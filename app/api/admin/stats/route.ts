import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase-server'

function groupByDate(data: Record<string, string>[], field: string, days: number): { date: string; count: number }[] {
  const counts: Record<string, number> = {}
  const now = new Date()
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(now)
    d.setDate(d.getDate() - i)
    counts[d.toISOString().slice(0, 10)] = 0
  }
  data.forEach(row => {
    const val = row[field]
    if (val) {
      const key = String(val).slice(0, 10)
      if (key in counts) counts[key]++
    }
  })
  return Object.entries(counts)
    .map(([date, count]) => ({ date, count }))
    .sort((a, b) => a.date.localeCompare(b.date))
}

export async function GET(req: NextRequest) {
  const adminPassword = process.env.ADMIN_PASSWORD || 'konklave2024'
  if (req.headers.get('x-admin-password') !== adminPassword) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const supabase = createServiceClient()

  const errors: Record<string, unknown> = {}

  // ── TABLE STRUCTURE CHECK ─────────────────────────────────
  const tableCheck = await supabase.from('leads').select('*').limit(3)
  console.log('[admin/stats] leads sample:', JSON.stringify(tableCheck))
  if (tableCheck.error) errors['tableCheck'] = tableCheck.error

  // ── LEADS COUNT ───────────────────────────────────────────
  const leadsCount = await supabase.from('leads').select('*', { count: 'exact', head: true })
  console.log('[admin/stats] leadsCount:', JSON.stringify(leadsCount))
  if (leadsCount.error) errors['leadsCount'] = leadsCount.error

  // ── USOS SUM ──────────────────────────────────────────────
  const usosData = await supabase.from('leads').select('usos')
  console.log('[admin/stats] usosData sample:', JSON.stringify({ error: usosData.error, count: usosData.data?.length, sample: usosData.data?.slice(0, 3) }))
  if (usosData.error) errors['usosData'] = usosData.error

  // ── FEEDBACKS COUNT + RATINGS ─────────────────────────────
  const feedbacksCount = await supabase.from('feedbacks').select('*', { count: 'exact', head: true })
  console.log('[admin/stats] feedbacksCount:', JSON.stringify(feedbacksCount))
  if (feedbacksCount.error) errors['feedbacksCount'] = feedbacksCount.error

  const ratingsData = await supabase.from('feedbacks').select('rating')
  console.log('[admin/stats] ratingsData sample:', JSON.stringify({ error: ratingsData.error, count: ratingsData.data?.length, sample: ratingsData.data?.slice(0, 3) }))
  if (ratingsData.error) errors['ratingsData'] = ratingsData.error

  // ── LEADS DATE FIELD — try criado_em first, fallback created_at ──
  let leadsDateField = 'criado_em'
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let leadsWithDates: { data: any[] | null; error: any } = await supabase.from('leads').select('criado_em').order('criado_em', { ascending: false }).limit(500)
  console.log('[admin/stats] leads criado_em attempt:', JSON.stringify({ error: leadsWithDates.error, count: leadsWithDates.data?.length }))

  if (leadsWithDates.error || !leadsWithDates.data?.length) {
    leadsDateField = 'created_at'
    leadsWithDates = await supabase.from('leads').select('created_at').order('created_at', { ascending: false }).limit(500)
    console.log('[admin/stats] leads created_at fallback:', JSON.stringify({ error: leadsWithDates.error, count: leadsWithDates.data?.length }))
  }
  if (leadsWithDates.error) errors['leadsWithDates'] = leadsWithDates.error

  // ── FEEDBACKS DATE FIELD — try criado_em first, fallback created_at ──
  let feedbacksDateField = 'criado_em'
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let feedbacksWithDates: { data: any[] | null; error: any } = await supabase.from('feedbacks').select('criado_em').order('criado_em', { ascending: false }).limit(500)
  console.log('[admin/stats] feedbacks criado_em attempt:', JSON.stringify({ error: feedbacksWithDates.error, count: feedbacksWithDates.data?.length }))

  if (feedbacksWithDates.error || !feedbacksWithDates.data?.length) {
    feedbacksDateField = 'created_at'
    feedbacksWithDates = await supabase.from('feedbacks').select('created_at').order('created_at', { ascending: false }).limit(500)
    console.log('[admin/stats] feedbacks created_at fallback:', JSON.stringify({ error: feedbacksWithDates.error, count: feedbacksWithDates.data?.length }))
  }
  if (feedbacksWithDates.error) errors['feedbacksWithDates'] = feedbacksWithDates.error

  // ── TOP USERS — try criado_em first, fallback created_at ──
  let topUsersDateField = 'criado_em'
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let topUsers: { data: any[] | null; error: any } = await supabase.from('leads').select('nome, email, usos, criado_em').order('usos', { ascending: false }).limit(10)
  console.log('[admin/stats] topUsers criado_em attempt:', JSON.stringify({ error: topUsers.error, count: topUsers.data?.length }))

  if (topUsers.error) {
    topUsersDateField = 'created_at'
    topUsers = await supabase.from('leads').select('nome, email, usos, created_at').order('usos', { ascending: false }).limit(10)
    console.log('[admin/stats] topUsers created_at fallback:', JSON.stringify({ error: topUsers.error, count: topUsers.data?.length }))
  }
  if (topUsers.error) errors['topUsers'] = topUsers.error

  // ── RECENT FEEDBACKS ──────────────────────────────────────
  const recentFeedbacks = await supabase.from('feedbacks').select('email, rating, comentario, questao, criado_em').order('criado_em', { ascending: false }).limit(20)
  console.log('[admin/stats] recentFeedbacks:', JSON.stringify({ error: recentFeedbacks.error, count: recentFeedbacks.data?.length, sample: recentFeedbacks.data?.[0] }))
  if (recentFeedbacks.error) errors['recentFeedbacks'] = recentFeedbacks.error

  // ── COMPUTE ───────────────────────────────────────────────
  const totalDebates = usosData.data?.reduce((sum, r) => sum + (r.usos || 0), 0) ?? 0
  const avgRating =
    ratingsData.data && ratingsData.data.length > 0
      ? Math.round((ratingsData.data.reduce((sum: number, r: { rating: number }) => sum + (r.rating || 0), 0) / ratingsData.data.length) * 10) / 10
      : 0

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const topUsersFormatted = (topUsers.data ?? []).map((u: any) => ({
    nome: u.nome,
    email: u.email,
    usos: u.usos,
    criado_em: u[topUsersDateField],
  }))

  return NextResponse.json({
    totalUsers: leadsCount.count ?? 0,
    totalDebates,
    totalFeedbacks: feedbacksCount.count ?? 0,
    avgRating,
    usersPerDay: groupByDate((leadsWithDates.data ?? []) as Record<string, string>[], leadsDateField, 14),
    debatesPerDay: groupByDate((feedbacksWithDates.data ?? []) as Record<string, string>[], feedbacksDateField, 14),
    topUsers: topUsersFormatted,
    recentFeedbacks: recentFeedbacks.data ?? [],
    ratingDistribution: [5, 4, 3, 2, 1].map(r => ({
      rating: r,
      count: ratingsData.data?.filter((d: { rating: number }) => d.rating === r).length ?? 0,
    })),
    debug: {
      errors: Object.keys(errors).length > 0 ? errors : null,
      leadsDateFieldUsed: leadsDateField,
      feedbacksDateFieldUsed: feedbacksDateField,
      tableCheck: {
        error: tableCheck.error,
        rowCount: tableCheck.data?.length ?? 0,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        columns: tableCheck.data?.[0] ? Object.keys(tableCheck.data[0] as any) : [],
        sample: tableCheck.data ?? [],
      },
    },
  })
}
