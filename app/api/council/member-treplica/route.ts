import { NextRequest, NextResponse } from 'next/server'
import { MEMBERS } from '@/lib/personas'
import { callOpenRouterWithRetry } from '@/lib/openrouter'

export const maxDuration = 30

export async function POST(req: NextRequest) {
    let memberId: string | undefined
    try {
        const body = await req.json()
        memberId = body.memberId
        const { question, speed, allOpinions = {}, allDebates = {}, allReplicas = {} } = body as {
            memberId: string
            question: string
            speed?: string
            allOpinions?: Record<string, string>
            allDebates?: Record<string, string>
            allReplicas?: Record<string, string>
        }

        const member = MEMBERS.find(m => m.id === memberId)
        if (!member) return NextResponse.json({ error: 'unknown member' }, { status: 400 })
        if (!question) return NextResponse.json({ error: 'question required' }, { status: 400 })

        const wordLimit = speed === 'deep' ? 140 : 90
        const PHASE_TASK = `TAREFA — FASE 4, TRÉPLICA: Apresente suas considerações finais sintetizando o que o debate produziu. Seja conciso. Máximo 2 parágrafos curtos. Máx ${wordLimit} palavras.`

        let transcript = `Questão em debate: ${question}\n\n`
        transcript += `=== FASE 1: OPINIÕES ===\n`
        MEMBERS.filter(m => allOpinions[m.id]).forEach(m => {
            transcript += `${m.name} (${m.role}):\n${allOpinions[m.id]}\n\n`
        })
        transcript += `=== FASE 2: DEBATE ===\n`
        MEMBERS.filter(m => allDebates[m.id]).forEach(m => {
            transcript += `${m.name} (${m.role}):\n${allDebates[m.id]}\n\n`
        })
        transcript += `=== FASE 3: RÉPLICA ===\n`
        MEMBERS.filter(m => allReplicas[m.id]).forEach(m => {
            transcript += `${m.name} (${m.role}):\n${allReplicas[m.id]}\n\n`
        })

        const userPrompt = `${transcript}\n\n---\n\nConsidere todo o histórico acima para sua tréplica final. Responda em no máximo ${wordLimit} palavras.`

        const text = await callOpenRouterWithRetry(member.model, [
            { role: 'system', content: member.systemPrompt + '\n\n' + PHASE_TASK },
            { role: 'user', content: userPrompt },
        ], 900, 25000)

        return NextResponse.json({ memberId, text })
    } catch (e: unknown) {
        const msg = e instanceof Error ? e.message : String(e)
        console.error(`[member-treplica] ${memberId} error:`, msg)
        return NextResponse.json({ memberId, text: `[Erro: ${msg}]` })
    }
}
