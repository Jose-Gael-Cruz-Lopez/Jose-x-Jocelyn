import { useEffect, useState, useCallback } from 'react'
import ArticleLayout from '../components/ArticleLayout'
import { supabase } from '../lib/supabase'

export default function AdminCoffeeChat() {
  const [authState, setAuthState] = useState('loading') // loading | guest | authed
  const [user, setUser] = useState(null)
  const [isAdmin, setIsAdmin] = useState(false)
  const [pending, setPending] = useState([])
  const [pendingError, setPendingError] = useState('')
  const [pendingLoading, setPendingLoading] = useState(false)
  const [busyId, setBusyId] = useState(null)

  const [emailInput, setEmailInput] = useState('')
  const [magicLinkSent, setMagicLinkSent] = useState(false)
  const [authError, setAuthError] = useState('')

  const checkAdminAndLoad = useCallback(async (currentUser) => {
    if (!currentUser?.email) {
      setIsAdmin(false)
      return
    }
    const { data, error } = await supabase
      .from('coffee_chat_admins')
      .select('email')
      .ilike('email', currentUser.email)
      .maybeSingle()
    const admin = !error && !!data
    setIsAdmin(admin)
    if (admin) await loadPending()
  }, [])

  const loadPending = async () => {
    setPendingLoading(true)
    setPendingError('')
    const { data, error } = await supabase.rpc('admin_list_pending_coffee_chat_profiles')
    if (error) {
      setPendingError(error.message || 'Could not load pending submissions.')
      setPending([])
    } else {
      setPending(data || [])
    }
    setPendingLoading(false)
  }

  useEffect(() => {
    let mounted = true
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (!mounted) return
      if (session?.user) {
        setUser(session.user)
        setAuthState('authed')
        await checkAdminAndLoad(session.user)
      } else {
        setAuthState('guest')
      }
    })
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (!mounted) return
      if (session?.user) {
        setUser(session.user)
        setAuthState('authed')
        await checkAdminAndLoad(session.user)
      } else {
        setUser(null)
        setIsAdmin(false)
        setAuthState('guest')
      }
    })
    return () => { mounted = false; subscription.unsubscribe() }
  }, [checkAdminAndLoad])

  const sendMagicLink = async (e) => {
    e.preventDefault()
    setAuthError('')
    if (!emailInput.trim()) return
    const { error } = await supabase.auth.signInWithOtp({
      email: emailInput.trim(),
      options: { emailRedirectTo: window.location.href },
    })
    if (error) {
      setAuthError(error.message || 'Could not send magic link.')
    } else {
      setMagicLinkSent(true)
    }
  }

  const signOut = async () => {
    await supabase.auth.signOut()
  }

  const approve = async (id) => {
    setBusyId(id)
    const { error } = await supabase.rpc('admin_approve_coffee_chat_profile', { profile_id: id })
    setBusyId(null)
    if (error) {
      alert(`Could not approve: ${error.message}`)
    } else {
      setPending(p => p.filter(x => x.id !== id))
    }
  }

  const reject = async (id) => {
    if (!window.confirm('Reject this submission? This hides it from the public directory.')) return
    setBusyId(id)
    const { error } = await supabase.rpc('admin_reject_coffee_chat_profile', { profile_id: id })
    setBusyId(null)
    if (error) {
      alert(`Could not reject: ${error.message}`)
    } else {
      setPending(p => p.filter(x => x.id !== id))
    }
  }

  return (
    <ArticleLayout title="Admin · Coffee Chat" description="Moderate Coffee Chat Network submissions.">
      <style>{`
        html, body { background: var(--color-cream); }
        .admin-wrap { max-width: 920px; margin: 0 auto; padding: 120px clamp(20px,5vw,56px) 80px; }
        .admin-kicker { font-size: 11px; font-weight: 700; letter-spacing: .14em; text-transform: uppercase; color: var(--color-muted); margin-bottom: 14px; }
        .admin-title { font-family: var(--font-display); font-size: clamp(32px,5vw,56px); font-weight: 700; color: var(--color-dark); line-height: 1.05; margin-bottom: 12px; }
        .admin-sub { font-size: clamp(14px,1.7vw,16px); color: var(--color-muted); line-height: 1.65; margin-bottom: 32px; max-width: 640px; }
        .admin-bar { display: flex; align-items: center; justify-content: space-between; gap: 16px; padding: 14px 18px; background: var(--color-white); border: 1px solid rgba(0,0,0,.08); border-radius: 12px; margin-bottom: 24px; flex-wrap: wrap; }
        .admin-bar__email { font-size: 13px; color: var(--color-muted); }
        .admin-bar__email strong { color: var(--color-dark); font-weight: 600; }
        .admin-btn { display: inline-flex; align-items: center; gap: 6px; padding: 9px 16px; border-radius: 8px; font-family: var(--font-display); font-size: 13px; font-weight: 600; cursor: pointer; transition: background .2s, border-color .2s, transform .15s; border: 1.5px solid transparent; }
        .admin-btn--primary { background: var(--color-dark); color: var(--color-cream); border-color: var(--color-dark); }
        .admin-btn--primary:hover { background: var(--color-teal); border-color: var(--color-teal); transform: translateY(-1px); }
        .admin-btn--ghost { background: transparent; color: var(--color-dark); border-color: rgba(0,0,0,.18); }
        .admin-btn--ghost:hover { border-color: var(--color-dark); }
        .admin-btn--danger { background: transparent; color: var(--color-accent); border-color: rgba(179,69,57,.3); }
        .admin-btn--danger:hover { background: rgba(179,69,57,.08); border-color: var(--color-accent); }
        .admin-btn:disabled { opacity: .55; cursor: not-allowed; transform: none; }

        .admin-login { background: var(--color-white); border: 1px solid rgba(0,0,0,.08); border-radius: 16px; padding: 36px; max-width: 480px; }
        .admin-login__label { display: block; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: .09em; color: var(--color-muted); margin-bottom: 6px; }
        .admin-login__input { width: 100%; font-family: var(--font-body); font-size: 15px; padding: 11px 14px; border: 1.5px solid rgba(0,0,0,.12); border-radius: 8px; background: var(--color-white); color: var(--color-dark); outline: none; margin-bottom: 14px; }
        .admin-login__input:focus { border-color: var(--color-gold); }
        .admin-login__error { color: var(--color-accent); font-size: 13px; margin: 8px 0 0; }
        .admin-login__sent { background: rgba(58,125,107,.08); border: 1px solid rgba(58,125,107,.2); border-radius: 12px; padding: 24px; }
        .admin-login__sent strong { color: var(--color-teal); }

        .admin-card { background: var(--color-white); border: 1px solid rgba(0,0,0,.08); border-radius: 16px; padding: 24px 28px; margin-bottom: 16px; }
        .admin-card__head { display: flex; justify-content: space-between; align-items: flex-start; gap: 16px; flex-wrap: wrap; margin-bottom: 14px; }
        .admin-card__name { font-family: var(--font-display); font-size: 20px; font-weight: 700; color: var(--color-dark); margin: 0 0 4px; }
        .admin-card__meta { font-size: 13px; color: var(--color-muted); line-height: 1.6; }
        .admin-card__meta a { color: var(--color-navy); }
        .admin-card__row { font-size: 14px; color: var(--color-dark); line-height: 1.7; margin: 8px 0; }
        .admin-card__row strong { font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: .08em; color: var(--color-muted); display: block; margin-bottom: 2px; }
        .admin-card__tags { display: flex; flex-wrap: wrap; gap: 6px; margin: 6px 0 12px; }
        .admin-card__tag { font-size: 11px; padding: 3px 9px; border-radius: 4px; background: rgba(0,0,0,.05); color: var(--color-dark); font-weight: 600; }
        .admin-card__actions { display: flex; gap: 10px; flex-wrap: wrap; margin-top: 14px; }

        .admin-empty { text-align: center; padding: 60px 20px; color: var(--color-muted); background: var(--color-white); border: 1px dashed rgba(0,0,0,.12); border-radius: 16px; }
        .admin-empty strong { color: var(--color-dark); display: block; font-family: var(--font-display); font-size: 18px; margin-bottom: 6px; }
      `}</style>

      <div className="admin-wrap">
        <p className="admin-kicker">Admin · Coffee Chat Network</p>
        <h1 className="admin-title">Moderation queue</h1>
        <p className="admin-sub">Review and approve coffee chat submissions before they appear in the public directory. Only users in the <code>coffee_chat_admins</code> table can use this page.</p>

        {authState === 'loading' && <p style={{ color: 'var(--color-muted)' }}>Checking session…</p>}

        {authState === 'guest' && (
          <div className="admin-login">
            {magicLinkSent ? (
              <div className="admin-login__sent">
                <strong>Check your inbox.</strong>
                <p style={{ margin: '6px 0 0', fontSize: '14px', color: 'var(--color-muted)' }}>
                  A magic link is on its way to <strong style={{ color: 'var(--color-dark)' }}>{emailInput}</strong>. Click it to sign in. You can close this tab.
                </p>
              </div>
            ) : (
              <form onSubmit={sendMagicLink}>
                <p style={{ marginTop: 0, fontSize: '14px', color: 'var(--color-muted)', marginBottom: '18px' }}>Sign in with a magic link to access the moderation queue.</p>
                <label className="admin-login__label" htmlFor="adminEmail">Admin email</label>
                <input
                  id="adminEmail"
                  className="admin-login__input"
                  type="email"
                  placeholder="you@example.com"
                  required
                  value={emailInput}
                  onChange={e => setEmailInput(e.target.value)}
                />
                {authError && <p className="admin-login__error">{authError}</p>}
                <button type="submit" className="admin-btn admin-btn--primary" style={{ width: '100%', justifyContent: 'center', padding: '12px' }}>
                  Send magic link
                </button>
              </form>
            )}
          </div>
        )}

        {authState === 'authed' && (
          <>
            <div className="admin-bar">
              <div className="admin-bar__email">Signed in as <strong>{user?.email}</strong> {isAdmin && <span style={{ color: 'var(--color-teal)', fontWeight: 600 }}>· Admin</span>}</div>
              <div style={{ display: 'flex', gap: 8 }}>
                {isAdmin && (
                  <button className="admin-btn admin-btn--ghost" onClick={loadPending} disabled={pendingLoading}>
                    {pendingLoading ? 'Refreshing…' : 'Refresh'}
                  </button>
                )}
                <button className="admin-btn admin-btn--ghost" onClick={signOut}>Sign out</button>
              </div>
            </div>

            {!isAdmin && (
              <div className="admin-empty">
                <strong>Not authorized</strong>
                <p style={{ margin: 0 }}>Your email isn't on the admin allow-list. To grant access, run in Supabase SQL Editor:<br />
                  <code style={{ fontSize: '12px', background: 'rgba(0,0,0,.05)', padding: '2px 6px', borderRadius: '4px' }}>insert into coffee_chat_admins (email) values ('{user?.email}');</code>
                </p>
              </div>
            )}

            {isAdmin && pendingError && (
              <div className="admin-empty">
                <strong>Couldn't load submissions</strong>
                <p style={{ margin: 0 }}>{pendingError}</p>
              </div>
            )}

            {isAdmin && !pendingError && !pendingLoading && pending.length === 0 && (
              <div className="admin-empty">
                <strong>Nothing pending.</strong>
                <p style={{ margin: 0 }}>The moderation queue is empty.</p>
              </div>
            )}

            {isAdmin && pending.map(p => (
              <article key={p.id} className="admin-card">
                <div className="admin-card__head">
                  <div>
                    <h2 className="admin-card__name">{p.name}{p.pronouns ? <span style={{ fontSize: '14px', fontWeight: 400, color: 'var(--color-muted)', marginLeft: 8 }}>({p.pronouns})</span> : null}</h2>
                    <div className="admin-card__meta">
                      <a href={`mailto:${p.email}`}>{p.email}</a>
                      {' · '}
                      <a href={p.linkedin_url} target="_blank" rel="noopener noreferrer">LinkedIn ↗</a>
                      {p.location ? ` · ${p.location}` : ''}
                    </div>
                  </div>
                  <div style={{ fontSize: 11, color: 'rgba(0,0,0,.4)' }}>
                    Submitted {new Date(p.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </div>
                </div>

                <div className="admin-card__row">
                  <strong>Role</strong>
                  {p.role_title}
                </div>

                {p.role_function?.length > 0 && (
                  <div className="admin-card__row">
                    <strong>Functions</strong>
                    <div className="admin-card__tags">
                      {p.role_function.map(f => <span key={f} className="admin-card__tag">{f}</span>)}
                    </div>
                  </div>
                )}

                {p.identity_tags?.length > 0 && (
                  <div className="admin-card__row">
                    <strong>Identity tags</strong>
                    <div className="admin-card__tags">
                      {p.identity_tags.map(t => <span key={t} className="admin-card__tag">{t}</span>)}
                    </div>
                  </div>
                )}

                <div className="admin-card__row">
                  <strong>Topics</strong>
                  {p.topics}
                </div>

                <div className="admin-card__row">
                  <strong>Capacity</strong>
                  {p.capacity || '—'}
                </div>

                {p.avatar_url && (
                  <div className="admin-card__row">
                    <strong>Photo</strong>
                    <img src={p.avatar_url} alt="" style={{ width: 64, height: 64, borderRadius: '50%', objectFit: 'cover', border: '1.5px solid rgba(0,0,0,.1)' }} />
                  </div>
                )}

                <div className="admin-card__actions">
                  <button className="admin-btn admin-btn--primary" onClick={() => approve(p.id)} disabled={busyId === p.id}>
                    {busyId === p.id ? 'Working…' : 'Approve'}
                  </button>
                  <button className="admin-btn admin-btn--danger" onClick={() => reject(p.id)} disabled={busyId === p.id}>
                    Reject
                  </button>
                </div>
              </article>
            ))}
          </>
        )}
      </div>
    </ArticleLayout>
  )
}
