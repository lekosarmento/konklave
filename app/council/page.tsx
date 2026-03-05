'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import CouncilApp from '@/components/council/CouncilApp'

interface KonklaveUser {
  nome: string
  email: string
  whatsapp?: string
  usos: number
}

export default function CouncilPage() {
  const router = useRouter()
  const [user, setUser] = useState<KonklaveUser | null>(null)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    const raw = localStorage.getItem('konklave_user')
    if (!raw) {
      router.replace('/cadastro')
      return
    }
    const parsed: KonklaveUser = JSON.parse(raw)
    setUser(parsed)
    setReady(true)
  }, [router])

  if (!ready || !user) return null

  return <CouncilApp user={user} />
}
