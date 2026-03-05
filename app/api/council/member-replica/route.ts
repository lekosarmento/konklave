import { NextRequest, NextResponse } from 'next/server'
import { MEMBERS } from '@/lib/personas'
import { callOpenRouter } from '@/lib/openrouter'

export const maxDuration = 30

export async function POST(req: NextRequest) {
    let memberId: string | undefined
    try {
        const body = await req.json()
        memberId = body.memberId
        const { question, speed, allOpinions = {}, allDebates = {} } = body as {
            memberId: string
            question: string
            speed?: string
            allOpinions?: Record<string, string>
            allDebates?: Record<string, string>
        }

        const member = MEMBERS.find(m => m.id === memberId)
        if (!member) return NextResponse.json({ error: 'unknown member' }, { status: 400 })
        if (!question) return NextResponse.json({ error: 'question required' }, { status: 400 })

        const wordLimit = speed === 'deep' ? 350 : 220
        const PHASE_TASK = `TAREFA — FASE 3, RÉPLICA: Com base no histórico completo, responda às críticas e refine ou defenda sua posição. Máx ${wordLimit} palavras.`

        let transcript = `Questão em debate: ${question}\n\n`
        transcript += `=== FASE 1: OPINIÕES ===\n`
        MEMBERS.filter(m => allOpinions[m.id]).forEach(m => {
            transcript += `${m.name} (${m.role}):\n${allOpinions[m.id]}\n\n`
        })
        transcript += `=== FASE 2: DEBATE ===\n`
        MEMBERS.filter(m => allDebates[m.id]).forEach(m => {
            transcript += `${m.name} (${m.role}):\n${allDebates[m.id]}\n\n`
        })

        const userPrompt = `${transcript}\n\n---\n\nCom base em todo o histórico acima, apresente sua réplica.`

        const text = await callOpenRouter(member.model, [
            { role: 'system', content: member.systemPrompt + '\n\n' + PHASE_TASK },
            { role: 'user', content: userPrompt },
        ], 900, 8000)

        return NextResponse.json({ memberId, text })
    } catch (e: unknown) {
        const msg = e instanceof Error ? e.message : String(e)
        console.error(`[member-replica] ${memberId} error:`, msg)
        return NextResponse.json({ memberId, text: `[Erro: ${msg}]` })
    }
}
