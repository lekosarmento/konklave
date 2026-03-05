'use client'

import { useState, useEffect, useRef } from "react"
import type { Dispatch, SetStateAction } from "react"

// ─── TYPES ────────────────────────────────────────────────────
interface Member {
  id: string
  name: string
  role: string
  color: string
  symbol: string
  category: 'technical' | 'historical'
  subcategory: 'models' | 'specialists' | 'minds'
  description: string
  whenToCall: string
  era?: string
  poweredBy?: string
}

interface HistoryItem {
  id: string
  question: string
  verdict: string
  members: string[]
  date: string
}

type StatusMap = Record<string, string>
type TextMap = Record<string, string>

// ─── MEMBERS ──────────────────────────────────────────────────
const MEMBERS: Member[] = [
  // Technical
  { id: "claude", name: "CLAUDE", role: "O Filósofo", color: "#C8952A", symbol: "Φ", category: "technical", subcategory: "models", poweredBy: "Claude Sonnet", description: "Antes de responder, desmonta a pergunta. Expõe o que está sendo assumido, o que está sendo evitado e o que ninguém quer ouvir. Não entrega conforto — entrega clareza.", whenToCall: "A decisão tem peso moral, consequências irreversíveis ou premissas que ninguém ainda questionou." },
  { id: "gpt", name: "GPT-4o", role: "O Executivo", color: "#3DAA6E", symbol: "Σ", category: "technical", subcategory: "models", poweredBy: "GPT-4o", description: "Transforma ambiguidade em plano. Cada análise termina com cenários, métricas e um próximo passo com prazo. Para ele, uma decisão sem data de execução não é uma decisão.", whenToCall: "Você precisa sair da reunião com um plano concreto, não com mais perguntas." },
  { id: "gemini", name: "GEMINI", role: "O Pesquisador", color: "#4A8FD4", symbol: "Ω", category: "technical", subcategory: "models", poweredBy: "Gemini 2.0", description: "Nenhum problema existe no vácuo. Ele conecta sua decisão a padrões históricos, movimentos globais e dados que você não sabia que precisava. Vê o mapa quando todos estão olhando para o ponto.", whenToCall: "Você precisa entender onde sua decisão se encaixa no mundo antes de tomá-la." },
  { id: "grok", name: "GROK", role: "Advogado do Diabo", color: "#A85CD4", symbol: "Δ", category: "technical", subcategory: "models", poweredBy: "Grok 3", description: "Assume que o consenso está errado até prova em contrário. Enquanto todos convergem, ele diverge — não por prazer, mas porque alguém precisa nomear o que pode dar errado antes que dê.", whenToCall: "Sua ideia precisa sobreviver ao pior argumento possível antes de chegar ao mercado." },
  { id: "perplexity", name: "PERPLEXITY", role: "O Jornalista", color: "#2ABFBF", symbol: "Ξ", category: "technical", subcategory: "models", poweredBy: "Sonar Pro", description: "Não tem opinião — tem dados. Fact-checa em tempo real, ancora o debate em evidências verificáveis e interrompe qualquer argumento baseado em achismo.", whenToCall: "O debate está girando em torno de suposições e você precisa de alguém que traga o mundo real para a sala." },
  { id: "deepseek", name: "DEEPSEEK", role: "O Matemático", color: "#E05A5A", symbol: "Ψ", category: "technical", subcategory: "models", poweredBy: "DeepSeek R1", description: "Desconstrua qualquer problema em variáveis e resolva passo a passo. Expõe falácias lógicas com precisão cirúrgica. Para ele, todo problema tem estrutura — e toda estrutura pode ser analisada.", whenToCall: "A decisão envolve variáveis complexas que precisam ser desmontadas com rigor lógico." },
  { id: "kimi", name: "KIMI", role: "O Sistêmico", color: "#E09A2A", symbol: "Λ", category: "technical", subcategory: "models", poweredBy: "Kimi K2", description: "Especialista em efeitos que você não viu vir. Mapeia cascatas de consequências de segunda e terceira ordem. Para ele, toda decisão é um sistema, não um ponto.", whenToCall: "Você suspeita que sua decisão tem consequências não intencionais que ainda não mapeou." },
  { id: "qwen", name: "QWEN", role: "O Estrategista Global", color: "#5AB4E0", symbol: "Θ", category: "technical", subcategory: "models", poweredBy: "Qwen3 235B", description: "Traz a perspectiva que o debate ocidental ignora: mercados emergentes, dinâmicas geopolíticas e infraestrutura em escala global. O mundo é maior do que o Vale do Silício.", whenToCall: "Sua decisão tem impacto global ou você precisa de uma perspectiva não-ocidental." },
  { id: "cetico", name: "O CÉTICO", role: "O Cético", color: "#8B8B8B", symbol: "Π", category: "technical", subcategory: "specialists", poweredBy: "Claude Sonnet", description: "Questiona tudo — incluindo a pergunta. Exige evidências antes de aceitar qualquer premissa. Não é negativo por temperamento; é rigoroso por princípio.", whenToCall: "Você quer que sua ideia sobreviva ao escrutínio mais severo antes de comprometer recursos." },
  { id: "visionario", name: "O VISIONÁRIO", role: "O Visionário", color: "#FF6B6B", symbol: "Γ", category: "technical", subcategory: "specialists", poweredBy: "GPT-4o", description: "Já está no horizonte enquanto os outros debatem o presente. Mapeia futuros possíveis, disrupção tecnológica e mudanças de paradigma que tornam a pergunta atual obsoleta.", whenToCall: "Você precisa pensar 5-10 anos à frente, não apenas no próximo trimestre." },
  { id: "pragmatico", name: "O PRAGMÁTICO", role: "O Pragmático", color: "#F4A261", symbol: "Β", category: "technical", subcategory: "specialists", poweredBy: "Mistral Large", description: "Corta o floreio e vai direto à execução. Para ele, uma ideia só existe quando implementada. Entrega sempre: próximo passo concreto, responsável, prazo.", whenToCall: "Você já tem análise suficiente e precisa de alguém que transforme isso em ação." },
  { id: "popular", name: "A VOZ POPULAR", role: "A Voz Popular", color: "#6BCB77", symbol: "Α", category: "technical", subcategory: "specialists", poweredBy: "Llama 3.3 70B", description: "Representa quem vai viver com as consequências, não quem as analisa. Traduz debates técnicos em linguagem humana. Pergunta o que todos pensam mas não ousam perguntar.", whenToCall: "Sua decisão afeta pessoas comuns e você precisa de uma perspectiva não-especialista." },
  { id: "psicologo", name: "O PSICÓLOGO", role: "O Psicólogo", color: "#C77DFF", symbol: "Η", category: "technical", subcategory: "specialists", poweredBy: "Claude Sonnet", description: "Mapeia os vieses cognitivos e motivações ocultas por trás de qualquer decisão. Enquanto os outros debatem o problema externo, ele estuda quem está decidindo e com quais emoções.", whenToCall: "A decisão envolve dinâmicas humanas complexas, resistência à mudança ou conflitos interpessoais." },
  { id: "historiador", name: "O HISTORIADOR", role: "O Historiador", color: "#ADB5BD", symbol: "Ρ", category: "technical", subcategory: "specialists", poweredBy: "GPT-4o", description: "Toda decisão já foi tomada antes. Ele traz os precedentes históricos — o que funcionou, o que falhou e por quê. A história não é passado; é laboratório.", whenToCall: "Você precisa aprender com decisões similares tomadas em outros contextos históricos." },
  { id: "leigo", name: "O LEIGO", role: "O Leigo Informado", color: "#74B9FF", symbol: "Μ", category: "technical", subcategory: "specialists", poweredBy: "Gemini Flash", description: "Inteligente e curioso, mas sem especialização técnica. Faz as perguntas simples que os especialistas esqueceram de fazer. Representa quem precisa entender para implementar.", whenToCall: "Você precisa testar se sua ideia é compreensível para quem não é especialista no assunto." },
  // Historical
  { id: "socrates", name: "SÓCRATES", role: "O Filósofo Socrático", color: "#D4A017", symbol: "∞", category: "historical", subcategory: "minds", era: "Grécia Antiga · 470–399 a.C.", poweredBy: "Claude Sonnet", description: "Usa perguntas para revelar o que você não sabe que não sabe. A maiêutica socrática força clareza onde havia certeza falsa. Não dá respostas — extrai as suas.", whenToCall: "Suas premissas precisam ser testadas com rigor absoluto antes de qualquer ação." },
  { id: "maquiavel", name: "MAQUIAVEL", role: "O Realista Político", color: "#8B0000", symbol: "⚔", category: "historical", subcategory: "minds", era: "Renascimento · 1469–1527", poweredBy: "Claude Sonnet", description: "Analisa poder, intenções reais e consequências políticas sem romantismo. Para ele, o que importa é o resultado — não a aparência. O realismo é sua única lealdade.", whenToCall: "Sua decisão envolve poder, influência, negociação ou dinâmicas políticas complexas." },
  { id: "suntzu", name: "SUN TZU", role: "O Estrategista", color: "#2D4A1E", symbol: "◬", category: "historical", subcategory: "minds", era: "China Antiga · séc. V a.C.", poweredBy: "Claude Sonnet", description: "Pensa em posicionamento estratégico, vantagem assimétrica e o uso mínimo de força para o máximo efeito. Vencer sem lutar é a arte suprema.", whenToCall: "Você está em situação competitiva e precisa de estratégia antes de tática." },
  { id: "marcoaurelio", name: "MARCO AURÉLIO", role: "O Imperador Estoico", color: "#C0A060", symbol: "⊛", category: "historical", subcategory: "minds", era: "Roma · 121–180 d.C.", poweredBy: "Claude Sonnet", description: "Separa o que está sob seu controle do que não está. Age com virtude independente do resultado. A serenidade estoica como base para decisões de alto impacto.", whenToCall: "Você está sob pressão e precisa de clareza sobre o que realmente depende de você." },
  { id: "nietzsche", name: "NIETZSCHE", role: "O Filósofo do Poder", color: "#4A0080", symbol: "↯", category: "historical", subcategory: "minds", era: "Alemanha · 1844–1900", poweredBy: "Claude Sonnet", description: "Questiona os valores assumidos por trás de qualquer decisão. Identifica a vontade de poder disfarçada de moralidade. Rompe com o nivelamento medíocre.", whenToCall: "Você suspeita que está preso em valores ou normas que nunca escolheu conscientemente." },
  { id: "buda", name: "BUDA", role: "O Iluminado", color: "#B8860B", symbol: "◉", category: "historical", subcategory: "minds", era: "Índia Antiga · séc. V a.C.", poweredBy: "Claude Sonnet", description: "Analisa o desejo e o apego por trás de qualquer decisão. O sofrimento nasce do agarrar. A sabedoria, do desapego. O caminho do meio raramente está onde os extremos apontam.", whenToCall: "Você está preso em um ciclo de ansiedade ou apego ao resultado e precisa de perspectiva." },
  { id: "jung", name: "CARL JUNG", role: "O Analista Junguiano", color: "#556B2F", symbol: "⊗", category: "historical", subcategory: "minds", era: "Suíça · 1875–1961", poweredBy: "Claude Sonnet", description: "Analisa a sombra, os arquétipos e as dimensões inconscientes da decisão. O que essa escolha revela sobre quem você realmente é? O inconsciente fala — ele escuta.", whenToCall: "Sua decisão envolve aspectos emocionais ou psicológicos que você ainda não reconheceu." },
  { id: "davinci", name: "DA VINCI", role: "O Polímata", color: "#8B4513", symbol: "✥", category: "historical", subcategory: "minds", era: "Renascimento · 1452–1519", poweredBy: "Claude Sonnet", description: "Conecta arte, ciência e engenharia em sínteses que ninguém viu antes. Toda solução pode ser mais elegante. Faz perguntas que os especialistas esqueceram de fazer.", whenToCall: "Você precisa de criatividade radical e de um olhar que atravesse múltiplas disciplinas." },
  { id: "jobs", name: "STEVE JOBS", role: "O Inovador", color: "#555555", symbol: "◼", category: "historical", subcategory: "minds", era: "EUA · 1955–2011", poweredBy: "Claude Sonnet", description: "Foco implacável no que importa — corta tudo o mais. O design não é aparência, é como funciona. Simplifica até doer. Pergunta por que isso precisa ser complicado.", whenToCall: "Você está perdido em complexidade e precisa de alguém que force a escolha do que realmente importa." },
  { id: "buffett", name: "WARREN BUFFETT", role: "O Investidor", color: "#1B4332", symbol: "◆", category: "historical", subcategory: "minds", era: "EUA · 1930–presente", poweredBy: "Claude Sonnet", description: "Pensa em valor de longo prazo, margens de segurança e círculo de competência. Se você não entende em 5 minutos, é complexo demais. Prefere estar aproximadamente certo a precisamente errado.", whenToCall: "Sua decisão envolve alocação de capital, investimento ou trade-offs de longo prazo." },
  { id: "tolle", name: "ECKHART TOLLE", role: "O Mestre do Presente", color: "#2E8B57", symbol: "○", category: "historical", subcategory: "minds", era: "Alemanha/Canadá · 1948–presente", poweredBy: "Claude Sonnet", description: "Examina a qualidade da consciência por trás da decisão. O ego cria problemas que a presença dissolve. Esta urgência é real ou o ego está criando urgência?", whenToCall: "Você está tomando decisões em modo reativo e precisa de clareza antes de agir." },
  { id: "taleb", name: "NASSIM TALEB", role: "O Anti-frágil", color: "#8B3A3A", symbol: "⚠", category: "historical", subcategory: "minds", era: "Líbano/EUA · 1960–presente", poweredBy: "Claude Sonnet", description: "Identifica os cisnes negros que os modelos ignoram. Prefere robustez à eficiência. Desconfia de previsões. Pele no jogo é o único validador de convicção real.", whenToCall: "Sua decisão envolve risco significativo e você precisa de alguém que pense no pior cenário possível." },
  { id: "lemann", name: "JORGE PAULO LEMANN", role: "O Construtor de Impérios", color: "#006400", symbol: "▲", category: "historical", subcategory: "minds", era: "Brasil · 1939–presente", poweredBy: "Claude Sonnet", description: "Pessoas certas, metas audaciosas, cultura de meritocracia. Sonho grande — execução modesta é desperdício de talento. Onde estão as ineficiências a eliminar?", whenToCall: "Você precisa de uma perspectiva de construtor de impérios sobre escala, cultura e execução." },
  { id: "einstein", name: "ALBERT EINSTEIN", role: "O Cientista", color: "#5B8DB8", symbol: "∿", category: "historical", subcategory: "minds", era: "Alemanha/EUA · 1879–1955", poweredBy: "Claude Sonnet", description: "Raciocina por experimentos mentais e primeiros princípios. Quando todos veem o problema, ele questiona se o enquadramento do problema está certo. Imaginação é mais importante que conhecimento.", whenToCall: "A solução óbvia parece errada mas você não consegue articular por quê." },
]

const MODELS = MEMBERS.filter(m => m.subcategory === 'models')
const SPECIALISTS = MEMBERS.filter(m => m.subcategory === 'specialists')
const MINDS = MEMBERS.filter(m => m.subcategory === 'minds')

// ─── CATEGORIES ───────────────────────────────────────────────
const CATEGORIES = [
  { id: 'pessoal', label: 'Vida Pessoal', description: 'Relacionamentos, saúde, estilo de vida', icon: '◈', members: ['buda', 'jung', 'tolle', 'psicologo', 'marcoaurelio'] },
  { id: 'etico', label: 'Dilema Ético', description: 'Conflito de valores, decisão difícil', icon: '⊖', members: ['claude', 'socrates', 'nietzsche', 'marcoaurelio', 'cetico'] },
  { id: 'ideia', label: 'Validação de Ideia', description: 'Negócio, produto, projeto', icon: '◎', members: ['gpt', 'grok', 'perplexity', 'jobs', 'taleb'] },
  { id: 'carreira', label: 'Carreira', description: 'Emprego, transição, liderança', icon: '△', members: ['buffett', 'lemann', 'gpt', 'psicologo', 'historiador'] },
  { id: 'conflito', label: 'Conflito', description: 'Com pessoa, equipe ou organização', icon: '✕', members: ['maquiavel', 'jung', 'psicologo', 'marcoaurelio', 'suntzu'] },
  { id: 'investimento', label: 'Investimento', description: 'Dinheiro, tempo, recursos', icon: '◇', members: ['buffett', 'taleb', 'gpt', 'deepseek', 'pragmatico'] },
  { id: 'estrategia', label: 'Estratégia', description: 'Planejamento, posicionamento, crescimento', icon: '⊕', members: ['suntzu', 'maquiavel', 'gpt', 'kimi', 'qwen'] },
  { id: 'criatividade', label: 'Criatividade', description: 'Arte, conteúdo, inovação', icon: '✦', members: ['davinci', 'jobs', 'visionario', 'einstein', 'popular'] },
  { id: 'outro', label: 'Outro', description: 'Defina o contexto manualmente', icon: '···', members: ['claude', 'gpt', 'gemini', 'grok', 'perplexity'] },
]

// ─── SUGGESTED QUESTIONS ──────────────────────────────────────
const ALL_SUGGESTIONS = [
  "Devo aceitar essa proposta de emprego ou esperar por algo melhor?",
  "Vale a pena abrir um segundo negócio agora?",
  "Como estruturar minha equipe para a próxima fase de crescimento?",
  "Devo pivotar meu produto ou insistir na estratégia atual?",
  "Como lidar com um sócio que está desalinhado?",
  "Quando é a hora certa de captar investimento externo?",
  "Como precificar meu produto para o mercado brasileiro?",
  "Devo contratar um COO agora ou continuar como operador?",
  "Como construir autoridade no meu nicho sem parecer arrogante?",
  "Qual é o momento certo para delegar decisões críticas?",
]
function getRandomSuggestions(n: number) {
  const arr = [...ALL_SUGGESTIONS]
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]]
  }
  return arr.slice(0, n)
}

// ─── LOADING MESSAGES ─────────────────────────────────────────
const LOADING_MESSAGES = [
  "Analisando sua questão...",
  "Consultando perspectivas...",
  "Estruturando argumento...",
  "Processando contexto...",
]

// ─── API CALL ──────────────────────────────────────────────────
async function callAPI(phase: string, body: object, signal?: AbortSignal): Promise<any> {
  const res = await fetch(`/api/council/${phase}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
    signal,
  })
  if (!res.ok) throw new Error(`API error ${res.status}`)
  return res.json()
}

// ─── MARKDOWN RENDERER ────────────────────────────────────────
function renderMarkdown(text: string): string {
  return text
    .replace(/^### (.+)$/gm, '$1')
    .replace(/^## (.+)$/gm, '$1')
    .replace(/^# (.+)$/gm, '$1')
    .replace(/\*\*(.+?)\*\*/g, '$1')
    .replace(/\*(.+?)\*/g, '$1')
    .replace(/^- /gm, '• ')
    .replace(/^[\d]+\. /gm, (m) => m)
    .trim()
}

// ─── PHASE LABELS ─────────────────────────────────────────────
const PHASE_LABELS: Record<string, string> = {
  idle: "",
  write_question: "FORMULAR QUESTÃO",
  select_category: "ESCOLHER CATEGORIA",
  select_council: "CONFIGURAR CONSELHO",
  opinions: "FASE 1 · OPINIÕES INDEPENDENTES",
  debate: "FASE 2 · DEBATE",
  ask_replica: "AGUARDANDO DECISÃO DO USUÁRIO",
  replica: "FASE 3 · RÉPLICA",
  ask_treplica: "AGUARDANDO DECISÃO DO USUÁRIO",
  treplica: "FASE 4 · TRÉPLICA",
  ask_president: "ELEIÇÃO DO PRESIDENTE",
  verdict: "FASE FINAL · VEREDITO",
  done: "SESSÃO ENCERRADA",
}

// ─── WELCOME MODAL ────────────────────────────────────────────
function WelcomeModal({ onClose }: { onClose: () => void }) {
  const tech = [
    { symbol: "Φ", name: "CLAUDE", color: "#C8952A", tagline: "Desmonta premissas. Entrega clareza." },
    { symbol: "Σ", name: "GPT-4o", color: "#3DAA6E", tagline: "Transforma ambiguidade em plano." },
    { symbol: "Δ", name: "GROK", color: "#A85CD4", tagline: "Nomeia o que pode dar errado." },
    { symbol: "Π", name: "O CÉTICO", color: "#8B8B8B", tagline: "Exige evidências antes de tudo." },
  ]
  const hist = [
    { symbol: "∞", name: "SÓCRATES", color: "#D4A017", tagline: "Maiêutica. Revela certezas falsas." },
    { symbol: "◬", name: "SUN TZU", color: "#2D4A1E", tagline: "Estratégia antes de tática." },
    { symbol: "⚠", name: "NASSIM TALEB", color: "#8B3A3A", tagline: "Identifica os cisnes negros." },
    { symbol: "◼", name: "STEVE JOBS", color: "#555555", tagline: "Foco implacável. Corta o resto." },
  ]
  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 100, background: "rgba(4,6,12,0.93)", backdropFilter: "blur(8px)", display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
      <div style={{ width: "100%", maxWidth: 580, background: "#0A0F1A", border: "1px solid rgba(200,149,42,0.3)", borderTop: "3px solid #C8952A", borderRadius: 2, padding: "40px 40px 36px", animation: "modalEntrance 250ms cubic-bezier(0.16,1,0.3,1) both" }}>
        <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 9, color: "#C8952A", letterSpacing: 3, marginBottom: 20 }}>▸ BEM-VINDO AO KONKLAVE</div>
        <h2 style={{ fontFamily: "'Libre Baskerville', Georgia, serif", fontSize: 22, color: "#E8F0F8", lineHeight: 1.35, marginBottom: 14 }}>
          29 conselheiros.<br />Uma decisão melhor.
        </h2>
        <p style={{ fontFamily: "'Libre Baskerville', Georgia, serif", fontSize: 13, color: "#6A8AA8", lineHeight: 1.75, marginBottom: 28 }}>
          Submeta uma questão ao conselho. 15 modelos técnicos + 14 pensadores históricos analisam, debatem e emitem um veredito fundamentado — sem consenso fácil.
        </p>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24, marginBottom: 32 }}>
          <div>
            <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 8, color: "#C8952A", letterSpacing: 2, marginBottom: 10 }}>TÉCNICOS</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {tech.map(m => (
                <div key={m.name} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <div style={{ width: 26, height: 26, borderRadius: 2, background: m.color + "18", border: `1px solid ${m.color}55`, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Libre Baskerville', Georgia, serif", fontSize: 12, color: m.color, flexShrink: 0 }}>{m.symbol}</div>
                  <div>
                    <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 8, color: m.color, letterSpacing: 1 }}>{m.name}</div>
                    <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 7, color: "#3A5A70" }}>{m.tagline}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div>
            <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 8, color: "#6A8AA8", letterSpacing: 2, marginBottom: 10 }}>HISTÓRICOS</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {hist.map(m => (
                <div key={m.name} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <div style={{ width: 26, height: 26, borderRadius: 2, background: m.color + "18", border: `1px solid ${m.color}55`, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Libre Baskerville', Georgia, serif", fontSize: 12, color: m.color, flexShrink: 0 }}>{m.symbol}</div>
                  <div>
                    <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 8, color: m.color, letterSpacing: 1 }}>{m.name}</div>
                    <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 7, color: "#3A5A70" }}>{m.tagline}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <button
          onClick={onClose}
          style={{ width: "100%", padding: "14px", background: "#C8952A", color: "#070910", border: "none", borderRadius: 2, fontFamily: "'Space Mono', monospace", fontSize: 11, fontWeight: 700, letterSpacing: 2, cursor: "pointer", boxShadow: "0 0 28px rgba(200,149,42,0.25)" }}
        >
          MONTAR MEU CONSELHO →
        </button>
      </div>
    </div>
  )
}

// ─── PRESIDENT MODAL ──────────────────────────────────────────
function PresidentModal({ activeMembers, onSelect, onAIDecide, aiDeciding, aiResult }: {
  activeMembers: Member[]
  onSelect: (id: string) => void
  onAIDecide: () => void
  aiDeciding: boolean
  aiResult: { id: string; reason: string } | null
}) {
  const [hoveredId, setHoveredId] = useState('')

  if (aiResult) {
    const president = activeMembers.find(m => m.id === aiResult.id)
    return (
      <div style={{ position: "fixed", inset: 0, zIndex: 100, background: "rgba(4,6,12,0.93)", backdropFilter: "blur(8px)", display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
        <div style={{ width: "100%", maxWidth: 440, background: "#0A0F1A", border: "1px solid rgba(200,149,42,0.3)", borderTop: "3px solid #C8952A", borderRadius: 2, padding: "36px 36px 32px", textAlign: "center", animation: "modalEntrance 250ms cubic-bezier(0.16,1,0.3,1) both" }}>
          <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 9, color: "#C8952A", letterSpacing: 3, marginBottom: 20 }}>▸ PRESIDENTE ELEITO PELA IA</div>
          {president && (
            <>
              <div style={{ width: 56, height: 56, borderRadius: 2, background: president.color + "20", border: `2px solid ${president.color}`, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Libre Baskerville', Georgia, serif", fontSize: 24, color: president.color, margin: "0 auto 16px" }}>{president.symbol}</div>
              <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 13, fontWeight: 700, color: president.color, letterSpacing: 2, marginBottom: 4 }}>{president.name}</div>
              <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 9, color: "#6A8AA8", letterSpacing: 1, marginBottom: 20 }}>{president.role}</div>
              <p style={{ fontFamily: "'Libre Baskerville', Georgia, serif", fontSize: 13, color: "#8AA8C0", lineHeight: 1.7, marginBottom: 28, fontStyle: "italic" }}>"{aiResult.reason}"</p>
            </>
          )}
          <button onClick={() => onSelect(aiResult.id)} style={{ width: "100%", padding: "13px", background: "#C8952A", color: "#070910", border: "none", borderRadius: 2, fontFamily: "'Space Mono', monospace", fontSize: 11, fontWeight: 700, letterSpacing: 2, cursor: "pointer" }}>
            CONFIRMAR E EMITIR VEREDITO →
          </button>
        </div>
      </div>
    )
  }

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 100, background: "rgba(4,6,12,0.93)", backdropFilter: "blur(8px)", display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
      <div style={{ width: "100%", maxWidth: 560, background: "#0A0F1A", border: "1px solid rgba(200,149,42,0.3)", borderTop: "3px solid #C8952A", borderRadius: 2, padding: "36px 36px 32px", animation: "modalEntrance 250ms cubic-bezier(0.16,1,0.3,1) both" }}>
        <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 9, color: "#C8952A", letterSpacing: 3, marginBottom: 16 }}>▸ ELEIÇÃO DO PRESIDENTE</div>
        <h3 style={{ fontFamily: "'Libre Baskerville', Georgia, serif", fontSize: 18, color: "#E8F0F8", marginBottom: 8, lineHeight: 1.3 }}>Quem presidirá o veredito?</h3>
        <p style={{ fontFamily: "'Space Mono', monospace", fontSize: 10, color: "#6A8AA8", letterSpacing: 1, marginBottom: 24, lineHeight: 1.6 }}>
          O presidente eleito conduzirá a deliberação final com sua perspectiva característica.
        </p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(120px, 1fr))", gap: 10, marginBottom: 20 }}>
          {activeMembers.map(m => (
            <div
              key={m.id}
              onClick={() => onSelect(m.id)}
              onMouseEnter={() => setHoveredId(m.id)}
              onMouseLeave={() => setHoveredId('')}
              style={{ background: hoveredId === m.id ? m.color + "18" : "#0B1018", border: `1px solid ${hoveredId === m.id ? m.color + "99" : "#1E2D42"}`, borderTop: `2px solid ${hoveredId === m.id ? m.color : "#1E2D42"}`, borderRadius: 2, padding: "14px 10px", cursor: "pointer", textAlign: "center", transition: "all 0.2s" }}
            >
              <div style={{ fontFamily: "'Libre Baskerville', Georgia, serif", fontSize: 18, color: hoveredId === m.id ? m.color : "#2A3A4A", marginBottom: 6, transition: "color 0.2s" }}>{m.symbol}</div>
              <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 7, color: hoveredId === m.id ? m.color : "#2A3A4A", letterSpacing: 1, lineHeight: 1.4, transition: "color 0.2s" }}>{m.name}</div>
            </div>
          ))}
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 0 }}>
          <div style={{ flex: 1, height: 1, background: "#1E2D42" }} />
          <span style={{ fontFamily: "'Space Mono', monospace", fontSize: 8, color: "#3A5A70" }}>OU</span>
          <div style={{ flex: 1, height: 1, background: "#1E2D42" }} />
        </div>
        <button
          onClick={onAIDecide}
          disabled={aiDeciding}
          style={{ width: "100%", marginTop: 16, padding: "13px", background: aiDeciding ? "#0B1018" : "transparent", color: aiDeciding ? "#6A8AA8" : "#C8952A", border: `1px solid ${aiDeciding ? "#1E2D42" : "rgba(200,149,42,0.35)"}`, borderRadius: 2, fontFamily: "'Space Mono', monospace", fontSize: 10, letterSpacing: 2, cursor: aiDeciding ? "default" : "pointer", transition: "all 0.2s" }}
        >
          {aiDeciding ? "A IA ESTÁ DELIBERANDO..." : "DEIXAR A IA ELEGER O PRESIDENTE →"}
        </button>
      </div>
    </div>
  )
}

// ─── HISTORY DRAWER ───────────────────────────────────────────
function HistoryDrawer({ items, onClose, onClear }: {
  items: HistoryItem[]
  onClose: () => void
  onClear: () => void
}) {
  const [selectedItem, setSelectedItem] = useState<HistoryItem | null>(null)
  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 90, display: "flex" }}>
      {/* Backdrop */}
      <div onClick={onClose} style={{ flex: 1, background: "rgba(4,6,12,0.7)", backdropFilter: "blur(4px)" }} />
      {/* Sidebar */}
      <div style={{ width: 380, background: "#0A0F1A", borderLeft: "1px solid rgba(200,149,42,0.2)", display: "flex", flexDirection: "column", animation: "slideInRight 300ms cubic-bezier(0.16,1,0.3,1) both" }}>
        <div style={{ padding: "24px 24px 20px", borderBottom: "1px solid #1E2D42", display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexShrink: 0 }}>
          <div>
            <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 9, color: "#C8952A", letterSpacing: 3, marginBottom: 6 }}>▸ HISTÓRICO DE DEBATES</div>
            <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 10, color: "#3A5A70" }}>{items.length} sess{items.length === 1 ? 'ão' : 'ões'} salvas</div>
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            {items.length > 0 && (
              <button onClick={onClear} style={{ padding: "6px 12px", background: "transparent", color: "#6A8AA8", border: "1px solid #1E2D42", borderRadius: 2, fontFamily: "'Space Mono', monospace", fontSize: 8, letterSpacing: 1, cursor: "pointer" }}>LIMPAR</button>
            )}
            <button onClick={onClose} style={{ padding: "6px 12px", background: "transparent", color: "#6A8AA8", border: "1px solid #1E2D42", borderRadius: 2, fontFamily: "'Space Mono', monospace", fontSize: 8, letterSpacing: 1, cursor: "pointer" }}>✕</button>
          </div>
        </div>
        <div style={{ flex: 1, padding: "16px 20px", overflowY: "auto" }}>
          {items.length === 0 && (
            <div style={{ textAlign: "center", padding: "60px 0", fontFamily: "'Libre Baskerville', Georgia, serif", fontSize: 13, color: "#3A4A5A", fontStyle: "italic" }}>
              Nenhuma sessão salva ainda.
            </div>
          )}
          {[...items].reverse().map((item, idx) => {
            const itemMembers = MEMBERS.filter(m => item.members.includes(m.id)).slice(0, 5)
            return (
              <div
                key={item.id}
                onClick={() => setSelectedItem(item)}
                style={{ marginBottom: 12, background: "#0B1018", border: "1px solid #1E2D42", borderLeft: "2px solid rgba(200,149,42,0.3)", borderRadius: 2, padding: "14px 16px", cursor: "pointer", transition: "border-color 0.2s", animation: `cardEntrance 300ms ease-out ${idx * 40}ms both` }}
                onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.borderColor = 'rgba(200,149,42,0.5)'; (e.currentTarget as HTMLDivElement).style.borderLeftColor = '#C8952A' }}
                onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.borderColor = '#1E2D42'; (e.currentTarget as HTMLDivElement).style.borderLeftColor = 'rgba(200,149,42,0.3)' }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                  <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 8, color: "#3A5A70", letterSpacing: 1 }}>{item.date} · {item.members.length} conselheiros</div>
                  <div style={{ display: "flex", gap: 4, alignItems: "center" }}>
                    {itemMembers.map(m => (
                      <span key={m.id} style={{ fontFamily: "'Libre Baskerville', Georgia, serif", fontSize: 12, color: m.color }}>{m.symbol}</span>
                    ))}
                    {item.members.length > 5 && <span style={{ fontFamily: "'Space Mono', monospace", fontSize: 8, color: "#3A5A70" }}>+{item.members.length - 5}</span>}
                  </div>
                </div>
                <p style={{ fontFamily: "'Libre Baskerville', Georgia, serif", fontSize: 12, color: "#8AA8C0", lineHeight: 1.5, margin: 0, fontStyle: "italic" }}>"{item.question.slice(0, 80)}{item.question.length > 80 ? '...' : ''}"</p>
              </div>
            )
          })}
        </div>
      </div>

      {/* Full verdict modal */}
      {selectedItem && (
        <div style={{ position: "fixed", inset: 0, zIndex: 100, background: "rgba(4,6,12,0.93)", backdropFilter: "blur(8px)", display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }} onClick={() => setSelectedItem(null)}>
          <div
            onClick={e => e.stopPropagation()}
            style={{ width: "100%", maxWidth: 560, maxHeight: "80vh", background: "#0A0F1A", border: "1px solid rgba(200,149,42,0.3)", borderTop: "3px solid #C8952A", borderRadius: 2, padding: "32px 36px", overflowY: "auto", animation: "modalEntrance 250ms cubic-bezier(0.16,1,0.3,1) both" }}
          >
            <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 8, color: "#3A5A70", letterSpacing: 1, marginBottom: 10 }}>{selectedItem.date} · {selectedItem.members.length} conselheiros</div>
            <p style={{ fontFamily: "'Libre Baskerville', Georgia, serif", fontSize: 14, color: "#D4E4F0", lineHeight: 1.7, marginBottom: 20, fontStyle: "italic" }}>"{selectedItem.question}"</p>
            <div style={{ height: 1, background: "linear-gradient(90deg, rgba(200,149,42,0.25), transparent)", marginBottom: 20 }} />
            <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 8, color: "#C8952A", letterSpacing: 2, marginBottom: 12 }}>▸ VEREDITO</div>
            <p style={{ fontFamily: "'Libre Baskerville', Georgia, serif", fontSize: 13, color: "#8AA8C0", lineHeight: 1.8, margin: 0, whiteSpace: "pre-wrap" }}>{selectedItem.verdict}</p>
          </div>
        </div>
      )}
    </div>
  )
}

// ─── FEEDBACK MODAL ───────────────────────────────────────────
function FeedbackModal({ onClose, verdict, userEmail, question, memberIds }: {
  onClose: () => void
  verdict: string
  userEmail: string
  question: string
  memberIds: string[]
}) {
  const [stars, setStars] = useState(0)
  const [hovered, setHovered] = useState(0)
  const [comment, setComment] = useState('')
  const [shareVerdict, setShareVerdict] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  const starLabels = ['', 'Decepcionante', 'Mediano', 'Bom', 'Muito bom', 'Excepcional']

  const handleSubmit = async () => {
    if (!stars) return
    setSubmitting(true)
    try {
      const feedbackRes = await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: userEmail || null,
          rating: stars,
          comment: comment.trim() || null,
          shared_verdict: shareVerdict ? verdict : null,
          questao: question,
          membros_usados: memberIds,
        }),
      })
      if (!feedbackRes.ok) {
        const errJson = await feedbackRes.json().catch(() => ({}))
        console.error('Feedback error:', errJson)
      }

      // Save to localStorage history
      const history: HistoryItem[] = JSON.parse(localStorage.getItem('konklave_history') || '[]')
      const newItem: HistoryItem = {
        id: Math.random().toString(36).slice(2, 8).toUpperCase(),
        question,
        verdict,
        members: memberIds,
        date: new Date().toLocaleDateString('pt-BR'),
      }
      history.push(newItem)
      localStorage.setItem('konklave_history', JSON.stringify(history.slice(-20)))
    } catch (e) {
      console.error('Feedback submit error:', e)
    }
    setSubmitting(false)
    onClose()
  }

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 100, background: "rgba(4,6,12,0.92)", backdropFilter: "blur(8px)", display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
      <div style={{ width: "100%", maxWidth: 480, background: "#0A0F1A", border: "1px solid rgba(200,149,42,0.3)", borderTop: "3px solid #C8952A", borderRadius: 2, padding: "36px 36px 32px", animation: "modalEntrance 250ms cubic-bezier(0.16,1,0.3,1) both" }}>
        <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 9, color: "#C8952A", letterSpacing: 3, marginBottom: 16 }}>▸ AVALIAÇÃO DA SESSÃO</div>
        <h3 style={{ fontFamily: "'Libre Baskerville', Georgia, serif", fontSize: 18, color: "#E8F0F8", marginBottom: 8, lineHeight: 1.3 }}>Como foi o debate?</h3>
        <p style={{ fontFamily: "'Space Mono', monospace", fontSize: 10, color: "#6A8AA8", letterSpacing: 1, marginBottom: 28, lineHeight: 1.6 }}>
          Seu feedback ajuda a melhorar o Konklave.
        </p>

        <div style={{ marginBottom: 24 }}>
          <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 8, color: "#6A8AA8", letterSpacing: 2, marginBottom: 10 }}>AVALIAÇÃO *</div>
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            {[1, 2, 3, 4, 5].map(n => (
              <button
                key={n}
                onMouseEnter={() => setHovered(n)}
                onMouseLeave={() => setHovered(0)}
                onClick={() => setStars(n)}
                style={{ width: 40, height: 40, borderRadius: 2, background: n <= (hovered || stars) ? "rgba(200,149,42,0.15)" : "#0F1520", border: `1px solid ${n <= (hovered || stars) ? "#C8952A" : "#1E2D42"}`, fontSize: 18, cursor: "pointer", transition: "all 0.15s", display: "flex", alignItems: "center", justifyContent: "center", color: n <= (hovered || stars) ? "#C8952A" : "#2A3A4A" }}
              >★</button>
            ))}
            {(hovered || stars) > 0 && (
              <span style={{ fontFamily: "'Space Mono', monospace", fontSize: 9, color: "#C8952A", letterSpacing: 1 }}>{starLabels[hovered || stars]}</span>
            )}
          </div>
        </div>

        <div style={{ marginBottom: 20 }}>
          <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 8, color: "#6A8AA8", letterSpacing: 2, marginBottom: 10 }}>
            COMENTÁRIO <span style={{ color: "#2A3A4A" }}>· opcional</span>
          </div>
          <textarea
            value={comment}
            onChange={e => setComment(e.target.value.slice(0, 500))}
            placeholder="O que você achou do debate?"
            style={{ width: "100%", background: "#0B1018", border: "1px solid #1E2D42", borderRadius: 2, padding: "10px 12px", fontFamily: "'Space Mono', monospace", fontSize: 11, color: "#D4E4F0", outline: "none", resize: "vertical", minHeight: 72, caretColor: "#C8952A", boxSizing: "border-box" }}
          />
          <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 8, color: "#2A3A4A", textAlign: "right", marginTop: 4 }}>{comment.length}/500</div>
        </div>

        <label style={{ display: "flex", alignItems: "flex-start", gap: 10, cursor: "pointer", marginBottom: 28 }}>
          <div
            onClick={() => setShareVerdict(v => !v)}
            style={{ width: 16, height: 16, borderRadius: 2, background: shareVerdict ? "rgba(200,149,42,0.15)" : "transparent", border: `1px solid ${shareVerdict ? "#C8952A" : "#1E2D42"}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 9, color: shareVerdict ? "#C8952A" : "transparent", flexShrink: 0, marginTop: 1, transition: "all 0.15s" }}
          >✓</div>
          <span style={{ fontFamily: "'Space Mono', monospace", fontSize: 9, color: "#6A8AA8", letterSpacing: 1, lineHeight: 1.6 }}>
            Compartilhar o veredito desta sessão para melhorar o produto
          </span>
        </label>

        <button
          onClick={handleSubmit}
          disabled={!stars || submitting}
          style={{ width: "100%", padding: "13px", background: stars ? "#C8952A" : "#0F1520", color: stars ? "#070910" : "#2A3A4A", border: `1px solid ${stars ? "#C8952A" : "#1E2D42"}`, borderRadius: 2, fontFamily: "'Space Mono', monospace", fontSize: 11, fontWeight: 700, letterSpacing: 2, cursor: stars ? "pointer" : "not-allowed", transition: "all 0.2s" }}
        >
          {submitting ? 'ENVIANDO...' : 'ENVIAR FEEDBACK →'}
        </button>
      </div>
    </div>
  )
}

// ─── MEMBER CARD ──────────────────────────────────────────────
function MemberCard({ member, status, text, compact = false, loading = false, loadingMessage = "" }: {
  member: Member
  status: string
  text: string
  compact?: boolean
  loading?: boolean
  loadingMessage?: string
}) {
  const isActive = status === "active"
  const isDone = status === "done"
  const isPending = status === "pending"
  const glow = member.color + "12"

  return (
    <div style={{
      background: isPending ? "#0B1018" : "#111827",
      border: `1px solid ${isDone ? member.color + "99" : isPending ? "#1E2D42" : isActive ? member.color + "99" : "#1E2D42"}`,
      borderTop: `2px solid ${isDone ? member.color : isPending ? "#1E2D42" : isActive ? member.color : member.color + "44"}`,
      borderRadius: 2,
      padding: compact ? "14px 16px" : "20px",
      opacity: isPending && !loading ? 0.25 : 1,
      boxShadow: isActive ? "0 2px 24px rgba(0,0,0,0.4)" : "none",
      transition: "all 0.4s ease",
      position: "relative", overflow: "hidden",
    }}>
      {(isActive || isDone) && (
        <div style={{ position: "absolute", inset: 0, pointerEvents: "none", background: `radial-gradient(ellipse at top left, ${glow}, transparent 65%)` }} />
      )}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{
            width: compact ? 28 : 34, height: compact ? 28 : 34, borderRadius: 2,
            background: isDone || isActive ? member.color + "20" : "#0F1520",
            border: `1px solid ${isDone || isActive ? member.color + "99" : "#1E2D42"}`,
            display: "flex", alignItems: "center", justifyContent: "center",
            fontFamily: "'Libre Baskerville', Georgia, serif",
            fontSize: 16, fontWeight: 400,
            color: isActive || isDone ? member.color : "#2A3A4A",
          }}>{member.symbol}</div>
          <div>
            <div style={{ fontFamily: "'Space Mono', monospace", fontSize: compact ? 10 : 12, fontWeight: 700, color: isActive || isDone ? member.color : loading ? "#3A5060" : "#2A3A4A", letterSpacing: 2 }}>{member.name}</div>
            <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 8, color: "#6A8AA8", letterSpacing: 1, marginTop: 1 }}>{member.role}</div>
          </div>
        </div>
        {isActive && (
          <div style={{ display: "flex", gap: 3 }}>
            {[0, 1, 2].map(i => (
              <span key={i} style={{ width: 4, height: 4, borderRadius: "50%", background: member.color, display: "inline-block", animation: `pulse 1.2s ease-in-out ${i * 0.2}s infinite` }} />
            ))}
          </div>
        )}
        {isDone && <span style={{ fontFamily: "'Space Mono', monospace", fontSize: 8, color: "#6A8AA8", letterSpacing: 1 }}>✓</span>}
        {isPending && loading && (
          <div style={{ display: "flex", gap: 3 }}>
            {[0, 1, 2].map(i => (
              <span key={i} style={{ width: 4, height: 4, borderRadius: "50%", background: "#2A4A5A", display: "inline-block", animation: `pulse 1.6s ease-in-out ${i * 0.35}s infinite` }} />
            ))}
          </div>
        )}
      </div>
      <div style={{ height: 1, background: `linear-gradient(90deg, ${isActive || isDone ? member.color + "44" : "#1E2D42"}, transparent)`, marginBottom: 12 }} />
      <div style={{ fontFamily: "'Libre Baskerville', Georgia, serif", fontSize: compact ? 12 : 13, lineHeight: 1.9, color: isDone ? "#B8CCE0" : isActive ? "#C8D8E8" : "#2A3A4A", minHeight: compact ? 40 : 80, whiteSpace: "pre-wrap" }}>
        {(isActive || isDone) && text}
        {isActive && <span style={{ animation: "blink .6s step-end infinite", color: member.color }}>█</span>}
        {isPending && loading && loadingMessage && (
          <span style={{ fontFamily: "'Space Mono', monospace", fontSize: 10, color: "#3A5870", fontStyle: "italic" }}>{loadingMessage}</span>
        )}
        {isPending && !loading && <span style={{ color: "#2A3A4A", fontFamily: "'Space Mono', monospace", fontSize: 10 }}>AGUARDANDO...</span>}
      </div>
    </div>
  )
}

// ─── SELECTION CARD ───────────────────────────────────────────
function SelectionCard({ member, selected, onToggle, canDeselect }: {
  member: Member
  selected: boolean
  onToggle: () => void
  canDeselect: boolean
}) {
  const glow = member.color + "12"
  return (
    <div
      onClick={() => { if (!selected || canDeselect) onToggle() }}
      style={{
        background: selected ? "#111827" : "#0C1520",
        border: `1px solid ${selected ? member.color + "80" : "#1A2A3A"}`,
        borderTop: `2px solid ${selected ? member.color : "#1A2A3A"}`,
        borderRadius: 2,
        padding: "18px 16px",
        cursor: selected && !canDeselect ? "default" : "pointer",
        transition: "all 0.25s ease",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {selected && (
        <div style={{ position: "absolute", inset: 0, pointerEvents: "none", background: `radial-gradient(ellipse at top left, ${glow}, transparent 70%)` }} />
      )}
      {member.subcategory === 'minds' && (
        <div style={{ position: "absolute", top: 10, right: 10, background: "rgba(200,149,42,0.15)", border: "1px solid rgba(200,149,42,0.4)", borderRadius: 999, padding: "2px 8px", fontFamily: "'Space Mono', monospace", fontSize: 7, color: "#C8952A", letterSpacing: 1, pointerEvents: "none" }}>
          Acesso Antecipado
        </div>
      )}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{
            width: 30, height: 30, borderRadius: 2,
            background: selected ? member.color + "20" : member.color + "10",
            border: `1px solid ${selected ? member.color + "99" : member.color + "33"}`,
            display: "flex", alignItems: "center", justifyContent: "center",
            fontFamily: "'Libre Baskerville', Georgia, serif", fontSize: 14, fontWeight: 400,
            color: selected ? member.color : member.color + "66",
          }}>{member.symbol}</div>
          <div>
            <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 9, fontWeight: 700, color: selected ? member.color : "#8A9BB0", letterSpacing: 2 }}>{member.name}</div>
            <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 7, color: selected ? "#6A8AA8" : "#5A7A94", letterSpacing: 1, marginTop: 1 }}>{member.role}</div>
            {member.era && <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 7, color: selected ? "#6A8AA8" : "#5A7A94", letterSpacing: 1, marginTop: 2 }}>{member.era}</div>}
          </div>
        </div>
        <div style={{
          width: 16, height: 16, borderRadius: 2, flexShrink: 0,
          background: selected ? member.color : "transparent",
          border: `1px solid ${selected ? member.color : "#1A2A3A"}`,
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 9, color: selected ? "#070910" : "transparent",
          fontWeight: 700, transition: "all 0.2s",
          marginTop: member.subcategory === 'minds' ? 20 : 0,
        }}>✓</div>
      </div>
      <div style={{ height: 1, background: `linear-gradient(90deg, ${selected ? member.color + "33" : member.color + "22"}, transparent)`, marginBottom: 10 }} />
      <p style={{ fontFamily: "'Libre Baskerville', Georgia, serif", fontSize: 11, color: selected ? "#8AA8C0" : "#7A9AB4", lineHeight: 1.65, marginBottom: 8, fontStyle: "italic" }}>
        "{member.description}"
      </p>
      <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 7, color: selected ? "#C8952A" : "#5A7A94", letterSpacing: 1, lineHeight: 1.6, marginBottom: member.subcategory === 'minds' ? 8 : 0 }}>
        <span style={{ opacity: 0.7 }}>CONVOCAR QUANDO: </span>{member.whenToCall}
      </div>
      {member.subcategory === 'minds' && member.poweredBy && (
        <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 7, color: "#1E2A3A", letterSpacing: 1 }}>
          powered by {member.poweredBy}
        </div>
      )}
    </div>
  )
}

// ─── DECISION GATE ────────────────────────────────────────────
function DecisionGate({ phase, onYes, onNo }: { phase: string; onYes: () => void; onNo: () => void }) {
  const isReplica = phase === "ask_replica"
  const label = isReplica ? "RÉPLICA" : "TRÉPLICA"
  const desc = isReplica
    ? "Cada membro reagirá ao debate dos outros, aprofundando ou contestando os pontos levantados."
    : "Rodada final de argumentação. Após a tréplica, o veredito será emitido obrigatoriamente."
  return (
    <div style={{ background: "#0A0F1A", border: "1px solid rgba(200,149,42,0.35)", borderLeft: "3px solid #C8952A", borderRadius: 2, padding: "28px 32px", margin: "32px 0" }}>
      <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 9, color: "#C8952A", letterSpacing: 3, marginBottom: 12 }}>▸ DECISÃO DO USUÁRIO</div>
      <div style={{ fontFamily: "'Libre Baskerville', Georgia, serif", fontSize: 15, color: "#C0D0DC", marginBottom: 8, lineHeight: 1.6 }}>
        O conselho concluiu esta fase. Deseja conceder <strong style={{ color: "#C8952A" }}>{label}</strong> aos membros?
      </div>
      <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 11, color: "#6A8AA8", marginBottom: 24, lineHeight: 1.6 }}>{desc}</div>
      <div style={{ display: "flex", gap: 12 }}>
        <button onClick={onYes} style={{ padding: "12px 28px", background: "rgba(200,149,42,0.12)", color: "#C8952A", border: "1px solid rgba(200,149,42,0.35)", borderRadius: 2, fontFamily: "'Space Mono', monospace", fontSize: 11, fontWeight: 700, letterSpacing: 2, cursor: "pointer", boxShadow: "0 0 24px rgba(200,149,42,0.15)" }}>
          SIM — CONCEDER {label} →
        </button>
        <button onClick={onNo} style={{ padding: "12px 28px", background: "transparent", color: "#6A8AA8", border: "1px solid #1E2D42", borderRadius: 2, fontFamily: "'Space Mono', monospace", fontSize: 11, letterSpacing: 2, cursor: "pointer" }}>
          NÃO — IR AO VEREDITO
        </button>
      </div>
    </div>
  )
}

// ─── VERDICT PANEL ────────────────────────────────────────────
function VerdictPanel({ text, loading, president }: { text: string; loading: boolean; president: Member | null }) {
  const lines = text ? text.split('\n') : []
  return (
    <div style={{ background: "#080C14", border: "1px solid rgba(200,149,42,0.25)", borderTop: "3px solid #C8952A", borderRadius: 2, padding: "32px", position: "relative", overflow: "hidden" }}>
      <div style={{ position: "absolute", inset: 0, pointerEvents: "none", background: "radial-gradient(ellipse at top, rgba(200,149,42,0.04), transparent 55%)" }} />
      <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 24 }}>
        {president ? (
          <div style={{ width: 36, height: 36, borderRadius: 2, background: president.color + "20", border: `1px solid ${president.color}99`, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Libre Baskerville', Georgia, serif", fontSize: 18, color: president.color }}>{president.symbol}</div>
        ) : (
          <span style={{ fontSize: 20, color: "#C8952A" }}>⚖</span>
        )}
        <div>
          <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 11, fontWeight: 700, color: "#C8952A", letterSpacing: 3 }}>
            {president ? `VEREDITO — ${president.name}` : "VEREDITO DO CONSELHO"}
          </div>
          <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 8, color: "#6A8AA8", letterSpacing: 2, marginTop: 3 }}>
            {president ? president.role.toUpperCase() + ' · PRESIDENTE ELEITO' : 'ANÁLISE FINAL · DELIBERAÇÃO ENCERRADA'}
          </div>
        </div>
        {loading && (
          <div style={{ marginLeft: "auto", display: "flex", gap: 3 }}>
            {[0, 1, 2].map(i => <span key={i} style={{ width: 5, height: 5, borderRadius: "50%", background: "#C8952A", display: "inline-block", animation: `pulse 1.2s ease-in-out ${i * 0.2}s infinite` }} />)}
          </div>
        )}
      </div>
      <div style={{ height: 1, background: "linear-gradient(90deg, rgba(200,149,42,0.25), transparent)", marginBottom: 24 }} />
      <div style={{ fontFamily: "'Libre Baskerville', Georgia, serif", fontSize: 14, lineHeight: 1.9, color: "#B0C4D8" }}>
        {loading && !text && (
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ display: "flex", gap: 4 }}>
              {[0, 1, 2].map(i => <span key={i} style={{ width: 5, height: 5, borderRadius: "50%", background: "#C8952A", display: "inline-block", animation: `pulse 1.2s ease-in-out ${i * 0.2}s infinite` }} />)}
            </div>
            <span style={{ fontFamily: "'Space Mono', monospace", fontSize: 11, color: "#6A8AA8" }}>O Presidente do Conselho está deliberando...</span>
          </div>
        )}
        {lines.map((line, i) => {
          if (line.startsWith('**') && line.endsWith('**')) {
            return <div key={i} style={{ fontFamily: "'Space Mono', monospace", fontSize: 10, color: "#C8952A", letterSpacing: 2, marginTop: i > 0 ? 20 : 0, marginBottom: 8 }}>{line.replace(/\*\*/g, '').toUpperCase()}</div>
          }
          if (/^\d\./.test(line)) {
            return <div key={i} style={{ paddingLeft: 16, marginBottom: 8, borderLeft: "2px solid rgba(200,149,42,0.25)", marginLeft: 4 }}>{line}</div>
          }
          if (line === '') return <div key={i} style={{ height: 10 }} />
          return <div key={i} style={{ marginBottom: 6 }}>{line}</div>
        })}
      </div>
    </div>
  )
}

// ─── SECTION HEADER ───────────────────────────────────────────
function SectionHeader({ label, active, done }: { label: string; active: boolean; done: boolean }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 24, opacity: active || done ? 1 : 0.15, transition: "opacity 0.4s" }}>
      <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 10, fontWeight: 700, color: active ? "#C8952A" : done ? "#6A8AA8" : "#111", letterSpacing: 3, whiteSpace: "nowrap" }}>{label}</div>
      <div style={{ flex: 1, height: 1, background: `linear-gradient(90deg, ${active ? "rgba(200,149,42,0.25)" : "#1E2D42"}, transparent)` }} />
    </div>
  )
}

// ─── LARGE COUNCIL MODAL ──────────────────────────────────────
function LargeCouncilModal({ count, onContinue, onReduce }: { count: number; onContinue: () => void; onReduce: () => void }) {
  const timeMap: Record<number, string> = { 7: '~8 min', 8: '~10 min', 9: '~12 min', 10: '~14 min' }
  const estimated = count <= 10 ? (timeMap[count] || '~14 min') : `~${Math.round(count * 1.5)} min`
  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 100, background: "rgba(4,6,12,0.93)", backdropFilter: "blur(8px)", display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
      <div style={{ width: "100%", maxWidth: 440, background: "#0A0F1A", border: "1px solid rgba(200,149,42,0.3)", borderTop: "3px solid #C8952A", borderRadius: 2, padding: "36px 36px 32px", animation: "modalEntrance 250ms cubic-bezier(0.16,1,0.3,1) both" }}>
        <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 9, color: "#C8952A", letterSpacing: 3, marginBottom: 16 }}>▸ CONSELHO GRANDE</div>
        <h3 style={{ fontFamily: "'Libre Baskerville', Georgia, serif", fontSize: 18, color: "#E8F0F8", marginBottom: 12, lineHeight: 1.3 }}>
          {count} conselheiros selecionados
        </h3>
        <p style={{ fontFamily: "'Space Mono', monospace", fontSize: 10, color: "#6A8AA8", letterSpacing: 1, lineHeight: 1.7, marginBottom: 8 }}>
          Tempo estimado de debate: <span style={{ color: "#C8952A", fontWeight: 700 }}>{estimated}</span>
        </p>
        <p style={{ fontFamily: "'Space Mono', monospace", fontSize: 9, color: "#3A5A70", letterSpacing: 1, lineHeight: 1.7, marginBottom: 28 }}>
          Conselhos grandes podem gerar instabilidade de rede. Considere reduzir para 5–6 membros para melhor desempenho.
        </p>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          <button onClick={onContinue} style={{ padding: "13px", background: "#C8952A", color: "#070910", border: "none", borderRadius: 2, fontFamily: "'Space Mono', monospace", fontSize: 10, fontWeight: 700, letterSpacing: 2, cursor: "pointer" }}>
            CONTINUAR COM {count} MEMBROS
          </button>
          <button onClick={onReduce} style={{ padding: "13px", background: "transparent", color: "#6A8AA8", border: "1px solid #1E2D42", borderRadius: 2, fontFamily: "'Space Mono', monospace", fontSize: 10, letterSpacing: 2, cursor: "pointer" }}>
            REDUZIR O CONSELHO
          </button>
        </div>
      </div>
    </div>
  )
}

// ─── MAIN ─────────────────────────────────────────────────────
interface KonklaveUser {
  nome: string
  email: string
  whatsapp?: string
  usos: number
}

export default function CouncilApp({ user }: { user: KonklaveUser }) {
  const [phase, setPhase] = useState("idle")
  const [question, setQuestion] = useState("")
  const [usos, setUsos] = useState(user.usos)
  const [selectionTab, setSelectionTab] = useState<'models' | 'specialists' | 'minds'>('models')
  const [selectedMembers, setSelectedMembers] = useState<Set<string>>(
    new Set(['claude', 'gpt', 'gemini', 'grok', 'perplexity'])
  )
  const [showWelcome, setShowWelcome] = useState(false)
  const [showFeedback, setShowFeedback] = useState(false)
  const [feedbackDone, setFeedbackDone] = useState(false)
  const [showHistory, setShowHistory] = useState(false)
  const [historyItems, setHistoryItems] = useState<HistoryItem[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [loadingMsgIdx, setLoadingMsgIdx] = useState(0)
  const [transitionBanner, setTransitionBanner] = useState("")

  // Engagement features
  const [convergenceText, setConvergenceText] = useState('')
  const [mostDivergentText, setMostDivergentText] = useState('')
  const [suggestedQuestions] = useState(() => getRandomSuggestions(3))

  // President election
  const [showPresidentModal, setShowPresidentModal] = useState(false)
  const [presidentAIDeciding, setPresidentAIDeciding] = useState(false)
  const [presidentAIResult, setPresidentAIResult] = useState<{ id: string; reason: string } | null>(null)
  const [electedPresident, setElectedPresident] = useState<Member | null>(null)
  const [showStopModal, setShowStopModal] = useState(false)

  const [opTexts, setOpTexts] = useState<TextMap>({})
  const [opStatus, setOpStatus] = useState<StatusMap>({})
  const [debTexts, setDebTexts] = useState<TextMap>({})
  const [debStatus, setDebStatus] = useState<StatusMap>({})
  const [repTexts, setRepTexts] = useState<TextMap>({})
  const [repStatus, setRepStatus] = useState<StatusMap>({})
  const [treTexts, setTreTexts] = useState<TextMap>({})
  const [treStatus, setTreStatus] = useState<StatusMap>({})
  const [verdict, setVerdict] = useState("")
  const [verdictSummary, setVerdictSummary] = useState("")
  const [verdictLoading, setVerdictLoading] = useState(false)
  const [error, setError] = useState("")
  const [elapsed, setElapsed] = useState(0)
  const [sessionId, setSessionId] = useState('')
  useEffect(() => {
    setSessionId(Math.random().toString(36).slice(2, 8).toUpperCase())
  }, [])

  // Category + speed + large council
  const [selectedCategory, setSelectedCategory] = useState<string>('')
  const [categoryContext, setCategoryContext] = useState<string>('')
  const [debateSpeed, setDebateSpeed] = useState<'fast' | 'normal' | 'deep'>('normal')
  const [showLargeCouncilModal, setShowLargeCouncilModal] = useState(false)
  const [largeCouncilShown, setLargeCouncilShown] = useState(false)
  // Gamification
  const [bonusDebates, setBonusDebates] = useState(0)
  const [sharesCount, setSharesCount] = useState(0)
  const [shareToast, setShareToast] = useState(false)

  // Council preview animation state
  const [enteringMemberIds, setEnteringMemberIds] = useState<Set<string>>(new Set())
  const [exitingMemberIds, setExitingMemberIds] = useState<Set<string>>(new Set())
  const prevSelectedRef = useRef<Set<string>>(new Set())
  const [hoveredPreviewId, setHoveredPreviewId] = useState('')
  const [showMinWarning, setShowMinWarning] = useState(false)

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const debateAborted = useRef(false)
  const abortControllerRef = useRef<AbortController | null>(null)
  const scrollRef = useRef<HTMLDivElement>(null)
  const resolveGate = useRef<((value: boolean) => void) | null>(null)
  const resolvePresident = useRef<((id: string) => void) | null>(null)
  const storedRounds = useRef<Record<string, Record<string, string>>>({ opinions: {}, debate: {}, replica: {}, treplica: {} })
  const shareCardStoryRef = useRef<HTMLDivElement>(null)
  const shareCardFeedRef = useRef<HTMLDivElement>(null)

  const activeMembers = MEMBERS.filter(m => selectedMembers.has(m.id))

  const showOp = !["idle", "write_question", "select_category", "select_council"].includes(phase)
  const showDeb = ["debate", "ask_replica", "replica", "ask_treplica", "treplica", "ask_president", "verdict", "done"].includes(phase)
  const showRep = ["replica", "ask_treplica", "treplica", "ask_president", "verdict", "done"].includes(phase)
  const showTre = ["treplica", "ask_president", "verdict", "done"].includes(phase)
  const showVerdict = ["verdict", "done"].includes(phase)
  const showAskRep = phase === "ask_replica"
  const showAskTre = phase === "ask_treplica"
  const showTimer = !["idle", "write_question", "select_category", "select_council", "done"].includes(phase)

  // Welcome modal
  useEffect(() => {
    if (!localStorage.getItem('konklave_welcomed')) setShowWelcome(true)
  }, [])

  // Load history + gamification
  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('konklave_history') || '[]')
    setHistoryItems(saved)
    setSharesCount(parseInt(localStorage.getItem('konklave_shares') || '0'))
    setBonusDebates(parseInt(localStorage.getItem('konklave_bonus_debates') || '0'))
  }, [])

  // Rotate loading message
  useEffect(() => {
    if (!isLoading) return
    const iv = setInterval(() => setLoadingMsgIdx(i => (i + 1) % LOADING_MESSAGES.length), 2000)
    return () => clearInterval(iv)
  }, [isLoading])

  // Auto-scroll
  useEffect(() => {
    const el = scrollRef.current
    if (!el) return
    const isNearBottom = el.scrollHeight - el.scrollTop - el.clientHeight < 120
    if (isNearBottom) el.scrollTop = el.scrollHeight
  }, [opTexts, debTexts, repTexts, treTexts, verdict, phase])

  useEffect(() => {
    if (showVerdict && scrollRef.current) {
      setTimeout(() => { if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight }, 100)
    }
  }, [showVerdict])

  // Scroll to top on setup phases
  useEffect(() => {
    if (["idle", "write_question", "select_council"].includes(phase) && scrollRef.current) {
      scrollRef.current.scrollTop = 0
    }
  }, [phase])

  // Session timer
  useEffect(() => {
    if (!["idle", "write_question", "done", "select_category", "select_council"].includes(phase)) {
      timerRef.current = setInterval(() => setElapsed(e => e + 1), 1000)
    } else {
      if (timerRef.current) clearInterval(timerRef.current)
    }
    return () => { if (timerRef.current) clearInterval(timerRef.current) }
  }, [phase])

  // Sync preview state when entering select_council
  useEffect(() => {
    if (phase === "select_council") {
      prevSelectedRef.current = new Set(selectedMembers)
      setExitingMemberIds(new Set())
      setEnteringMemberIds(new Set())
    }
  }, [phase]) // eslint-disable-line react-hooks/exhaustive-deps

  // Detect member add/remove to animate preview row
  useEffect(() => {
    if (phase !== "select_council") return
    const prev = prevSelectedRef.current
    const curr = selectedMembers
    const added = [...curr].filter(id => !prev.has(id))
    const removed = [...prev].filter(id => !curr.has(id))
    if (added.length > 0) {
      setEnteringMemberIds(p => new Set([...p, ...added]))
      setTimeout(() => setEnteringMemberIds(p => { const n = new Set(p); added.forEach(id => n.delete(id)); return n }), 400)
    }
    if (removed.length > 0) {
      setExitingMemberIds(p => new Set([...p, ...removed]))
      setTimeout(() => setExitingMemberIds(p => { const n = new Set(p); removed.forEach(id => n.delete(id)); return n }), 250)
    }
    prevSelectedRef.current = new Set(curr)
  }, [selectedMembers, phase])

  // Load Google Fonts
  useEffect(() => {
    const link = document.createElement("link")
    link.href = "https://fonts.googleapis.com/css2?family=Space+Mono:ital,wght@0,400;0,700;1,400&family=Libre+Baskerville:ital,wght@0,400;0,700;1,400&display=swap"
    link.rel = "stylesheet"
    document.head.appendChild(link)
    return () => { document.head.removeChild(link) }
  }, [])

  const sleep = (ms: number) => new Promise<void>(r => setTimeout(r, ms))

  const typeInto = (
    setter: Dispatch<SetStateAction<TextMap>>,
    id: string,
    text: string,
    spd = 20
  ): Promise<void> => new Promise(resolve => {
    let i = 0
    setter(p => ({ ...p, [id]: "" }))
    const iv = setInterval(() => {
      if (debateAborted.current) {
        clearInterval(iv)
        setter(p => ({ ...p, [id]: text }))
        resolve()
        return
      }
      i += 3
      setter(p => ({ ...p, [id]: text.slice(0, i) }))
      if (i >= text.length) {
        clearInterval(iv)
        setter(p => ({ ...p, [id]: text }))
        resolve()
      }
    }, spd)
  })

  const typeVerdict = (text: string): Promise<void> => new Promise(resolve => {
    let i = 0
    setVerdict("")
    const iv = setInterval(() => {
      i += 3
      setVerdict(text.slice(0, i))
      if (i >= text.length) { clearInterval(iv); setVerdict(text); resolve() }
    }, 20)
  })

  const waitGate = (): Promise<boolean> => new Promise(resolve => {
    resolveGate.current = resolve
  })

  const handleGate = (choice: boolean) => {
    if (resolveGate.current) {
      resolveGate.current(choice)
      resolveGate.current = null
    }
  }

  const waitPresident = (): Promise<string> => new Promise(resolve => {
    resolvePresident.current = resolve
  })

  const initStatuses = (setter: Dispatch<SetStateAction<StatusMap>>, members: Member[]) => {
    const s: StatusMap = {}
    members.forEach(m => { s[m.id] = "pending" })
    setter(s)
  }

  const showTransition = async (message: string) => {
    setTransitionBanner(message)
    await sleep(1500)
    setTransitionBanner("")
  }

  const resetState = () => {
    setPhase("idle"); setQuestion(""); setElapsed(0); setError("")
    setOpTexts({}); setOpStatus({})
    setDebTexts({}); setDebStatus({})
    setRepTexts({}); setRepStatus({})
    setTreTexts({}); setTreStatus({})
    setVerdict(""); setVerdictSummary(""); setVerdictLoading(false)
    setIsLoading(false); setTransitionBanner("")
    setShowFeedback(false); setFeedbackDone(false)
    setConvergenceText(''); setMostDivergentText('')
    setElectedPresident(null); setPresidentAIResult(null); setPresidentAIDeciding(false)
    setShowPresidentModal(false); setShowStopModal(false)
    setSelectedCategory(''); setCategoryContext(''); setDebateSpeed('normal')
    setShowLargeCouncilModal(false); setLargeCouncilShown(false); setShareToast(false)
    storedRounds.current = { opinions: {}, debate: {}, replica: {}, treplica: {} }
    // Reload history
    setHistoryItems(JSON.parse(localStorage.getItem('konklave_history') || '[]'))
  }

  const toggleMember = (id: string) => {
    setSelectedMembers(prev => {
      const next = new Set(prev)
      if (next.has(id)) {
        if (next.size <= 3) return prev  // min 3
        next.delete(id)
        if (next.size < 6) setLargeCouncilShown(false)
      } else {
        next.add(id)
        if (prev.size === 6 && next.size === 7 && !largeCouncilShown) {
          setShowLargeCouncilModal(true)
          setLargeCouncilShown(true)
        }
      }
      return next
    })
  }

  const handleShare = async (format: 'story' | 'feed') => {
    const ref = format === 'story' ? shareCardStoryRef : shareCardFeedRef
    if (!ref.current) return
    try {
      const { default: html2canvas } = await import('html2canvas')
      const canvas = await html2canvas(ref.current, { useCORS: true, backgroundColor: '#080C14', scale: 2, logging: false })
      const link = document.createElement('a')
      link.download = `konklave-${format}-${sessionId}.png`
      link.href = canvas.toDataURL('image/png')
      link.click()
      const newCount = sharesCount + 1
      setSharesCount(newCount)
      localStorage.setItem('konklave_shares', String(newCount))
      const newBonus = Math.floor(newCount / 3)
      if (newBonus > bonusDebates) {
        setBonusDebates(newBonus)
        localStorage.setItem('konklave_bonus_debates', String(newBonus))
        setShareToast(true)
        setTimeout(() => setShareToast(false), 3500)
      }
      fetch('/api/leads', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: user.email, shares_count: newCount }),
      }).then(r => { if (!r.ok) r.json().then(e => console.error('Supabase share error:', e)) })
    } catch (e) {
      console.error('Share error:', e)
    }
  }

  const handlePresidentSelect = (id: string) => {
    const member = MEMBERS.find(m => m.id === id) || null
    setElectedPresident(member)
    setShowPresidentModal(false)
    setPresidentAIResult(null)
    if (resolvePresident.current) {
      resolvePresident.current(id)
      resolvePresident.current = null
    }
  }

  const handleAIElectPresident = async () => {
    setPresidentAIDeciding(true)
    try {
      const data = await callAPI('utility', {
        action: 'electPresident',
        question,
        selectedMembers: activeMembers.map(m => m.id),
        previousRounds: storedRounds.current,
      })
      const parsed = JSON.parse(data.text)
      if (parsed.presidentId) {
        setPresidentAIResult({ id: parsed.presidentId, reason: parsed.reason || '' })
      } else {
        // Fallback: just pick first member
        handlePresidentSelect(activeMembers[0].id)
      }
    } catch (e) {
      // Fallback: just pick first member
      handlePresidentSelect(activeMembers[0].id)
    } finally {
      setPresidentAIDeciding(false)
    }
  }

  const handleStopDebate = () => {
    setShowStopModal(true)
  }

  const handleConfirmStop = () => {
    debateAborted.current = true
    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
    }
    if (resolveGate.current) {
      resolveGate.current(false)
      resolveGate.current = null
    }
    if (resolvePresident.current) {
      handlePresidentSelect(activeMembers[0].id)
    }
    setShowStopModal(false)
  }

  const runLive = async (membersToUse: Member[], speed: 'fast' | 'normal' | 'deep') => {
    const userData = JSON.parse(localStorage.getItem('konklave_user') || '{}')
    userData.usos = (userData.usos || 0) + 1
    localStorage.setItem('konklave_user', JSON.stringify(userData))
    setUsos(userData.usos)
    fetch('/api/leads', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: userData.email, usos: userData.usos }),
    }).then(r => { if (!r.ok) r.json().then(e => console.error('Supabase update error:', e)) })

    setPhase("opinions"); setElapsed(0); setError("")
    setOpTexts({}); setOpStatus({})
    setDebTexts({}); setDebStatus({})
    setRepTexts({}); setRepStatus({})
    setTreTexts({}); setTreStatus({})
    setVerdict(""); setElectedPresident(null)
    storedRounds.current = { opinions: {}, debate: {}, replica: {}, treplica: {} }

    try {
      debateAborted.current = false
      abortControllerRef.current = new AbortController()

      try {
        // Phase 1 — opinions
        initStatuses(setOpStatus, membersToUse)
        setIsLoading(true)
        const opData = await callAPI('opinions', {
          question,
          selectedMembers: membersToUse.map(m => m.id),
          previousRounds: {},
          speed,
        }, abortControllerRef.current.signal)
        setIsLoading(false)
        for (const result of opData.results as Array<{ memberId: string; text: string }>) {
          if (debateAborted.current) break
          storedRounds.current.opinions[result.memberId] = result.text
          setOpStatus(p => ({ ...p, [result.memberId]: 'active' }))
          await typeInto(setOpTexts, result.memberId, renderMarkdown(result.text))
          setOpStatus(p => ({ ...p, [result.memberId]: 'done' }))
          await sleep(150)
        }

        // Non-blocking convergence after opinions
        callAPI('utility', {
          action: 'convergence',
          question,
          selectedMembers: membersToUse.map(m => m.id),
          previousRounds: { opinions: storedRounds.current.opinions },
        }).then(d => setConvergenceText(d.text || '')).catch(() => { })

        if (speed !== 'fast' && !debateAborted.current) {
          // Phase 2 — debate
          await showTransition("FASE 2 · DEBATE — Os conselheiros reagem entre si")
          if (debateAborted.current) throw new Error('AbortError')
          setPhase("debate")
          initStatuses(setDebStatus, membersToUse)
          setIsLoading(true)
          const debData = await callAPI('debate', {
            question,
            selectedMembers: membersToUse.map(m => m.id),
            previousRounds: { opinions: storedRounds.current.opinions },
            speed,
          }, abortControllerRef.current.signal)
          setIsLoading(false)
          for (const result of debData.results as Array<{ memberId: string; text: string }>) {
            if (debateAborted.current) break
            storedRounds.current.debate[result.memberId] = result.text
            setDebStatus(p => ({ ...p, [result.memberId]: 'active' }))
            await typeInto(setDebTexts, result.memberId, renderMarkdown(result.text))
            setDebStatus(p => ({ ...p, [result.memberId]: 'done' }))
            await sleep(150)
          }

          // Gate 1 — replica?
          let wantsReplica: boolean
          if (speed === 'deep') {
            wantsReplica = true
          } else {
            setPhase("ask_replica")
            wantsReplica = await waitGate()
          }

          if (wantsReplica && !debateAborted.current) {
            await showTransition("FASE 3 · RÉPLICA — Respondendo às críticas")
            if (debateAborted.current) throw new Error('AbortError')
            setPhase("replica")
            initStatuses(setRepStatus, membersToUse)
            setIsLoading(true)
            const repData = await callAPI('replica', {
              question,
              selectedMembers: membersToUse.map(m => m.id),
              previousRounds: { opinions: storedRounds.current.opinions, debate: storedRounds.current.debate },
              speed,
            }, abortControllerRef.current.signal)
            setIsLoading(false)
            for (const result of repData.results as Array<{ memberId: string; text: string }>) {
              if (debateAborted.current) break
              storedRounds.current.replica[result.memberId] = result.text
              setRepStatus(p => ({ ...p, [result.memberId]: 'active' }))
              await typeInto(setRepTexts, result.memberId, renderMarkdown(result.text))
              setRepStatus(p => ({ ...p, [result.memberId]: 'done' }))
              await sleep(150)
            }

            // Gate 2 — treplica?
            let wantsTreplica: boolean
            if (speed === 'deep') {
              wantsTreplica = true
            } else {
              setPhase("ask_treplica")
              wantsTreplica = await waitGate()
            }

            if (wantsTreplica && !debateAborted.current) {
              await showTransition("FASE 4 · TRÉPLICA — Argumentos finais")
              if (debateAborted.current) throw new Error('AbortError')
              setPhase("treplica")
              initStatuses(setTreStatus, membersToUse)
              setIsLoading(true)
              const treData = await callAPI('treplica', {
                question,
                selectedMembers: membersToUse.map(m => m.id),
                previousRounds: { opinions: storedRounds.current.opinions, debate: storedRounds.current.debate, replica: storedRounds.current.replica },
                speed,
              }, abortControllerRef.current.signal)
              setIsLoading(false)
              for (const result of treData.results as Array<{ memberId: string; text: string }>) {
                if (debateAborted.current) break
                storedRounds.current.treplica[result.memberId] = result.text
                setTreStatus(p => ({ ...p, [result.memberId]: 'active' }))
                await typeInto(setTreTexts, result.memberId, renderMarkdown(result.text))
                setTreStatus(p => ({ ...p, [result.memberId]: 'done' }))
                await sleep(150)
              }
            }
          }
        }

        // President election
        if (!debateAborted.current) {
          setPhase("ask_president")
          setShowPresidentModal(true)
          await waitPresident()
        }
      } catch (innerE: any) {
        if (!debateAborted.current && innerE.name !== 'AbortError' && !innerE.message?.includes('aborted')) {
          throw innerE
        }
        // If aborted, just swallow and proceed to Verdict.
      }

      // Cleanup modals if aborted mid-way
      setShowPresidentModal(false)

      // Ensure we have a president for the verdict
      // Need to capture the current state securely. Since we are inside runLive async context,
      // it might be safer to manually pick [0] if electedPresident is not yet synced,
      // because React state update takes a render tick.
      let presId = electedPresident?.id || membersToUse[0].id
      let presName = electedPresident?.name || membersToUse[0].name

      await showTransition(`${presName} — EMITINDO VEREDITO`)

      // Verdict
      setPhase("verdict")
      setVerdictLoading(true)
      setIsLoading(true)
      const verdictData = await callAPI('verdict', {
        question,
        selectedMembers: membersToUse.map(m => m.id),
        presidentId: presId,
        previousRounds: storedRounds.current,
      })
      setIsLoading(false)
      setVerdictLoading(false)
      await typeVerdict(renderMarkdown(verdictData.text))
      setPhase("done")

      // Non-blocking verdict summary for share cards
      callAPI('utility', {
        action: 'summarizeVerdict',
        verdictText: verdictData.text,
        question,
        selectedMembers: membersToUse.map(m => m.id),
        previousRounds: storedRounds.current,
      }).then(d => setVerdictSummary(d.text || '')).catch(() => {})

      // Non-blocking most divergent after verdict
      callAPI('utility', {
        action: 'mostDivergent',
        question,
        selectedMembers: membersToUse.map(m => m.id),
        previousRounds: storedRounds.current,
      }).then(d => setMostDivergentText(d.text || '')).catch(() => { })

      setShowFeedback(true)
    } catch (e: unknown) {
      setIsLoading(false)
      const msg = e instanceof Error ? e.message : String(e)
      setError("Erro: " + msg)
      setPhase("done")
    }
  }

  const startDebate = () => {
    runLive(MEMBERS.filter(m => selectedMembers.has(m.id)), debateSpeed)
  }

  const fmt = (s: number) => `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`

  const tabMembers = selectionTab === 'models' ? MODELS : selectionTab === 'specialists' ? SPECIALISTS : MINDS

  return (
    <>
      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 0.2; transform: scale(0.8); }
          50% { opacity: 1; transform: scale(1); }
        }
        @keyframes blink {
          from, to { opacity: 1; }
          50% { opacity: 0; }
        }
        @keyframes glow {
          0%, 100% { box-shadow: 0 0 14px #C8952A; }
          50% { box-shadow: 0 0 28px #C8952A, 0 0 40px rgba(200,149,42,0.4); }
        }
        @keyframes timerPulse {
          0%, 100% { box-shadow: 0 0 0px rgba(200,149,42,0); border-color: rgba(200,149,42,0.3); }
          50% { box-shadow: 0 0 16px rgba(200,149,42,0.3); border-color: rgba(200,149,42,0.7); }
        }
        @keyframes loadingSlide {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(400%); }
        }
        @keyframes bannerFade {
          0% { opacity: 0; transform: translateY(-4px); }
          15% { opacity: 1; transform: translateY(0); }
          80% { opacity: 1; transform: translateY(0); }
          100% { opacity: 0; transform: translateY(4px); }
        }
        @keyframes memberEnter {
          0% { transform: scale(0.6); opacity: 0; box-shadow: 0 0 0px rgba(200,149,42,0); }
          60% { transform: scale(1.05); opacity: 1; box-shadow: 0 0 24px rgba(200,149,42,0.8); }
          100% { transform: scale(1.0); opacity: 1; box-shadow: 0 0 0px rgba(200,149,42,0); }
        }
        @keyframes memberExit {
          0% { transform: scale(1.0); opacity: 1; }
          100% { transform: scale(0.6); opacity: 0; }
        }
        @keyframes fadeSlideIn {
          from { opacity: 0; transform: translateY(12px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes cardEntrance {
          from { opacity: 0; transform: translateY(16px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes slideInRight {
          from { transform: translateX(100%); }
          to { transform: translateX(0); }
        }
        @keyframes modalEntrance {
          from { opacity: 0; transform: scale(0.95) translateY(8px); }
          to { opacity: 1; transform: scale(1) translateY(0); }
        }
      `}</style>

      <div ref={scrollRef} style={{ height: "100vh", overflowY: "auto", background: "#080C14", fontFamily: "'Space Mono', monospace", color: "#C8D8E8", scrollBehavior: "smooth" }}>
        <div style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0, backgroundImage: "linear-gradient(rgba(200,149,42,0.012) 1px,transparent 1px),linear-gradient(90deg,rgba(200,149,42,0.012) 1px,transparent 1px)", backgroundSize: "52px 52px" }} />

        {/* HEADER */}
        <div style={{ position: "sticky", top: 0, zIndex: 20, background: "rgba(8,12,20,0.97)", backdropFilter: "blur(12px)", borderBottom: "1px solid #1E2D42", padding: "0 44px", height: 54, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
              <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#C8952A", boxShadow: !["idle", "write_question", "done", "select_category", "select_council"].includes(phase) ? "0 0 14px #C8952A" : "none", animation: !["idle", "write_question", "done", "select_category", "select_council"].includes(phase) ? "glow 2s ease-in-out infinite" : "none" }} />
              <span style={{ fontSize: 13, fontWeight: 700, color: "#ccd8e0", letterSpacing: 3 }}>KONKLAVE</span>
            </div>
            <div style={{ width: 1, height: 18, background: "#1E2D42" }} />
            <span style={{ fontSize: 8, color: "#C8952A", letterSpacing: 2 }}>{PHASE_LABELS[phase] || ""}</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <button
              onClick={() => setShowHistory(true)}
              style={{ background: "transparent", border: "none", color: "#3A5A70", fontFamily: "'Space Mono', monospace", fontSize: 8, letterSpacing: 1, cursor: "pointer", padding: "4px 8px" }}
            >HISTÓRICO</button>
            <div
              title="Todos os recursos gratuitos por tempo limitado"
              style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 2, cursor: "default" }}
            >
              <span style={{ fontFamily: "'Space Mono', monospace", fontSize: 9, color: "#C8952A", letterSpacing: 2, fontWeight: 700 }}>ACESSO GRATUITO</span>
              <span style={{ fontFamily: "'Space Mono', monospace", fontSize: 8, color: "#6A8AA8", letterSpacing: 1 }}>{usos} debates realizados{bonusDebates > 0 ? ` · ${bonusDebates} bônus` : ''}</span>
            </div>
            <span style={{ fontFamily: "'Space Mono', monospace", fontSize: 11, color: "#6A8AA8" }}>Olá, {user.nome}</span>
          </div>
        </div>

        {/* LOADING BAR */}
        {isLoading && (
          <div style={{ position: "sticky", top: 54, zIndex: 19, height: 2, background: "#0A0F1A", overflow: "hidden" }}>
            <div style={{ height: "100%", width: "30%", background: "linear-gradient(90deg, transparent, #C8952A, transparent)", animation: "loadingSlide 1.4s ease-in-out infinite" }} />
          </div>
        )}

        {/* TRANSITION BANNER */}
        {transitionBanner && (
          <div style={{ position: "relative", zIndex: 10, padding: "18px 40px", background: "rgba(8,12,20,0.98)", borderBottom: "1px solid rgba(200,149,42,0.12)", textAlign: "center", animation: "bannerFade 1.5s ease-in-out forwards" }}>
            <span style={{ fontFamily: "'Space Mono', monospace", fontSize: 10, color: "#C8952A", letterSpacing: 4, fontWeight: 700 }}>— {transitionBanner} —</span>
          </div>
        )}

        {/* MAIN */}
        <div style={{ position: "relative", zIndex: 1, maxWidth: 1020, margin: "0 auto", padding: "44px 40px 140px" }}>

          {/* QUESTION — shown read-only after write_question phase */}
          {!["idle", "write_question"].includes(phase) && (
            <div style={{ background: "#0A0F1A", border: "1px solid #1E2D42", borderLeft: "3px solid #C8952A", borderRadius: 2, padding: "26px 30px", marginBottom: 40 }}>
              <div style={{ fontSize: 8, color: "#C8952A", letterSpacing: 3, marginBottom: 14 }}>▸ QUESTÃO AO CONSELHO</div>
              <p style={{ fontFamily: "'Libre Baskerville', Georgia, serif", fontSize: 15, lineHeight: 1.8, color: "#D4E4F0", margin: 0, fontStyle: "italic" }}>"{question}"</p>
            </div>
          )}

          {/* CATEGORY SELECTION — IDLE */}
          {phase === "idle" && (
            <div style={{ animation: "fadeSlideIn 400ms ease-out both" }}>
              <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 10, color: "#6A8AA8", letterSpacing: 1, marginBottom: 28 }}>
                Qual é o contexto da sua questão? O conselho será pré-configurado para você.
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12 }}>
                {CATEGORIES.map((cat, idx) => (
                  <div key={cat.id} style={{ animation: `cardEntrance 400ms ease-out ${idx * 60}ms both` }}>
                    <div
                      onClick={() => {
                        setSelectedCategory(cat.id)
                        setSelectedMembers(new Set(cat.members))
                        setPhase("write_question")
                      }}
                      style={{
                        background: "#0F1520",
                        border: "1px solid #1E2D42",
                        borderRadius: 4,
                        padding: 20,
                        cursor: "pointer",
                        transition: "all 0.2s",
                      }}
                      onMouseEnter={e => { const el = e.currentTarget as HTMLDivElement; el.style.borderColor = "#C8952A"; el.style.background = "#111827"; el.style.transform = "translateY(-3px)"; el.style.boxShadow = "0 8px 24px rgba(0,0,0,0.3)" }}
                      onMouseLeave={e => { const el = e.currentTarget as HTMLDivElement; el.style.borderColor = "#1E2D42"; el.style.background = "#0F1520"; el.style.transform = "translateY(0)"; el.style.boxShadow = "none" }}
                    >
                      <div style={{ fontSize: 20, color: "#C8952A", marginBottom: 10 }}>{cat.icon}</div>
                      <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 11, color: "#C0D0DC", letterSpacing: 1, marginBottom: 6 }}>{cat.label}</div>
                      <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 9, color: "#6A8AA8", letterSpacing: 0 }}>{cat.description}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* WRITE QUESTION */}
          {phase === "write_question" && (() => {
            const cat = CATEGORIES.find(c => c.id === selectedCategory)
            return (
              <div style={{ paddingBottom: 60, animation: "fadeSlideIn 400ms ease-out both" }}>
                {/* Category badge */}
                <div style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "5px 14px", background: "rgba(200,149,42,0.08)", border: "1px solid rgba(200,149,42,0.3)", borderRadius: 999, marginBottom: 28 }}>
                  <span style={{ color: "#C8952A", fontSize: 13 }}>{cat?.icon}</span>
                  <span style={{ fontFamily: "'Space Mono', monospace", fontSize: 9, color: "#C8952A", letterSpacing: 2 }}>{cat?.label?.toUpperCase()}</span>
                </div>
                {/* Question box */}
                <div style={{ background: "#0A0F1A", border: "1px solid #1E2D42", borderLeft: "3px solid #C8952A", borderRadius: 2, padding: "26px 30px", marginBottom: 20 }}>
                  <div style={{ fontSize: 8, color: "#C8952A", letterSpacing: 3, marginBottom: 14 }}>▸ QUESTÃO AO CONSELHO</div>
                  <textarea
                    value={question}
                    onChange={e => setQuestion(e.target.value)}
                    placeholder="Qual é a sua questão?"
                    style={{ width: "100%", background: "transparent", border: "none", outline: "none", resize: "vertical", fontFamily: "'Libre Baskerville', Georgia, serif", fontSize: 15, lineHeight: 1.8, color: "#D4E4F0", minHeight: 80, caretColor: "#C8952A" }}
                  />
                </div>
                {/* Actions */}
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <button
                    onClick={() => { setPhase("idle"); setQuestion("") }}
                    style={{ padding: "12px 20px", background: "transparent", color: "#6A8AA8", border: "1px solid #1E2D42", borderRadius: 2, fontFamily: "'Space Mono', monospace", fontSize: 10, letterSpacing: 2, cursor: "pointer" }}
                  >← VOLTAR</button>
                  <button
                    onClick={() => setPhase("select_council")}
                    disabled={!question.trim()}
                    style={{ padding: "12px 30px", background: "#C8952A", color: "#070910", border: "none", borderRadius: 2, fontFamily: "'Space Mono', monospace", fontSize: 11, fontWeight: 700, letterSpacing: 2, cursor: question.trim() ? "pointer" : "not-allowed", boxShadow: "0 0 28px rgba(200,149,42,0.2)", opacity: !question.trim() ? 0.4 : 1 }}
                  >
                    CONVOCAR O CONSELHO →
                  </button>
                </div>
              </div>
            )
          })()}

          {/* SELECTION SCREEN */}
          {phase === "select_council" && (
            <div style={{ animation: "fadeSlideIn 400ms ease-out both" }}>
              <SectionHeader label="— CONFIGURAR SEU CONSELHO" active={true} done={false} />

              {/* CONSELHO SUGERIDO — dynamic preview with entry/exit animations */}
              {(() => {
                const cat = CATEGORIES.find(c => c.id === selectedCategory)
                const previewIds = new Set([...selectedMembers, ...exitingMemberIds])
                const previewMembers = MEMBERS.filter(m => previewIds.has(m.id))
                return (
                  <div style={{ marginBottom: 32 }}>
                    <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 9, color: "#C8952A", letterSpacing: 2, marginBottom: 6 }}>
                      ◈ Conselho sugerido para {cat?.label} — {selectedMembers.size} membros selecionados
                    </div>
                    <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 8, color: "#6A8AA8", letterSpacing: 1, marginBottom: 16 }}>
                      Clique em qualquer aba abaixo para personalizar
                    </div>
                    {showMinWarning && (
                      <div style={{ marginBottom: 10, padding: "7px 14px", background: "rgba(224,90,90,0.1)", border: "1px solid rgba(224,90,90,0.35)", borderRadius: 2, fontFamily: "'Space Mono', monospace", fontSize: 8, color: "#E05A5A", letterSpacing: 1 }}>
                        Mínimo de 3 conselheiros necessário
                      </div>
                    )}
                    <div style={{ display: "flex", gap: 10, overflowX: "auto", paddingBottom: 4 }}>
                      {previewMembers.map(m => {
                        const isExiting = exitingMemberIds.has(m.id)
                        const isEntering = enteringMemberIds.has(m.id)
                        const isHovered = hoveredPreviewId === m.id && !isExiting
                        return (
                          <div key={m.id} style={{ flexShrink: 0, display: "flex", flexDirection: "column", alignItems: "center" }}>
                            <div
                              onClick={() => {
                                if (isExiting) return
                                if (selectedMembers.size <= 3) {
                                  setShowMinWarning(true)
                                  setTimeout(() => setShowMinWarning(false), 2000)
                                  return
                                }
                                toggleMember(m.id)
                              }}
                              onMouseEnter={() => setHoveredPreviewId(m.id)}
                              onMouseLeave={() => setHoveredPreviewId('')}
                              style={{
                                position: "relative",
                                background: "#111827",
                                border: `1px solid ${isHovered ? '#E05A5A' : 'rgba(200,149,42,0.45)'}`,
                                borderTop: `2px solid ${isHovered ? '#E05A5A' : '#C8952A'}`,
                                borderRadius: 2,
                                padding: "14px 16px",
                                minWidth: 90,
                                textAlign: "center",
                                cursor: isExiting ? "default" : "pointer",
                                transition: "border-color 0.2s",
                                overflow: "hidden",
                                animation: isExiting
                                  ? "memberExit 250ms ease-in forwards"
                                  : isEntering
                                    ? "memberEnter 400ms ease-out forwards"
                                    : "none",
                              }}
                            >
                              {/* Removal overlay */}
                              <div style={{
                                position: "absolute",
                                inset: 0,
                                background: "rgba(0,0,0,0.6)",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                opacity: isHovered ? 1 : 0,
                                transition: "opacity 0.2s",
                                borderRadius: 2,
                                pointerEvents: "none",
                              }}>
                                <span style={{ fontFamily: "'Space Mono', monospace", fontSize: 9, color: "#E05A5A", letterSpacing: 1, fontWeight: 700 }}>✕ REMOVER</span>
                              </div>
                              <div style={{ fontFamily: "'Libre Baskerville', Georgia, serif", fontSize: 22, color: m.color, marginBottom: 8 }}>{m.symbol}</div>
                              <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 8, color: m.color, letterSpacing: 1, marginBottom: 4 }}>{m.name}</div>
                              <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 7, color: "#6A8AA8" }}>{m.role}</div>
                            </div>
                            {/* Per-card tooltip */}
                            <div style={{
                              fontFamily: "'Space Mono', monospace",
                              fontSize: 7,
                              color: "#E05A5A",
                              letterSpacing: 0,
                              marginTop: 5,
                              opacity: isHovered ? 1 : 0,
                              transition: "opacity 0.2s",
                              whiteSpace: "nowrap",
                              pointerEvents: "none",
                            }}>
                              Clique para remover
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                )
              })()}

              {/* Stat line */}
              <div style={{ marginBottom: 24 }}>
                <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 10, color: "#6A8AA8", letterSpacing: 1 }}>
                  29 CONSELHEIROS · 8 modelos de IA · 7 especialistas · 14 grandes mentes
                </div>
              </div>

              {/* 3 Tabs — pill container */}
              <div style={{ marginBottom: 0 }}>
                <div style={{ display: "inline-flex", background: "#0A0F1A", borderRadius: 4, padding: 4, gap: 2, border: "1px solid #1E2D42" }}>
                  {([
                    { key: 'models', label: 'MODELOS DE IA', members: MODELS },
                    { key: 'specialists', label: 'ESPECIALISTAS', members: SPECIALISTS },
                    { key: 'minds', label: 'GRANDES MENTES', members: MINDS },
                  ] as const).map(({ key, label, members }) => {
                    const isActive = selectionTab === key
                    const previewSymbols = members.slice(0, 3)
                    return (
                      <button
                        key={key}
                        onClick={() => setSelectionTab(key)}
                        style={{
                          padding: "9px 18px",
                          background: isActive ? "#C8952A" : "transparent",
                          border: "none",
                          borderRadius: 2,
                          fontFamily: "'Space Mono', monospace",
                          fontSize: 9,
                          color: isActive ? "#070910" : "#6A8AA8",
                          letterSpacing: 2,
                          cursor: "pointer",
                          transition: "all 0.2s",
                          display: "flex",
                          alignItems: "center",
                          gap: 8,
                          whiteSpace: "nowrap",
                        }}
                        onMouseEnter={e => { if (!isActive) (e.currentTarget as HTMLButtonElement).style.background = "rgba(200,149,42,0.08)" }}
                        onMouseLeave={e => { if (!isActive) (e.currentTarget as HTMLButtonElement).style.background = "transparent" }}
                      >
                        <div style={{ display: "flex", gap: 3 }}>
                          {previewSymbols.map(m => (
                            <span key={m.id} style={{ fontFamily: "'Libre Baskerville', Georgia, serif", fontSize: 11, color: isActive ? "#070910" : m.color, opacity: isActive ? 0.5 : 0.8, transition: "color 0.2s" }}>{m.symbol}</span>
                          ))}
                        </div>
                        {label}
                      </button>
                    )
                  })}
                </div>
              </div>

              <div style={{ height: 24 }} />

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, paddingBottom: 100 }}>
                {tabMembers.map((m, idx) => (
                  <div key={m.id} style={{ animation: `cardEntrance 350ms ease-out ${idx * 40}ms both` }}>
                    <SelectionCard
                      member={m}
                      selected={selectedMembers.has(m.id)}
                      onToggle={() => toggleMember(m.id)}
                      canDeselect={selectedMembers.size > 3}
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* SELECTION FOOTER */}
          {phase === "select_council" && (
            <div style={{ position: "fixed", bottom: 0, left: 0, right: 0, background: "#080C14", borderTop: "1px solid rgba(200,149,42,0.25)", padding: "14px 40px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16, zIndex: 30 }}>
              <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 10, color: "#6A8AA8", letterSpacing: 1, flexShrink: 0 }}>
                <span style={{ color: "#C8952A", fontWeight: 700 }}>{selectedMembers.size}</span> selecionados de {MEMBERS.length} disponíveis
                <span style={{ color: "#2A3A4A", marginLeft: 10 }}>· mínimo 3</span>
              </div>
              {/* Speed selector */}
              <div style={{ display: "flex", flexDirection: "column", gap: 6, alignItems: "center" }}>
                <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
                  {([
                    { key: 'fast', icon: '⚡', label: 'RÁPIDO', desc: '⚡ Só opiniões individuais + veredito direto. Ideal para decisões rápidas. ~2-3 min.' },
                    { key: 'normal', icon: '◎', label: 'NORMAL', desc: '◎ Fluxo completo com réplica e tréplica. Recomendado para decisões importantes. ~5-8 min.' },
                    { key: 'deep', icon: '∞', label: 'PROFUNDO', desc: '∞ Todas as fases obrigatórias com respostas mais longas. Máxima profundidade. ~10-15 min.' },
                  ] as const).map(({ key, icon, label, desc }) => {
                    const isActive = debateSpeed === key
                    return (
                      <button
                        key={key}
                        onClick={() => setDebateSpeed(key)}
                        title={desc}
                        style={{ padding: "7px 12px", background: isActive ? "#C8952A" : "#0B1018", color: isActive ? "#070910" : "#6A8AA8", border: `1px solid ${isActive ? "#C8952A" : "#1E2D42"}`, borderRadius: 999, fontFamily: "'Space Mono', monospace", fontSize: 8, letterSpacing: 1, cursor: "pointer", transition: "all 0.2s", whiteSpace: "nowrap" }}
                      >
                        {icon} {label}
                      </button>
                    )
                  })}
                </div>
                <div key={debateSpeed} style={{ fontFamily: "'Space Mono', monospace", fontSize: 9, color: "#6A8AA8", fontStyle: "italic", textAlign: "center", animation: "fadeSlideIn 200ms ease-out both", maxWidth: 360 }}>
                  {debateSpeed === 'fast' && '⚡ Só opiniões individuais + veredito direto. Ideal para decisões rápidas. ~2-3 min.'}
                  {debateSpeed === 'normal' && '◎ Fluxo completo com réplica e tréplica. Recomendado para decisões importantes. ~5-8 min.'}
                  {debateSpeed === 'deep' && '∞ Todas as fases obrigatórias com respostas mais longas. Máxima profundidade. ~10-15 min.'}
                </div>
              </div>
              <div style={{ display: "flex", gap: 12, flexShrink: 0 }}>
                <button onClick={() => setPhase("write_question")} style={{ padding: "12px 20px", background: "transparent", color: "#6A8AA8", border: "1px solid #1E2D42", borderRadius: 2, fontFamily: "'Space Mono', monospace", fontSize: 10, letterSpacing: 2, cursor: "pointer" }}>← VOLTAR</button>
                <button
                  onClick={startDebate}
                  disabled={selectedMembers.size < 3}
                  style={{ padding: "12px 30px", background: "#C8952A", color: "#070910", border: "none", borderRadius: 2, fontFamily: "'Space Mono', monospace", fontSize: 11, fontWeight: 700, letterSpacing: 2, cursor: selectedMembers.size < 3 ? "not-allowed" : "pointer", boxShadow: "0 0 28px rgba(200,149,42,0.2)", opacity: selectedMembers.size < 3 ? 0.4 : 1 }}
                >
                  INICIAR DEBATE COM {selectedMembers.size} CONSELHEIROS →
                </button>
              </div>
            </div>
          )}

          {error && <div style={{ padding: "12px 18px", marginBottom: 20, background: "#110808", border: "1px solid #3a1010", fontSize: 10, color: "#c06060", borderRadius: 2 }}>{error}</div>}

          {/* CONVERGENCE BADGE */}
          {convergenceText && showDeb && (
            <div style={{ padding: "10px 16px", marginBottom: 16, background: "#0A0F1A", border: "1px solid rgba(74,143,212,0.2)", borderLeft: "2px solid #4A8FD4", borderRadius: 2 }}>
              <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 7, color: "#4A8FD4", letterSpacing: 2, marginBottom: 4 }}>▸ ANÁLISE DE CONVERGÊNCIA</div>
              <div style={{ fontFamily: "'Libre Baskerville', Georgia, serif", fontSize: 12, color: "#6A8AA8", lineHeight: 1.6 }}>{convergenceText}</div>
            </div>
          )}

          {/* PHASE 1 */}
          {showOp && (
            <div style={{ marginBottom: 52 }}>
              <SectionHeader label="— FASE 1 · OPINIÕES INDEPENDENTES" active={phase === "opinions"} done={phase !== "opinions"} />
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                {activeMembers.map(m => (
                  <MemberCard key={m.id} member={m} status={opStatus[m.id] || "pending"} text={opTexts[m.id] || ""} loading={isLoading && phase === "opinions"} loadingMessage={LOADING_MESSAGES[loadingMsgIdx]} />
                ))}
              </div>
            </div>
          )}

          {/* PHASE 2 */}
          {showDeb && (
            <div style={{ marginBottom: showAskRep ? 0 : 52 }}>
              <SectionHeader label="— FASE 2 · DEBATE" active={phase === "debate"} done={!["opinions", "debate"].includes(phase)} />
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                {activeMembers.map(m => (
                  <MemberCard key={m.id} member={m} status={debStatus[m.id] || "pending"} text={debTexts[m.id] || ""} loading={isLoading && phase === "debate"} loadingMessage={LOADING_MESSAGES[loadingMsgIdx]} />
                ))}
              </div>
            </div>
          )}

          {showAskRep && <DecisionGate phase="ask_replica" onYes={() => handleGate(true)} onNo={() => handleGate(false)} />}

          {/* PHASE 3 */}
          {showRep && (
            <div style={{ marginBottom: showAskTre ? 0 : 52 }}>
              <SectionHeader label="— FASE 3 · RÉPLICA" active={phase === "replica"} done={!["opinions", "debate", "ask_replica", "replica"].includes(phase)} />
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                {activeMembers.map(m => (
                  <MemberCard key={m.id} member={m} status={repStatus[m.id] || "pending"} text={repTexts[m.id] || ""} loading={isLoading && phase === "replica"} loadingMessage={LOADING_MESSAGES[loadingMsgIdx]} />
                ))}
              </div>
            </div>
          )}

          {showAskTre && <DecisionGate phase="ask_treplica" onYes={() => handleGate(true)} onNo={() => handleGate(false)} />}

          {/* PHASE 4 */}
          {showTre && (
            <div style={{ marginBottom: 52 }}>
              <SectionHeader label="— FASE 4 · TRÉPLICA" active={phase === "treplica"} done={["ask_president", "verdict", "done"].includes(phase)} />
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                {activeMembers.map(m => (
                  <MemberCard key={m.id} member={m} status={treStatus[m.id] || "pending"} text={treTexts[m.id] || ""} loading={isLoading && phase === "treplica"} loadingMessage={LOADING_MESSAGES[loadingMsgIdx]} />
                ))}
              </div>
            </div>
          )}

          {/* VERDICT */}
          {showVerdict && (
            <div style={{ marginBottom: 32 }}>
              <SectionHeader label="— FASE FINAL · VEREDITO" active={phase === "verdict"} done={phase === "done"} />
              <VerdictPanel text={verdict} loading={verdictLoading} president={electedPresident} />
            </div>
          )}

          {/* MOST DIVERGENT BADGE */}
          {mostDivergentText && phase === "done" && (
            <div style={{ padding: "10px 16px", marginBottom: 16, background: "#0A0F1A", border: "1px solid rgba(168,92,212,0.2)", borderLeft: "2px solid #A85CD4", borderRadius: 2 }}>
              <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 7, color: "#A85CD4", letterSpacing: 2, marginBottom: 4 }}>▸ CONSELHEIRO MAIS DIVERGENTE</div>
              <div style={{ fontFamily: "'Libre Baskerville', Georgia, serif", fontSize: 12, color: "#6A8AA8", lineHeight: 1.6 }}>{mostDivergentText}</div>
            </div>
          )}

          {/* SHARE SECTION */}
          {phase === "done" && verdict && (
            <div style={{ marginTop: 32, marginBottom: 16, background: "#0A0F1A", border: "1px solid #1E2D42", borderRadius: 2, padding: "24px 28px" }}>
              <p style={{ fontFamily: "'Libre Baskerville', Georgia, serif", fontSize: 16, color: "#C0D0DC", lineHeight: 1.5, marginBottom: 20, fontStyle: "italic" }}>
                Este veredito pode ajudar alguém que você conhece.
              </p>
              <div style={{ display: "flex", gap: 10 }}>
                <button
                  onClick={() => handleShare('story')}
                  style={{ padding: "10px 18px", background: "transparent", color: "#6A8AA8", border: "1px solid #1E2D42", borderRadius: 2, fontFamily: "'Space Mono', monospace", fontSize: 8, letterSpacing: 2, cursor: "pointer", transition: "all 0.2s" }}
                  onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(200,149,42,0.4)'; (e.currentTarget as HTMLButtonElement).style.color = '#C8952A' }}
                  onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = '#1E2D42'; (e.currentTarget as HTMLButtonElement).style.color = '#6A8AA8' }}
                >
                  ↓ STORY (9:16)
                </button>
                <button
                  onClick={() => handleShare('feed')}
                  style={{ padding: "10px 18px", background: "transparent", color: "#6A8AA8", border: "1px solid #1E2D42", borderRadius: 2, fontFamily: "'Space Mono', monospace", fontSize: 8, letterSpacing: 2, cursor: "pointer", transition: "all 0.2s" }}
                  onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(200,149,42,0.4)'; (e.currentTarget as HTMLButtonElement).style.color = '#C8952A' }}
                  onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = '#1E2D42'; (e.currentTarget as HTMLButtonElement).style.color = '#6A8AA8' }}
                >
                  ↓ FEED / LINKEDIN (1:1)
                </button>
              </div>
            </div>
          )}

          {/* DONE ACTIONS */}
          {phase === "done" && (
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 24 }}>
              <span style={{ fontSize: 8, color: "#6A8AA8", letterSpacing: 1 }}>#{sessionId} · {fmt(elapsed)}</span>
              <div style={{ display: "flex", gap: 10 }}>
                <button
                  onClick={() => navigator.clipboard?.writeText(`KONKLAVE #${sessionId}\n\n${question}\n\n${verdict}`)}
                  style={{ padding: "9px 18px", background: "transparent", color: "#6A8AA8", border: "1px solid #1E2D42", borderRadius: 2, fontSize: 8, fontFamily: "'Space Mono', monospace", letterSpacing: 2, cursor: "pointer" }}
                >
                  COPIAR VEREDITO
                </button>
                <button
                  onClick={feedbackDone ? resetState : () => setShowFeedback(true)}
                  style={{ padding: "9px 18px", background: "transparent", color: feedbackDone ? "#C8952A" : "#6A8AA8", border: `1px solid ${feedbackDone ? "rgba(200,149,42,0.3)" : "#1E2D42"}`, borderRadius: 2, fontSize: 8, fontFamily: "'Space Mono', monospace", letterSpacing: 2, cursor: "pointer" }}
                >
                  {feedbackDone ? "NOVA SESSÃO →" : "AVALIAR SESSÃO →"}
                </button>
              </div>
            </div>
          )}

        </div>
      </div>

      {/* WELCOME MODAL */}
      {showWelcome && (
        <WelcomeModal onClose={() => {
          localStorage.setItem('konklave_welcomed', 'true')
          setShowWelcome(false)
        }} />
      )}

      {/* PRESIDENT MODAL */}
      {showPresidentModal && (
        <PresidentModal
          activeMembers={activeMembers}
          onSelect={handlePresidentSelect}
          onAIDecide={handleAIElectPresident}
          aiDeciding={presidentAIDeciding}
          aiResult={presidentAIResult}
        />
      )}

      {/* FEEDBACK MODAL */}
      {showFeedback && (
        <FeedbackModal
          verdict={verdict}
          userEmail={user.email}
          question={question}
          memberIds={activeMembers.map(m => m.id)}
          onClose={() => {
            setShowFeedback(false)
            setFeedbackDone(true)
            setHistoryItems(JSON.parse(localStorage.getItem('konklave_history') || '[]'))
          }}
        />
      )}

      {/* HISTORY DRAWER */}
      {showHistory && (
        <HistoryDrawer
          items={historyItems}
          onClose={() => setShowHistory(false)}
          onClear={() => {
            localStorage.removeItem('konklave_history')
            setHistoryItems([])
          }}
        />
      )}

      {/* FLOATING TIMER PILL & STOP BUTTON */}
      {showTimer && (
        <div style={{ position: "fixed", bottom: 24, left: "50%", transform: "translateX(-50%)", display: "flex", alignItems: "center", gap: 8, zIndex: 50 }}>
          <div style={{ background: "#0A0F1A", border: "1px solid rgba(200,149,42,0.3)", borderRadius: 999, padding: "8px 20px", fontFamily: "'Space Mono', monospace", fontSize: 13, color: "#C8952A", animation: "timerPulse 2s ease-in-out infinite", pointerEvents: "none", letterSpacing: 2 }}>
            ⏱ {fmt(elapsed)}
          </div>
          <button
            onClick={handleStopDebate}
            style={{ padding: "8px 16px", background: "transparent", color: "#E05A5A", border: "1px solid rgba(224,90,90,0.4)", borderRadius: 999, fontFamily: "'Space Mono', monospace", fontSize: 9, letterSpacing: 1, cursor: "pointer", transition: "all 200ms" }}
            onMouseEnter={e => { const t = e.currentTarget; t.style.background = "rgba(224,90,90,0.1)"; t.style.borderColor = "#E05A5A" }}
            onMouseLeave={e => { const t = e.currentTarget; t.style.background = "transparent"; t.style.borderColor = "rgba(224,90,90,0.4)" }}
          >
            ⏹ ENCERRAR
          </button>
        </div>
      )}

      {/* STOP CONFIRMATION MODAL */}
      {showStopModal && (
        <div style={{ position: "fixed", inset: 0, zIndex: 100, background: "rgba(4,6,12,0.93)", backdropFilter: "blur(8px)", display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
          <div style={{ width: "100%", maxWidth: 460, background: "#0A0F1A", border: "1px solid rgba(224,90,90,0.3)", borderTop: "3px solid #E05A5A", borderRadius: 2, padding: "36px 36px 32px" }}>
            <h3 style={{ fontFamily: "'Libre Baskerville', Georgia, serif", fontSize: 18, color: "#C0D0DC", marginBottom: 16, lineHeight: 1.3 }}>Encerrar o debate?</h3>
            <p style={{ fontFamily: "'Space Mono', monospace", fontSize: 11, color: "#6A8AA8", lineHeight: 1.7, marginBottom: 32 }}>
              O debate será interrompido. Você pode ir direto ao veredito com as respostas já coletadas, ou cancelar e continuar.
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <button
                onClick={handleConfirmStop}
                style={{ width: "100%", padding: "13px", background: "#C8952A", color: "#070910", border: "none", borderRadius: 2, fontFamily: "'Space Mono', monospace", fontSize: 11, fontWeight: 700, letterSpacing: 2, cursor: "pointer" }}
              >
                IR AO VEREDITO AGORA →
              </button>
              <button
                onClick={() => setShowStopModal(false)}
                style={{ width: "100%", padding: "13px", background: "transparent", color: "#6A8AA8", border: "1px solid #1E2D42", borderRadius: 2, fontFamily: "'Space Mono', monospace", fontSize: 11, letterSpacing: 2, cursor: "pointer" }}
              >
                CONTINUAR DEBATE
              </button>
            </div>
          </div>
        </div>
      )}

      {/* LARGE COUNCIL MODAL */}
      {showLargeCouncilModal && (
        <LargeCouncilModal
          count={selectedMembers.size}
          onContinue={() => setShowLargeCouncilModal(false)}
          onReduce={() => setShowLargeCouncilModal(false)}
        />
      )}

      {/* SHARE TOAST */}
      {shareToast && (
        <div style={{ position: "fixed", bottom: 32, left: "50%", transform: "translateX(-50%)", background: "#0A0F1A", border: "1px solid rgba(200,149,42,0.5)", borderRadius: 999, padding: "10px 24px", fontFamily: "'Space Mono', monospace", fontSize: 10, color: "#C8952A", zIndex: 60, letterSpacing: 2, whiteSpace: "nowrap", boxShadow: "0 4px 24px rgba(0,0,0,0.4)" }}>
          🎖 +1 debate desbloqueado por compartilhar!
        </div>
      )}

      {/* OFF-SCREEN SHARE CARDS */}
      {phase === "done" && verdict && (
        <>
          {/* Story 9:16 — 400×711 */}
          <div
            ref={shareCardStoryRef}
            style={{
              position: "fixed", left: -10000, top: 0,
              width: 400, height: 711,
              background: "#080C14",
              border: "1px solid rgba(200,149,42,0.15)",
              padding: "36px",
              boxSizing: "border-box",
              display: "flex", flexDirection: "column",
              fontFamily: "'Space Mono', monospace",
            }}
          >
            {/* Top — KONKLAVE + category */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20, flexShrink: 0 }}>
              <span style={{ fontFamily: "'Space Mono', monospace", fontSize: 13, fontWeight: 700, color: "#C8952A", letterSpacing: 4 }}>KONKLAVE</span>
              {selectedCategory && (
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <span style={{ fontSize: 14, color: "#C8952A" }}>{CATEGORIES.find(c => c.id === selectedCategory)?.icon}</span>
                  <span style={{ fontFamily: "'Space Mono', monospace", fontSize: 8, color: "#6A8AA8", letterSpacing: 2 }}>{CATEGORIES.find(c => c.id === selectedCategory)?.label?.toUpperCase()}</span>
                </div>
              )}
            </div>

            {/* Question with gold left border */}
            <div style={{ borderLeft: "3px solid #C8952A", paddingLeft: 14, marginBottom: 18, flexShrink: 0 }}>
              <p style={{ fontFamily: "'Libre Baskerville', Georgia, serif", fontSize: 15, color: "#C0D0DC", lineHeight: 1.7, margin: 0, fontStyle: "italic" }}>
                &ldquo;{question.slice(0, 100)}{question.length > 100 ? '...' : ''}&rdquo;
              </p>
            </div>

            {/* Gold divider */}
            <div style={{ height: 1, background: "linear-gradient(90deg, rgba(200,149,42,0.6), transparent)", marginBottom: 18, flexShrink: 0 }} />

            {/* Verdict summary */}
            <div style={{ flex: 1, overflow: "hidden", marginBottom: 18 }}>
              <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 8, color: "#C8952A", letterSpacing: 3, marginBottom: 10 }}>VEREDITO</div>
              <p style={{ fontFamily: "'Libre Baskerville', Georgia, serif", fontSize: 15, color: "#B8CCE0", lineHeight: 1.8, margin: 0 }}>
                {verdictSummary || (verdict.slice(0, 180) + (verdict.length > 180 ? '...' : ''))}
              </p>
            </div>

            {/* Member chips */}
            <div style={{ display: "flex", gap: 7, flexWrap: "wrap", marginBottom: 18, flexShrink: 0 }}>
              {activeMembers.slice(0, 8).map(m => (
                <div key={m.id} style={{
                  background: m.color + "1E",
                  border: `1px solid ${m.color}4D`,
                  borderRadius: 4,
                  padding: "6px 10px",
                  display: "flex", flexDirection: "column", alignItems: "center", gap: 2,
                }}>
                  <span style={{ fontFamily: "'Libre Baskerville', Georgia, serif", fontSize: 14, color: m.color }}>{m.symbol}</span>
                  <span style={{ fontFamily: "'Space Mono', monospace", fontSize: 8, color: "#6A8AA8" }}>{m.name.slice(0, 7)}</span>
                </div>
              ))}
            </div>

            {/* CTA */}
            <div style={{ flexShrink: 0, borderTop: "1px solid rgba(200,149,42,0.1)", paddingTop: 18 }}>
              <div style={{ fontFamily: "'Libre Baskerville', Georgia, serif", fontSize: 14, color: "#C8952A", fontStyle: "italic", marginBottom: 6 }}>
                Traga sua questão ao Konklave.
              </div>
              <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 10, color: "#6A8AA8", letterSpacing: 2, marginBottom: 12 }}>
                29 inteligências. Um veredito.
              </div>
              <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 11, color: "#C8952A", letterSpacing: 3 }}>
                konklave.app
              </div>
            </div>
          </div>

          {/* Feed 1:1 — 500×500 */}
          <div
            ref={shareCardFeedRef}
            style={{
              position: "fixed", left: -10001, top: 0,
              width: 500, height: 500,
              background: "#080C14",
              border: "1px solid rgba(200,149,42,0.15)",
              padding: "40px",
              boxSizing: "border-box",
              display: "flex", flexDirection: "column",
              fontFamily: "'Space Mono', monospace",
            }}
          >
            {/* Top bar */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12, flexShrink: 0 }}>
              <span style={{ fontFamily: "'Space Mono', monospace", fontSize: 10, fontWeight: 700, color: "#C8952A", letterSpacing: 4 }}>KONKLAVE</span>
              {selectedCategory && (
                <span style={{ fontFamily: "'Space Mono', monospace", fontSize: 10, color: "#6A8AA8", letterSpacing: 1 }}>{CATEGORIES.find(c => c.id === selectedCategory)?.label}</span>
              )}
            </div>

            {/* Gold divider */}
            <div style={{ height: 1, background: "linear-gradient(90deg, rgba(200,149,42,0.6), transparent)", marginBottom: 16, flexShrink: 0 }} />

            {/* Question */}
            <p style={{ fontFamily: "'Libre Baskerville', Georgia, serif", fontSize: 16, color: "#C0D0DC", lineHeight: 1.65, marginBottom: 14, fontStyle: "italic", flexShrink: 0 }}>
              &ldquo;{question.slice(0, 90)}{question.length > 90 ? '...' : ''}&rdquo;
            </p>

            {/* Thin gold divider */}
            <div style={{ height: 1, background: "linear-gradient(90deg, rgba(200,149,42,0.3), transparent)", marginBottom: 14, flexShrink: 0 }} />

            {/* Verdict summary */}
            <div style={{ flex: 1, overflow: "hidden", marginBottom: 14 }}>
              <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 8, color: "#C8952A", letterSpacing: 3, marginBottom: 8 }}>VEREDITO</div>
              <p style={{ fontFamily: "'Libre Baskerville', Georgia, serif", fontSize: 15, color: "#B8CCE0", lineHeight: 1.7, margin: 0 }}>
                {verdictSummary || (verdict.slice(0, 180) + (verdict.length > 180 ? '...' : ''))}
              </p>
            </div>

            {/* Member chips */}
            <div style={{ display: "flex", gap: 7, flexWrap: "wrap", marginBottom: 16, flexShrink: 0 }}>
              {activeMembers.slice(0, 6).map(m => (
                <div key={m.id} style={{
                  background: m.color + "1E",
                  border: `1px solid ${m.color}4D`,
                  borderRadius: 4,
                  padding: "6px 10px",
                  display: "flex", flexDirection: "column", alignItems: "center", gap: 2,
                }}>
                  <span style={{ fontFamily: "'Libre Baskerville', Georgia, serif", fontSize: 14, color: m.color }}>{m.symbol}</span>
                  <span style={{ fontFamily: "'Space Mono', monospace", fontSize: 8, color: "#6A8AA8" }}>{m.name.slice(0, 7)}</span>
                </div>
              ))}
            </div>

            {/* Bottom CTA */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexShrink: 0 }}>
              <div>
                <div style={{ fontFamily: "'Libre Baskerville', Georgia, serif", fontSize: 13, color: "#C8952A", fontStyle: "italic", marginBottom: 4 }}>
                  Traga sua questão.
                </div>
                <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 9, color: "#6A8AA8", letterSpacing: 1 }}>
                  29 inteligências. Um veredito.
                </div>
              </div>
              <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 11, color: "#C8952A", letterSpacing: 2 }}>
                konklave.app
              </div>
            </div>
          </div>
        </>
      )}
    </>
  )
}
