import { NextRequest, NextResponse } from 'next/server'
import { MEMBERS } from '@/lib/personas'
import { callOpenRouter } from '@/lib/openrouter'

export const maxDuration = 30

export async function POST(req: NextRequest) {
    let memberId: string | undefined
    try {
        const body = await req.json()
        memberId = body.memberId
        const { question, speed, allOpinions = {} } = body as {
            memberId: string
            question: string
            speed?: string
            allOpinions?: Record<string, string>
        }

        const member = MEMBERS.find(m => m.id === memberId)
        if (!member) return NextResponse.json({ error: 'unknown member' }, { status: 400 })
        if (!question) return NextResponse.json({ error: 'question required' }, { status: 400 })

        const wordLimit = speed === 'deep' ? 320 : 200
        const PHASE_TASK = `TAREFA — FASE 2, DEBATE: Analise as opiniões dos outros membros, questione pontos fracos e aprofunde os mais relevantes. Máx ${wordLimit} palavras.`

        const myOpinion = allOpinions[member.id] || ''
        const otherOpinionsStr = MEMBERS
            .filter(m => allOpinions[m.id] && m.id !== member.id)
            .map(m => `${m.name} (${m.role}):\n${allOpinions[m.id]}`)
            .join('\n\n---\n\n')

        const userPrompt = `Questão em debate: ${question}\n\nSua opinião anterior:\n${myOpinion}\n\nO que os outros membros disseram:\n\n---\n\n${otherOpinionsStr}`

        const text = await callOpenRouter(member.model, [
            { role: 'system', content: member.systemPrompt + '\n\n' + PHASE_TASK },
            { role: 'user', content: userPrompt },
        ], 900, 8000)

        return NextResponse.json({ memberId, text })
    } catch (e: unknown) {
        const msg = e instanceof Error ? e.message : String(e)
        console.error(`[member-debate] ${memberId} error:`, msg)
        return NextResponse.json({ memberId, text: `[Erro: ${msg}]` })
    }
}
