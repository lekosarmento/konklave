import Link from 'next/link'

export default function Home() {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Mono:ital,wght@0,400;0,700;1,400&family=Libre+Baskerville:ital,wght@0,400;0,700;1,400&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
      `}</style>

      <div style={{ minHeight: '100vh', background: '#080C14', fontFamily: "'Space Mono', monospace", color: '#C8D8E8' }}>
        {/* Grid overlay */}
        <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0, backgroundImage: 'linear-gradient(rgba(200,149,42,0.012) 1px,transparent 1px),linear-gradient(90deg,rgba(200,149,42,0.012) 1px,transparent 1px)', backgroundSize: '52px 52px' }} />

        {/* Header */}
        <div style={{ position: 'relative', zIndex: 1, borderBottom: '1px solid #1E2D42', padding: '0 44px', height: 54, display: 'flex', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
            <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#C8952A' }} />
            <span style={{ fontSize: 13, fontWeight: 700, color: '#ccd8e0', letterSpacing: 3 }}>KONKLAVE</span>
          </div>
          <div style={{ marginLeft: 'auto' }}>
            <Link href="/cadastro" style={{ fontFamily: "'Space Mono', monospace", fontSize: 10, color: '#6A8AA8', letterSpacing: 2, textDecoration: 'none' }}>
              ENTRAR →
            </Link>
          </div>
        </div>

        {/* Hero */}
        <div style={{ position: 'relative', zIndex: 1, maxWidth: 900, margin: '0 auto', padding: '100px 40px 80px', textAlign: 'center' }}>
          <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 9, color: '#C8952A', letterSpacing: 4, marginBottom: 32 }}>
            ▸ SISTEMA DE DELIBERAÇÃO POR INTELIGÊNCIA ARTIFICIAL
          </div>

          <h1 style={{ fontFamily: "'Space Mono', monospace", fontSize: 64, fontWeight: 700, color: '#E8F0F8', letterSpacing: 8, marginBottom: 32, lineHeight: 1 }}>
            KONKLAVE
          </h1>

          <p style={{ fontFamily: "'Libre Baskerville', Georgia, serif", fontSize: 22, color: '#A0B8CC', lineHeight: 1.7, marginBottom: 16, fontStyle: 'italic' }}>
            Convoque suas inteligências. Debata. Decida.
          </p>

          <p style={{ fontFamily: "'Libre Baskerville', Georgia, serif", fontSize: 15, color: '#6A8AA8', lineHeight: 1.9, maxWidth: 580, margin: '0 auto 52px' }}>
            Submeta uma questão difícil a um conselho de cinco IAs com perspectivas distintas.
            Elas debatem em fases estruturadas e entregam um veredito fundamentado.
          </p>

          <Link href="/cadastro" style={{
            display: 'inline-block',
            padding: '16px 40px',
            background: '#C8952A',
            color: '#070910',
            textDecoration: 'none',
            fontFamily: "'Space Mono', monospace",
            fontSize: 12,
            fontWeight: 700,
            letterSpacing: 2,
            borderRadius: 2,
            boxShadow: '0 0 40px rgba(200,149,42,0.25)',
          }}>
            CONVOCAR O CONSELHO →
          </Link>

          <div style={{ marginTop: 20 }}>
            <span style={{ fontSize: 9, color: '#2A3A4A', letterSpacing: 1 }}>5 debates gratuitos · sem cartão de crédito</span>
          </div>
        </div>

        {/* Divider */}
        <div style={{ position: 'relative', zIndex: 1, maxWidth: 900, margin: '0 auto', padding: '0 40px' }}>
          <div style={{ height: 1, background: 'linear-gradient(90deg, transparent, #1E2D42, transparent)' }} />
        </div>

        {/* Benefit cards */}
        <div style={{ position: 'relative', zIndex: 1, maxWidth: 900, margin: '0 auto', padding: '72px 40px 100px' }}>
          <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 9, color: '#6A8AA8', letterSpacing: 3, textAlign: 'center', marginBottom: 48 }}>
            COMO FUNCIONA
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 20 }}>
            {[
              {
                phase: '01',
                title: 'Opiniões Independentes',
                desc: 'Cada membro do conselho analisa a questão de forma isolada, trazendo sua perspectiva única sem influência dos demais.',
                color: '#C8952A',
              },
              {
                phase: '02',
                title: 'Debate e Réplica',
                desc: 'Os membros reagem uns aos outros — concordam, contestam, aprofundam. Você decide quantas rodadas de debate deseja.',
                color: '#4A8FD4',
              },
              {
                phase: '03',
                title: 'Veredito',
                desc: 'Um presidente sintetiza toda a deliberação e entrega um veredito estruturado, com consenso, riscos e próximo passo concreto.',
                color: '#3DAA6E',
              },
            ].map((card) => (
              <div key={card.phase} style={{
                background: '#0F1520',
                border: '1px solid #1E2D42',
                borderTop: `2px solid ${card.color}`,
                borderRadius: 2,
                padding: '28px 24px',
              }}>
                <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 9, color: card.color, letterSpacing: 3, marginBottom: 16 }}>
                  FASE {card.phase}
                </div>
                <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 11, fontWeight: 700, color: '#C8D8E8', letterSpacing: 1, marginBottom: 14 }}>
                  {card.title.toUpperCase()}
                </div>
                <div style={{ fontFamily: "'Libre Baskerville', Georgia, serif", fontSize: 13, color: '#6A8AA8', lineHeight: 1.8 }}>
                  {card.desc}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div style={{ position: 'relative', zIndex: 1, borderTop: '1px solid #1E2D42', padding: '24px 44px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontFamily: "'Space Mono', monospace", fontSize: 9, color: '#2A3A4A', letterSpacing: 2 }}>
            KONKLAVE · VERTEKIA
          </span>
          <span style={{ fontFamily: "'Space Mono', monospace", fontSize: 9, color: '#1E2D42', letterSpacing: 1 }}>
            © 2025
          </span>
        </div>
      </div>
    </>
  )
}
