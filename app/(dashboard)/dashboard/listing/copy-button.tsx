'use client'

import { useState } from 'react'
import { Copy, Check } from 'lucide-react'

export function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    await navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <button
      onClick={handleCopy}
      className="p-2 rounded-[2px] bg-white hover:bg-[var(--cream)] border border-[var(--border-light)] text-[var(--muted-text)] hover:text-[var(--primary-accent)] transition-all duration-200"
      title="Copy to clipboard"
    >
      {copied ? (
        <Check className="w-4 h-4 text-[var(--primary-accent)]" />
      ) : (
        <Copy className="w-4 h-4" />
      )}
    </button>
  )
}
