import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { resolveShortUrlApi } from '@/api/url.api'
import { Link, Loader2 } from 'lucide-react'

export default function RedirectHandler() {
  const { shortCode } = useParams<{ shortCode: string }>()
  const navigate = useNavigate()
  const [statusMessage, setStatusMessage] = useState('Verifying your link...')

  useEffect(() => {
    if (!shortCode) {
      navigate('/expired?reason=not_found', { replace: true })
      return
    }

    let isMounted = true

    const resolveAndRedirect = async () => {
      try {
        setStatusMessage('Connecting to destination...')
        const data = await resolveShortUrlApi(shortCode)

        if (!isMounted) return

        setStatusMessage('Redirecting...')
        // Immediate redirection to the target destination
        window.location.replace(data.originalUrl)
      } catch (err: any) {
        if (!isMounted) return

        const isExpired = err.isExpired || err.statusCode === 410
        const isNotFound = err.isNotFound || err.statusCode === 404

        let reason = 'error'
        if (isExpired) {
          reason = 'expired'
        } else if (isNotFound) {
          reason = 'not_found'
        }

        navigate(
          `/expired?code=${encodeURIComponent(shortCode)}&reason=${reason}&message=${encodeURIComponent(
            err.message || 'This URL is not available.'
          )}`,
          { replace: true }
        )
      }
    }

    resolveAndRedirect()

    return () => {
      isMounted = false
    }
  }, [shortCode, navigate])

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Background ambient glows */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[40%] -left-[20%] w-[70%] h-[70%] rounded-full bg-violet-600/15 blur-[120px]" />
        <div className="absolute -bottom-[40%] -right-[20%] w-[70%] h-[70%] rounded-full bg-cyan-600/15 blur-[120px]" />
      </div>

      <div className="z-10 flex flex-col items-center text-center max-w-sm">
        <div className="relative mb-6">
          <div className="w-16 h-16 rounded-2xl bg-slate-900/80 border border-slate-800 flex items-center justify-center shadow-2xl relative">
            <Link className="w-7 h-7 text-cyan-400 animate-pulse" />
            <div className="absolute -inset-1 rounded-2xl bg-cyan-500/20 blur-sm pointer-events-none" />
          </div>
        </div>

        <div className="flex items-center gap-2 mb-2">
          <Loader2 className="w-4 h-4 text-cyan-400 animate-spin" />
          <h2 className="text-xl font-bold text-slate-100">{statusMessage}</h2>
        </div>

        <p className="text-xs text-slate-400 font-mono bg-slate-900/60 px-3 py-1.5 rounded-lg border border-slate-800">
          Code: {shortCode}
        </p>

        <p className="text-xs text-slate-500 mt-4">
          If you are not redirected automatically in a moment, the link will be verified.
        </p>
      </div>
    </div>
  )
}
