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
    console.log(`[openrouter] key=${apiKey.slice(0, 10)}... model=${model} timeout=${timeoutMs}ms`)

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

function isTimeoutError(e: unknown): boolean {
    if (!(e instanceof Error)) return false
    return (
        e.name === 'AbortError' ||
        e.name === 'TimeoutError' ||
        e.message.includes('timed out') ||
        e.message.includes('timeout') ||
        e.message.includes('network')
    )
}

export async function callOpenRouterWithRetry(
    model: string,
    messages: ORMessage[],
    maxTokens = 900,
    timeoutMs = 25000
): Promise<string> {
    try {
        return await callOpenRouter(model, messages, maxTokens, timeoutMs)
    } catch (e) {
        if (!isTimeoutError(e)) throw e
        console.log(`[openrouter] timeout on ${model}, retrying in 2s...`)
        await new Promise(r => setTimeout(r, 2000))
        return await callOpenRouter(model, messages, maxTokens, timeoutMs)
    }
}
