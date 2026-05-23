import { motion } from 'framer-motion'

const operatorColor = {
  Telkomsel: 'bg-red-500/15 text-red-300 border-red-500/30',
  Indosat: 'bg-yellow-500/15 text-yellow-300 border-yellow-500/30',
  'XL Axiata': 'bg-sky-500/15 text-sky-300 border-sky-500/30',
  Tri: 'bg-fuchsia-500/15 text-fuchsia-300 border-fuchsia-500/30',
  Smartfren: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30',
}

export function BtsCard({ bts, index = 0, highlight = false }) {
  const opClass = operatorColor[bts.operator] ?? 'bg-slate-500/15 text-slate-300 border-slate-500/30'
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.25 }}
      className={`rounded-xl border p-3 sm:p-4 backdrop-blur ${
        highlight
          ? 'border-amber-400/60 bg-amber-400/5 shadow-lg shadow-amber-500/10'
          : 'border-slate-700/70 bg-slate-900/60'
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className={`text-xs px-2 py-0.5 rounded-md border ${opClass}`}>{bts.operator}</span>
            <span className="text-[10px] uppercase tracking-wider text-slate-400">{bts.tech}</span>
          </div>
          <div className="mt-1 font-mono text-sm text-slate-200 truncate">{bts.id}</div>
          <div className="text-xs text-slate-400">{bts.city}, {bts.province}</div>
        </div>
        <div className="text-right shrink-0">
          <div className="text-emerald-300 font-semibold text-lg leading-none">
            {bts.distanceKm.toFixed(1)}
            <span className="text-xs text-slate-400 ml-1">km</span>
          </div>
          <div className="text-[10px] text-slate-500 mt-1">
            {bts.lat.toFixed(3)}, {bts.lon.toFixed(3)}
          </div>
        </div>
      </div>
    </motion.div>
  )
}
