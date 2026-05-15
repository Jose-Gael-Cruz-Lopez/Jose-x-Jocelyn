import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY')
const ADMIN_NOTIFY = 'campustocareerteam@gmail.com'
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
    const { name, email, school, lang } = await req.json()

    if (!name || !email || !school) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const { error: dbErr } = await supabase
      .from('waitlist_subscribers')
      .insert({
        name: String(name).trim(),
        email: String(email).trim().toLowerCase(),
        school: String(school).trim(),
        lang: typeof lang === 'string' ? lang : null,
      })

    if (dbErr) {
      console.error('Insert error:', dbErr)
      return new Response(
        JSON.stringify({ error: dbErr.message }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    if (RESEND_API_KEY) {
      fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${RESEND_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: FROM_EMAIL,
          to: [ADMIN_NOTIFY],
          subject: `New waitlist signup — ${name}`,
          html: `
            <div style="font-family:sans-serif;max-width:600px;margin:0 auto;padding:32px;">
              <h2 style="margin:0 0 24px;color:#162B44;">New waitlist signup</h2>
              <p style="margin:0 0 8px;color:#6B5E52;font-size:14px;font-weight:600;text-transform:uppercase;letter-spacing:.08em;">Name</p>
              <p style="margin:0 0 16px;font-size:16px;color:#1A1916;">${name}</p>
              <p style="margin:0 0 8px;color:#6B5E52;font-size:14px;font-weight:600;text-transform:uppercase;letter-spacing:.08em;">Email</p>
              <p style="margin:0 0 16px;font-size:16px;color:#1A1916;">${email}</p>
              <p style="margin:0 0 8px;color:#6B5E52;font-size:14px;font-weight:600;text-transform:uppercase;letter-spacing:.08em;">School</p>
              <p style="margin:0 0 16px;font-size:16px;color:#1A1916;">${school}</p>
              <p style="margin:0 0 8px;color:#6B5E52;font-size:14px;font-weight:600;text-transform:uppercase;letter-spacing:.08em;">Language</p>
              <p style="margin:0;font-size:16px;color:#1A1916;">${lang ?? 'n/a'}</p>
            </div>
          `,
        }),
      }).catch((err) => console.error('Resend notify failed (non-fatal):', err))
    }

    return new Response(JSON.stringify({ ok: true }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  } catch (err) {
    console.error('Function error:', err)
    return new Response(
      JSON.stringify({ error: err.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
