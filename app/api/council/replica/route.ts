import { NextRequest, NextResponse } from 'next/server'
import { MEMBERS } from '@/lib/personas'
import { callOpenRouter } from '@/lib/openrouter'
import { ApiRequest } from '@/lib/types'

export const maxDuration = 60

export async function POST(req: NextRequest) {
    try {
        const body: ApiRequest = await req.json()
        const { question, selectedMembers, previousRounds } = body
        const wordLimit = body.speed === 'deep' ? 350 : 220
        const PHASE_TASK = `TAREFA — FASE 3, RÉPLICA: Com base no histórico completo, responda às críticas e refine ou defenda sua posição. Máx ${wordLimit} palavras.`
        if (!question) return NextResponse.json({ error: 'question required' }, { status: 400 })

        const targets = MEMBERS.filter(m => selectedMembers.includes(m.id))
        const opinions = previousRounds?.opinions || ({} as Record<string, string>)
        const debates = previousRounds?.debate || ({} as Record<string, string>)

        const settled = await Promise.allSettled(
            targets.map(async (member) => {
                let transcript = `Questão em debate: ${question}\n\n`

                transcript += `=== FASE 1: OPINIÕES ===\n`
                MEMBERS.filter(m => selectedMembers.includes(m.id) && opinions[m.id]).forEach(m => {
                    transcript += `${m.name} (${m.role}):\n${opinions[m.id] || ''}\n\n`
                })

                transcript += `=== FASE 2: DEBATE ===\n`
                MEMBERS.filter(m => selectedMembers.includes(m.id) && debates[m.id]).forEach(m => {
                    transcript += `${m.name} (${m.role}):\n${debates[m.id] || ''}\n\n`
                })

                const userPrompt = `${transcript}\n\n---\n\nCom base em todo o histórico acima, apresente sua réplica.`

                const text = await callOpenRouter(member.model, [
                    { role: 'system', content: member.systemPrompt + '\n\n' + PHASE_TASK },
                    { role: 'user', content: userPrompt },
                ])
                return { memberId: member.id, text, phase: 'replica' as const }
            })
        )

        const results = settled.map((res, i) =>
            res.status === 'fulfilled'
                ? res.value
                : { memberId: targets[i].id, text: `[Erro: ${res.reason?.message || 'timeout'}]`, phase: 'replica' as const }
        )

        return NextResponse.json({ results })
    } catch (e: unknown) {
        const msg = e instanceof Error ? e.message : String(e)
        return NextResponse.json({ error: msg }, { status: 500 })
    }
}
