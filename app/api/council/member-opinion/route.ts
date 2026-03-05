import { NextRequest, NextResponse } from 'next/server'
import { MEMBERS } from '@/lib/personas'
import { callOpenRouterWithRetry } from '@/lib/openrouter'

export const maxDuration = 30

export async function POST(req: NextRequest) {
    let memberId: string | undefined
    try {
        const body = await req.json()
        memberId = body.memberId
        const { question, speed } = body

        const member = MEMBERS.find(m => m.id === memberId)
        if (!member) return NextResponse.json({ error: 'unknown member' }, { status: 400 })
        if (!question) return NextResponse.json({ error: 'question required' }, { status: 400 })

        const wordLimit = speed === 'deep' ? 400 : 250
        const PHASE_TASK = `TAREFA — FASE 1, OPINIÕES: Apresente sua visão inicial sobre a questão. Seja direto e autêntico à sua identidade. Máx ${wordLimit} palavras.`

        const userPrompt = member.id === 'perplexity'
            ? `Pesquise dados reais, tendências de mercado e referências concretas sobre:\n\n${question}`
            : `Analise esta questão:\n\n${question}`

        const text = await callOpenRouterWithRetry(member.model, [
            { role: 'system', content: member.systemPrompt + '\n\n' + PHASE_TASK },
            { role: 'user', content: userPrompt },
        ], 900, 25000)

        return NextResponse.json({ memberId, text })
    } catch (e: unknown) {
        const msg = e instanceof Error ? e.message : String(e)
        console.error(`[member-opinion] ${memberId} error:`, msg)
        return NextResponse.json({ memberId, text: `[Erro: ${msg}]` })
    }
}
