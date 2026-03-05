import { NextRequest, NextResponse } from 'next/server'
import { MEMBERS, VERDICT_SYSTEM, VERDICT_FORMAT } from '@/lib/personas'
import { callOpenRouter } from '@/lib/openrouter'

export async function POST(req: NextRequest) {
    try {
        const { question, previousRounds, selectedMembers, presidentId } = await req.json()
        const members = MEMBERS.filter(m => selectedMembers.includes(m.id))
        const phaseLabels: Record<string, string> = {
            opinions: 'OPINIÕES', debate: 'DEBATE', replica: 'RÉPLICA', treplica: 'TRÉPLICA'
        }
        const transcript = Object.entries(previousRounds as Record<string, Record<string, string>>)
            .map(([phase, memberTexts]) => {
                const label = phaseLabels[phase] || phase.toUpperCase()
                const lines = members.map(m => `${m.name} (${m.role}):\n${(memberTexts as any)[m.id] || ''}`).join('\n\n')
                return `=== ${label} ===\n${lines}`
            }).join('\n\n')

        const president = presidentId ? MEMBERS.find(m => m.id === presidentId) : null
        const systemPrompt = president
            ? `Você é ${president.name}, ${president.role}, eleito Presidente do Konklave para arbitrar esta deliberação. Sintetize toda a discussão com a perspectiva característica do seu papel. Seja direto, honesto e acionável. Português brasileiro.`
            : VERDICT_SYSTEM

        const text = await callOpenRouter(
            president ? president.model : 'anthropic/claude-sonnet-4-5',
            [
                { role: 'system', content: systemPrompt },
                { role: 'user', content: `QUESTÃO:\n"${question}"\n\nTRANSCRIÇÃO:\n\n${transcript}\n\n${VERDICT_FORMAT}` },
            ],
            1200
        )
        return NextResponse.json({ text })
    } catch (e: any) {
        return NextResponse.json({ error: e.message }, { status: 500 })
    }
}
