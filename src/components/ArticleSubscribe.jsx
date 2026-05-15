import { useState } from 'react'
import { supabase } from '../lib/supabase'
import { useT } from '../hooks/useT'

export default function ArticleSubscribe({ source }) {
  const t = useT('articleLayout')
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e) {
    e.preventDefault()
    const val = email.trim()
    if (!val) return
    setLoading(true)
    setError('')

    const { error: err } = await supabase
      .from('subscribers')
      .insert({ email: val, source: source || 'article' })

    setLoading(false)
    if (err) {
      if (err.code === '23505') {
        // unique violation — already subscribed
        setDone(true)
      } else {
        setError(`Error: ${err.message} (${err.code})`)
      }
    } else {
      setDone(true)
    }
  }

  return (
    <div className="art-subscribe">
      <div className="art-subscribe__box">
        <h3 className="art-subscribe__title">{t.subscribeTitle}</h3>
        <p className="art-subscribe__desc">{t.subscribeDesc}</p>
        {done ? (
          <p style={{ color: 'var(--color-teal)', fontWeight: 600, fontSize: 15 }}>
            {t.subscribeSuccess}
          </p>
        ) : (
          <form className="art-subscribe__form" onSubmit={handleSubmit}>
            <input
              type="email"
              className="art-subscribe__input"
              placeholder={t.subscribePlaceholder}
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              disabled={loading}
            />
            <button className="art-subscribe__btn" type="submit" disabled={loading}>
              {loading ? t.subscribeBtnLoading : t.subscribeBtnIdle}
            </button>
          </form>
        )}
        {error && <p style={{ color: 'var(--color-accent)', fontSize: 13, marginTop: 8 }}>{error}</p>}
      </div>
    </div>
  )
}
