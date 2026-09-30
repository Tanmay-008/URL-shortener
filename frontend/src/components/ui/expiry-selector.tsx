import React from 'react'
import { Clock } from 'lucide-react'

interface ExpirySelectorProps {
  value: number
  onChange: (days: number) => void
}

export const ExpirySelector: React.FC<ExpirySelectorProps> = ({ value, onChange }) => {
  const daysOptions = [1, 2, 3, 4, 5, 6, 7]

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-xs font-medium text-slate-400">
        <label className="flex items-center gap-1.5 text-slate-300 font-medium">
          <Clock className="w-3.5 h-3.5 text-cyan-400" />
          Link Expiration
        </label>
        <span className="text-cyan-400 font-semibold">
          {value} {value === 1 ? 'Day' : 'Days'}
        </span>
      </div>

      <div className="grid grid-cols-7 gap-1.5 p-1 bg-slate-950/60 border border-slate-800 rounded-xl">
        {daysOptions.map((day) => {
          const isSelected = value === day
          return (
            <button
              key={day}
              type="button"
              onClick={() => onChange(day)}
              className={`py-1.5 text-xs font-semibold rounded-lg transition-all duration-200 ${
                isSelected
                  ? 'bg-gradient-to-r from-cyan-500 to-violet-500 text-white shadow-md shadow-cyan-500/20 scale-[1.02]'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/80'
              }`}
            >
              {day}d
            </button>
          )
        })}
      </div>
    </div>
  )
}
