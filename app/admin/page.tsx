'use client'

import { useState, useEffect, useCallback } from 'react'

interface DayCount { date: string; count: number }
interface TopUser { nome: string; email: string; usos: number; criado_em: string }
interface RecentFeedback { email: string; rating: number; comment: string; questao: string; criado_em: string }
interface RatingDist { rating: number; count: number }

interface Stats {
  totalUsers: number
  totalDebates: number
  totalFeedbacks: number
  avgRating: number
  usersPerDay: DayCount[]
  debatesPerDay: DayCount[]
  topUsers: TopUser[]
  recentFeedbacks: RecentFeedback[]
  ratingDistribution: RatingDist[]
}

// ─── BAR CHART ────────────────────────────────────────────────
function BarChart({ data, color, title }: { data: DayCount[]; color: string; title: string }) {
  const max = Math.max(...data.map(d => d.count), 1)
  return (
    <div style={{ background: '#0F1520', border: '1px solid #1E2D42', borderTop: '2px solid rgba(200,149,42,0.3)', borderRadius: 2, padding: '24px' }}>
      <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 9, color: '#C8952A', letterSpacing: 3, marginBottom: 24 }}>{title}</div>
      <div style={{ display: 'flex', alignItems: 'flex-end', gap: 5, height: 100 }}>
        {data.map(d => (
          <div key={d.date} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', height: '100%', justifyContent: 'flex-end', gap: 6 }}>
            <div style={{ width: '100%', display: 'flex', alignItems: 'flex-end', justifyContent: 'center', height: 'calc(100% - 22px)' }}>
              <div
                title={`${d.count}`}
                style={{
                  width: '100%',
                  height: `${Math.max((d.count / max) * 100, d.count > 0 ? 4 : 0)}%`,
                  background: color,
                  borderRadius: '2px 2px 0 0',
                  opacity: 0.85,
                  transition: 'height 0.3s ease',
                }}
              />
            </div>
            <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 7, color: '#3A5A70', textAlign: 'center', width: '100%', overflow: 'hidden' }}>
              {d.date.slice(5).replace('-', '/')}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── STAT CARD ────────────────────────────────────────────────
function StatCard({ label, value, sub, color }: { label: string; value: string | number; sub: string; color: string }) {
  return (
    <div style={{ background: '#0F1520', borderTop: `2px solid ${color}`, border: '1px solid #1E2D42', borderRadius: 2, padding: '24px 20px' }}>
      <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 8, color: '#6A8AA8', letterSpacing: 2, marginBottom: 12 }}>{label.toUpperCase()}</div>
      <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 28, fontWeight: 700, color, marginBottom: 6, letterSpacing: 1 }}>{value}</div>
      <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 8, color: '#3A5A70', letterSpacing: 1 }}>{sub}</div>
    </div>
  )
}

// ─── MAIN ─────────────────────────────────────────────────────
export default function AdminPage() {
  const [authenticated, setAuthenticated] = useState(false)
  const [password, setPassword] = useState('')
  const [passwordError, setPasswordError] = useState('')
  const [logging, setLogging] = useState(false)
  const [stats, setStats] = useState<Stats | null>(null)
  const [loading, setLoading] = useState(false)
  const [lastUpdated, setLastUpdated] = useState('')
  const [storedPwd, setStoredPwd] = useState('')

  const fetchStats = useCallback(async (pwd: string) => {
    setLoading(true)
    try {
      const res = await fetch('/api/admin/stats', {
        headers: { 'x-admin-password': pwd },
      })
      if (res.ok) {
        const data = await res.json()
        setStats(data)
        setLastUpdated(new Date().toLocaleTimeString('pt-BR'))
      } else {
        sessionStorage.removeItem('konklave_admin')
        setAuthenticated(false)
        setStats(null)
      }
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    const stored = sessionStorage.getItem('konklave_admin')
    if (stored) {
      setStoredPwd(stored)
      setAuthenticated(true)
      fetchStats(stored)
    }
  }, [fetchStats])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setPasswordError('')
    setLogging(true)
    try {
      const res = await fetch('/api/admin/stats', {
        headers: { 'x-admin-password': password },
      })
      if (res.ok) {
        const data = await res.json()
        sessionStorage.setItem('konklave_admin', password)
        setStoredPwd(password)
        setAuthenticated(true)
        setStats(data)
        setLastUpdated(new Date().toLocaleTimeString('pt-BR'))
      } else {
        setPasswordError('Senha incorreta')
      }
    } finally {
      setLogging(false)
    }
  }

  const handleLogout = () => {
    sessionStorage.removeItem('konklave_admin')
    setAuthenticated(false)
    setStats(null)
    setStoredPwd('')
  }

  // ─── PASSWORD SCREEN ──────────────────────────────────────
  if (!authenticated) {
    return (
      <div style={{ minHeight: '100vh', background: '#080C14', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Space Mono', monospace" }}>
        <style>{`@import url('https://fonts.googleapis.com/css2?family=Space+Mono:ital,wght@0,400;0,700&family=Libre+Baskerville:ital,wght@0,400;0,700;1,400&display=swap'); * { box-sizing: border-box; }`}</style>
        <div style={{ width: '100%', maxWidth: 360, background: '#0A0F1A', border: '1px solid rgba(200,149,42,0.3)', borderTop: '3px solid #C8952A', borderRadius: 2, padding: '40px 36px' }}>
          <div style={{ fontSize: 9, color: '#C8952A', letterSpacing: 3, marginBottom: 12 }}>▸ ÁREA RESTRITA</div>
          <div style={{ fontFamily: "'Libre Baskerville', Georgia, serif", fontSize: 20, color: '#E8F0F8', marginBottom: 8 }}>Admin Dashboard</div>
          <div style={{ fontSize: 9, color: '#6A8AA8', letterSpacing: 1, marginBottom: 32 }}>Konklave · Painel de Controle</div>
          <form onSubmit={handleLogin}>
            <div style={{ marginBottom: 16 }}>
              <div style={{ fontSize: 8, color: '#6A8AA8', letterSpacing: 2, marginBottom: 8 }}>SENHA</div>
              <input
                type="password"
                value={password}
                onChange={e => { setPassword(e.target.value); setPasswordError('') }}
                placeholder="••••••••"
                autoFocus
                style={{ width: '100%', background: '#0B1018', border: `1px solid ${passwordError ? '#E05A5A' : '#1E2D42'}`, borderRadius: 2, padding: '10px 14px', fontFamily: "'Space Mono', monospace", fontSize: 13, color: '#D4E4F0', outline: 'none' }}
              />
              {passwordError && (
                <div style={{ marginTop: 8, fontSize: 9, color: '#E05A5A', letterSpacing: 1 }}>{passwordError}</div>
              )}
            </div>
            <button
              type="submit"
              disabled={!password || logging}
              style={{ width: '100%', padding: '12px', background: password && !logging ? '#C8952A' : '#0F1520', color: password && !logging ? '#070910' : '#2A3A4A', border: 'none', borderRadius: 2, fontFamily: "'Space Mono', monospace", fontSize: 10, fontWeight: 700, letterSpacing: 2, cursor: password && !logging ? 'pointer' : 'not-allowed', transition: 'all 0.2s' }}
            >
              {logging ? 'VERIFICANDO...' : 'ENTRAR →'}
            </button>
          </form>
        </div>
      </div>
    )
  }

  // ─── DASHBOARD ────────────────────────────────────────────
  const s = stats
  return (
    <div style={{ minHeight: '100vh', background: '#080C14', fontFamily: "'Space Mono', monospace", color: '#C8D8E8' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Mono:ital,wght@0,400;0,700&family=Libre+Baskerville:ital,wght@0,400;0,700;1,400&display=swap');
        * { box-sizing: border-box; }
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: #080C14; }
        ::-webkit-scrollbar-thumb { background: #1E2D42; border-radius: 3px; }
      `}</style>

      {/* HEADER */}
      <div style={{ position: 'sticky', top: 0, zIndex: 10, background: 'rgba(8,12,20,0.98)', borderBottom: '1px solid #1E2D42', padding: '0 44px', height: 56, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
            <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#C8952A' }} />
            <span style={{ fontSize: 13, fontWeight: 700, color: '#ccd8e0', letterSpacing: 3 }}>KONKLAVE ADMIN</span>
          </div>
          <div style={{ width: 1, height: 18, background: '#1E2D42' }} />
          <span style={{ fontSize: 8, color: '#C8952A', letterSpacing: 2 }}>PAINEL DE CONTROLE</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          {lastUpdated && (
            <span style={{ fontSize: 8, color: '#3A5A70', letterSpacing: 1 }}>
              Última atualização: {lastUpdated}
            </span>
          )}
          <button
            onClick={() => fetchStats(storedPwd)}
            disabled={loading}
            style={{ padding: '7px 16px', background: loading ? 'transparent' : 'rgba(200,149,42,0.08)', color: loading ? '#3A5A70' : '#C8952A', border: `1px solid ${loading ? '#1E2D42' : 'rgba(200,149,42,0.3)'}`, borderRadius: 2, fontFamily: "'Space Mono', monospace", fontSize: 8, letterSpacing: 2, cursor: loading ? 'default' : 'pointer', transition: 'all 0.2s' }}
          >
            {loading ? '...' : 'ATUALIZAR'}
          </button>
          <button
            onClick={handleLogout}
            style={{ padding: '7px 16px', background: 'transparent', color: '#6A8AA8', border: '1px solid #1E2D42', borderRadius: 2, fontFamily: "'Space Mono', monospace", fontSize: 8, letterSpacing: 2, cursor: 'pointer' }}
          >
            SAIR
          </button>
        </div>
      </div>

      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '40px 40px 80px' }}>

        {/* Loading */}
        {loading && !s && (
          <div style={{ textAlign: 'center', padding: '80px 0', fontFamily: "'Libre Baskerville', Georgia, serif", fontSize: 14, color: '#3A5A70', fontStyle: 'italic' }}>
            Carregando dados...
          </div>
        )}

        {s && (
          <>
            {/* ── STAT CARDS ── */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 28 }}>
              <StatCard label="Total de Usuários"  value={s.totalUsers}   sub="cadastros"          color="#C8952A" />
              <StatCard label="Total de Debates"   value={s.totalDebates} sub="sessões realizadas"  color="#3DAA6E" />
              <StatCard label="Avaliação Média"    value={`${s.avgRating} ★`} sub="de 5.0"         color="#4A8FD4" />
              <StatCard label="Total de Feedbacks" value={s.totalFeedbacks} sub="avaliações"        color="#A85CD4" />
            </div>

            {/* ── CHARTS ── */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 28 }}>
              <BarChart data={s.usersPerDay}   color="#C8952A" title="NOVOS USUÁRIOS — ÚLTIMOS 14 DIAS" />
              <BarChart data={s.debatesPerDay} color="#4A8FD4" title="DEBATES POR DIA — ÚLTIMOS 14 DIAS" />
            </div>

            {/* ── TOP USERS + RATING DISTRIBUTION ── */}
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 16, marginBottom: 28 }}>

              {/* Top Users Table */}
              <div style={{ background: '#0F1520', border: '1px solid #1E2D42', borderRadius: 2, overflow: 'hidden' }}>
                <div style={{ padding: '18px 24px', borderBottom: '1px solid #1E2D42' }}>
                  <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 9, color: '#C8952A', letterSpacing: 3 }}>USUÁRIOS MAIS ATIVOS</div>
                </div>
                {/* Table header */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr 70px 90px', padding: '10px 24px', borderBottom: '1px solid #1E2D42', background: '#0A0F1A' }}>
                  {['NOME', 'EMAIL', 'DEBATES', 'CADASTRO'].map(h => (
                    <div key={h} style={{ fontFamily: "'Space Mono', monospace", fontSize: 7, color: '#C8952A', letterSpacing: 2 }}>{h}</div>
                  ))}
                </div>
                {s.topUsers.length === 0 && (
                  <div style={{ padding: '28px 24px', fontFamily: "'Libre Baskerville', Georgia, serif", fontSize: 12, color: '#3A5A70', fontStyle: 'italic' }}>
                    Nenhum dado disponível.
                  </div>
                )}
                {s.topUsers.map((u, i) => (
                  <div
                    key={`${u.email}-${i}`}
                    style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr 70px 90px', padding: '13px 24px', background: i % 2 === 1 ? 'rgba(255,255,255,0.018)' : 'transparent', borderBottom: '1px solid rgba(30,45,66,0.5)' }}
                  >
                    <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 9, color: '#C8D8E8', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', paddingRight: 10 }}>{u.nome || '—'}</div>
                    <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 8, color: '#6A8AA8', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', paddingRight: 10 }}>{u.email}</div>
                    <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 11, color: '#C8952A', fontWeight: 700 }}>{u.usos ?? 0}</div>
                    <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 8, color: '#3A5A70' }}>
                      {u.criado_em ? new Date(u.criado_em).toLocaleDateString('pt-BR') : '—'}
                    </div>
                  </div>
                ))}
              </div>

              {/* Rating Distribution */}
              <div style={{ background: '#0F1520', border: '1px solid #1E2D42', borderRadius: 2, padding: '24px' }}>
                <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 9, color: '#C8952A', letterSpacing: 3, marginBottom: 24 }}>DISTRIBUIÇÃO DE AVALIAÇÕES</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                  {s.ratingDistribution.map(r => {
                    const total = s.ratingDistribution.reduce((sum, x) => sum + x.count, 0)
                    const pct = total > 0 ? (r.count / total) * 100 : 0
                    return (
                      <div key={r.rating} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 9, color: '#C8952A', width: 26, textAlign: 'right', flexShrink: 0 }}>{r.rating}★</div>
                        <div style={{ flex: 1, height: 8, background: '#0B1018', borderRadius: 4, overflow: 'hidden' }}>
                          <div style={{ height: '100%', width: `${pct}%`, background: '#C8952A', borderRadius: 4, minWidth: pct > 0 ? 4 : 0, transition: 'width 0.5s ease' }} />
                        </div>
                        <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 8, color: '#6A8AA8', width: 28, textAlign: 'right', flexShrink: 0 }}>{r.count}</div>
                      </div>
                    )
                  })}
                </div>
                {s.totalFeedbacks > 0 && (
                  <div style={{ marginTop: 24, paddingTop: 20, borderTop: '1px solid #1E2D42', fontFamily: "'Space Mono', monospace", fontSize: 8, color: '#3A5A70', letterSpacing: 1 }}>
                    {s.totalFeedbacks} avaliações no total
                  </div>
                )}
              </div>
            </div>

            {/* ── RECENT FEEDBACKS ── */}
            <div style={{ background: '#0F1520', border: '1px solid #1E2D42', borderRadius: 2, overflow: 'hidden' }}>
              <div style={{ padding: '18px 24px', borderBottom: '1px solid #1E2D42' }}>
                <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 9, color: '#C8952A', letterSpacing: 3 }}>FEEDBACKS RECENTES</div>
              </div>
              {s.recentFeedbacks.length === 0 && (
                <div style={{ padding: '28px 24px', fontFamily: "'Libre Baskerville', Georgia, serif", fontSize: 12, color: '#3A5A70', fontStyle: 'italic' }}>
                  Nenhum feedback ainda.
                </div>
              )}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)' }}>
                {s.recentFeedbacks.map((f, i) => (
                  <div
                    key={i}
                    style={{ padding: '18px 20px', borderBottom: '1px solid rgba(30,45,66,0.6)', borderRight: i % 2 === 0 ? '1px solid rgba(30,45,66,0.6)' : 'none', background: i % 4 < 2 ? 'transparent' : 'rgba(255,255,255,0.012)' }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                      <div style={{ fontSize: 14, color: '#C8952A', letterSpacing: 3 }}>
                        {'★'.repeat(f.rating)}
                        <span style={{ color: '#1E2D42' }}>{'★'.repeat(5 - f.rating)}</span>
                      </div>
                      <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 7, color: '#3A5A70' }}>
                        {f.criado_em ? new Date(f.criado_em).toLocaleDateString('pt-BR') : '—'}
                      </div>
                    </div>
                    {f.comment && (
                      <p style={{ fontFamily: "'Libre Baskerville', Georgia, serif", fontSize: 12, color: '#B0C4D8', lineHeight: 1.65, marginBottom: 8 }}>
                        &ldquo;{f.comment}&rdquo;
                      </p>
                    )}
                    {f.questao && (
                      <p style={{ fontFamily: "'Libre Baskerville', Georgia, serif", fontSize: 11, color: '#6A8AA8', fontStyle: 'italic', marginBottom: 6 }}>
                        {f.questao.slice(0, 100)}{f.questao.length > 100 ? '...' : ''}
                      </p>
                    )}
                    <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 7, color: '#2A3A4A', letterSpacing: 1 }}>
                      {f.email || 'anônimo'}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
