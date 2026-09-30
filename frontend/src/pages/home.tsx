import { useState } from 'react'
import axios from 'axios'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ExpirySelector } from '@/components/ui/expiry-selector'
import { Link, Copy, Check, ArrowRight, AlertCircle } from 'lucide-react'

export default function Home() {
  const [url, setUrl] = useState('')
  const [expirationTime, setExpirationTime] = useState(1)
  const [shortUrl, setShortUrl] = useState('')
  const [copied, setCopied] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!url) return

    setLoading(true)
    setError('')
    setShortUrl('')

    try {
      const response = await axios.post('http://localhost:4000/api/v1/url/create-short-url', {
        url,
        expirationTime
      })

      if (response.data?.data?.shortUrl) {
        setShortUrl(response.data.data.shortUrl)
      } else {
        setShortUrl('https://url-shortener.tanmayshirbhayye.tech/' + (response.data?.data?.shortUrlCode || ''))
      }
      setCopied(false)
    } catch (err: any) {
      console.error(err)
      setError(err.response?.data?.message || 'Failed to generate short URL. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(shortUrl)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[40%] -left-[20%] w-[70%] h-[70%] rounded-full bg-violet-600/20 blur-[120px]" />
        <div className="absolute -bottom-[40%] -right-[20%] w-[70%] h-[70%] rounded-full bg-cyan-600/20 blur-[120px]" />
      </div>

      <div className="z-10 w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center p-3 bg-white/5 rounded-2xl mb-4 ring-1 ring-white/10 shadow-2xl">
            <Link className="w-8 h-8 text-cyan-400" />
          </div>
          <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-violet-500 mb-2">
            URL Shortener
          </h1>
          <p className="text-slate-400">
            Paste your long link and we'll shrink it for you.
          </p>
        </div>

        <Card className="bg-slate-900/50 border-slate-800 backdrop-blur-xl shadow-2xl relative overflow-hidden">
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan-500 to-transparent opacity-50"></div>

          <CardHeader>
            <CardTitle className="text-slate-200">Shorten a URL</CardTitle>
            <CardDescription className="text-slate-400">Enter a valid URL to get a shortened link.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <Link className="w-5 h-5 text-slate-500" />
                </div>
                <Input
                  type="url"
                  placeholder="https://example.com/very-long-url-..."
                  className="pl-10 bg-slate-950/50 border-slate-700 text-slate-200 placeholder:text-slate-500 focus-visible:ring-cyan-500/50"
                  value={url}
                  onChange={(e: any) => setUrl(e.target.value)}
                  required
                />
              </div>

              {/* Expiry Selector Component */}
              <ExpirySelector
                value={expirationTime}
                onChange={(days) => setExpirationTime(days)}
              />

              {error && (
                <div className="flex items-center gap-2 p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-xs font-medium">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-cyan-500 to-violet-500 hover:from-cyan-400 hover:to-violet-400 text-white shadow-lg shadow-cyan-500/20 transition-all duration-300 cursor-pointer"
                disabled={loading}
              >
                {loading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                    Shortening...
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    Shorten URL
                    <ArrowRight className="w-4 h-4" />
                  </div>
                )}
              </Button>
            </form>
          </CardContent>

          {shortUrl && (
            <div className="px-6 pb-6 animate-in slide-in-from-top-4 fade-in duration-300">
              <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800">
                <p className="text-sm text-slate-400 mb-2 font-medium">Your shortened URL:</p>
                <div className="flex items-center gap-2">
                  <Input
                    readOnly
                    value={shortUrl}
                    className="bg-slate-900 border-slate-700 text-cyan-400 font-medium font-mono"
                  />
                  <Button
                    variant="outline"
                    size="icon"
                    className="shrink-0 border-slate-700 bg-slate-900 hover:bg-slate-800 hover:text-slate-200 text-slate-400 cursor-pointer"
                    onClick={copyToClipboard}
                    title="Copy to clipboard"
                  >
                    {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                  </Button>
                </div>
              </div>
            </div>
          )}
        </Card>

        <p className="text-center text-xs text-slate-500 mt-8">
          By using this service, you agree to our Terms of Service and Privacy Policy.
        </p>
      </div>
    </div>
  )
}
