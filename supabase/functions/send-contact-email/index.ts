import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'

const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY')
const TO_EMAIL = 'campustocareerteam@gmail.com'
const FROM_EMAIL = 'Jose x Jocelyn <newsletter@fromcampuscareer.com>'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  if (req.method !== 'POST') {
    return new Response('Method not allowed', { status: 405, headers: corsHeaders })
  }

  try {
    const { name, email, message } = await req.json()

    if (!email || !message) {
      return new Response('Missing required fields', { status: 400, headers: corsHeaders })
    }

    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: FROM_EMAIL,
        to: [TO_EMAIL],
        reply_to: email,
        subject: `New message from ${name || email}`,
        html: `
          <div style="font-family:sans-serif;max-width:600px;margin:0 auto;padding:32px;">
            <h2 style="margin:0 0 24px;color:#162B44;">New message via Jose x Jocelyn</h2>
            <p style="margin:0 0 8px;color:#6B5E52;font-size:14px;font-weight:600;text-transform:uppercase;letter-spacing:.08em;">From</p>
            <p style="margin:0 0 24px;font-size:16px;color:#1A1916;">${name || '(no name)'} &lt;${email}&gt;</p>
            <p style="margin:0 0 8px;color:#6B5E52;font-size:14px;font-weight:600;text-transform:uppercase;letter-spacing:.08em;">Message</p>
            <p style="margin:0;font-size:16px;color:#1A1916;line-height:1.7;white-space:pre-wrap;">${message}</p>
          </div>
        `,
      }),
    })

    if (!res.ok) {
      const err = await res.text()
      console.error('Resend error:', err)
      return new Response(JSON.stringify({ error: err }), { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
    }

    return new Response(JSON.stringify({ sent: true }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  } catch (err) {
    console.error('Function error:', err)
    return new Response(JSON.stringify({ error: err.message }), { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
  }
})
