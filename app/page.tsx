import Link from 'next/link'

export default function Home() {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Mono:ital,wght@0,400;0,700;1,400&family=Libre+Baskerville:ital,wght@0,400;0,700;1,400&display=swap');
      `}</style>

      <div style={{ minHeight: '100vh', background: '#080C14', fontFamily: "'Space Mono', monospace", color: '#C8D8E8' }}>
        {/* Grid overlay */}
        <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0, backgroundImage: 'linear-gradient(rgba(200,149,42,0.012) 1px,transparent 1px),linear-gradient(90deg,rgba(200,149,42,0.012) 1px,transparent 1px)', backgroundSize: '52px 52px' }} />

        {/* Header */}
        <div className="relative z-[1] flex items-center border-b px-4 sm:px-8 lg:px-11 h-14" style={{ borderColor: '#1E2D42' }}>
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full" style={{ background: '#C8952A' }} />
            <span className="text-xs sm:text-sm font-bold tracking-[3px]" style={{ fontFamily: "'Space Mono', monospace", color: '#ccd8e0' }}>KONKLAVE</span>
          </div>
          <div className="ml-auto">
            <Link href="/cadastro" className="text-xs tracking-widest" style={{ fontFamily: "'Space Mono', monospace", fontSize: 10, color: '#6A8AA8', textDecoration: 'none', letterSpacing: 2 }}>
              ENTRAR →
            </Link>
          </div>
        </div>

        {/* Hero */}
        <div className="relative z-[1] max-w-4xl mx-auto px-4 sm:px-8 py-12 sm:py-20 text-center">
          <div className="text-[9px] tracking-[4px] mb-6 sm:mb-8" style={{ fontFamily: "'Space Mono', monospace", color: '#C8952A' }}>
            ▸ SISTEMA DE DELIBERAÇÃO POR INTELIGÊNCIA ARTIFICIAL
          </div>

          <h1 className="text-4xl sm:text-6xl md:text-[80px] font-bold leading-none tracking-[4px] sm:tracking-[8px] mb-6 sm:mb-8" style={{ fontFamily: "'Space Mono', monospace", color: '#E8F0F8' }}>
            KONKLAVE
          </h1>

          <p className="text-base sm:text-lg md:text-xl leading-relaxed mb-3 italic" style={{ fontFamily: "'Libre Baskerville', Georgia, serif", color: '#A0B8CC' }}>
            Convoque suas inteligências. Debata. Decida.
          </p>

          <p className="text-sm sm:text-base leading-loose max-w-lg mx-auto mb-10 sm:mb-14 px-2 sm:px-0" style={{ fontFamily: "'Libre Baskerville', Georgia, serif", color: '#6A8AA8' }}>
            Submeta uma questão difícil a um conselho de cinco IAs com perspectivas distintas.
            Elas debatem em fases estruturadas e entregam um veredito fundamentado.
          </p>

          <Link
            href="/cadastro"
            className="inline-flex items-center justify-center w-full max-w-xs sm:w-auto sm:max-w-none mx-auto h-14 sm:h-auto sm:px-10 sm:py-4 font-bold text-sm sm:text-xs tracking-widest rounded-sm"
            style={{ background: '#C8952A', color: '#070910', fontFamily: "'Space Mono', monospace", letterSpacing: 2, boxShadow: '0 0 40px rgba(200,149,42,0.25)', textDecoration: 'none' }}
          >
            CONVOCAR O CONSELHO →
          </Link>

          <div className="mt-4">
            <span className="text-[9px] tracking-wide" style={{ color: '#2A3A4A', fontFamily: "'Space Mono', monospace" }}>5 debates gratuitos · sem cartão de crédito</span>
          </div>
        </div>

        {/* Divider */}
        <div className="relative z-[1] max-w-4xl mx-auto px-4 sm:px-8">
          <div className="h-px" style={{ background: 'linear-gradient(90deg, transparent, #1E2D42, transparent)' }} />
        </div>

        {/* Benefit cards */}
        <div className="relative z-[1] max-w-4xl mx-auto px-4 sm:px-8 py-10 sm:py-16">
          <div className="text-center mb-8 sm:mb-12 text-[9px] tracking-[3px]" style={{ fontFamily: "'Space Mono', monospace", color: '#6A8AA8' }}>
            COMO FUNCIONA
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { phase: '01', title: 'Opiniões Independentes', desc: 'Cada membro do conselho analisa a questão de forma isolada, trazendo sua perspectiva única sem influência dos demais.', color: '#C8952A' },
              { phase: '02', title: 'Debate e Réplica', desc: 'Os membros reagem uns aos outros — concordam, contestam, aprofundam. Você decide quantas rodadas de debate deseja.', color: '#4A8FD4' },
              { phase: '03', title: 'Veredito', desc: 'Um presidente sintetiza toda a deliberação e entrega um veredito estruturado, com consenso, riscos e próximo passo concreto.', color: '#3DAA6E' },
            ].map((card) => (
              <div key={card.phase} className="rounded-sm p-5 sm:p-6" style={{ background: '#0F1520', border: '1px solid #1E2D42', borderTop: `2px solid ${card.color}` }}>
                <div className="text-[9px] tracking-[3px] mb-3" style={{ fontFamily: "'Space Mono', monospace", color: card.color }}>FASE {card.phase}</div>
                <div className="text-xs font-bold tracking-wide mb-3" style={{ fontFamily: "'Space Mono', monospace", color: '#C8D8E8' }}>{card.title.toUpperCase()}</div>
                <div className="text-sm leading-relaxed" style={{ fontFamily: "'Libre Baskerville', Georgia, serif", color: '#6A8AA8' }}>{card.desc}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="relative z-[1] flex flex-col sm:flex-row justify-between items-center gap-2 border-t px-4 sm:px-11 py-5" style={{ borderColor: '#1E2D42' }}>
          <span className="text-[9px] tracking-widest" style={{ fontFamily: "'Space Mono', monospace", color: '#2A3A4A' }}>KONKLAVE · VERTEKIA</span>
          <span className="text-[9px] tracking-wide" style={{ fontFamily: "'Space Mono', monospace", color: '#1E2D42' }}>© 2025</span>
        </div>
      </div>
    </>
  )
}
