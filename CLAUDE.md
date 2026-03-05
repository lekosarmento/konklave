# Konklave — Instructions for Claude Code

## What this project is
A structured multi-AI debate system where selected AI members debate a question in phases and deliver a final verdict.

## Stack
Next.js 14 App Router + TypeScript | OpenRouter API | Tailwind CSS | Vercel

## Debate flow
1. /api/council/opinions  — parallel, each member opines independently
2. /api/council/debate    — parallel, each member reacts to others
3. /api/council/replica   — optional, parallel deeper round
4. /api/council/treplica  — optional, parallel final round
5. /api/council/verdict   — single Claude call as president/arbiter

## Rules
- NEVER expose OPENROUTER_API_KEY in frontend code
- Always use Promise.all for parallel member calls
- previousRounds shape: { phase: { memberId: text } }
- Verdict always uses anthropic/claude-sonnet-4-5
- All user-facing text must be in pt-BR

## Member models (OpenRouter)
claude → anthropic/claude-sonnet-4-5 | gpt → openai/gpt-4o
gemini → google/gemini-2.5-pro-preview | grok → x-ai/grok-3
perplexity → perplexity/sonar-pro | deepseek → deepseek/deepseek-r1
kimi → moonshotai/kimi-k2 | qwen → qwen/qwen3-235b-a22b
