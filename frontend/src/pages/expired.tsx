import { useState, useEffect, useRef } from 'react'
import { useSearchParams, useNavigate, Link as RouterLink } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Clock,
  AlertTriangle,
  ArrowRight,
  Home as HomeIcon,
  Pause,
  Play,
  RotateCcw,
  Sparkles,
  Link2Off
} from 'lucide-react'

export default function Expired() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()

  const code = searchParams.get('code') || ''
  const reason = searchParams.get('reason') || 'expired'
  const customMessage = searchParams.get('message')

  const TOTAL_SECONDS = 6
  const [secondsLeft, setSecondsLeft] = useState(TOTAL_SECONDS)
  const [isPaused, setIsPaused] = useState(false)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => {
    document.title = 'Link Expired | URL Shortener'
  }, [])

  useEffect(() => {
    if (isPaused) {
      if (timerRef.current) clearInterval(timerRef.current)
      return
    }

    if (secondsLeft <= 0) {
      navigate('/?redirected=expired', { replace: true })
      return
    }

    timerRef.current = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          if (timerRef.current) clearInterval(timerRef.current)
          navigate('/?redirected=expired', { replace: true })
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [secondsLeft, isPaused, navigate])

  const handleGoHome = () => {
    if (timerRef.current) clearInterval(timerRef.current)
    navigate('/?redirected=expired')
  }

  const togglePause = () => {
    setIsPaused((prev) => !prev)
  }

  const handleResetTimer = () => {
    setSecondsLeft(TOTAL_SECONDS)
    setIsPaused(false)
  }

  const isNotFound = reason === 'not_found'
  const progressPercent = ((TOTAL_SECONDS - secondsLeft) / TOTAL_SECONDS) * 100

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Background ambient light orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[30%] -left-[20%] w-[65%] h-[65%] rounded-full bg-amber-600/15 blur-[130px]" />
        <div className="absolute -bottom-[30%] -right-[20%] w-[65%] h-[65%] rounded-full bg-rose-600/15 blur-[130px]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[40%] h-[40%] rounded-full bg-violet-600/10 blur-[140px]" />
      </div>

      <div className="z-10 w-full max-w-lg">
        {/* Main Card */}
        <Card className="bg-slate-900/60 border-slate-800/80 backdrop-blur-2xl shadow-2xl relative overflow-hidden ring-1 ring-white/10">
          {/* Top glowing gradient line */}
          <div className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-amber-500 to-rose-500 opacity-80" />

          <CardContent className="p-8 sm:p-10 flex flex-col items-center text-center">
            {/* Animated Status Icon */}
            <div className="relative mb-6">
              <div className="absolute -inset-2 bg-gradient-to-r from-amber-500/20 to-rose-500/20 rounded-full blur-xl animate-pulse" />
              <div className="relative w-20 h-20 rounded-2xl bg-gradient-to-br from-amber-500/10 to-rose-500/10 border border-amber-500/30 flex items-center justify-center shadow-inner">
                {isNotFound ? (
                  <Link2Off className="w-10 h-10 text-rose-400 animate-bounce" />
                ) : (
                  <Clock className="w-10 h-10 text-amber-400" />
                )}
              </div>
            </div>

            {/* Status Badge */}
            <div className="mb-3">
              <Badge
                variant="outline"
                className={
                  isNotFound
                    ? 'border-rose-500/30 bg-rose-500/10 text-rose-300 px-3 py-1 text-xs uppercase tracking-wider font-semibold'
                    : 'border-amber-500/30 bg-amber-500/10 text-amber-300 px-3 py-1 text-xs uppercase tracking-wider font-semibold'
                }
              >
                {isNotFound ? '404 • Link Not Found' : '410 • Link Expired'}
              </Badge>
            </div>

            {/* Headline */}
            <h1 className="text-3xl sm:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-orange-300 to-rose-400 mb-3 tracking-tight">
              {isNotFound ? 'URL Not Found or Removed' : 'This URL is Expired'}
            </h1>

            {/* Subtitle / Description */}
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed mb-6 max-w-md">
              {customMessage
                ? customMessage
                : isNotFound
                ? 'The short link you are trying to visit does not exist or has been permanently removed due to inactivity.'
                : 'This link has passed its expiration limit and is no longer available. Links automatically expire for security and privacy.'}
            </p>

            {/* Short Code Display Pill */}
            {code && (
              <div className="w-full bg-slate-950/60 border border-slate-800 rounded-xl p-3 mb-6 flex items-center justify-between gap-3 text-left">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-7 h-7 rounded-lg bg-slate-800/80 flex items-center justify-center shrink-0">
                    <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
                  </div>
                  <div className="truncate">
                    <p className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">
                      Attempted Link
                    </p>
                    <p className="text-xs text-slate-200 font-mono truncate line-through opacity-75">
                      {code.includes('/') ? code : `/${code}`}
                    </p>
                  </div>
                </div>
                <Badge className="bg-red-500/20 text-red-300 border-red-500/30 text-[10px] shrink-0 font-medium">
                  Inactive
                </Badge>
              </div>
            )}

            {/* Auto Redirect Countdown Box */}
            <div className="w-full bg-slate-950/40 border border-slate-800/60 rounded-2xl p-4 mb-6">
              <div className="flex items-center justify-between text-xs text-slate-400 mb-2.5">
                <span className="flex items-center gap-1.5 font-medium">
                  <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                  {isPaused ? 'Auto-redirect paused' : 'Redirecting to home in'}
                </span>
                <span className="font-mono font-bold text-slate-200 text-sm">
                  {secondsLeft}s
                </span>
              </div>

              {/* Progress Bar */}
              <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden mb-3">
                <div
                  className="h-full bg-gradient-to-r from-cyan-400 to-violet-500 transition-all duration-1000 ease-linear rounded-full"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>

              {/* Timer Controls */}
              <div className="flex items-center justify-center gap-2">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={togglePause}
                  className="text-xs text-slate-400 hover:text-slate-200 hover:bg-slate-800/50 h-7 px-2.5 cursor-pointer"
                >
                  {isPaused ? (
                    <>
                      <Play className="w-3 h-3 mr-1 text-emerald-400" />
                      Resume Timer
                    </>
                  ) : (
                    <>
                      <Pause className="w-3 h-3 mr-1 text-amber-400" />
                      Pause Timer
                    </>
                  )}
                </Button>
                {secondsLeft < TOTAL_SECONDS && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={handleResetTimer}
                    className="text-xs text-slate-400 hover:text-slate-200 hover:bg-slate-800/50 h-7 px-2 cursor-pointer"
                  >
                    <RotateCcw className="w-3 h-3 mr-1" />
                    Reset
                  </Button>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="w-full flex flex-col sm:flex-row gap-3">
              <Button
                type="button"
                onClick={handleGoHome}
                className="flex-1 bg-gradient-to-r from-cyan-500 via-indigo-500 to-violet-500 hover:from-cyan-400 hover:to-violet-400 text-white font-medium shadow-lg shadow-cyan-500/20 py-5 cursor-pointer"
              >
                <HomeIcon className="w-4 h-4 mr-1.5" />
                Go to Home Now
                <ArrowRight className="w-4 h-4 ml-1.5" />
              </Button>

              <Button
                type="button"
                variant="outline"
                asChild
                className="border-slate-700 bg-slate-800/40 text-slate-300 hover:bg-slate-800 hover:text-white py-5 cursor-pointer"
              >
                <RouterLink to="/">
                  Create New Link
                </RouterLink>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Footer info note */}
        <p className="text-center text-xs text-slate-500 mt-6 flex items-center justify-center gap-1.5">
          <span>Need to keep links active longer? Choose custom expiry when creating.</span>
        </p>
      </div>
    </div>
  )
}
