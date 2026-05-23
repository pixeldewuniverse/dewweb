import { motion } from 'framer-motion'

const MODES = [
  { id: 'gps',     label: 'GPS Device Scan',  hint: 'Find BTS near your device' },
  { id: 'phone',   label: 'Trace Phone',      hint: 'Find BTS near a phone number origin' },
  { id: 'compare', label: 'Compare Both',     hint: 'Side-by-side GPS vs phone' },
]

export function ModeTabs({ mode, onChange }) {
  return (
    <div className="grid grid-cols-3 gap-1 p-1 rounded-xl bg-slate-900/70 border border-slate-800">
      {MODES.map((m) => {
        const active = mode === m.id
        return (
          <button
            key={m.id}
            type="button"
            onClick={() => onChange(m.id)}
            className="relative rounded-lg px-2 sm:px-3 py-2 text-left"
          >
            {active && (
              <motion.span
                layoutId="mode-pill"
                className="absolute inset-0 rounded-lg bg-emerald-500/15 border border-emerald-500/40"
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              />
            )}
            <span className="relative block">
              <span className={`block text-xs sm:text-sm font-medium ${active ? 'text-emerald-200' : 'text-slate-300'}`}>
                {m.label}
              </span>
              <span className="block text-[10px] sm:text-[11px] text-slate-500 mt-0.5">{m.hint}</span>
            </span>
          </button>
        )
      })}
    </div>
  )
}
