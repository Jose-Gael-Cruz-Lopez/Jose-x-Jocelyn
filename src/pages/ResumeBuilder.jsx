import { useState, useRef, useEffect, useMemo } from 'react'
import ArticleLayout from '../components/ArticleLayout'
import ResumeSubNav from '../components/ResumeSubNav'
import { useT } from '../hooks/useT'
import {
  hasGeminiKey,
  fileToInlineData,
  extractJobFields,
  chatAboutResume,
  tailorResume,
} from '../lib/gemini'

const MAX_PDF_BYTES = 5 * 1024 * 1024
const DOCS_KEY = 'jxj_builder_docs_v1'

function loadDocs() {
  if (typeof window === 'undefined') return []
  try { return JSON.parse(localStorage.getItem(DOCS_KEY) || '[]') } catch { return [] }
}
function saveDocs(docs) {
  try { localStorage.setItem(DOCS_KEY, JSON.stringify(docs)) } catch {}
}
function uid() { return Math.random().toString(36).slice(2, 10) }

const EMPTY_JOB = {
  url: '', role: '', company: '', department: '', location: '',
  employmentType: '', industry: '', companyType: '', description: '',
}

export default function ResumeBuilder() {
  const t = useT('resumeBuilder')

  const [docs, setDocs] = useState(loadDocs)
  const [activeDocId, setActiveDocId] = useState(() => loadDocs()[0]?.id || null)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [tab, setTab] = useState('job')

  const activeDoc = useMemo(() => docs.find(d => d.id === activeDocId) || null, [docs, activeDocId])
  const fileInputRef = useRef(null)
  const chatScrollRef = useRef(null)

  // Local non-persisted state per session
  const [pdfInline, setPdfInline] = useState(null) // {mimeType, data}
  const [pdfBlobUrl, setPdfBlobUrl] = useState(null)
  const [pdfFileName, setPdfFileName] = useState('')
  const [parsing, setParsing] = useState(false)
  const [parseError, setParseError] = useState('')

  const [job, setJob] = useState(EMPTY_JOB)
  const [autofilling, setAutofilling] = useState(false)
  const [autofillError, setAutofillError] = useState('')

  const [editorContent, setEditorContent] = useState('')
  const [generating, setGenerating] = useState(false)
  const [generateMsg, setGenerateMsg] = useState('')

  const [chatHistory, setChatHistory] = useState([]) // {role, text}
  const [chatInput, setChatInput] = useState('')
  const [chatLoading, setChatLoading] = useState(false)
  const [chatError, setChatError] = useState('')

  // Initialize a doc if none
  useEffect(() => {
    if (docs.length === 0) {
      const first = { id: uid(), name: t.untitled, createdAt: Date.now() }
      const next = [first]
      setDocs(next)
      saveDocs(next)
      setActiveDocId(first.id)
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  // Auto-scroll chat
  useEffect(() => {
    chatScrollRef.current?.scrollTo({ top: chatScrollRef.current.scrollHeight, behavior: 'smooth' })
  }, [chatHistory, chatLoading])

  // Cleanup blob URL on unmount or change
  useEffect(() => {
    return () => { if (pdfBlobUrl) URL.revokeObjectURL(pdfBlobUrl) }
  }, [pdfBlobUrl])

  function newDoc() {
    const d = { id: uid(), name: t.untitled, createdAt: Date.now() }
    const next = [d, ...docs]
    setDocs(next); saveDocs(next); setActiveDocId(d.id)
    setPdfInline(null); setPdfBlobUrl(null); setPdfFileName('')
    setJob(EMPTY_JOB); setEditorContent(''); setChatHistory([])
  }

  async function handleFile(file) {
    if (!file) return
    if (file.type !== 'application/pdf') { setParseError(t.dropZoneError); return }
    if (file.size > MAX_PDF_BYTES) { setParseError(t.dropZoneError); return }
    setParseError(''); setParsing(true)
    try {
      const inline = await fileToInlineData(file)
      setPdfInline(inline)
      if (pdfBlobUrl) URL.revokeObjectURL(pdfBlobUrl)
      setPdfBlobUrl(URL.createObjectURL(file))
      setPdfFileName(file.name)
      // Rename active doc if still untitled
      if (activeDoc && activeDoc.name === t.untitled) {
        const next = docs.map(d => d.id === activeDoc.id ? { ...d, name: file.name.replace(/\.pdf$/i, '') } : d)
        setDocs(next); saveDocs(next)
      }
    } catch (e) {
      setParseError(t.parseError)
    } finally {
      setParsing(false)
    }
  }

  function onDrop(e) {
    e.preventDefault()
    const f = e.dataTransfer.files?.[0]
    if (f) handleFile(f)
  }

  async function handleAutofill() {
    setAutofillError('')
    if (!hasGeminiKey()) { setAutofillError(t.chatNeedKey); return }
    if (!job.url.trim() && !job.description.trim()) { setAutofillError(t.autofillError); return }
    setAutofilling(true)
    let descSource = job.description
    // Try cors proxy if URL but no description
    if (job.url.trim() && !descSource.trim()) {
      try {
        const res = await fetch(`https://api.allorigins.win/raw?url=${encodeURIComponent(job.url)}`)
        if (res.ok) {
          const html = await res.text()
          descSource = html.replace(/<script[\s\S]*?<\/script>/gi, '').replace(/<style[\s\S]*?<\/style>/gi, '').replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').slice(0, 12000)
        }
      } catch {}
    }
    try {
      const fields = await extractJobFields({ description: descSource, url: job.url })
      setJob(j => ({
        ...j,
        role: fields.role || j.role,
        company: fields.company || j.company,
        department: fields.department || j.department,
        location: fields.location || j.location,
        employmentType: fields.employmentType || j.employmentType,
        industry: fields.industry || j.industry,
        companyType: fields.companyType || j.companyType,
        description: fields.description || j.description,
      }))
    } catch (e) {
      setAutofillError(t.autofillError)
    } finally {
      setAutofilling(false)
    }
  }

  function buildJobContext() {
    if (!job.role && !job.company && !job.description) return ''
    return [
      job.role && `Role: ${job.role}`,
      job.company && `Company: ${job.company}`,
      job.department && `Department: ${job.department}`,
      job.location && `Location: ${job.location}`,
      job.employmentType && `Type: ${job.employmentType}`,
      job.industry && `Industry: ${job.industry}`,
      job.description && `\nDescription:\n${job.description}`,
    ].filter(Boolean).join('\n')
  }

  async function sendChat(messageOverride) {
    const msg = (messageOverride ?? chatInput).trim()
    if (!msg) return
    setChatError('')
    if (!hasGeminiKey()) { setChatError(t.chatNeedKey); return }
    if (!pdfInline) { setChatError(t.chatNeedResume); return }
    const newHistory = [...chatHistory, { role: 'user', text: msg }]
    setChatHistory(newHistory)
    setChatInput('')
    setChatLoading(true)
    try {
      const reply = await chatAboutResume({
        history: chatHistory,
        userMessage: msg,
        pdfInline,
        jobContext: buildJobContext(),
      })
      setChatHistory(h => [...h, { role: 'assistant', text: reply }])
    } catch (e) {
      setChatError(t.chatError)
      setChatHistory(h => h.slice(0, -1))
    } finally {
      setChatLoading(false)
    }
  }

  async function handleGenerate() {
    setGenerateMsg('')
    if (!hasGeminiKey()) { setGenerateMsg(t.chatNeedKey); return }
    if (!pdfInline) { setGenerateMsg(t.generateNeedResume); return }
    const ctx = buildJobContext()
    if (!ctx) { setGenerateMsg(t.generateNeedJob); return }
    setGenerating(true)
    try {
      const md = await tailorResume({ pdfInline, jobContext: ctx })
      setEditorContent(md)
      setTab('editor')
      setGenerateMsg(t.generateSuccess)
    } catch (e) {
      setGenerateMsg(t.chatError)
    } finally {
      setGenerating(false)
    }
  }

  const suggested = [t.chatSuggested1, t.chatSuggested2, t.chatSuggested3, t.chatSuggested4]

  return (
    <ArticleLayout title={t.pageTitle}>
      <style>{`
        html, body { background: var(--color-cream); }

        .rb-shell {
          display: grid;
          grid-template-columns: ${sidebarCollapsed ? '52px' : '260px'} 1fr 1fr;
          gap: 0;
          height: calc(100vh - 64px);
          min-height: 600px;
          background: var(--color-cream);
          border-top: 1px solid rgba(0,0,0,.08);
          transition: grid-template-columns .2s cubic-bezier(.16,1,.3,1);
        }
        @media (max-width: 1100px) {
          .rb-shell { grid-template-columns: ${sidebarCollapsed ? '52px' : '220px'} 1fr 1fr; }
        }
        @media (max-width: 880px) {
          .rb-shell { grid-template-columns: 1fr; height: auto; }
          .rb-side, .rb-mid, .rb-right { border-right: none; border-bottom: 1px solid rgba(0,0,0,.08); }
        }

        .rb-side { background: var(--color-white); border-right: 1px solid rgba(0,0,0,.08); padding: 18px 12px; display: flex; flex-direction: column; overflow: hidden; }
        .rb-side__head { display: flex; align-items: center; justify-content: space-between; gap: 10px; margin-bottom: 16px; padding: 0 6px; }
        .rb-side__brand { display: flex; align-items: center; gap: 10px; min-width: 0; }
        .rb-side__brand-icon { width: 28px; height: 28px; border-radius: 8px; background: var(--color-accent); color: var(--color-white); display: inline-flex; align-items: center; justify-content: center; flex-shrink: 0; }
        .rb-side__brand-text { font-family: var(--font-display); font-size: 14px; font-weight: 700; color: var(--color-dark); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        .rb-side__collapse { background: none; border: none; padding: 6px; color: var(--color-muted); cursor: pointer; border-radius: 6px; display: inline-flex; align-items: center; justify-content: center; transition: background .15s, color .15s; flex-shrink: 0; }
        .rb-side__collapse:hover { background: rgba(0,0,0,.05); color: var(--color-dark); }
        .rb-side__new { display: flex; align-items: center; gap: 8px; padding: 10px 14px; background: var(--color-blue); color: var(--color-white); border: none; border-radius: 10px; font-family: var(--font-display); font-size: 14px; font-weight: 700; cursor: pointer; transition: background .18s, transform .18s; margin-bottom: 18px; }
        .rb-side__new:hover { background: var(--color-navy); transform: translateY(-1px); }
        .rb-side__section { font-size: 11px; font-weight: 700; letter-spacing: .1em; text-transform: uppercase; color: var(--color-muted); padding: 0 8px; margin-bottom: 8px; }
        .rb-side__doc { display: flex; align-items: center; gap: 10px; padding: 9px 10px; border-radius: 8px; background: transparent; border: none; cursor: pointer; text-align: left; width: 100%; transition: background .15s; }
        .rb-side__doc:hover { background: rgba(0,0,0,.04); }
        .rb-side__doc--active { background: rgba(91,142,194,.12); }
        .rb-side__doc-icon { color: var(--color-muted); flex-shrink: 0; }
        .rb-side__doc-name { font-size: 13px; font-weight: 600; color: var(--color-dark); flex: 1; min-width: 0; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }

        .rb-side--collapsed .rb-side__brand-text,
        .rb-side--collapsed .rb-side__section,
        .rb-side--collapsed .rb-side__doc-name,
        .rb-side--collapsed .rb-side__new span { display: none; }
        .rb-side--collapsed .rb-side__new { padding: 10px; justify-content: center; }
        .rb-side--collapsed .rb-side__doc { justify-content: center; padding: 9px 6px; }

        .rb-mid, .rb-right { background: var(--color-cream); display: flex; flex-direction: column; min-height: 0; }
        .rb-mid { border-right: 1px solid rgba(0,0,0,.08); }

        .rb-mid__head, .rb-right__head { padding: 14px 24px; display: flex; align-items: center; justify-content: space-between; gap: 12px; border-bottom: 1px solid rgba(0,0,0,.08); flex-shrink: 0; }
        .rb-mid__title { font-size: 14px; color: var(--color-muted); font-weight: 600; }
        .rb-generate { display: inline-flex; align-items: center; gap: 6px; padding: 8px 16px; background: var(--color-dark); color: var(--color-cream); border: none; border-radius: 8px; font-family: var(--font-display); font-size: 13px; font-weight: 700; cursor: pointer; transition: background .18s, transform .18s; }
        .rb-generate:hover:not(:disabled) { background: var(--color-accent); transform: translateY(-1px); }
        .rb-generate:disabled { opacity: .55; cursor: not-allowed; }
        .rb-generate svg { width: 14px; height: 14px; }

        .rb-mid__body { flex: 1; min-height: 0; padding: 24px; display: flex; align-items: center; justify-content: center; overflow: auto; }
        .rb-drop { width: 100%; max-width: 480px; aspect-ratio: 1.2 / 1; border: 1.5px dashed rgba(0,0,0,.18); border-radius: 14px; padding: 32px; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 10px; text-align: center; transition: border-color .18s, background .18s; cursor: pointer; }
        .rb-drop:hover, .rb-drop--over { border-color: var(--color-accent); background: rgba(179,69,57,.04); }
        .rb-drop__icon { color: var(--color-muted); }
        .rb-drop__text { font-size: 14px; color: var(--color-muted); }
        .rb-drop__text strong { color: var(--color-blue); cursor: pointer; }
        .rb-drop__msg { font-size: 12px; color: var(--color-accent); margin-top: 4px; }

        .rb-preview { width: 100%; height: 100%; border: 1px solid rgba(0,0,0,.08); border-radius: 8px; background: var(--color-white); }

        .rb-tabs { display: flex; gap: 4px; }
        .rb-tab { display: inline-flex; align-items: center; gap: 6px; padding: 8px 12px; background: transparent; border: none; border-radius: 8px; font-family: var(--font-display); font-size: 13px; font-weight: 600; color: var(--color-muted); cursor: pointer; transition: color .15s, background .15s; }
        .rb-tab:hover { color: var(--color-dark); }
        .rb-tab--active { color: var(--color-blue); }
        .rb-tab svg { width: 14px; height: 14px; }

        .rb-right__body { flex: 1; min-height: 0; overflow-y: auto; padding: 24px; }

        .rb-job__field { margin-bottom: 18px; }
        .rb-job__row { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
        .rb-job__label { display: flex; align-items: center; gap: 6px; font-size: 13px; font-weight: 700; color: var(--color-dark); margin-bottom: 6px; font-family: var(--font-display); }
        .rb-job__label svg { width: 14px; height: 14px; color: var(--color-muted); }
        .rb-job__label em { color: var(--color-muted); font-weight: 500; font-style: normal; font-size: 11px; }
        .rb-job__input, .rb-job__textarea { width: 100%; padding: 10px 12px; background: var(--color-white); border: 1.5px solid rgba(0,0,0,.1); border-radius: 8px; font-family: var(--font-body); font-size: 13px; color: var(--color-dark); transition: border-color .15s, box-shadow .15s; }
        .rb-job__input:focus, .rb-job__textarea:focus { outline: none; border-color: var(--color-accent); box-shadow: 0 0 0 3px rgba(179,69,57,.1); }
        .rb-job__textarea { min-height: 220px; resize: vertical; font-family: 'SF Mono', 'Monaco', monospace; font-size: 12px; line-height: 1.55; }

        .rb-url { display: flex; gap: 8px; }
        .rb-url .rb-job__input { flex: 1; }
        .rb-autofill { display: inline-flex; align-items: center; gap: 6px; padding: 0 16px; background: var(--color-blue); color: var(--color-white); border: none; border-radius: 8px; font-family: var(--font-display); font-size: 12px; font-weight: 700; cursor: pointer; flex-shrink: 0; transition: background .18s; }
        .rb-autofill:hover:not(:disabled) { background: var(--color-navy); }
        .rb-autofill:disabled { opacity: .55; cursor: not-allowed; }
        .rb-autofill svg { width: 12px; height: 12px; }
        .rb-autofill__error { font-size: 12px; color: var(--color-accent); margin-top: 6px; }

        .rb-editor { width: 100%; height: 100%; min-height: 100%; padding: 16px; border: 1px solid rgba(0,0,0,.08); border-radius: 8px; background: var(--color-white); font-family: 'SF Mono', 'Monaco', monospace; font-size: 13px; line-height: 1.6; color: var(--color-dark); resize: none; }
        .rb-editor:focus { outline: 2px solid var(--color-accent); outline-offset: -2px; }
        .rb-editor-empty { display: flex; align-items: center; justify-content: center; height: 100%; color: var(--color-muted); font-size: 14px; }

        .rb-chat { display: flex; flex-direction: column; height: 100%; }
        .rb-chat__list { flex: 1; min-height: 0; overflow-y: auto; padding-right: 4px; }
        .rb-chat__msg { max-width: 84%; padding: 10px 14px; border-radius: 14px; margin-bottom: 10px; font-size: 13px; line-height: 1.55; white-space: pre-wrap; word-wrap: break-word; }
        .rb-chat__msg--user { background: var(--color-blue); color: var(--color-white); margin-left: auto; border-bottom-right-radius: 4px; }
        .rb-chat__msg--assistant { background: var(--color-white); color: var(--color-dark); border-bottom-left-radius: 4px; box-shadow: 0 1px 3px rgba(0,0,0,.05); }
        .rb-chat__thinking { font-size: 12px; color: var(--color-muted); padding: 6px 10px; }
        .rb-chat__error { font-size: 12px; color: var(--color-accent); padding: 6px 10px; }
        .rb-chat__suggested { display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 10px; }
        .rb-chat__chip { padding: 6px 12px; background: var(--color-white); border: 1px solid rgba(0,0,0,.1); border-radius: 999px; font-size: 12px; color: var(--color-dark); cursor: pointer; transition: border-color .15s, color .15s; font-family: inherit; }
        .rb-chat__chip:hover { border-color: var(--color-accent); color: var(--color-accent); }
        .rb-chat__form { display: flex; gap: 8px; align-items: flex-end; padding-top: 10px; border-top: 1px solid rgba(0,0,0,.08); margin-top: 10px; }
        .rb-chat__input { flex: 1; padding: 10px 14px; background: var(--color-white); border: 1.5px solid rgba(0,0,0,.1); border-radius: 10px; font-family: var(--font-body); font-size: 13px; color: var(--color-dark); resize: none; min-height: 40px; max-height: 140px; }
        .rb-chat__input:focus { outline: none; border-color: var(--color-accent); box-shadow: 0 0 0 3px rgba(179,69,57,.1); }
        .rb-chat__send { width: 40px; height: 40px; flex-shrink: 0; background: var(--color-blue); color: var(--color-white); border: none; border-radius: 10px; cursor: pointer; display: inline-flex; align-items: center; justify-content: center; transition: background .15s, transform .15s; }
        .rb-chat__send:hover:not(:disabled) { background: var(--color-navy); transform: translateY(-1px); }
        .rb-chat__send:disabled { opacity: .55; cursor: not-allowed; }

        .rb-key-warning { background: rgba(232,168,56,.14); border: 1px solid rgba(232,168,56,.4); color: var(--color-gold-dark); padding: 10px 14px; border-radius: 8px; font-size: 12px; margin-bottom: 16px; }
        .rb-gen-msg { font-size: 12px; color: var(--color-muted); padding: 10px 24px 0; }
        .rb-gen-msg--success { color: var(--color-teal); }
      `}</style>

      <ResumeSubNav />

      <div className="rb-shell">
        <aside className={`rb-side${sidebarCollapsed ? ' rb-side--collapsed' : ''}`} aria-label={t.sidebarTitle}>
          <div className="rb-side__head">
            <div className="rb-side__brand">
              <span className="rb-side__brand-icon" aria-hidden="true">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><polyline points="14 2 14 8 20 8"/><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/></svg>
              </span>
              <span className="rb-side__brand-text">{t.sidebarTitle}</span>
            </div>
            <button
              type="button"
              className="rb-side__collapse"
              onClick={() => setSidebarCollapsed(s => !s)}
              aria-label={sidebarCollapsed ? t.expandAria : t.collapseAria}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <rect x="3" y="3" width="18" height="18" rx="2"/>
                <line x1="9" y1="3" x2="9" y2="21"/>
              </svg>
            </button>
          </div>
          <button type="button" className="rb-side__new" onClick={newDoc}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <circle cx="12" cy="12" r="10"/>
              <line x1="12" y1="8" x2="12" y2="16"/>
              <line x1="8" y1="12" x2="16" y2="12"/>
            </svg>
            <span>{t.newResume}</span>
          </button>
          {!sidebarCollapsed && <div className="rb-side__section">{t.documents}</div>}
          {docs.map(d => (
            <button
              key={d.id}
              type="button"
              className={`rb-side__doc${d.id === activeDocId ? ' rb-side__doc--active' : ''}`}
              onClick={() => setActiveDocId(d.id)}
              title={d.name}
            >
              <svg className="rb-side__doc-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                <polyline points="14 2 14 8 20 8"/>
              </svg>
              <span className="rb-side__doc-name">{d.name}</span>
            </button>
          ))}
        </aside>

        <section className="rb-mid" aria-label={t.previewLabel}>
          <div className="rb-mid__head">
            <span className="rb-mid__title">{t.previewLabel}</span>
            <button
              type="button"
              className="rb-generate"
              onClick={handleGenerate}
              disabled={generating || !pdfInline}
              title={!pdfInline ? t.generateNeedResume : ''}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M5 3v4M3 5h4M6 17v4M4 19h4M13 3l3.5 8L24 14.5l-7.5 3.5L13 26l-3.5-8L2 14.5 9.5 11z"/>
              </svg>
              {generating ? t.generatingBtn : t.generateBtn}
            </button>
          </div>
          {generateMsg && (
            <p className={`rb-gen-msg${generateMsg === t.generateSuccess ? ' rb-gen-msg--success' : ''}`}>{generateMsg}</p>
          )}
          <div className="rb-mid__body">
            {pdfBlobUrl ? (
              <iframe className="rb-preview" src={pdfBlobUrl} title={pdfFileName || t.previewLabel} />
            ) : (
              <label
                className="rb-drop"
                onDragOver={e => { e.preventDefault() }}
                onDrop={onDrop}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="application/pdf"
                  style={{ display: 'none' }}
                  onChange={e => handleFile(e.target.files?.[0])}
                />
                <svg className="rb-drop__icon" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                  <polyline points="17 8 12 3 7 8"/>
                  <line x1="12" y1="3" x2="12" y2="15"/>
                </svg>
                <p className="rb-drop__text">
                  {parsing ? t.parsingPdf : (
                    <>
                      {t.dropZone}{' '}
                      <strong>{t.dropZoneBrowse}</strong>
                    </>
                  )}
                </p>
                {parseError && <p className="rb-drop__msg">{parseError}</p>}
              </label>
            )}
          </div>
        </section>

        <section className="rb-right" aria-label="Tools">
          <div className="rb-right__head">
            <div />
            <div className="rb-tabs" role="tablist">
              <button type="button" role="tab" aria-selected={tab === 'job'} className={`rb-tab${tab === 'job' ? ' rb-tab--active' : ''}`} onClick={() => setTab('job')}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>
                {t.tabJob}
              </button>
              <button type="button" role="tab" aria-selected={tab === 'editor'} className={`rb-tab${tab === 'editor' ? ' rb-tab--active' : ''}`} onClick={() => setTab('editor')}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                {t.tabEditor}
              </button>
              <button type="button" role="tab" aria-selected={tab === 'chat'} className={`rb-tab${tab === 'chat' ? ' rb-tab--active' : ''}`} onClick={() => setTab('chat')}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
                {t.tabChat}
              </button>
            </div>
          </div>

          <div className="rb-right__body">
            {!hasGeminiKey() && (
              <div className="rb-key-warning">{t.chatNeedKey}</div>
            )}

            {tab === 'job' && (
              <div>
                <div className="rb-job__field">
                  <label className="rb-job__label" htmlFor="rbUrl">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>
                    {t.jobPostingLabel}
                  </label>
                  <div className="rb-url">
                    <input
                      id="rbUrl"
                      className="rb-job__input"
                      type="url"
                      placeholder={t.jobPostingPlaceholder}
                      value={job.url}
                      onChange={e => setJob(j => ({ ...j, url: e.target.value }))}
                    />
                    <button
                      type="button"
                      className="rb-autofill"
                      onClick={handleAutofill}
                      disabled={autofilling || (!job.url.trim() && !job.description.trim())}
                    >
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 3v4M3 5h4M19 17v4M17 19h4M13 3l2 5 5 2-5 2-2 5-2-5-5-2 5-2z"/></svg>
                      {autofilling ? t.autofillingBtn : t.autofillBtn}
                    </button>
                  </div>
                  {autofillError && <p className="rb-autofill__error">{autofillError}</p>}
                </div>

                <div className="rb-job__row">
                  <div className="rb-job__field">
                    <label className="rb-job__label" htmlFor="rbRole">{t.jobRoleLabel}</label>
                    <input id="rbRole" className="rb-job__input" type="text" placeholder={t.jobRolePlaceholder} value={job.role} onChange={e => setJob(j => ({ ...j, role: e.target.value }))} />
                  </div>
                  <div className="rb-job__field">
                    <label className="rb-job__label" htmlFor="rbCompany">{t.jobCompanyLabel}</label>
                    <input id="rbCompany" className="rb-job__input" type="text" placeholder={t.jobCompanyPlaceholder} value={job.company} onChange={e => setJob(j => ({ ...j, company: e.target.value }))} />
                  </div>
                </div>

                <div className="rb-job__row">
                  <div className="rb-job__field">
                    <label className="rb-job__label" htmlFor="rbDept">{t.jobDeptLabel}</label>
                    <input id="rbDept" className="rb-job__input" type="text" placeholder={t.jobDeptPlaceholder} value={job.department} onChange={e => setJob(j => ({ ...j, department: e.target.value }))} />
                  </div>
                  <div className="rb-job__field">
                    <label className="rb-job__label" htmlFor="rbLoc">{t.jobLocationLabel}</label>
                    <input id="rbLoc" className="rb-job__input" type="text" placeholder={t.jobLocationPlaceholder} value={job.location} onChange={e => setJob(j => ({ ...j, location: e.target.value }))} />
                  </div>
                </div>

                <div className="rb-job__field">
                  <label className="rb-job__label" htmlFor="rbType">{t.jobEmploymentLabel}</label>
                  <input id="rbType" className="rb-job__input" type="text" placeholder={t.jobEmploymentPlaceholder} value={job.employmentType} onChange={e => setJob(j => ({ ...j, employmentType: e.target.value }))} />
                </div>

                <div className="rb-job__row">
                  <div className="rb-job__field">
                    <label className="rb-job__label" htmlFor="rbInd">{t.jobIndustryLabel}</label>
                    <input id="rbInd" className="rb-job__input" type="text" placeholder={t.jobIndustryPlaceholder} value={job.industry} onChange={e => setJob(j => ({ ...j, industry: e.target.value }))} />
                  </div>
                  <div className="rb-job__field">
                    <label className="rb-job__label" htmlFor="rbCt">{t.jobCompanyTypeLabel}</label>
                    <input id="rbCt" className="rb-job__input" type="text" placeholder={t.jobCompanyTypePlaceholder} value={job.companyType} onChange={e => setJob(j => ({ ...j, companyType: e.target.value }))} />
                  </div>
                </div>

                <div className="rb-job__field">
                  <label className="rb-job__label" htmlFor="rbDesc">
                    {t.jobDescLabel} <em>{t.jobDescNote}</em>
                  </label>
                  <textarea
                    id="rbDesc"
                    className="rb-job__textarea"
                    placeholder={t.jobDescPlaceholder}
                    value={job.description}
                    onChange={e => setJob(j => ({ ...j, description: e.target.value }))}
                  />
                </div>
              </div>
            )}

            {tab === 'editor' && (
              editorContent ? (
                <textarea
                  className="rb-editor"
                  value={editorContent}
                  onChange={e => setEditorContent(e.target.value)}
                  placeholder={t.editorPlaceholder}
                  spellCheck="true"
                />
              ) : (
                <div className="rb-editor-empty">{pdfInline ? t.editorPlaceholder : t.editorEmpty}</div>
              )
            )}

            {tab === 'chat' && (
              <div className="rb-chat">
                <div className="rb-chat__list" ref={chatScrollRef}>
                  {chatHistory.length === 0 && (
                    <div className="rb-chat__suggested">
                      {suggested.map(s => (
                        <button key={s} type="button" className="rb-chat__chip" onClick={() => sendChat(s)}>{s}</button>
                      ))}
                    </div>
                  )}
                  {chatHistory.map((m, i) => (
                    <div key={i} className={`rb-chat__msg rb-chat__msg--${m.role}`}>{m.text}</div>
                  ))}
                  {chatLoading && <div className="rb-chat__thinking">{t.chatThinking}</div>}
                  {chatError && <div className="rb-chat__error">{chatError}</div>}
                </div>
                <form className="rb-chat__form" onSubmit={e => { e.preventDefault(); sendChat() }}>
                  <textarea
                    className="rb-chat__input"
                    placeholder={t.chatPlaceholder}
                    value={chatInput}
                    onChange={e => setChatInput(e.target.value)}
                    onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendChat() } }}
                    rows={1}
                  />
                  <button type="submit" className="rb-chat__send" disabled={chatLoading || !chatInput.trim()} aria-label={t.chatSendAria}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <line x1="22" y1="2" x2="11" y2="13"/>
                      <polygon points="22 2 15 22 11 13 2 9 22 2"/>
                    </svg>
                  </button>
                </form>
              </div>
            )}
          </div>
        </section>
      </div>
    </ArticleLayout>
  )
}
