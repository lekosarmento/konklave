import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(req: Request) {
  try {
    const body = await req.json()
    console.log('[feedback] received:', JSON.stringify(body))

    const { email, rating, comentario, questao, verdict_approved } = body

    if (!email || !rating) {
      return NextResponse.json(
        { error: 'Missing required fields: email and rating' },
        { status: 400 }
      )
    }

    const insertData = {
      email,
      rating: Number(rating),
      comentario: comentario || null,
      questao: questao || null,
      verdict_approved: verdict_approved ?? null,
      criado_em: new Date().toISOString(),
    }

    console.log('[feedback] inserting:', JSON.stringify(insertData))

    const { data, error } = await supabase
      .from('feedbacks')
      .insert([insertData])
      .select()

    if (error) {
      console.error('[feedback] Supabase error:', JSON.stringify(error))
      return NextResponse.json(
        { error: error.message, details: error.details, hint: error.hint },
        { status: 500 }
      )
    }

    console.log('[feedback] success:', JSON.stringify(data))
    return NextResponse.json({ success: true, data })

  } catch (e) {
    console.error('[feedback] unexpected error:', e)
    return NextResponse.json(
      { error: String(e) },
      { status: 500 }
    )
  }
}
