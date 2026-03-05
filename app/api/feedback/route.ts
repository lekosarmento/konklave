import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase-server'

// POST /api/feedback — insert a feedback row
export async function POST(req: NextRequest) {
  console.log('[api/feedback] POST received')
  let body: unknown
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }
  const { email, rating, comment, shared_verdict, questao, membros_usados } =
    body as {
      email?: string
      rating?: number
      comment?: string
      shared_verdict?: string
      questao?: string
      membros_usados?: string[]
    }
  console.log('[api/feedback] data:', { email, rating, questao })

  if (!rating) {
    return NextResponse.json({ error: 'rating is required' }, { status: 400 })
  }

  const supabase = createServiceClient()
  console.log('[api/feedback] before insert')
  const { data, error } = await supabase.from('feedbacks').insert({
    email: email || null,
    rating,
    comment: comment || null,
    shared_verdict: shared_verdict || null,
    questao: questao || null,
    membros_usados: membros_usados || null,
    criado_em: new Date().toISOString(),
  }).select().single()
  console.log('[api/feedback] after insert — data:', data, 'error:', error)

  if (error) {
    console.error('[api/feedback] Supabase insert error:', error)
    return NextResponse.json({ error: error.message, details: error }, { status: 500 })
  }

  return NextResponse.json({ ok: true, data })
}
