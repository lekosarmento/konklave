'use client'

import { useState, useEffect, useCallback } from 'react'

interface DayCount { date: string; count: number }
interface TopUser { nome: string; email: string; usos: number; criado_em: string }
interface RecentFeedback { email: string; rating: number; comentario: string | null; questao: string | null; criado_em: string }
interface RatingDist { rating: number; count: number }
interface Retention { onetime: number; returning: number; power: number }
interface RecentDebate { email: string | null; questao: string | null; rating: number | null; criado_em: string }

interface Stats {
  totalUsers: number
  totalDebates: number
  totalFeedbacks: number
  avgRating: number
  usersPerDay: DayCount[]
  debatesPerDay: DayCount[]
  topUsers: TopUser[]
  recentFeedbacks: RecentFeedback[]
  recentDebates: RecentDebate[]
  ratingDistribution: RatingDist[]
  retention: Retention
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

// ─── RETENTION CHART ──────────────────────────────────────────
function RetentionChart({ retention }: { retention: Retention }) {
  const total = retention.onetime + retention.returning + retention.power || 1
  const rows = [
    { label: '1 debate', count: retention.onetime, color: '#6A8AA8' },
    { label: '2–3 debates', count: retention.returning, color: '#C8952A' },
    { label: '4+ debates', count: retention.power, color: '#4CAF50' },
  ]
  return (
    <div style={{ background: '#0F1520', border: '1px solid #1E2D42', borderTop: '2px solid rgba(200,149,42,0.3)', borderRadius: 2, padding: '24px' }}>
      <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 9, color: '#C8952A', letterSpacing: 3, marginBottom: 24 }}>RETENÇÃO DE USUÁRIOS</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        {rows.map(r => (
          <div key={r.label} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 8, color: '#6A8AA8', width: 70, flexShrink: 0 }}>{r.label}</div>
            <div style={{ flex: 1, height: 8, background: '#0B1018', borderRadius: 4, overflow: 'hidden' }}>
              <div style={{ height: '100%', width: `${(r.count / total) * 100}%`, background: r.color, borderRadius: 4, minWidth: r.count > 0 ? 4 : 0, transition: 'width 0.5s ease' }} />
            </div>
            <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 9, color: r.color, width: 24, textAlign: 'right', flexShrink: 0, fontWeight: 700 }}>{r.count}</div>
          </div>
        ))}
      </div>
      <div style={{ marginTop: 20, paddingTop: 16, borderTop: '1px solid #1E2D42', fontFamily: "'Space Mono', monospace", fontSize: 8, color: '#3A5A70', letterSpacing: 1 }}>
        {total} usuário{total !== 1 ? 's' : ''} com pelo menos 1 debate
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

  const handleExportCSV = () => {
    if (!stats) return
    const headers = ['Nome', 'Email', 'Debates', 'Cadastro']
    const rows = stats.topUsers.map(u => [
      u.nome,
      u.email,
      u.usos,
      new Date(u.criado_em).toLocaleDateString('pt-BR'),
    ])
    const csv = [headers, ...rows].map(r => r.join(',')).join('\n')
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `konklave-leads-${new Date().toISOString().split('T')[0]}.csv`
    link.click()
    URL.revokeObjectURL(url)
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
        .adm-header { padding: 0 44px; }
        .adm-body { padding: 40px 40px 80px; }
        .adm-stat-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; margin-bottom: 28px; }
        .adm-chart-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 28px; }
        .adm-retention-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 28px; }
        .adm-users-grid { display: grid; grid-template-columns: 2fr 1fr; gap: 16px; margin-bottom: 28px; }
        .adm-feedback-grid { display: grid; grid-template-columns: repeat(2, 1fr); }
        .adm-header-right { display: flex; align-items: center; gap: 16px; }
        .adm-header-updated { display: block; }
        .adm-table-wrap { overflow-x: auto; }
        .adm-export-btn { border: 1px solid #C8952A; color: #C8952A; font-family: 'Space Mono', monospace; font-size: 8px; letter-spacing: 2px; padding: 7px 16px; background: transparent; border-radius: 2px; cursor: pointer; transition: all 0.2s; }
        .adm-export-btn:hover { background: #C8952A; color: #080C14; }
        @media (max-width: 767px) {
          .adm-header { padding: 0 16px; }
          .adm-body { padding: 20px 16px 60px; }
          .adm-stat-grid { grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 16px; }
          .adm-chart-grid { grid-template-columns: 1fr; gap: 12px; margin-bottom: 16px; }
          .adm-retention-grid { grid-template-columns: 1fr; gap: 12px; margin-bottom: 16px; }
          .adm-users-grid { grid-template-columns: 1fr; gap: 12px; margin-bottom: 16px; }
          .adm-feedback-grid { grid-template-columns: 1fr; }
          .adm-header-updated { display: none; }
        }
        @media (min-width: 768px) and (max-width: 1024px) {
          .adm-header { padding: 0 24px; }
          .adm-body { padding: 28px 24px 60px; }
          .adm-stat-grid { grid-template-columns: repeat(2, 1fr); gap: 14px; }
          .adm-chart-grid { grid-template-columns: 1fr; }
          .adm-retention-grid { grid-template-columns: 1fr; }
          .adm-users-grid { grid-template-columns: 1fr; }
        }
      `}</style>

      {/* HEADER */}
      <div className="adm-header" style={{ position: 'sticky', top: 0, zIndex: 10, background: 'rgba(8,12,20,0.98)', borderBottom: '1px solid #1E2D42', height: 56, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
            <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#C8952A' }} />
            <span style={{ fontSize: 13, fontWeight: 700, color: '#ccd8e0', letterSpacing: 3 }}>KONKLAVE ADMIN</span>
          </div>
          <div style={{ width: 1, height: 18, background: '#1E2D42' }} />
          <span style={{ fontSize: 8, color: '#C8952A', letterSpacing: 2 }}>PAINEL DE CONTROLE</span>
        </div>
        <div className="adm-header-right">
          {lastUpdated && (
            <span className="adm-header-updated" style={{ fontSize: 8, color: '#3A5A70', letterSpacing: 1 }}>
              Última atualização: {lastUpdated}
            </span>
          )}
          {s && (
            <button className="adm-export-btn" onClick={handleExportCSV}>
              EXPORTAR CSV
            </button>
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

      <div className="adm-body" style={{ maxWidth: 1200, margin: '0 auto' }}>

        {/* Loading */}
        {loading && !s && (
          <div style={{ textAlign: 'center', padding: '80px 0', fontFamily: "'Libre Baskerville', Georgia, serif", fontSize: 14, color: '#3A5A70', fontStyle: 'italic' }}>
            Carregando dados...
          </div>
        )}

        {s && (
          <>
            {/* ── STAT CARDS ── */}
            <div className="adm-stat-grid">
              <StatCard label="Total de Usuários"  value={s.totalUsers}   sub="cadastros"          color="#C8952A" />
              <StatCard label="Total de Debates"   value={s.totalDebates} sub="sessões realizadas"  color="#3DAA6E" />
              <StatCard label="Avaliação Média"    value={`${s.avgRating} ★`} sub="de 5.0"         color="#4A8FD4" />
              <StatCard label="Total de Feedbacks" value={s.totalFeedbacks} sub="avaliações"        color="#A85CD4" />
            </div>

            {/* ── CHARTS ── */}
            <div className="adm-chart-grid">
              <BarChart data={s.usersPerDay}   color="#C8952A" title="NOVOS USUÁRIOS — ÚLTIMOS 14 DIAS" />
              <BarChart data={s.debatesPerDay} color="#4A8FD4" title="DEBATES POR DIA — ÚLTIMOS 14 DIAS" />
            </div>

            {/* ── RETENTION ── */}
            {s.retention && (
              <div className="adm-retention-grid">
                <RetentionChart retention={s.retention} />
                {/* Rating Distribution */}
                <div style={{ background: '#0F1520', border: '1px solid #1E2D42', borderTop: '2px solid rgba(200,149,42,0.3)', borderRadius: 2, padding: '24px' }}>
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
            )}

            {/* ── TOP USERS ── */}
            <div style={{ marginBottom: 28 }}>
              <div style={{ background: '#0F1520', border: '1px solid #1E2D42', borderRadius: 2, overflow: 'hidden' }}>
                <div style={{ padding: '18px 24px', borderBottom: '1px solid #1E2D42', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 9, color: '#C8952A', letterSpacing: 3 }}>USUÁRIOS MAIS ATIVOS</div>
                  <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 8, color: '#3A5A70' }}>{s.topUsers.length} total · exibindo top 10</div>
                </div>
                <div className="adm-table-wrap">
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr 70px 90px', minWidth: 320, padding: '10px 24px', borderBottom: '1px solid #1E2D42', background: '#0A0F1A' }}>
                    {['NOME', 'EMAIL', 'DEBATES', 'CADASTRO'].map(h => (
                      <div key={h} style={{ fontFamily: "'Space Mono', monospace", fontSize: 7, color: '#C8952A', letterSpacing: 2 }}>{h}</div>
                    ))}
                  </div>
                  {s.topUsers.length === 0 && (
                    <div style={{ padding: '28px 24px', fontFamily: "'Libre Baskerville', Georgia, serif", fontSize: 12, color: '#3A5A70', fontStyle: 'italic' }}>
                      Nenhum dado disponível.
                    </div>
                  )}
                  {s.topUsers.slice(0, 10).map((u, i) => (
                    <div
                      key={`${u.email}-${i}`}
                      style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr 70px 90px', minWidth: 320, padding: '13px 24px', background: i % 2 === 1 ? 'rgba(255,255,255,0.018)' : 'transparent', borderBottom: '1px solid rgba(30,45,66,0.5)' }}
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
              </div>
            </div>

            {/* ── RECENT FEEDBACKS ── */}
            <div style={{ background: '#0F1520', border: '1px solid #1E2D42', borderRadius: 2, overflow: 'hidden', marginBottom: 28 }}>
              <div style={{ padding: '18px 24px', borderBottom: '1px solid #1E2D42' }}>
                <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 9, color: '#C8952A', letterSpacing: 3 }}>FEEDBACKS RECENTES</div>
              </div>
              {s.recentFeedbacks.length === 0 && (
                <div style={{ padding: '28px 24px', fontFamily: "'Libre Baskerville', Georgia, serif", fontSize: 12, color: '#3A5A70', fontStyle: 'italic' }}>
                  Nenhum feedback ainda.
                </div>
              )}
              <div className="adm-feedback-grid">
                {s.recentFeedbacks.map((f, i) => (
                  <div
                    key={i}
                    style={{ padding: '18px 20px', borderBottom: '1px solid rgba(30,45,66,0.6)', borderRight: i % 2 === 0 ? '1px solid rgba(30,45,66,0.6)' : 'none', background: i % 4 < 2 ? 'transparent' : 'rgba(255,255,255,0.012)' }}
                  >
                    {/* Stars + date */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                      <div style={{ fontSize: 14, color: '#C8952A', letterSpacing: 3 }}>
                        {'★'.repeat(f.rating)}
                        <span style={{ color: '#1E2D42' }}>{'★'.repeat(5 - f.rating)}</span>
                      </div>
                      <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 7, color: '#3A5A70' }}>
                        {f.criado_em ? new Date(f.criado_em).toLocaleDateString('pt-BR') : '—'}
                      </div>
                    </div>
                    {/* Comment (main text) */}
                    {f.comentario ? (
                      <p style={{ fontFamily: "'Libre Baskerville', Georgia, serif", fontSize: 12, color: '#B0C4D8', lineHeight: 1.65, marginBottom: 8 }}>
                        &ldquo;{f.comentario}&rdquo;
                      </p>
                    ) : (
                      <p style={{ fontFamily: "'Libre Baskerville', Georgia, serif", fontSize: 11, color: '#2A3A4A', fontStyle: 'italic', marginBottom: 8 }}>
                        sem comentário
                      </p>
                    )}
                    {/* Question (subtitle) */}
                    {f.questao && (
                      <p style={{ fontFamily: "'Space Mono', monospace", fontSize: 8, color: '#4A6A80', fontStyle: 'italic', marginBottom: 6, lineHeight: 1.5 }}>
                        Questão: {f.questao.slice(0, 60)}{f.questao.length > 60 ? '...' : ''}
                      </p>
                    )}
                    {/* Email */}
                    <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 7, color: '#2A3A4A', letterSpacing: 1 }}>
                      {f.email || 'anônimo'}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* ── ÚLTIMOS DEBATES ── */}
            {s.recentDebates && s.recentDebates.length > 0 && (
              <div style={{ background: '#0F1520', border: '1px solid #1E2D42', borderRadius: 2, overflow: 'hidden', marginBottom: 28 }}>
                <div style={{ padding: '18px 24px', borderBottom: '1px solid #1E2D42' }}>
                  <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 9, color: '#C8952A', letterSpacing: 3 }}>ÚLTIMOS DEBATES</div>
                </div>
                <div className="adm-table-wrap">
                  <div style={{ display: 'grid', gridTemplateColumns: '3fr 1.5fr 80px 80px', minWidth: 480, padding: '10px 24px', borderBottom: '1px solid #1E2D42', background: '#0A0F1A' }}>
                    {['QUESTÃO', 'USUÁRIO', 'AVALIAÇÃO', 'DATA'].map(h => (
                      <div key={h} style={{ fontFamily: "'Space Mono', monospace", fontSize: 7, color: '#C8952A', letterSpacing: 2 }}>{h}</div>
                    ))}
                  </div>
                  {s.recentDebates.map((d, i) => (
                    <div
                      key={i}
                      style={{ display: 'grid', gridTemplateColumns: '3fr 1.5fr 80px 80px', minWidth: 480, padding: '13px 24px', background: i % 2 === 1 ? 'rgba(255,255,255,0.018)' : 'transparent', borderBottom: '1px solid rgba(30,45,66,0.5)' }}
                    >
                      <div style={{ fontFamily: "'Libre Baskerville', Georgia, serif", fontSize: 11, color: '#B0C4D8', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', paddingRight: 16 }}>
                        {d.questao ? `${d.questao.slice(0, 80)}${d.questao.length > 80 ? '...' : ''}` : '—'}
                      </div>
                      <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 8, color: '#6A8AA8', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', paddingRight: 10 }}>
                        {d.email || 'anônimo'}
                      </div>
                      <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 10, color: '#C8952A' }}>
                        {d.rating ? '★'.repeat(d.rating) : <span style={{ color: '#2A3A4A' }}>—</span>}
                      </div>
                      <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 8, color: '#3A5A70' }}>
                        {d.criado_em ? new Date(d.criado_em).toLocaleDateString('pt-BR') : '—'}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
