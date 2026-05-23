import { motion, AnimatePresence } from 'framer-motion'
import { BtsCard } from './BtsCard'

export function ScanPanel({ title, subtitle, accent = 'emerald', point, btsList, highlightTopOperator }) {
  const accentRing =
    accent === 'amber' ? 'ring-amber-500/30' : 'ring-emerald-500/30'
  const accentText =
    accent === 'amber' ? 'text-amber-300' : 'text-emerald-300'
  const accentDot =
    accent === 'amber' ? 'bg-amber-400' : 'bg-emerald-400'

  return (
    <section className={`rounded-2xl border border-slate-800 bg-slate-950/60 p-4 sm:p-5 ring-1 ${accentRing}`}>
      <header className="flex items-center justify-between gap-3 mb-3">
        <div>
          <div className="flex items-center gap-2">
            <span className={`inline-block w-2 h-2 rounded-full ${accentDot}`} />
            <h2 className={`text-sm font-semibold tracking-wide uppercase ${accentText}`}>{title}</h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">{subtitle}</p>
        </div>
        {point && (
          <div className="text-right text-[11px] text-slate-400 font-mono">
            {point.lat.toFixed(4)}, {point.lon.toFixed(4)}
          </div>
        )}
      </header>

      {!point ? (
        <div className="rounded-lg border border-dashed border-slate-800 p-6 text-center text-slate-500 text-sm">
          No location data
        </div>
      ) : btsList.length === 0 ? (
        <div className="text-slate-500 text-sm">No BTS in reference data.</div>
      ) : (
        <div className="space-y-2">
          <AnimatePresence>
            {btsList.map((b, i) => (
              <BtsCard
                key={b.id}
                bts={b}
                index={i}
                highlight={highlightTopOperator && b.operator === highlightTopOperator && i === 0}
              />
            ))}
          </AnimatePresence>
        </div>
      )}

      {point && btsList.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mt-3 text-[11px] text-slate-500"
        >
          Nearest: <span className="text-slate-300">{btsList[0].operator}</span> ·{' '}
          {btsList[0].distanceKm.toFixed(2)} km · {btsList[0].city}
        </motion.div>
      )}
    </section>
  )
}
