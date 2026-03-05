export interface ORMessage {
    role: 'system' | 'user' | 'assistant'
    content: string
}

export async function callOpenRouter(
    model: string,
    messages: ORMessage[],
    maxTokens = 900,
    timeoutMs = 25000
): Promise<string> {
    const apiKey = process.env.OPENROUTER_API_KEY
    if (!apiKey) throw new Error('OPENROUTER_API_KEY not configured')

    const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${apiKey}`,
            'HTTP-Referer': process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
            'X-Title': 'AI Council',
        },
        body: JSON.stringify({
            model,
            messages,
            max_tokens: maxTokens,
            temperature: 0.8,
        }),
        signal: AbortSignal.timeout(timeoutMs),
    })

    if (!res.ok) {
        const err = await res.text()
        throw new Error(`OpenRouter ${res.status}: ${err}`)
    }

    const data = await res.json()
    return data.choices?.[0]?.message?.content || ''
}
