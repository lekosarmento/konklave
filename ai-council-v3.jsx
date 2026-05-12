import { useState, useEffect, useRef } from "react";

const fontLink = document.createElement("link");
fontLink.href = "https://fonts.googleapis.com/css2?family=Space+Mono:ital,wght@0,400;0,700;1,400&family=Libre+Baskerville:ital,wght@0,400;0,700;1,400&display=swap";
fontLink.rel = "stylesheet";
document.head.appendChild(fontLink);

// ─── MEMBERS ──────────────────────────────────────────────────
const MEMBERS = [
    {
        id: "claude",
        name: "CLAUDE",
        company: "Anthropic",
        role: "O Filósofo",
        color: "#C8952A",
        glow: "rgba(200,149,42,0.12)",
        border: "rgba(200,149,42,0.35)",
        avatar: "C",
        bias: "Ética · Consequências · Nuance",
    },
    {
        id: "gpt",
        name: "GPT-4o",
        company: "OpenAI",
        role: "O Executivo",
        color: "#3DAA6E",
        glow: "rgba(61,170,110,0.12)",
        border: "rgba(61,170,110,0.35)",
        avatar: "G",
        bias: "Dados · ROI · Plano de Ação",
    },
    {
        id: "gemini",
        name: "GEMINI",
        company: "Google",
        role: "O Pesquisador",
        color: "#4A8FD4",
        glow: "rgba(74,143,212,0.12)",
        border: "rgba(74,143,212,0.35)",
        avatar: "Gm",
        bias: "Contexto · Tendências · Amplitude",
    },
    {
        id: "grok",
        name: "GROK",
        company: "xAI",
        role: "Advogado do Diabo",
        color: "#A85CD4",
        glow: "rgba(168,92,212,0.12)",
        border: "rgba(168,92,212,0.35)",
        avatar: "Gr",
        bias: "Risco · Contradição · Verdade Nua",
    },
    {
        id: "perplexity",
        name: "PERPLEXITY",
        company: "Perplexity AI",
        role: "O Jornalista",
        color: "#2ABFBF",
        glow: "rgba(42,191,191,0.12)",
        border: "rgba(42,191,191,0.35)",
        avatar: "Px",
        bias: "Dados Reais · Fontes · Mercado Atual",
    },
];

// ─── DEMO DATA ─────────────────────────────────────────────────
const DEMO_TOPIC = "Devo lançar o AI Council como produto pago agora, com Claude simulando todas as vozes, ou esperar até ter as APIs reais do GPT, Gemini e Grok integradas?";

const DEMO_OPINIONS = {
    perplexity: `Pesquisei dados atuais do mercado de ferramentas de IA para decisão e encontrei padrões relevantes:

O mercado de "AI decision support" cresceu 340% entre 2023 e 2025, segundo relatório da CB Insights. Produtos como Consensus AI e Elicit — que também usam um único modelo para simular múltiplas perspectivas acadêmicas — captaram entre US$8M e US$25M em seed rounds antes de ter múltiplos modelos integrados.

Dados críticos: 78% dos produtos SaaS de IA que esperaram pela "stack perfeita" perderam sua janela de mercado para concorrentes que lançaram MVPs mais rápido (Gartner, 2025). O custo médio de integração de 4 APIs diferentes (OpenAI, Google, xAI, Anthropic) com fallback e rate limit management é de 3 a 5 meses de desenvolvimento para um time pequeno.

Referência direta: o Character.ai lançou com um único modelo antes de ter a infraestrutura atual. Hoje processa 20 bilhões de mensagens por mês. A velocidade de aprendizado do mercado superou qualquer vantagem técnica que teria vindo de esperar.`,

    claude: `A pergunta contém uma premissa que merece ser questionada antes de qualquer resposta: o que exatamente diferencia o AI Council de um único modelo com prompts bem escritos?

Se a resposta for "o processo estruturado de deliberação e o veredito fundamentado" — esse valor existe hoje, com Claude. Se a resposta for "a diversidade real de arquiteturas e dados de treinamento" — esse valor só existe com APIs reais.

Essa distinção importa porque define o que você pode prometer ao comprador. Lançar com transparência absoluta — "um modelo, múltiplas perspectivas estruturadas, em evolução para múltiplos modelos" — é eticamente sustentável e comercialmente honesto. Lançar como se fossem quatro IAs independentes quando não são é uma promessa que pode destruir confiança no momento em que o usuário perceber.

Minha posição: a velocidade de lançamento é valiosa, mas não a qualquer custo de integridade. Lance com o que é, não com o que será. Quem compra a promessa honesta é o cliente que vai ficar.`,

    gpt: `Análise estruturada com dados:

CENÁRIO A — Lança agora (Claude multi-persona):
- Tempo para mercado: 14 dias
- Custo operacional por sessão: ~US$0,03-0,08
- Pricing viável: R$97-197/mês early adopter
- Risco: percepção de "ChatGPT com prompts"
- Upside: 50 clientes em 90 dias = R$9.700-9.850/mês MRR

CENÁRIO B — Espera stack completa (4 APIs reais):
- Tempo para mercado: 3-5 meses adicionais
- Custo operacional por sessão: ~US$0,35-0,80 (4x APIs)
- Pricing mínimo viável: R$297-497/mês
- Risco: janela de mercado fechada, concorrentes estabelecidos
- Upside potencial maior, mas base de clientes zero ao lançar

DECISÃO: Cenário A com roadmap público para Cenário B. Os primeiros 50 clientes financiam a integração das APIs reais. Sem clientes, não há produto — há protótipo.`,

    gemini: `Contexto de mercado que os outros podem não ter considerado:

O ecossistema de "multi-LLM orchestration" está em consolidação acelerada. LangChain, CrewAI e AutoGen já oferecem frameworks open-source para o que o AI Council propõe tecnicamente. A diferença competitiva do AI Council não é a stack — é o design da experiência e o processo de deliberação.

Tendência global relevante: empresas de consultoria estratégica (McKinsey, BCG, Bain) estão desenvolvendo internamente ferramentas similares. O mercado corporativo está disposto a pagar entre US$500 e US$5.000/mês por ferramentas de suporte a decisão de alta qualidade. Mas elas exigem confiança institucional — e confiança se constrói com tempo no mercado, não com stack técnica.

Ponto cego de todos: o maior risco não é técnico, é de posicionamento. Se o AI Council se posiciona como "4 IAs debatendo", a stack importa. Se se posiciona como "processo estruturado de deliberação assistido por IA", a stack é detalhe de implementação.`,

    grok: `Vou nomear o elefante na sala que ninguém está dizendo diretamente:

Simular quatro vozes com um único modelo não é apenas uma limitação técnica — é uma limitação epistemológica. Claude treinado para simular "o que o Grok diria" não é o Grok. É Claude imaginando o Grok. Os pontos cegos de Claude continuam sendo pontos cegos, mesmo que ele finja ser outra IA.

Isso importa especialmente em decisões de alto risco. Se alguém toma uma decisão médica, jurídica ou financeira com base no "debate" de quatro vozes que são, na prática, uma só — há um problema de confiabilidade real que pode se tornar um problema legal.

O segundo ponto: a proposta de valor do AI Council é precisamente a diversidade de perspectivas. Sem diversidade real de modelos, o diferencial central não existe de forma plena. Você pode lançar — mas precisa entender que está vendendo uma versão inferior do produto até ter as APIs reais. Isso deve estar no preço, no contrato e na comunicação.`,
};

const DEMO_DEBATE = {
    perplexity: `Os dados que trouxe são claros, mas o Grok levanta um ponto que os números não capturam: risco reputacional.

Encontrei um padrão preocupante: 34% dos produtos de IA que lançaram com claims não totalmente precisos sobre suas capacidades enfrentaram backlash público significativo em 12 meses (MIT Technology Review, 2025). O dano reputacional médio custou 60% da base de clientes inicial.

Mas — e isso é crucial — todos eles sobreviveram e cresceram quando responderam com transparência. A lição não é "não lance", é "lance com total clareza sobre o que é". Os dados de mercado favorecem a velocidade. Os dados de reputação favorecem a honestidade. Não são excludentes.`,

    claude: `O GPT-4o apresentou uma análise financeira útil, mas ela não captura o custo assimétrico do erro. R$9.850 de MRR em 90 dias é um número atraente — mas um escândalo de "a IA estava fingindo ser 4 IAs" pode custar não apenas esses clientes, mas a credibilidade do produto inteiro.

Concordo com o Gemini sobre posicionamento. "Processo estruturado de deliberação" é uma proposta de valor genuína e diferenciada. O problema é que esse posicionamento exige que o marketing seja completamente diferente — sem mencionar "Claude vs GPT vs Gemini debatendo", apenas "múltiplas perspectivas estruturadas".

Incorporo o dado do Perplexity: Character.ai funcionou porque nunca fingiu que seus personagens eram humanos reais. A transparência foi o produto, não um disclaimer.`,

    gpt: `Preciso responder diretamente ao Grok: a limitação epistemológica que ele descreve é real, mas existe em graus — não é binária.

Um único analista humano que deliberadamente assume perspectivas diferentes antes de uma decisão é prática padrão em consultoria estratégica (chama-se "perspective-taking"). O valor não é zero porque vem de uma fonte — o valor está na estrutura do processo.

Minha posição se mantém com um ajuste: o pricing de R$97-197 deve refletir explicitamente que é versão beta com um modelo. Quando as 4 APIs chegarem, o preço sobe para R$397+. Os early adopters que pagaram menos e receberam honestidade viram defensores do produto. Essa é a matemática correta.`,

    gemini: `O debate está convergindo para um consenso, o que é incomum e significativo.

Quero adicionar uma dimensão que ainda não foi endereçada: o que acontece com os dados dos usuários durante o beta? Se médicos ou advogados usarem o produto com casos reais e a stack mudar de Claude para multi-modelo, há questões de privacidade e consistência que precisam de resposta antes do lançamento, não depois.

Recomendo adicionar ao plano: política de dados clara desde o dia 1, mesmo em beta. Isso não atrasa o lançamento — um documento bem escrito leva dois dias — e protege de um risco que pode ser mais sério que qualquer questão técnica ou de posicionamento.`,

    grok: `Ouvi os outros e preciso ajustar minha posição em um ponto: a dicotomia "lança agora vs espera" é falsa.

A pergunta real é: o que exatamente você está lançando e para quem? Se for para fundadores, executivos e profissionais que entendem como IA funciona — eles não se importam que seja um modelo simulando perspectivas. Eles querem o processo e o veredito.

Se for para médicos, advogados ou pessoas que tomarão decisões de alto risco acreditando que são 4 IAs independentes — aí o problema ético e legal é sério.

Minha recomendação ajustada: lance agora, mas para o segmento correto. O mercado de "builders e profissionais tech-savvy" é grande o suficiente para validar o modelo de negócio sem os riscos que descrevi.`,
};

const DEMO_REPLICA = {
    perplexity: `Encontrei um dado novo que muda o peso do argumento do Grok sobre segmentação: 67% dos early adopters de ferramentas de IA de suporte a decisão são exatamente o perfil "tech-savvy" que ele descreve — fundadores, product managers, consultores estratégicos. Apenas 12% são profissionais de saúde ou jurídico no primeiro ano de um produto novo.

Isso significa que o risco ético real do lançamento imediato é menor do que a percepção inicial sugere, porque o mercado natural de adoção gravita para quem entende o contexto. O Grok tem razão sobre o risco — mas o dado sugere que ele é menor no horizonte imediato.`,

    claude: `O ajuste do Grok foi o mais importante do debate. A variável não é "lançar ou esperar" — é "para quem lançar primeiro".

Mas quero aprofundar: mesmo entre profissionais tech-savvy, há um espectro. O fundador que usa o Council para decidir se pivota o produto entende o contexto. O mesmo fundador que usa o Council para decidir se demite 30 pessoas está em território de alto risco emocional e consequencial. O produto precisa de guardrails claros sobre o tipo de decisão para o qual foi projetado.

Proponha um disclaimer não como obrigação legal, mas como posicionamento: "O AI Council é uma ferramenta de expansão de perspectivas, não de substituição de julgamento humano em decisões irreversíveis."`,

    gpt: `A segmentação que o Grok propôs e os dados que o Perplexity trouxe me permitem refinar o plano:

FASE 1 (meses 1-3): ICP restrito — fundadores, PMs, consultores estratégicos. Pricing R$147/mês. Meta: 30 clientes. Objetivo: validar processo e coletar casos de uso reais.

FASE 2 (meses 4-6): Expansão para profissionais liberais tech-savvy com onboarding específico. Pricing R$247/mês. Meta: 100 clientes. Integrar primeira API real (provavelmente GPT-4o via OpenRouter).

FASE 3 (mês 7+): Stack completa. Pricing R$397+. Mercado corporativo.

Esse roadmap usa o aprendizado do beta para financiar e justificar cada expansão. É mais conservador do que meu plano original — e mais defensável.`,

    gemini: `O ponto do Claude sobre guardrails para tipos de decisão é o mais sofisticado do debate até agora. Quero expandir:

Empresas como Palantir e IBM Watson aprenderam — a custo alto — que ferramentas de IA sem delimitação clara de escopo de uso enfrentam responsabilidade quando usadas fora do contexto previsto. O AI Council precisa de uma taxonomia de decisões: quais são adequadas para suporte de IA, quais não são.

Sugestão concreta: no onboarding, o usuário classifica o tipo de decisão (estratégica, operacional, pessoal de baixo risco, pessoal de alto risco). Para as últimas duas categorias com alto impacto, o sistema exibe um aviso antes do debate começar. Isso não atrasa o lançamento — é uma feature, não um obstáculo.`,

    grok: `Aceitei a crítica dos outros e ajustei minha posição. Vou ser preciso sobre o que ainda defendo:

O risco que descrevi não desaparece com segmentação — ele diminui. E "diminui" em contexto de decisões de alto risco ainda pode ser significativo. O disclamer que o Claude propõe é necessário mas não suficiente — disclaimers raramente protegem quando há dano real.

O que adiciono: considere construir no produto um mecanismo de "saída" — quando a questão submetida ao conselho toca em domínios de alto risco (saúde, direito, finanças pessoais significativas), o sistema reconhece isso e reformula o output como "perspectivas para considerar com um profissional" em vez de "veredito". Isso protege o usuário e o produto.`,
};

const DEMO_TREPLICA = {
    perplexity: `Dado final relevante: produtos que implementaram "saída de domínio de risco" como o Grok descreve tiveram NPS 23 pontos maior do que similares sem esse recurso (UX Research Collective, 2025). Não é só proteção — é diferencial de produto.

Resumo do que os dados apoiam: lance agora, segmente bem, seja transparente, construa os guardrails de risco como feature desde a v1.`,

    claude: `O debate chegou a uma posição coletiva que é mais sofisticada do que qualquer posição inicial de qualquer membro, inclusive a minha.

O mecanismo de "saída" que o Grok propõe e que os dados do Perplexity validam não é um disclaimer passivo — é um design ativo de responsabilidade. Isso transforma uma limitação potencial em uma decisão de produto consciente. É exatamente o tipo de pensamento que separa produtos de IA bem construídos dos que causam dano.

Minha posição final: lance em 14 dias, para o ICP correto, com transparência total, com o mecanismo de saída de risco como feature central. Não como versão inferior do produto — como versão 1.0 honesta de um produto que respeita seu usuário.`,

    gpt: `O plano de três fases que refinei na réplica está validado pelo debate completo. Incorporo o mecanismo de saída de risco como feature da Fase 1 — não da Fase 3.

Número final: se executar o plano de três fases com as proteções discutidas, a projeção conservadora é R$15.000-25.000 MRR ao final do mês 6, com base de clientes qualificada o suficiente para justificar integração de APIs reais sem capital externo.

A decisão é clara: lance agora. O debate inteiro convergiu para isso, com mais nuance e proteções do que a pergunta original sugeria.`,

    gemini: `A taxonomia de decisões que propus e o mecanismo de saída do Grok são complementares e devem ser construídos juntos. Sugiro que o Leko use isso como diferencial de marketing: "O único sistema de suporte a decisão por IA que sabe quando não deve ser usado."

Isso transforma a limitação em posicionamento. Nenhum concorrente está comunicando responsabilidade ativa. É um espaço vazio no mercado.`,

    grok: `Minha posição final, sem concessões desnecessárias mas com as atualizações que o debate produziu:

Lance. Para o público certo. Com transparência completa sobre o que é tecnicamente. Com o mecanismo de saída de risco como feature central, não como disclaimer escondido. Com roadmap público para as APIs reais.

O que não mudo: se qualquer uma dessas condições for ignorada — público errado, transparência parcial, sem proteções de risco — o produto pode causar dano real. O debate foi valioso precisamente porque forçou essas condições a serem articuladas. Agora o Leko sabe o que está decidindo.`,
};

const DEMO_VERDICT = `**VEREDICTO: Sim — lance em 14 dias. Mas não do jeito que a pergunta original sugeria.**

**O QUE O DEBATE PRODUZIU**
O conselho foi unânime no resultado mas chegou lá por caminhos diferentes, o que produziu um plano muito mais sólido do que qualquer posição inicial. Cinco membros, cinco perspectivas, uma convergência com nuance real.

**CONDIÇÕES INEGOCIÁVEIS PARA O LANÇAMENTO**

1. Transparência técnica total: "Um modelo com múltiplas perspectivas estruturadas" — nunca "4 IAs debatendo". Quem compra a verdade fica; quem compra a ilusão vai embora quando descobrir.

2. ICP restrito na Fase 1: fundadores, PMs, consultores estratégicos. Não médicos, não advogados, não usuários que tomarão decisões irreversíveis de alto risco.

3. Mecanismo de saída de risco como feature v1: quando a questão toca saúde, direito ou finanças pessoais significativas, o sistema reconhece e reformula o output como "perspectivas para considerar com um profissional". Isso é proteção do usuário e diferencial de produto.

4. Pricing: R$147/mês para os primeiros 30 clientes. Sobe para R$247 na Fase 2 com primeira API real integrada.

**RISCO CRÍTICO REMANESCENTE**
Se o mecanismo de saída de risco não for implementado desde a v1, o produto está exposto a responsabilidade em casos de decisões de alto impacto tomadas com base no veredito. Isso não é hipotético — é o padrão histórico de ferramentas de IA de suporte a decisão.

**PRÓXIMO PASSO — ESTA SEMANA**
Lance a landing page com waitlist. Defina as 30 vagas de early adopter. Construa o mecanismo de saída de risco antes de abrir o acesso. Com esses três itens, o produto está pronto para o mercado com integridade.`;

// ─── API CALL ──────────────────────────────────────────────────
async function callClaude(system, userContent) {
    const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            model: "claude-sonnet-4-20250514",
            max_tokens: 1000,
            system,
            messages: [{ role: "user", content: userContent }],
        }),
    });
    if (!res.ok) throw new Error(`API ${res.status}`);
    const data = await res.json();
    return data.content?.[0]?.text || "";
}

// ─── TYPEWRITER STATE HOOK ────────────────────────────────────
function useStreamText(speed = 6) {
    const [texts, setTexts] = useState({});
    const timers = useRef({});

    const stream = useCallback((id, fullText) => {
        if (timers.current[id]) clearInterval(timers.current[id]);
        let i = 0;
        setTexts(p => ({ ...p, [id]: "" }));
        return new Promise(resolve => {
            timers.current[id] = setInterval(() => {
                i += 3;
                setTexts(p => ({ ...p, [id]: fullText.slice(0, i) }));
                if (i >= fullText.length) {
                    clearInterval(timers.current[id]);
                    setTexts(p => ({ ...p, [id]: fullText }));
                    resolve();
                }
            }, speed);
        });
    }, []);

    const streamString = useCallback((setter, fullText, spd = speed) => {
        let i = 0;
        setter("");
        return new Promise(resolve => {
            const iv = setInterval(() => {
                i += 3;
                setter(fullText.slice(0, i));
                if (i >= fullText.length) { clearInterval(iv); setter(fullText); resolve(); }
            }, spd);
        });
    }, []);

    return { texts, stream, streamString };
}

function useCallback(fn, deps) {
    const ref = useRef(fn);
    useEffect(() => { ref.current = fn; }, deps);
    return useRef((...args) => ref.current(...args)).current;
}

// ─── PHASE LABEL ──────────────────────────────────────────────
const PHASE_LABELS = {
    idle: "",
    opinions: "FASE 1 · OPINIÕES INDEPENDENTES",
    debate: "FASE 2 · DEBATE",
    ask_replica: "AGUARDANDO DECISÃO DO USUÁRIO",
    replica: "FASE 3 · RÉPLICA",
    ask_treplica: "AGUARDANDO DECISÃO DO USUÁRIO",
    treplica: "FASE 4 · TRÉPLICA",
    verdict: "FASE FINAL · VEREDITO",
    done: "SESSÃO ENCERRADA",
};

// ─── MEMBER CARD ──────────────────────────────────────────────
function MemberCard({ member, status, text, compact = false }) {
    const isActive = status === "active";
    const isDone = status === "done";
    const isPending = status === "pending";

    return (
        <div style={{
            background: isPending ? "#080a0f" : "#0c0f18",
            border: `1px solid ${isDone ? member.border : isPending ? "#0a0e16" : member.border.replace("0.35", "0.18")}`,
            borderTop: `2px solid ${isDone ? member.color : isPending ? "#111825" : member.color + "66"}`,
            borderRadius: 2,
            padding: compact ? "14px 16px" : "20px",
            opacity: isPending ? 0.25 : 1,
            transition: "all 0.4s ease",
            position: "relative", overflow: "hidden",
        }}>
            {(isActive || isDone) && (
                <div style={{
                    position: "absolute", inset: 0, pointerEvents: "none",
                    background: `radial-gradient(ellipse at top left, ${member.glow}, transparent 65%)`,
                }} />
            )}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <div style={{
                        width: compact ? 28 : 34, height: compact ? 28 : 34,
                        borderRadius: 2,
                        background: isDone || isActive ? member.color + "15" : "#0a0e18",
                        border: `1px solid ${isDone || isActive ? member.color + "44" : "#111825"}`,
                        display: "flex", alignItems: "center", justifyContent: "center",
                        fontFamily: "'Space Mono', monospace",
                        fontSize: compact ? 9 : 11, fontWeight: 700,
                        color: isActive || isDone ? member.color : "#222",
                    }}>{member.avatar}</div>
                    <div>
                        <div style={{ fontFamily: "'Space Mono', monospace", fontSize: compact ? 10 : 12, fontWeight: 700, color: isActive || isDone ? member.color : "#222", letterSpacing: 2 }}>{member.name}</div>
                        <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 8, color: "#2a3545", letterSpacing: 1, marginTop: 1 }}>{member.role}</div>
                    </div>
                </div>
                {isActive && (
                    <div style={{ display: "flex", gap: 3 }}>
                        {[0, 1, 2].map(i => <span key={i} style={{ width: 4, height: 4, borderRadius: "50%", background: member.color, display: "inline-block", animation: `pulse 1.2s ease-in-out ${i * 0.2}s infinite` }} />)}
                    </div>
                )}
                {isDone && <span style={{ fontFamily: "'Space Mono', monospace", fontSize: 8, color: "#1e2a3a", letterSpacing: 1 }}>✓</span>}
            </div>

            <div style={{ height: 1, background: `linear-gradient(90deg, ${isActive || isDone ? member.color + "22" : "#0a0e16"}, transparent)`, marginBottom: 12 }} />

            <div style={{ fontFamily: "'Libre Baskerville', Georgia, serif", fontSize: compact ? 12 : 13, lineHeight: 1.9, color: isDone ? "#8fa0b2" : isActive ? "#6a7a8a" : "#1a2030", minHeight: compact ? 40 : 80, whiteSpace: "pre-wrap" }}>
                {(isActive || isDone) && text}
                {isActive && <span style={{ animation: "blink .6s step-end infinite", color: member.color }}>█</span>}
                {isPending && <span style={{ color: "#111825", fontFamily: "'Space Mono', monospace", fontSize: 10 }}>AGUARDANDO...</span>}
            </div>
        </div>
    );
}

// ─── DECISION GATE ────────────────────────────────────────────
function DecisionGate({ phase, onYes, onNo }) {
    const isReplica = phase === "ask_replica";
    const label = isReplica ? "RÉPLICA" : "TRÉPLICA";
    const desc = isReplica
        ? "Cada membro reagirá ao debate dos outros, aprofundando ou contestando os pontos levantados."
        : "Rodada final de argumentação. Após a tréplica, o veredito será emitido obrigatoriamente.";

    return (
        <div style={{
            background: "#0a0c14",
            border: "1px solid rgba(200,149,42,0.2)",
            borderLeft: "3px solid #C8952A",
            borderRadius: 2,
            padding: "28px 32px",
            margin: "32px 0",
        }}>
            <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 9, color: "#C8952A", letterSpacing: 3, marginBottom: 12 }}>
                ▸ DECISÃO DO USUÁRIO
            </div>
            <div style={{ fontFamily: "'Libre Baskerville', Georgia, serif", fontSize: 15, color: "#a0b4c0", marginBottom: 8, lineHeight: 1.6 }}>
                O conselho concluiu esta fase. Deseja conceder <strong style={{ color: "#C8952A" }}>{label}</strong> aos membros?
            </div>
            <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 11, color: "#3a4a5a", marginBottom: 24, lineHeight: 1.6 }}>
                {desc}
                {!isReplica && " Após a tréplica, o veredito é emitido independentemente de nova solicitação."}
            </div>
            <div style={{ display: "flex", gap: 12 }}>
                <button onClick={onYes} style={{
                    padding: "12px 28px", background: "#C8952A", color: "#070910",
                    border: "none", borderRadius: 2, fontFamily: "'Space Mono', monospace",
                    fontSize: 11, fontWeight: 700, letterSpacing: 2, cursor: "pointer",
                    boxShadow: "0 0 24px rgba(200,149,42,0.2)",
                }}>
                    SIM — CONCEDER {label} →
                </button>
                <button onClick={onNo} style={{
                    padding: "12px 28px", background: "transparent", color: "#445",
                    border: "1px solid #1a2030", borderRadius: 2, fontFamily: "'Space Mono', monospace",
                    fontSize: 11, letterSpacing: 2, cursor: "pointer",
                }}>
                    NÃO — IR AO VEREDITO
                </button>
            </div>
        </div>
    );
}

// ─── VERDICT PANEL ────────────────────────────────────────────
function VerdictPanel({ text, loading }) {
    const lines = text ? text.split('\n') : [];

    return (
        <div style={{
            background: "#08090f",
            border: "1px solid rgba(200,149,42,0.2)",
            borderTop: "2px solid #C8952A",
            borderRadius: 2, padding: "32px",
            position: "relative", overflow: "hidden",
        }}>
            <div style={{ position: "absolute", inset: 0, pointerEvents: "none", background: "radial-gradient(ellipse at top, rgba(200,149,42,0.04), transparent 55%)" }} />
            <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 24 }}>
                <span style={{ fontSize: 20, color: "#C8952A" }}>⚖</span>
                <div>
                    <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 11, fontWeight: 700, color: "#C8952A", letterSpacing: 3 }}>VEREDITO DO CONSELHO</div>
                    <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 8, color: "#2a3545", letterSpacing: 2, marginTop: 3 }}>ANÁLISE FINAL · DELIBERAÇÃO ENCERRADA</div>
                </div>
                {loading && <div style={{ marginLeft: "auto", display: "flex", gap: 3 }}>{[0, 1, 2].map(i => <span key={i} style={{ width: 5, height: 5, borderRadius: "50%", background: "#C8952A", display: "inline-block", animation: `pulse 1.2s ease-in-out ${i * 0.2}s infinite` }} />)}</div>}
            </div>
            <div style={{ height: 1, background: "linear-gradient(90deg, rgba(200,149,42,0.25), transparent)", marginBottom: 24 }} />
            <div style={{ fontFamily: "'Libre Baskerville', Georgia, serif", fontSize: 14, lineHeight: 1.9, color: "#8090a0" }}>
                {loading && !text && <span style={{ fontFamily: "'Space Mono', monospace", fontSize: 11, color: "#1e2a3a" }}>Sintetizando deliberação completa...</span>}
                {lines.map((line, i) => {
                    if (line.startsWith('**') && line.endsWith('**')) {
                        return <div key={i} style={{ fontFamily: "'Space Mono', monospace", fontSize: 10, color: "#C8952A", letterSpacing: 2, marginTop: i > 0 ? 20 : 0, marginBottom: 8 }}>{line.replace(/\*\*/g, '').toUpperCase()}</div>;
                    }
                    if (/^\d\./.test(line)) {
                        return <div key={i} style={{ paddingLeft: 16, marginBottom: 8, borderLeft: "2px solid rgba(200,149,42,0.25)", marginLeft: 4 }}>{line}</div>;
                    }
                    if (line === '') return <div key={i} style={{ height: 10 }} />;
                    return <div key={i} style={{ marginBottom: 6 }}>{line}</div>;
                })}
            </div>
        </div>
    );
}

// ─── SECTION HEADER ───────────────────────────────────────────
function SectionHeader({ label, active, done }) {
    return (
        <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 24, opacity: active || done ? 1 : 0.15, transition: "opacity 0.4s" }}>
            <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 10, fontWeight: 700, color: active ? "#C8952A" : done ? "#334" : "#111", letterSpacing: 3, whiteSpace: "nowrap" }}>{label}</div>
            <div style={{ flex: 1, height: 1, background: `linear-gradient(90deg, ${active ? "rgba(200,149,42,0.25)" : "#0f1520"}, transparent)` }} />
        </div>
    );
}

// ─── MAIN ─────────────────────────────────────────────────────
export default function AICouncil() {
    const [phase, setPhase] = useState("idle");
    const [question, setQuestion] = useState(DEMO_TOPIC);
    const [useDemo, setUseDemo] = useState(true);

    // texts by round
    const [opTexts, setOpTexts] = useState({});
    const [opStatus, setOpStatus] = useState({});
    const [debTexts, setDebTexts] = useState({});
    const [debStatus, setDebStatus] = useState({});
    const [repTexts, setRepTexts] = useState({});
    const [repStatus, setRepStatus] = useState({});
    const [treTexts, setTreTexts] = useState({});
    const [treStatus, setTreStatus] = useState({});
    const [verdict, setVerdict] = useState("");
    const [verdictLoading, setVerdictLoading] = useState(false);
    const [error, setError] = useState("");
    const [elapsed, setElapsed] = useState(0);
    const [sessionId] = useState(() => Math.random().toString(36).slice(2, 8).toUpperCase());
    const timerRef = useRef(null);
    const bottomRef = useRef(null);
    const resolveGate = useRef(null);

    const showOp = !["idle"].includes(phase);
    const showDeb = ["debate", "ask_replica", "replica", "ask_treplica", "treplica", "verdict", "done"].includes(phase);
    const showRep = ["replica", "ask_treplica", "treplica", "verdict", "done"].includes(phase);
    const showTre = ["treplica", "verdict", "done"].includes(phase);
    const showVerdict = ["verdict", "done"].includes(phase);
    const showAskRep = phase === "ask_replica";
    const showAskTre = phase === "ask_treplica";

    useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }); },
        [opTexts, debTexts, repTexts, treTexts, verdict, verdictLoading, phase]);

    useEffect(() => {
        if (!["idle", "done"].includes(phase)) {
            timerRef.current = setInterval(() => setElapsed(e => e + 1), 1000);
        } else clearInterval(timerRef.current);
        return () => clearInterval(timerRef.current);
    }, [phase]);

    const sleep = ms => new Promise(r => setTimeout(r, ms));

    const typeInto = (setter, id, text, spd = 6) => new Promise(resolve => {
        let i = 0;
        setter(p => ({ ...p, [id]: "" }));
        const iv = setInterval(() => {
            i += 3;
            setter(p => ({ ...p, [id]: text.slice(0, i) }));
            if (i >= text.length) { clearInterval(iv); setter(p => ({ ...p, [id]: text })); resolve(); }
        }, spd);
    });

    const typeVerdict = (text) => new Promise(resolve => {
        let i = 0;
        setVerdict("");
        const iv = setInterval(() => {
            i += 3;
            setVerdict(text.slice(0, i));
            if (i >= text.length) { clearInterval(iv); setVerdict(text); resolve(); }
        }, 5);
    });

    const waitGate = () => new Promise(resolve => { resolveGate.current = resolve; });

    const initStatuses = (setter) => {
        const s = {}; MEMBERS.forEach(m => s[m.id] = "pending"); setter(s);
    };

    const runRound = async (dataMap, setTexts, setStatus, spd = 6) => {
        initStatuses(setStatus);
        for (const m of MEMBERS) {
            setStatus(p => ({ ...p, [m.id]: "active" }));
            await typeInto(setTexts, m.id, dataMap[m.id], spd);
            setStatus(p => ({ ...p, [m.id]: "done" }));
            await sleep(200);
        }
    };

    const handleGate = (choice) => { resolveGate.current?.(choice); };

    const runDemo = async () => {
        setPhase("opinions"); setElapsed(0); setError("");
        setOpTexts({}); setOpStatus({});
        setDebTexts({}); setDebStatus({});
        setRepTexts({}); setRepStatus({});
        setTreTexts({}); setTreStatus({});
        setVerdict("");

        // Phase 1 — opinions (slower for depth)
        await runRound(DEMO_OPINIONS, setOpTexts, setOpStatus, 4);
        await sleep(500);

        // Phase 2 — debate
        setPhase("debate");
        await runRound(DEMO_DEBATE, setDebTexts, setDebStatus, 4);
        await sleep(500);

        // Gate 1 — replica?
        setPhase("ask_replica");
        const wantsReplica = await waitGate();

        if (wantsReplica) {
            setPhase("replica");
            await runRound(DEMO_REPLICA, setRepTexts, setRepStatus, 4);
            await sleep(500);

            // Gate 2 — treplica?
            setPhase("ask_treplica");
            const wantsTreplica = await waitGate();

            if (wantsTreplica) {
                setPhase("treplica");
                await runRound(DEMO_TREPLICA, setTreTexts, setTreStatus, 4);
                await sleep(500);
            }
        }

        // Verdict — mandatory
        setPhase("verdict");
        setVerdictLoading(true);
        await sleep(1000);
        setVerdictLoading(false);
        await typeVerdict(DEMO_VERDICT);
        setPhase("done");
    };

    const buildPersonaSystem = (member) => `Você é ${member.name} (${member.role}) no AI Council.
Seu viés natural: ${member.bias}.
Seja profundo, específico e substantivo. Traga exemplos, dados ou raciocínios concretos.
Tom característico do seu papel. Máx 220 palavras. Português brasileiro.`;

    const runLive = async () => {
        setPhase("opinions"); setElapsed(0); setError("");
        setOpTexts({}); setOpStatus({});
        setDebTexts({}); setDebStatus({});
        setRepTexts({}); setRepStatus({});
        setTreTexts({}); setTreStatus({});
        setVerdict("");

        const stored = { opinions: {}, debate: {}, replica: {}, treplica: {} };

        try {
            // Phase 1
            initStatuses(setOpStatus);
            for (const m of MEMBERS) {
                setOpStatus(p => ({ ...p, [m.id]: "active" }));
                const prompt = m.id === "perplexity"
                    ? `Pesquise dados reais e tendências de mercado relevantes para esta questão:\n${question}\n\nTraga números, referências e dados concretos como O Jornalista do conselho.`
                    : `Analise esta questão como ${m.role}:\n${question}`;
                const text = await callClaude(buildPersonaSystem(m), prompt);
                stored.opinions[m.id] = text;
                await typeInto(setOpTexts, m.id, text);
                setOpStatus(p => ({ ...p, [m.id]: "done" }));
                await sleep(150);
            }

            // Phase 2
            setPhase("debate");
            initStatuses(setDebStatus);
            for (const m of MEMBERS) {
                setDebStatus(p => ({ ...p, [m.id]: "active" }));
                const others = MEMBERS.filter(x => x.id !== m.id)
                    .map(x => `${x.name} (${x.role}): ${stored.opinions[x.id]}`).join("\n\n");
                const text = await callClaude(buildPersonaSystem(m),
                    `Sua análise inicial:\n"${stored.opinions[m.id]}"\n\nO que os outros membros disseram:\n${others}\n\nReaja ao debate com profundidade. Concorde, discorde ou aprofunde. Seja específico sobre os argumentos dos outros. Máx 200 palavras.`);
                stored.debate[m.id] = text;
                await typeInto(setDebTexts, m.id, text);
                setDebStatus(p => ({ ...p, [m.id]: "done" }));
                await sleep(150);
            }

            // Gate 1
            setPhase("ask_replica");
            const wantsReplica = await waitGate();

            if (wantsReplica) {
                setPhase("replica");
                initStatuses(setRepStatus);
                for (const m of MEMBERS) {
                    setRepStatus(p => ({ ...p, [m.id]: "active" }));
                    const allDebate = MEMBERS.filter(x => x.id !== m.id)
                        .map(x => `${x.name}: ${stored.debate[x.id]}`).join("\n\n");
                    const text = await callClaude(buildPersonaSystem(m),
                        `Debate completo até agora:\nSua opinião: ${stored.opinions[m.id]}\nSua reação: ${stored.debate[m.id]}\n\nRéplica dos outros:\n${allDebate}\n\nRéplique com precisão cirúrgica. Aprofunde seu argumento mais forte ou conteste o ponto mais fraco do debate. Máx 180 palavras.`);
                    stored.replica[m.id] = text;
                    await typeInto(setRepTexts, m.id, text);
                    setRepStatus(p => ({ ...p, [m.id]: "done" }));
                    await sleep(150);
                }

                // Gate 2
                setPhase("ask_treplica");
                const wantsTreplica = await waitGate();

                if (wantsTreplica) {
                    setPhase("treplica");
                    initStatuses(setTreStatus);
                    for (const m of MEMBERS) {
                        setTreStatus(p => ({ ...p, [m.id]: "active" }));
                        const allReplica = MEMBERS.filter(x => x.id !== m.id)
                            .map(x => `${x.name}: ${stored.replica[x.id]}`).join("\n\n");
                        const text = await callClaude(buildPersonaSystem(m),
                            `Rodada final. Tréplica:\nSua posição acumulada: ${stored.debate[m.id]}\n\nRéplicas dos outros:\n${allReplica}\n\nArgumento final. Seja definitivo. O que você defende sem ceder? Máx 160 palavras.`);
                        stored.treplica[m.id] = text;
                        await typeInto(setTreTexts, m.id, text);
                        setTreStatus(p => ({ ...p, [m.id]: "done" }));
                        await sleep(150);
                    }
                }
            }

            // Verdict — mandatory
            setPhase("verdict");
            setVerdictLoading(true);
            const allContent = `QUESTÃO: ${question}\n\n` +
                `OPINIÕES:\n${MEMBERS.map(m => `${m.name}: ${stored.opinions[m.id] || ''}`).join('\n\n')}\n\n` +
                `DEBATE:\n${MEMBERS.map(m => `${m.name}: ${stored.debate[m.id] || ''}`).join('\n\n')}\n\n` +
                (Object.keys(stored.replica).length ? `RÉPLICA:\n${MEMBERS.map(m => `${m.name}: ${stored.replica[m.id] || ''}`).join('\n\n')}\n\n` : '') +
                (Object.keys(stored.treplica).length ? `TRÉPLICA:\n${MEMBERS.map(m => `${m.name}: ${stored.treplica[m.id] || ''}`).join('\n\n')}\n\n` : '');

            const v = await callClaude(
                "Você é o Presidente do Conselho. Sintetize toda a deliberação. Seja direto, honesto e acionável. Português.",
                `${allContent}\nEntregue o veredito estruturado com: VEREDICTO (direto), CONSENSO DO CONSELHO, DIVERGÊNCIAS IMPORTANTES, RISCO CRÍTICO, PRÓXIMO PASSO CONCRETO. Máx 320 palavras.`
            );
            setVerdictLoading(false);
            await typeVerdict(v);
            setPhase("done");
        } catch (e) {
            setError("Erro: " + e.message);
            setPhase("done");
        }
    };

    const reset = () => {
        setPhase("idle"); setElapsed(0); setError("");
        setOpTexts({}); setOpStatus({});
        setDebTexts({}); setDebStatus({});
        setRepTexts({}); setRepStatus({});
        setTreTexts({}); setTreStatus({});
        setVerdict(""); setVerdictLoading(false);
    };

    const fmt = s => `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;

    return (
        <div style={{ minHeight: "100vh", background: "#070910", fontFamily: "'Space Mono', monospace", color: "#8090a0" }}>
            <div style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0, backgroundImage: "linear-gradient(rgba(200,149,42,0.012) 1px,transparent 1px),linear-gradient(90deg,rgba(200,149,42,0.012) 1px,transparent 1px)", backgroundSize: "52px 52px" }} />

            {/* HEADER */}
            <div style={{ position: "sticky", top: 0, zIndex: 20, background: "rgba(7,9,16,0.97)", backdropFilter: "blur(12px)", borderBottom: "1px solid #0c1018", padding: "0 44px", height: 54, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
                        <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#C8952A", boxShadow: !["idle", "done"].includes(phase) ? "0 0 14px #C8952A" : "none", animation: !["idle", "done"].includes(phase) ? "glow 2s ease-in-out infinite" : "none" }} />
                        <span style={{ fontSize: 13, fontWeight: 700, color: "#ccd8e0", letterSpacing: 3 }}>AI COUNCIL</span>
                    </div>
                    <div style={{ width: 1, height: 18, background: "#0f1520" }} />
                    <span style={{ fontSize: 8, color: "#1a2535", letterSpacing: 2 }}>{PHASE_LABELS[phase] || ""}</span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
                    <div style={{ display: "flex", gap: 5 }}>
                        {MEMBERS.map(m => (
                            <div key={m.id} title={m.name} style={{ width: 22, height: 22, borderRadius: 2, background: opStatus[m.id] === "done" ? m.color + "15" : "#090c12", border: `1px solid ${opStatus[m.id] === "active" ? m.color + "55" : "#0d1220"}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 7, fontWeight: 700, color: opStatus[m.id] ? m.color : "#1a2030", transition: "all 0.3s" }}>{m.avatar}</div>
                        ))}
                    </div>
                    {elapsed > 0 && <span style={{ fontSize: 9, color: "#1e2a3a", fontVariantNumeric: "tabular-nums" }}>{fmt(elapsed)}</span>}
                    <span style={{ fontSize: 8, color: "#111825", letterSpacing: 1 }}>#{sessionId}</span>
                </div>
            </div>

            {/* MAIN */}
            <div style={{ position: "relative", zIndex: 1, maxWidth: 1020, margin: "0 auto", padding: "44px 40px 140px" }}>

                {/* QUESTION */}
                <div style={{ background: "#090b12", border: "1px solid #0e1520", borderLeft: "3px solid #C8952A", borderRadius: 2, padding: "26px 30px", marginBottom: 40 }}>
                    <div style={{ fontSize: 8, color: "#1e2a3a", letterSpacing: 3, marginBottom: 14 }}>▸ QUESTÃO AO CONSELHO</div>
                    {phase === "idle" ? (
                        <>
                            <textarea value={question} onChange={e => setQuestion(e.target.value)} style={{ width: "100%", background: "transparent", border: "none", outline: "none", resize: "vertical", fontFamily: "'Libre Baskerville', Georgia, serif", fontSize: 15, lineHeight: 1.8, color: "#90a4b0", minHeight: 68, caretColor: "#C8952A" }} />
                            <div style={{ marginTop: 18, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                                <label style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer" }} onClick={() => setUseDemo(!useDemo)}>
                                    <div style={{ width: 36, height: 20, borderRadius: 10, background: useDemo ? "rgba(200,149,42,0.15)" : "#0c1018", border: `1px solid ${useDemo ? "rgba(200,149,42,0.5)" : "#1a2030"}`, position: "relative", transition: "all 0.2s" }}>
                                        <div style={{ position: "absolute", top: 3, left: useDemo ? 17 : 3, width: 12, height: 12, borderRadius: "50%", background: useDemo ? "#C8952A" : "#1e2a3a", transition: "left 0.2s" }} />
                                    </div>
                                    <span style={{ fontSize: 9, color: "#2a3545", letterSpacing: 1 }}>{useDemo ? "MODO DEMO" : "MODO LIVE (API)"}</span>
                                </label>
                                <button onClick={() => useDemo ? runDemo() : runLive()} disabled={!question.trim()} style={{ padding: "12px 30px", background: "#C8952A", color: "#070910", border: "none", borderRadius: 2, fontFamily: "'Space Mono', monospace", fontSize: 11, fontWeight: 700, letterSpacing: 2, cursor: "pointer", boxShadow: "0 0 28px rgba(200,149,42,0.2)", opacity: !question.trim() ? 0.4 : 1 }}>
                                    CONVOCAR O CONSELHO →
                                </button>
                            </div>
                        </>
                    ) : (
                        <p style={{ fontFamily: "'Libre Baskerville', Georgia, serif", fontSize: 15, lineHeight: 1.8, color: "#5a6a78", margin: 0, fontStyle: "italic" }}>"{question}"</p>
                    )}
                </div>

                {error && <div style={{ padding: "12px 18px", marginBottom: 20, background: "#110808", border: "1px solid #3a1010", fontSize: 10, color: "#c06060", borderRadius: 2 }}>{error}</div>}

                {/* PHASE 1 — OPINIONS */}
                {showOp && (
                    <div style={{ marginBottom: 52 }}>
                        <SectionHeader label="— FASE 1 · OPINIÕES INDEPENDENTES" active={phase === "opinions"} done={phase !== "opinions" && showOp} />
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                            {MEMBERS.map(m => <MemberCard key={m.id} member={m} status={opStatus[m.id] || "pending"} text={opTexts[m.id] || ""} />)}
                        </div>
                    </div>
                )}

                {/* PHASE 2 — DEBATE */}
                {showDeb && (
                    <div style={{ marginBottom: showAskRep ? 0 : 52 }}>
                        <SectionHeader label="— FASE 2 · DEBATE" active={phase === "debate"} done={!["opinions", "debate"].includes(phase)} />
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                            {MEMBERS.map(m => <MemberCard key={m.id} member={m} status={debStatus[m.id] || "pending"} text={debTexts[m.id] || ""} />)}
                        </div>
                    </div>
                )}

                {/* GATE 1 */}
                {showAskRep && <DecisionGate phase="ask_replica" onYes={() => handleGate(true)} onNo={() => handleGate(false)} />}

                {/* PHASE 3 — REPLICA */}
                {showRep && (
                    <div style={{ marginBottom: showAskTre ? 0 : 52 }}>
                        <SectionHeader label="— FASE 3 · RÉPLICA" active={phase === "replica"} done={!["opinions", "debate", "ask_replica", "replica"].includes(phase)} />
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                            {MEMBERS.map(m => <MemberCard key={m.id} member={m} status={repStatus[m.id] || "pending"} text={repTexts[m.id] || ""} />)}
                        </div>
                    </div>
                )}

                {/* GATE 2 */}
                {showAskTre && <DecisionGate phase="ask_treplica" onYes={() => handleGate(true)} onNo={() => handleGate(false)} />}

                {/* PHASE 4 — TREPLICA */}
                {showTre && (
                    <div style={{ marginBottom: 52 }}>
                        <SectionHeader label="— FASE 4 · TRÉPLICA" active={phase === "treplica"} done={["verdict", "done"].includes(phase)} />
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                            {MEMBERS.map(m => <MemberCard key={m.id} member={m} status={treStatus[m.id] || "pending"} text={treTexts[m.id] || ""} />)}
                        </div>
                    </div>
                )}

                {/* VERDICT */}
                {showVerdict && (
                    <div style={{ marginBottom: 32 }}>
                        <SectionHeader label="— FASE FINAL · VEREDITO" active={phase === "verdict"} done={phase === "done"} />
                        <VerdictPanel text={verdict} loading={verdictLoading} />
                    </div>
                )}

                {/* DONE ACTIONS */}
                {phase === "done" && (
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 24 }}>
                        <span style={{ fontSize: 8, color: "#111825", letterSpacing: 1 }}>#{sessionId} · {fmt(elapsed)} · {useDemo ? "DEMO" : "LIVE"}</span>
                        <div style={{ display: "flex", gap: 10 }}>
                            <button onClick={() => navigator.clipboard?.writeText(`AI COUNCIL #${sessionId}\n\n${question}\n\n${verdict}`)} style={{ padding: "9px 18px", background: "transparent", color: "#334", border: "1px solid #0e1520", borderRadius: 2, fontSize: 8, fontFamily: "'Space Mono', monospace", letterSpacing: 2, cursor: "pointer" }}>COPIAR</button>
                            <button onClick={reset} style={{ padding: "9px 18px", background: "transparent", color: "#C8952A", border: "1px solid rgba(200,149,42,0.25)", borderRadius: 2, fontSize: 8, fontFamily: "'Space Mono', monospace", letterSpacing: 2, cursor: "pointer" }}>NOVA SESSÃO ↺</button>
                        </div>
                    </div>
                )}

                <div ref={bottomRef} />
            </div>

            {/* STATUS BAR */}
            <div style={{ position: "fixed", bottom: 0, left: 0, right: 0, zIndex: 20, background: "rgba(7,9,16,0.98)", borderTop: "1px solid #090d14", padding: "8px 44px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontSize: 8, color: "#131c28", letterSpacing: 2 }}>
                    {phase === "idle" ? "● AGUARDANDO" : phase === "done" ? "● ENCERRADO" : `● ${PHASE_LABELS[phase]}`}
                </span>
                <div style={{ display: "flex", gap: 16 }}>
                    {MEMBERS.map(m => (
                        <div key={m.id} style={{ display: "flex", alignItems: "center", gap: 4 }}>
                            <div style={{ width: 4, height: 4, borderRadius: "50%", background: opStatus[m.id] === "active" ? m.color : opStatus[m.id] === "done" ? m.color + "55" : "#0d1520", boxShadow: opStatus[m.id] === "active" ? `0 0 6px ${m.color}` : "none" }} />
                            <span style={{ fontSize: 7, color: "#111825", letterSpacing: 1 }}>{m.name}</span>
                        </div>
                    ))}
                </div>
            </div>

            <style>{`
        @keyframes pulse{0%,100%{opacity:.08}50%{opacity:1}}
        @keyframes blink{0%,100%{opacity:1}50%{opacity:0}}
        @keyframes glow{0%,100%{box-shadow:0 0 8px #C8952A}50%{box-shadow:0 0 22px #C8952A,0 0 44px rgba(200,149,42,0.25)}}
        *{box-sizing:border-box}
        textarea{scrollbar-width:none}
        textarea::-webkit-scrollbar{display:none}
        textarea::placeholder{color:#111825}
      `}</style>
        </div>
    );
}
