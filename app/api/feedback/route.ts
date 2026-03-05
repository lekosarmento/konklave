import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

// POST /api/feedback — insert a feedback row using service role key (bypasses RLS)
export async function POST(req: NextRequest) {
  if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
    console.error('[api/feedback] SUPABASE_SERVICE_ROLE_KEY not configured')
    return NextResponse.json({ error: 'SUPABASE_SERVICE_ROLE_KEY not configured' }, { status: 500 })
  }

  console.log('[api/feedback] POST received')
  let body: unknown
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }
  const { email, rating, comentario, shared_verdict, questao, membros_usados, verdict_approved } =
    body as {
      email?: string
      rating?: number
      comentario?: string
      shared_verdict?: string
      questao?: string
      membros_usados?: string[]
      verdict_approved?: boolean | null
    }
  console.log('[api/feedback] data:', { email, rating, questao, verdict_approved })

  if (!rating) {
    return NextResponse.json({ error: 'rating is required' }, { status: 400 })
  }

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
  console.log('[api/feedback] before insert')
  const { data, error } = await supabase.from('feedbacks').insert({
    email: email || null,
    rating,
    comentario: comentario || null,
    shared_verdict: shared_verdict || null,
    questao: questao || null,
    membros_usados: membros_usados || null,
    verdict_approved: verdict_approved ?? null,
    criado_em: new Date().toISOString(),
  }).select().single()
  console.log('[api/feedback] after insert — data:', data, 'error:', error)

  if (error) {
    console.error('[api/feedback] Supabase insert error:', error)
    return NextResponse.json({ error: error.message, details: error }, { status: 500 })
  }

  return NextResponse.json({ ok: true, data })
}
