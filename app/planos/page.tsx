import Link from 'next/link'

const PLANS = [
  {
    id: 'starter',
    name: 'STARTER',
    price: 'R$ 47',
    period: '/mês',
    quota: '20 debates/mês',
    features: ['Todos os 5 membros do conselho', 'Fases de réplica e tréplica', 'Exportação de veredito'],
    color: '#4A8FD4',
  },
  {
    id: 'pro',
    name: 'PRO',
    price: 'R$ 97',
    period: '/mês',
    quota: 'Debates ilimitados',
    features: ['Tudo do Starter', 'Prioridade nas respostas', 'Histórico de sessões'],
    color: '#C8952A',
    highlight: true,
  },
  {
    id: 'time',
    name: 'TIME',
    price: 'R$ 197',
    period: '/mês',
    quota: 'Até 5 usuários',
    features: ['Tudo do Pro', 'Dashboard de equipe', 'Suporte prioritário'],
    color: '#3DAA6E',
  },
]

export default function PlanosPage() {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Mono:ital,wght@0,400;0,700;1,400&family=Libre+Baskerville:ital,wght@0,400;0,700;1,400&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
      `}</style>

      <div style={{ minHeight: '100vh', background: '#080C14', fontFamily: "'Space Mono', monospace", color: '#C8D8E8' }}>
        <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0, backgroundImage: 'linear-gradient(rgba(200,149,42,0.012) 1px,transparent 1px),linear-gradient(90deg,rgba(200,149,42,0.012) 1px,transparent 1px)', backgroundSize: '52px 52px' }} />

        {/* Header */}
        <div style={{ position: 'relative', zIndex: 1, borderBottom: '1px solid #1E2D42', padding: '0 44px', height: 54, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
            <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#C8952A' }} />
            <span style={{ fontSize: 13, fontWeight: 700, color: '#ccd8e0', letterSpacing: 3 }}>KONKLAVE</span>
          </div>
          <Link href="/council" style={{ fontFamily: "'Space Mono', monospace", fontSize: 9, color: '#6A8AA8', letterSpacing: 2, textDecoration: 'none' }}>
            ← VOLTAR
          </Link>
        </div>

        {/* Content */}
        <div style={{ position: 'relative', zIndex: 1, maxWidth: 900, margin: '0 auto', padding: '72px 40px 100px', textAlign: 'center' }}>

          <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 9, color: '#C8952A', letterSpacing: 4, marginBottom: 24 }}>
            ▸ LIMITE ATINGIDO
          </div>

          <h1 style={{ fontFamily: "'Libre Baskerville', Georgia, serif", fontSize: 32, color: '#E8F0F8', marginBottom: 16, lineHeight: 1.3 }}>
            Você usou seus 5 debates gratuitos
          </h1>

          <p style={{ fontFamily: "'Libre Baskerville', Georgia, serif", fontSize: 15, color: '#6A8AA8', lineHeight: 1.8, marginBottom: 60 }}>
            Para continuar deliberando, escolha um plano abaixo.
          </p>

          {/* Plans grid */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 20, marginBottom: 48 }}>
            {PLANS.map(plan => (
              <div key={plan.id} style={{
                background: plan.highlight ? '#111827' : '#0F1520',
                border: `1px solid ${plan.highlight ? 'rgba(200,149,42,0.4)' : '#1E2D42'}`,
                borderTop: `3px solid ${plan.color}`,
                borderRadius: 2,
                padding: '32px 24px',
                position: 'relative',
              }}>
                {plan.highlight && (
                  <div style={{ position: 'absolute', top: -1, right: 20, background: '#C8952A', color: '#070910', fontFamily: "'Space Mono', monospace", fontSize: 8, fontWeight: 700, letterSpacing: 2, padding: '4px 10px', borderRadius: '0 0 4px 4px' }}>
                    MAIS POPULAR
                  </div>
                )}

                <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 10, fontWeight: 700, color: plan.color, letterSpacing: 3, marginBottom: 20 }}>
                  {plan.name}
                </div>

                <div style={{ marginBottom: 8 }}>
                  <span style={{ fontFamily: "'Space Mono', monospace", fontSize: 32, fontWeight: 700, color: '#E8F0F8' }}>{plan.price}</span>
                  <span style={{ fontFamily: "'Space Mono', monospace", fontSize: 11, color: '#6A8AA8' }}>{plan.period}</span>
                </div>

                <div style={{ fontFamily: "'Libre Baskerville', Georgia, serif", fontSize: 13, color: plan.color, marginBottom: 24, fontStyle: 'italic' }}>
                  {plan.quota}
                </div>

                <div style={{ height: 1, background: '#1E2D42', marginBottom: 24 }} />

                <ul style={{ listStyle: 'none', marginBottom: 32, textAlign: 'left' }}>
                  {plan.features.map(f => (
                    <li key={f} style={{ fontFamily: "'Space Mono', monospace", fontSize: 9, color: '#6A8AA8', letterSpacing: 1, marginBottom: 10, display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span style={{ color: plan.color }}>✓</span> {f}
                    </li>
                  ))}
                </ul>

                <button style={{
                  width: '100%',
                  padding: '12px',
                  background: plan.highlight ? '#C8952A' : 'transparent',
                  color: plan.highlight ? '#070910' : plan.color,
                  border: `1px solid ${plan.highlight ? '#C8952A' : plan.color}`,
                  borderRadius: 2,
                  fontFamily: "'Space Mono', monospace",
                  fontSize: 10,
                  fontWeight: 700,
                  letterSpacing: 2,
                  cursor: 'pointer',
                }}>
                  ASSINAR
                </button>
              </div>
            ))}
          </div>

          <Link href="/council" style={{ fontFamily: "'Space Mono', monospace", fontSize: 9, color: '#2A3A4A', letterSpacing: 2, textDecoration: 'none' }}>
            ← Voltar ao conselho
          </Link>
        </div>
      </div>
    </>
  )
}
