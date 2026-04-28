// Coffee Chat Network — confirmation email after a profile is added.
//
// Deploy:  supabase functions deploy coffee-chat-welcome --no-verify-jwt
// Secret:  supabase secrets set RESEND_API_KEY=<your Resend key>
//
// The CoffeeChat page invokes this after a successful insert.
// Failures are silent on the client side — the directory listing is the source of truth.

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'

const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY')
// Resend won't let you send "from" a gmail.com address you don't own (no SPF/DKIM control).
// So the visible sender uses Resend's verified test domain, and replies route to the
// real campus-to-career inbox via reply_to. When fromcampuscareer.com is verified in
// Resend, swap FROM_EMAIL to something like 'Jose & Jocelyn <hello@fromcampuscareer.com>'.
const FROM_EMAIL = 'Jose & Jocelyn <onboarding@resend.dev>'
const REPLY_TO = 'campustocareerteam@gmail.com'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }
  if (req.method !== 'POST') {
    return new Response('Method not allowed', { status: 405, headers: corsHeaders })
  }
  if (!RESEND_API_KEY) {
    return new Response(JSON.stringify({ sent: false, error: 'RESEND_API_KEY not configured' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }

  try {
    const { name, email, profileId } = await req.json()
    if (!email) {
      return new Response(JSON.stringify({ sent: false, error: 'missing email' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    const firstName = (name || '').toString().split(/\s+/)[0] || 'there'
    const profileUrl = profileId
      ? `https://josexjocelyn.com/coffee-chat?profile=${profileId}`
      : 'https://josexjocelyn.com/coffee-chat'

    const html = buildEmailHtml(firstName, profileUrl)
    const text = buildEmailText(firstName, profileUrl)

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
        subject: "You're in the Coffee Chat Network",
        html,
        text,
      }),
    })

    if (!res.ok) {
      const err = await res.text()
      return new Response(JSON.stringify({ sent: false, error: err }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    return new Response(JSON.stringify({ sent: true }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  } catch (err) {
    return new Response(JSON.stringify({ sent: false, error: err.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})

function buildEmailText(firstName: string, profileUrl: string): string {
  return [
    `Hi ${firstName},`,
    '',
    "Your Coffee Chat Network profile is live. Students and peers in the Jose × Jocelyn community can now find you and reach out via your LinkedIn for short conversations.",
    '',
    `View your listing: ${profileUrl}`,
    '',
    'A few reminders:',
    '— You control how many chats you take per month — update us anytime.',
    "— You're never obligated to accept every request.",
    '— Reply to this email to edit, pause, or delete your profile.',
    '',
    "Thanks for being someone who shows up for the next person.",
    '',
    '— Jose & Jocelyn',
    'campustocareerteam@gmail.com',
  ].join('\n')
}

function buildEmailHtml(firstName: string, profileUrl: string): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>You're in the Coffee Chat Network</title>
</head>
<body style="margin:0;padding:0;background:#F2E4CE;font-family:Georgia,serif;color:#1A1916;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#F2E4CE;padding:40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">
          <tr>
            <td style="background:#162B44;border-radius:12px 12px 0 0;padding:36px 40px;">
              <p style="margin:0 0 6px;font-size:11px;font-weight:700;letter-spacing:.14em;text-transform:uppercase;color:rgba(242,228,206,.5);">From Campus to Career</p>
              <h1 style="margin:0;font-size:28px;font-weight:700;color:#F2E4CE;line-height:1.2;">You're in the Coffee Chat Network</h1>
            </td>
          </tr>
          <tr>
            <td style="background:#FFFFFF;padding:36px 40px;">
              <p style="margin:0 0 16px;font-size:16px;line-height:1.65;">Hi ${firstName},</p>
              <p style="margin:0 0 16px;font-size:16px;line-height:1.65;">Your profile is live. Students and peers in the Jose × Jocelyn community can find you and reach out via your LinkedIn for short conversations about the work you do.</p>
              <p style="margin:0 0 24px;text-align:center;">
                <a href="${profileUrl}" style="display:inline-block;background:#1A1916;color:#F2E4CE;padding:14px 28px;border-radius:8px;text-decoration:none;font-family:Arial,sans-serif;font-size:14px;font-weight:600;">View your listing →</a>
              </p>
              <p style="margin:0 0 8px;font-size:14px;line-height:1.65;color:#6B5E52;"><strong style="color:#1A1916;">A few reminders</strong></p>
              <ul style="margin:0 0 16px;padding-left:18px;font-size:14px;line-height:1.7;color:#6B5E52;">
                <li>You control how many chats you take per month — update us anytime.</li>
                <li>You're never obligated to accept every request.</li>
                <li>Reply to this email to edit, pause, or delete your profile.</li>
              </ul>
              <p style="margin:24px 0 0;font-size:14px;line-height:1.65;color:#6B5E52;">Thanks for being someone who shows up for the next person.</p>
              <p style="margin:8px 0 0;font-size:14px;color:#1A1916;">— Jose &amp; Jocelyn</p>
            </td>
          </tr>
          <tr>
            <td style="background:#F2E4CE;padding:24px 40px;border-radius:0 0 12px 12px;border-top:1px solid rgba(0,0,0,.08);">
              <p style="margin:0;font-size:12px;color:#6B5E52;line-height:1.6;">Replies to this email go straight to <a href="mailto:campustocareerteam@gmail.com" style="color:#162B44;">campustocareerteam@gmail.com</a>. We read every message.</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`
}
