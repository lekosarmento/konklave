'use client'
import { useEffect, useRef } from 'react'

interface Particle {
  x: number
  y: number
  vx: number
  vy: number
  size: number
  opacity: number
  pulseSpeed: number
  pulseOffset: number
}

export default function ParticleBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let animationId: number
    let particles: Particle[] = []
    let mouseX = 0
    let mouseY = 0

    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
      initParticles()
    }

    const initParticles = () => {
      const isMobile = window.innerWidth < 768
      const divisor = isMobile ? 36000 : 18000
      const count = Math.floor((canvas.width * canvas.height) / divisor)
      particles = Array.from({ length: count }, () => ({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.15,
        vy: (Math.random() - 0.5) * 0.15,
        size: Math.random() * 1.5 + 0.3,
        opacity: Math.random() * 0.5 + 0.1,
        pulseSpeed: Math.random() * 0.02 + 0.005,
        pulseOffset: Math.random() * Math.PI * 2,
      }))
    }

    const drawConnections = (p: Particle, others: Particle[]) => {
      others.forEach(other => {
        const dx = p.x - other.x
        const dy = p.y - other.y
        const dist = Math.sqrt(dx * dx + dy * dy)
        if (dist < 120) {
          const opacity = (1 - dist / 120) * 0.08
          ctx.beginPath()
          ctx.moveTo(p.x, p.y)
          ctx.lineTo(other.x, other.y)
          ctx.strokeStyle = `rgba(200, 149, 42, ${opacity})`
          ctx.lineWidth = 0.5
          ctx.stroke()
        }
      })
    }

    let t = 0
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      t += 0.01

      particles.forEach((p, i) => {
        // Subtle mouse attraction
        const mdx = mouseX - p.x
        const mdy = mouseY - p.y
        const mdist = Math.sqrt(mdx * mdx + mdy * mdy)
        if (mdist < 200) {
          p.vx += (mdx / mdist) * 0.002
          p.vy += (mdy / mdist) * 0.002
        }

        p.x += p.vx
        p.y += p.vy

        // Dampen velocity
        p.vx *= 0.99
        p.vy *= 0.99

        // Wrap around edges
        if (p.x < 0) p.x = canvas.width
        if (p.x > canvas.width) p.x = 0
        if (p.y < 0) p.y = canvas.height
        if (p.y > canvas.height) p.y = 0

        // Pulsing opacity
        const pulse = Math.sin(t * p.pulseSpeed * 100 + p.pulseOffset) * 0.2
        const currentOpacity = Math.max(0.05, p.opacity + pulse)

        // Draw connections
        drawConnections(p, particles.slice(i + 1, i + 8))

        // Draw particle
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(200, 149, 42, ${currentOpacity})`
        ctx.fill()
      })

      animationId = requestAnimationFrame(animate)
    }

    const handleMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX
      mouseY = e.clientY
    }

    resize()
    animate()
    window.addEventListener('resize', resize)
    window.addEventListener('mousemove', handleMouseMove)

    return () => {
      cancelAnimationFrame(animationId)
      window.removeEventListener('resize', resize)
      window.removeEventListener('mousemove', handleMouseMove)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
      style={{ opacity: 0.6 }}
    />
  )
}
