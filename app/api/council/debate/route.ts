import { NextRequest, NextResponse } from 'next/server'
import { MEMBERS } from '@/lib/personas'
import { callOpenRouter } from '@/lib/openrouter'
import { ApiRequest } from '@/lib/types'

export const maxDuration = 60

export async function POST(req: NextRequest) {
    try {
        const body: ApiRequest = await req.json()
        const { question, selectedMembers, previousRounds } = body
        const wordLimit = body.speed === 'deep' ? 320 : 200
        const PHASE_TASK = `TAREFA — FASE 2, DEBATE: Analise as opiniões dos outros membros, questione pontos fracos e aprofunde os mais relevantes. Máx ${wordLimit} palavras.`
        if (!question) return NextResponse.json({ error: 'question required' }, { status: 400 })

        const targets = MEMBERS.filter(m => selectedMembers.includes(m.id))
        const opinions = previousRounds?.opinions || ({} as Record<string, string>)

        const settled = await Promise.allSettled(
            targets.map(async (member) => {
                const myOpinion = opinions[member.id] || ''

                const otherOpinionsStr = MEMBERS
                    .filter(m => selectedMembers.includes(m.id) && m.id !== member.id && opinions[m.id])
                    .map(m => `${m.name} (${m.role}):\n${opinions[m.id]}`)
                    .join('\n\n---\n\n')

                const userPrompt = `Questão em debate: ${question}\n\nSua opinião anterior:\n${myOpinion}\n\nO que os outros membros disseram:\n\n---\n\n${otherOpinionsStr}`

                const text = await callOpenRouter(member.model, [
                    { role: 'system', content: member.systemPrompt + '\n\n' + PHASE_TASK },
                    { role: 'user', content: userPrompt },
                ])
                return { memberId: member.id, text, phase: 'debate' as const }
            })
        )

        const results = settled.map((res, i) =>
            res.status === 'fulfilled'
                ? res.value
                : { memberId: targets[i].id, text: `[Erro: ${res.reason?.message || 'timeout'}]`, phase: 'debate' as const }
        )

        return NextResponse.json({ results })
    } catch (e: unknown) {
        const msg = e instanceof Error ? e.message : String(e)
        return NextResponse.json({ error: msg }, { status: 500 })
    }
}
