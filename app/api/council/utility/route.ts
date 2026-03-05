import { NextRequest, NextResponse } from 'next/server'
import { MEMBERS } from '@/lib/personas'
import { callOpenRouter } from '@/lib/openrouter'
import { UtilityRequest } from '@/lib/types'

export async function POST(req: NextRequest) {
    try {
        const body: UtilityRequest = await req.json()
        const { action, question, selectedMembers, previousRounds, verdictText } = body
        const members = MEMBERS.filter(m => selectedMembers.includes(m.id))
        const memberNames = members.map(m => `${m.name} (${m.role})`).join(', ')

        let transcript = `Questão: ${question}\n\n`
        const phases = ['opinions', 'debate', 'replica', 'treplica']
        const phaseLabels: Record<string, string> = {
            opinions: 'FASE 1: OPINIÕES',
            debate: 'FASE 2: DEBATE',
            replica: 'FASE 3: RÉPLICA',
            treplica: 'FASE 4: TRÉPLICA',
        }

        for (const phase of phases) {
            const phaseData = previousRounds[phase]
            if (phaseData && Object.keys(phaseData).length > 0) {
                transcript += `=== ${phaseLabels[phase]} ===\n`
                members.forEach(m => {
                    if (phaseData[m.id]) {
                        transcript += `${m.name} (${m.role}):\n${phaseData[m.id]}\n\n`
                    }
                })
            }
        }

        let systemPrompt = ''
        let userPrompt = ''

        if (action === 'convergence') {
            systemPrompt = 'Você é um analisador de convergência de debate. Responda em português brasileiro, de forma concisa e direta.'
            userPrompt = `${transcript}\n\nAnalise o grau de convergência entre os conselheiros (${memberNames}). Em 2-3 frases curtas: onde convergem, onde divergem, e qual é o consenso emergente, se houver.`
        } else if (action === 'mostDivergent') {
            systemPrompt = 'Você é um analisador de debates. Responda em português brasileiro, de forma concisa.'
            userPrompt = `${transcript}\n\nDos conselheiros (${memberNames}), qual apresentou a perspectiva mais divergente e original ao longo de todo o debate? Responda exatamente neste formato:\nMEMBRO: [nome exato do membro]\nMOTIVO: [1 frase explicando por que foi o mais divergente]`
        } else if (action === 'electPresident') {
            systemPrompt = 'Você é um árbitro imparcial de debates. Responda APENAS em JSON válido, sem texto adicional, sem markdown.'
            userPrompt = `${transcript}\n\nCom base no debate completo entre (${memberNames}), eleja o conselheiro que demonstrou o pensamento mais equilibrado, fundamentado e útil para a decisão final. Responda APENAS com JSON válido: {"presidentId": "[id do membro]", "reason": "[1 frase de justificativa]"}\n\nIDs disponíveis: ${members.map(m => m.id).join(', ')}`
        } else if (action === 'summarizeVerdict') {
            systemPrompt = 'Você é um especialista em comunicação. Responda apenas com o resumo solicitado, sem introdução, sem aspas, sem explicações adicionais.'
            userPrompt = `Resuma este veredito em exatamente 2 frases diretas e impactantes, máximo 180 caracteres no total. Retorne só as frases, sem introdução, sem aspas:\n\n${verdictText || ''}`
        } else {
            return NextResponse.json({ error: 'invalid action' }, { status: 400 })
        }

        const text = await callOpenRouter('anthropic/claude-sonnet-4-5', [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: userPrompt },
        ], 600)

        return NextResponse.json({ text })
    } catch (e: any) {
        return NextResponse.json({ error: e.message }, { status: 500 })
    }
}
