import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(req: Request) {
  try {
    const { email } = await req.json()
    if (!email) return NextResponse.json({ error: 'No email' }, { status: 400 })

    const { data: lead } = await supabase
      .from('leads')
      .select('usos')
      .eq('email', email)
      .single()

    const newUsos = (lead?.usos || 0) + 1

    const { error } = await supabase
      .from('leads')
      .update({ usos: newUsos })
      .eq('email', email)

    if (error) return NextResponse.json({ error }, { status: 500 })
    return NextResponse.json({ usos: newUsos })
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 })
  }
}
