import { NextRequest, NextResponse } from 'next/server'
import { MEMBERS } from '@/lib/personas'
import { callOpenRouter } from '@/lib/openrouter'
import { ApiRequest } from '@/lib/types'

export async function POST(req: NextRequest) {
    try {
        const body: ApiRequest = await req.json()
        const { question, selectedMembers } = body
        const wordLimit = body.speed === 'deep' ? 400 : 250
        const PHASE_TASK = `TAREFA — FASE 1, OPINIÕES: Apresente sua visão inicial sobre a questão. Seja direto e autêntico à sua identidade. Máx ${wordLimit} palavras.`
        if (!question) return NextResponse.json({ error: 'question required' }, { status: 400 })

        const targets = MEMBERS.filter(m => selectedMembers.includes(m.id))

        const results = await Promise.all(
            targets.map(async (member) => {
                const userPrompt = member.id === 'perplexity'
                    ? `Pesquise dados reais, tendências de mercado e referências concretas sobre:\n\n${question}`
                    : `Analise esta questão:\n\n${question}`

                const text = await callOpenRouter(member.model, [
                    { role: 'system', content: member.systemPrompt + '\n\n' + PHASE_TASK },
                    { role: 'user', content: userPrompt },
                ])
                return { memberId: member.id, text, phase: 'opinions' as const }
            })
        )
        return NextResponse.json({ results })
    } catch (e: any) {
        return NextResponse.json({ error: e.message }, { status: 500 })
    }
}
