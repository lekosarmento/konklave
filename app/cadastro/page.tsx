'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function CadastroPage() {
  const router = useRouter()
  const [nome, setNome] = useState('')
  const [email, setEmail] = useState('')
  const [whatsapp, setWhatsapp] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)

  useEffect(() => {
    const existing = localStorage.getItem('konklave_user')
    if (existing) {
      router.replace('/council')
    }
  }, [router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!nome.trim() || !email.trim()) return
    setSubmitting(true)
    setSubmitError(null)
    console.log('[cadastro] submitting lead:', { nome: nome.trim(), email: email.trim() })

    localStorage.setItem('konklave_user', JSON.stringify({
      nome: nome.trim(),
      email: email.trim(),
      whatsapp: whatsapp.trim(),
      usos: 0,
    }))

    try {
      console.log('[cadastro] calling /api/leads')
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nome: nome.trim(),
          email: email.trim(),
          whatsapp: whatsapp.trim() || null,
        }),
      })
      const json = await res.json()
      console.log('[cadastro] /api/leads response:', res.status, json)
      if (!res.ok) {
        console.error('[cadastro] lead insert failed:', json)
        setSubmitError(`Erro ao salvar: ${json.error || 'erro desconhecido'}`)
        setSubmitting(false)
        return
      }
    } catch (err) {
      console.error('[cadastro] fetch error:', err)
      setSubmitError('Erro de conexão. Tente novamente.')
      setSubmitting(false)
      return
    }

    router.push('/council')
  }

  const inputStyle: React.CSSProperties = {
    width: '100%',
    background: '#0B1018',
    border: '1px solid #1E2D42',
    borderRadius: 2,
    padding: '12px 16px',
    fontFamily: "'Space Mono', monospace",
    fontSize: 13,
    color: '#D4E4F0',
    outline: 'none',
  }

  const labelStyle: React.CSSProperties = {
    fontFamily: "'Space Mono', monospace",
    fontSize: 9,
    color: '#6A8AA8',
    letterSpacing: 2,
    display: 'block',
    marginBottom: 8,
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Mono:ital,wght@0,400;0,700;1,400&family=Libre+Baskerville:ital,wght@0,400;0,700;1,400&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        input::placeholder { color: #2A3A4A; }
        input:focus { border-color: rgba(200,149,42,0.5) !important; }
      `}</style>

      <div style={{ minHeight: '100vh', background: '#080C14', fontFamily: "'Space Mono', monospace", color: '#C8D8E8', display: 'flex', flexDirection: 'column' }}>
        <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0, backgroundImage: 'linear-gradient(rgba(200,149,42,0.012) 1px,transparent 1px),linear-gradient(90deg,rgba(200,149,42,0.012) 1px,transparent 1px)', backgroundSize: '52px 52px' }} />

        {/* Header */}
        <div style={{ position: 'relative', zIndex: 1, borderBottom: '1px solid #1E2D42', padding: '0 44px', height: 54, display: 'flex', alignItems: 'center' }}>
          <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 9, textDecoration: 'none' }}>
            <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#C8952A' }} />
            <span style={{ fontSize: 13, fontWeight: 700, color: '#ccd8e0', letterSpacing: 3 }}>KONKLAVE</span>
          </Link>
        </div>

        {/* Form */}
        <div style={{ position: 'relative', zIndex: 1, flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px' }}>
          <div style={{ width: '100%', maxWidth: 480 }}>
            <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 9, color: '#C8952A', letterSpacing: 3, marginBottom: 20 }}>
              ▸ ACESSO AO CONSELHO
            </div>

            <h1 style={{ fontFamily: "'Libre Baskerville', Georgia, serif", fontSize: 28, color: '#E8F0F8', marginBottom: 10, lineHeight: 1.3 }}>
              Crie seu acesso
            </h1>

            <p style={{ fontFamily: "'Libre Baskerville', Georgia, serif", fontSize: 14, color: '#6A8AA8', marginBottom: 40, lineHeight: 1.7 }}>
              5 debates gratuitos, sem cartão de crédito. Comece agora.
            </p>

            <div style={{ background: '#0A0F1A', border: '1px solid #1E2D42', borderTop: '2px solid #C8952A', borderRadius: 2, padding: '32px' }}>
              <form onSubmit={handleSubmit}>
                <div style={{ marginBottom: 24 }}>
                  <label style={labelStyle}>NOME</label>
                  <input
                    type="text"
                    value={nome}
                    onChange={e => setNome(e.target.value)}
                    placeholder="Seu nome"
                    required
                    style={inputStyle}
                  />
                </div>

                <div style={{ marginBottom: 24 }}>
                  <label style={labelStyle}>EMAIL</label>
                  <input
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="seu@email.com"
                    required
                    style={inputStyle}
                  />
                </div>

                <div style={{ marginBottom: 32 }}>
                  <label style={labelStyle}>
                    WHATSAPP <span style={{ color: '#2A3A4A', fontWeight: 400 }}>· opcional</span>
                  </label>
                  <input
                    type="tel"
                    value={whatsapp}
                    onChange={e => setWhatsapp(e.target.value)}
                    placeholder="+55 11 99999-9999"
                    style={inputStyle}
                  />
                </div>

                <button
                  type="submit"
                  disabled={!nome.trim() || !email.trim() || submitting}
                  style={{
                    width: '100%',
                    padding: '14px',
                    background: '#C8952A',
                    color: '#070910',
                    border: 'none',
                    borderRadius: 2,
                    fontFamily: "'Space Mono', monospace",
                    fontSize: 11,
                    fontWeight: 700,
                    letterSpacing: 2,
                    cursor: !nome.trim() || !email.trim() || submitting ? 'not-allowed' : 'pointer',
                    opacity: !nome.trim() || !email.trim() || submitting ? 0.5 : 1,
                    boxShadow: '0 0 28px rgba(200,149,42,0.2)',
                  }}
                >
                  {submitting ? 'SALVANDO...' : 'ACESSAR O KONKLAVE →'}
                </button>

                {submitError && (
                  <div style={{
                    marginTop: 16,
                    padding: '10px 14px',
                    background: 'rgba(200,60,60,0.1)',
                    border: '1px solid rgba(200,60,60,0.3)',
                    borderRadius: 2,
                    fontFamily: "'Space Mono', monospace",
                    fontSize: 11,
                    color: '#E87070',
                    letterSpacing: 0.5,
                  }}>
                    {submitError}
                  </div>
                )}
              </form>
            </div>

            <div style={{ marginTop: 24, textAlign: 'center' }}>
              <span style={{ fontFamily: "'Space Mono', monospace", fontSize: 9, color: '#6A8AA8', letterSpacing: 1 }}>
                Ao continuar, você concorda com os termos de uso
              </span>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
