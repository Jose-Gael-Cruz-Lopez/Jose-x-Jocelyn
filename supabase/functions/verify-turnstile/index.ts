// Cloudflare Turnstile verification proxy.
//
// Deploy:  supabase functions deploy verify-turnstile --no-verify-jwt
// Secret:  supabase secrets set TURNSTILE_SECRET_KEY=<from Cloudflare dashboard>
//
// Client calls this from CoffeeChat.jsx with { token } before insert.
// Returns { success: true } on pass, { success: false, errors } on fail.

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'

const TURNSTILE_SECRET_KEY = Deno.env.get('TURNSTILE_SECRET_KEY')
const TURNSTILE_VERIFY_URL = 'https://challenges.cloudflare.com/turnstile/v0/siteverify'

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
  if (!TURNSTILE_SECRET_KEY) {
    return new Response(JSON.stringify({ success: false, errors: ['TURNSTILE_SECRET_KEY not configured'] }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }

  try {
    const { token } = await req.json()
    if (!token) {
      return new Response(JSON.stringify({ success: false, errors: ['missing-token'] }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    const remoteIp = req.headers.get('cf-connecting-ip') ||
                     req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
                     ''

    const body = new URLSearchParams()
    body.append('secret', TURNSTILE_SECRET_KEY)
    body.append('response', token)
    if (remoteIp) body.append('remoteip', remoteIp)

    const verify = await fetch(TURNSTILE_VERIFY_URL, {
      method: 'POST',
      body,
    })
    const result = await verify.json()

    return new Response(JSON.stringify({
      success: !!result.success,
      errors: result['error-codes'] || [],
    }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  } catch (err) {
    return new Response(JSON.stringify({ success: false, errors: [err.message] }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})
