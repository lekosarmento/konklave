import Link from 'next/link'

export default function Home() {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Mono:ital,wght@0,400;0,700;1,400&family=Libre+Baskerville:ital,wght@0,400;0,700;1,400&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        .lp-header { padding: 0 44px; }
        .lp-hero { padding: 100px 40px 80px; }
        .lp-title { font-size: 64px; letter-spacing: 8px; }
        .lp-subtitle { font-size: 22px; }
        .lp-body { font-size: 15px; }
        .lp-cta { display: inline-block; padding: 16px 40px; font-size: 12px; }
        .lp-benefits { padding: 72px 40px 100px; }
        .lp-benefits-grid { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 20px; }
        .lp-footer { padding: 24px 44px; }
        @media (max-width: 767px) {
          .lp-header { padding: 0 20px; }
          .lp-hero { padding: 52px 24px 48px; }
          .lp-title { font-size: 38px; letter-spacing: 4px; }
          .lp-subtitle { font-size: 18px; }
          .lp-body { font-size: 14px; max-width: 100% !important; }
          .lp-cta { display: flex; align-items: center; justify-content: center; width: 100%; padding: 0 24px; height: 56px; font-size: 14px; text-align: center; }
          .lp-benefits { padding: 40px 24px 60px; }
          .lp-benefits-grid { grid-template-columns: 1fr; }
          .lp-footer { flex-direction: column; gap: 8px; padding: 20px 24px; }
        }
        @media (min-width: 768px) and (max-width: 1024px) {
          .lp-header { padding: 0 28px; }
          .lp-hero { padding: 72px 32px 64px; }
          .lp-title { font-size: 52px; }
          .lp-benefits { padding: 56px 32px 80px; }
          .lp-benefits-grid { grid-template-columns: 1fr 1fr; }
          .lp-footer { padding: 20px 28px; }
        }
      `}</style>

      <div style={{ minHeight: '100vh', background: '#080C14', fontFamily: "'Space Mono', monospace", color: '#C8D8E8' }}>
        {/* Grid overlay */}
        <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0, backgroundImage: 'linear-gradient(rgba(200,149,42,0.012) 1px,transparent 1px),linear-gradient(90deg,rgba(200,149,42,0.012) 1px,transparent 1px)', backgroundSize: '52px 52px' }} />

        {/* Header */}
        <div className="lp-header" style={{ position: 'relative', zIndex: 1, borderBottom: '1px solid #1E2D42', height: 54, display: 'flex', alignItems: 'center' }}>
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
        <div className="lp-hero" style={{ position: 'relative', zIndex: 1, maxWidth: 900, margin: '0 auto', textAlign: 'center' }}>
          <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 9, color: '#C8952A', letterSpacing: 4, marginBottom: 32 }}>
            ▸ SISTEMA DE DELIBERAÇÃO POR INTELIGÊNCIA ARTIFICIAL
          </div>

          <h1 className="lp-title" style={{ fontFamily: "'Space Mono', monospace", fontWeight: 700, color: '#E8F0F8', marginBottom: 32, lineHeight: 1 }}>
            KONKLAVE
          </h1>

          <p className="lp-subtitle" style={{ fontFamily: "'Libre Baskerville', Georgia, serif", color: '#A0B8CC', lineHeight: 1.7, marginBottom: 16, fontStyle: 'italic' }}>
            Convoque suas inteligências. Debata. Decida.
          </p>

          <p className="lp-body" style={{ fontFamily: "'Libre Baskerville', Georgia, serif", color: '#6A8AA8', lineHeight: 1.9, maxWidth: 580, margin: '0 auto 52px' }}>
            Submeta uma questão difícil a um conselho de cinco IAs com perspectivas distintas.
            Elas debatem em fases estruturadas e entregam um veredito fundamentado.
          </p>

          <Link href="/cadastro" className="lp-cta" style={{
            background: '#C8952A',
            color: '#070910',
            textDecoration: 'none',
            fontFamily: "'Space Mono', monospace",
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
        <div className="lp-benefits" style={{ position: 'relative', zIndex: 1, maxWidth: 900, margin: '0 auto' }}>
          <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 9, color: '#6A8AA8', letterSpacing: 3, textAlign: 'center', marginBottom: 48 }}>
            COMO FUNCIONA
          </div>

          <div className="lp-benefits-grid">
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
        <div className="lp-footer" style={{ position: 'relative', zIndex: 1, borderTop: '1px solid #1E2D42', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
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
