import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Konklave',
  description: 'AI models debating questions in structured phases',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR">
      <head>
        <meta charSet="UTF-8" />
      </head>
      <body className={`${inter.className} bg-[#070910] text-gray-100 min-h-screen`}>
        {children}
      </body>
    </html>
  )
}
