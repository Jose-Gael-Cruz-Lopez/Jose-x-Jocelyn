import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'

const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY')
const FROM_EMAIL = 'Jose & Jocelyn <newsletter@fromcampuscareer.com>'
const REPLY_TO = 'jose@fromcampuscareer.com'

serve(async (req) => {
  // Supabase database webhooks send a POST with the record payload
  if (req.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 })
  }

  try {
    const payload = await req.json()
    const record = payload.record

    if (!record?.email) {
      return new Response('No email in payload', { status: 400 })
    }

    const firstName = record.name?.split(' ')[0] || 'there'
    const email = record.email

    const html = buildEmailHtml(firstName)

    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: FROM_EMAIL,
        reply_to: REPLY_TO,
        to: [email],
        subject: 'Welcome to La Voz del Día',
        html,
      }),
    })

    if (!res.ok) {
      const err = await res.text()
      console.error('Resend error:', err)
      return new Response(`Resend error: ${err}`, { status: 500 })
    }

    return new Response(JSON.stringify({ sent: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    })
  } catch (err) {
    console.error('Function error:', err)
    return new Response(`Error: ${err.message}`, { status: 500 })
  }
})

function buildEmailHtml(firstName: string): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Welcome to La Voz del Día</title>
</head>
<body style="margin:0;padding:0;background:#F2E4CE;font-family:'Georgia',serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#F2E4CE;padding:40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">

          <!-- Header -->
          <tr>
            <td style="background:#162B44;border-radius:12px 12px 0 0;padding:36px 40px;">
              <p style="margin:0 0 6px;font-size:11px;font-weight:700;letter-spacing:.14em;text-transform:uppercase;color:rgba(242,228,206,.5);">From Campus to Career</p>
              <h1 style="margin:0;font-size:28px;font-weight:700;color:#F2E4CE;line-height:1.2;">La Voz del Día</h1>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="background:#ffffff;padding:40px 40px 32px;">
              <p style="margin:0 0 20px;font-size:17px;color:#2A2117;line-height:1.75;">Hey ${firstName},</p>
              <p style="margin:0 0 20px;font-size:16px;color:#6B5E52;line-height:1.8;">
                You're in. Welcome to <strong style="color:#2A2117;">La Voz del Día</strong> — the weekly newsletter from Jose &amp; Jocelyn built for first-gen and underrepresented students navigating internships, early careers, and everything in between.
              </p>
              <p style="margin:0 0 28px;font-size:16px;color:#6B5E52;line-height:1.8;">
                Every article we write comes from a real moment — a rejection, a negotiation, a coffee chat that changed everything. No generic advice. No recycled LinkedIn content. Just the stuff that actually matters when you're figuring it out without a roadmap.
              </p>

              <!-- Divider -->
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr><td style="border-top:1px solid rgba(0,0,0,.08);padding-bottom:28px;"></td></tr>
              </table>

              <p style="margin:0 0 16px;font-size:12px;font-weight:700;letter-spacing:.1em;text-transform:uppercase;color:#8A7E72;">While you're here</p>

              <!-- Links -->
              <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:28px;">
                <tr>
                  <td style="padding:12px 0;border-bottom:1px solid rgba(0,0,0,.06);">
                    <a href="https://fromcampuscareer.com/coffee-chat" style="text-decoration:none;color:#2A2117;font-size:14px;font-weight:600;">☕ Coffee Chat Network</a>
                    <p style="margin:2px 0 0;font-size:13px;color:#8A7E72;">Find people who want to be reached out to.</p>
                  </td>
                </tr>
                <tr>
                  <td style="padding:12px 0;border-bottom:1px solid rgba(0,0,0,.06);">
                    <a href="https://fromcampuscareer.com/opportunity-board" style="text-decoration:none;color:#2A2117;font-size:14px;font-weight:600;">📋 Opportunity Board</a>
                    <p style="margin:2px 0 0;font-size:13px;color:#8A7E72;">Curated internships and early-career roles.</p>
                  </td>
                </tr>
                <tr>
                  <td style="padding:12px 0;">
                    <a href="https://fromcampuscareer.com/career-templates" style="text-decoration:none;color:#2A2117;font-size:14px;font-weight:600;">📄 Career Templates</a>
                    <p style="margin:2px 0 0;font-size:13px;color:#8A7E72;">Scripts and trackers for every stage of your search.</p>
                  </td>
                </tr>
              </table>

              <p style="margin:0;font-size:15px;color:#6B5E52;line-height:1.75;">
                Talk soon,<br />
                <strong style="color:#2A2117;">Jose &amp; Jocelyn</strong>
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background:#F2E4CE;border-radius:0 0 12px 12px;padding:24px 40px;text-align:center;">
              <p style="margin:0;font-size:12px;color:#8A7E72;line-height:1.6;">
                You're receiving this because you subscribed at fromcampuscareer.com.<br />
                No spam, ever. We write when we have something worth saying.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`
}
