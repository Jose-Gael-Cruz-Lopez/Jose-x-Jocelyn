// Gemini Flash client (Google AI Studio REST API)
// Set VITE_GEMINI_API_KEY in .env.local. Free tier available at https://aistudio.google.com/apikey
const API_KEY = import.meta.env.VITE_GEMINI_API_KEY
const MODEL = 'gemini-2.0-flash'
const ENDPOINT = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent`

export const hasGeminiKey = () => Boolean(API_KEY)

export async function fileToInlineData(file) {
  const buf = await file.arrayBuffer()
  const bytes = new Uint8Array(buf)
  let binary = ''
  const chunkSize = 0x8000
  for (let i = 0; i < bytes.length; i += chunkSize) {
    binary += String.fromCharCode.apply(null, bytes.subarray(i, i + chunkSize))
  }
  return { mimeType: file.type || 'application/pdf', data: btoa(binary) }
}

async function callGemini({ contents, systemInstruction, generationConfig }) {
  if (!API_KEY) throw new Error('NO_API_KEY')
  const body = { contents }
  if (systemInstruction) body.systemInstruction = { parts: [{ text: systemInstruction }] }
  if (generationConfig) body.generationConfig = generationConfig
  const res = await fetch(`${ENDPOINT}?key=${API_KEY}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
  if (!res.ok) {
    const err = await res.text().catch(() => '')
    throw new Error(`Gemini ${res.status}: ${err.slice(0, 200)}`)
  }
  const json = await res.json()
  const text = json?.candidates?.[0]?.content?.parts?.map(p => p.text).filter(Boolean).join('\n') || ''
  return text
}

// Extract structured job fields from raw description text or URL
export async function extractJobFields({ description = '', url = '' }) {
  const source = description.trim() || (url ? `[Job posting URL — try to infer from URL only if you must]: ${url}` : '')
  if (!source) throw new Error('NO_INPUT')
  const prompt = `Extract structured fields from this job posting. Return ONLY valid JSON with these exact keys (use empty string for missing values, no nested objects):
{"role": "", "company": "", "department": "", "location": "", "employmentType": "", "industry": "", "companyType": "", "description": ""}

The "description" field should be a clean markdown summary of the role: responsibilities, requirements, and any key details — preserve bullet structure.

Job posting:
${source}`
  const text = await callGemini({
    contents: [{ role: 'user', parts: [{ text: prompt }] }],
    generationConfig: { responseMimeType: 'application/json', temperature: 0.2 },
  })
  return JSON.parse(text)
}

// Chat coach reply, optionally grounded on a resume PDF + job context
export async function chatAboutResume({ history, userMessage, pdfInline, jobContext }) {
  const system = `You are a warm, candid resume coach for college students and early-career candidates — especially first-gen, nontraditional, and underrepresented candidates. Your tone is real, grounded, and specific. You give actionable advice. When you suggest a rewrite, show the BEFORE and AFTER with the change in plain text. Keep replies concise (under 250 words unless asked).`
  const parts = []
  if (pdfInline) parts.push({ inlineData: pdfInline })
  if (jobContext) parts.push({ text: `Job context:\n${jobContext}` })
  parts.push({ text: userMessage })

  const contents = [
    ...history.map(m => ({ role: m.role === 'assistant' ? 'model' : 'user', parts: [{ text: m.text }] })),
    { role: 'user', parts },
  ]
  return callGemini({ contents, systemInstruction: system, generationConfig: { temperature: 0.6 } })
}

// Tailor resume to the job — returns full markdown rewrite
export async function tailorResume({ pdfInline, jobContext }) {
  if (!pdfInline) throw new Error('NO_RESUME')
  if (!jobContext?.trim()) throw new Error('NO_JOB')
  const system = `You are a resume editor. You output a tailored markdown version of the candidate's resume aligned with the target job. Preserve facts truthfully — never fabricate experience, dates, or numbers. Tighten bullets, lead with impact verbs, and weave keywords from the job description where they truthfully apply.`
  const prompt = `Tailor this resume to the target job. Return ONLY the tailored resume in clean markdown — section headers as ##, role lines as bold, bullets as -. No preamble, no closing notes.

Target job:
${jobContext}`
  return callGemini({
    contents: [{ role: 'user', parts: [{ inlineData: pdfInline }, { text: prompt }] }],
    systemInstruction: system,
    generationConfig: { temperature: 0.3 },
  })
}
