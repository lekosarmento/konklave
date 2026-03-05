import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase-server'

// POST /api/leads — insert a new lead (called from /cadastro)
export async function POST(req: NextRequest) {
  console.log('[api/leads] POST received')
  let body: unknown
  try {
    body = await req.json()
  } catch {
    console.log('[api/leads] failed to parse body')
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }
  const { nome, email, whatsapp } = body as { nome?: string; email?: string; whatsapp?: string }
  console.log('[api/leads] data:', { nome, email, whatsapp })

  if (!nome || !email) {
    return NextResponse.json({ error: 'nome and email are required' }, { status: 400 })
  }

  const supabase = createServiceClient()
  console.log('[api/leads] before insert')
  const { data, error } = await supabase.from('leads').insert({
    nome,
    email,
    whatsapp: whatsapp || null,
    usos: 0,
  }).select().single()
  console.log('[api/leads] after insert — data:', data, 'error:', error)

  if (error) {
    console.error('[api/leads] Supabase insert error:', error)
    return NextResponse.json({ error: error.message, details: error }, { status: 500 })
  }

  return NextResponse.json({ ok: true, data })
}

// PATCH /api/leads — update an existing lead (usos, shares_count)
export async function PATCH(req: NextRequest) {
  console.log('[api/leads] PATCH received')
  let body: unknown
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }
  const { email, ...updates } = body as { email?: string; [key: string]: unknown }
  console.log('[api/leads] updating email:', email, 'fields:', updates)

  if (!email) {
    return NextResponse.json({ error: 'email is required' }, { status: 400 })
  }

  const supabase = createServiceClient()
  const { error } = await supabase.from('leads').update(updates).eq('email', email)
  if (error) {
    console.error('[api/leads] Supabase update error:', error)
    return NextResponse.json({ error: error.message, details: error }, { status: 500 })
  }

  return NextResponse.json({ ok: true })
}
