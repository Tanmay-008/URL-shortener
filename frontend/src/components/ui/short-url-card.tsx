import React, { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Copy, Check, ExternalLink, Sparkles } from 'lucide-react'

interface ShortUrlCardProps {
  shortUrl: string
}

export const ShortUrlCard: React.FC<ShortUrlCardProps> = ({ shortUrl }) => {
  const [copied, setCopied] = useState(false)

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(shortUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy text: ', err)
    }
  }

  if (!shortUrl) return null

  return (
    <div className="mt-4 p-4 rounded-xl bg-slate-950/80 border border-slate-800 animate-in slide-in-from-top-4 fade-in duration-300">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-1.5 text-xs font-semibold text-cyan-400">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Your Shortened Link</span>
        </div>
        {copied && (
          <span className="text-[11px] font-medium text-emerald-400 animate-pulse">
            Copied to clipboard!
          </span>
        )}
      </div>

      <div className="flex items-center gap-2">
        <Input
          readOnly
          value={shortUrl}
          className="bg-slate-900 border-slate-700 text-cyan-400 font-medium font-mono text-sm focus-visible:ring-cyan-500/50"
        />
        <Button
          variant="outline"
          size="icon"
          className="shrink-0 border-slate-700 bg-slate-900 hover:bg-slate-800 hover:text-slate-200 text-slate-300 transition-all cursor-pointer"
          onClick={copyToClipboard}
          title="Copy to clipboard"
        >
          {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
        </Button>
        <a
          href={shortUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center w-9 h-9 rounded-md border border-slate-700 bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-cyan-400 transition-all shrink-0"
          title="Open in new tab"
        >
          <ExternalLink className="w-4 h-4" />
        </a>
      </div>
    </div>
  )
}
