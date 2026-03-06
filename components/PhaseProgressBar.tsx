'use client'
import { motion } from 'framer-motion'

const PHASES = ['opinions', 'debate', 'replica', 'treplica', 'verdict']

interface Props {
  currentPhase: string
}

export default function PhaseProgressBar({ currentPhase }: Props) {
  const currentIndex = PHASES.indexOf(currentPhase)
  if (currentIndex === -1) return null

  const progress = ((currentIndex + 1) / PHASES.length) * 100

  return (
    <div className="w-full h-px bg-[#1E2D42] relative my-4">
      <motion.div
        className="absolute top-0 left-0 h-full bg-[#C8952A]"
        initial={{ width: 0 }}
        animate={{ width: `${progress}%` }}
        transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
      />
      {/* Glowing tip */}
      <div
        className="absolute top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-[#C8952A]"
        style={{ left: `${progress}%`, transform: 'translateX(-50%) translateY(-50%)' }}
      >
        <motion.div
          className="absolute inset-0 rounded-full bg-[#C8952A]"
          animate={{ scale: [1, 2, 1], opacity: [1, 0, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
      </div>
    </div>
  )
}
