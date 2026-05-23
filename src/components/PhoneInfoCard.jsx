import { motion } from 'framer-motion'

const confidenceStyle = {
  high:   { label: 'High confidence',   cls: 'text-emerald-300 bg-emerald-500/15 border-emerald-500/30' },
  medium: { label: 'Medium confidence', cls: 'text-amber-300 bg-amber-500/15 border-amber-500/30' },
  low:    { label: 'Low confidence',    cls: 'text-orange-300 bg-orange-500/15 border-orange-500/30' },
  none:   { label: 'Unknown',           cls: 'text-rose-300 bg-rose-500/15 border-rose-500/30' },
}

export function PhoneInfoCard({ origin, formatted, valid }) {
  if (!origin) {
    return (
      <div className="rounded-xl border border-rose-500/40 bg-rose-500/5 p-4 text-rose-200">
        <div className="font-semibold">Invalid phone number</div>
        <div className="text-sm text-rose-300/80 mt-1">
          Use Indonesian format: <code className="font-mono">+62 8xx xxxx xxxx</code> or{' '}
          <code className="font-mono">08xx-xxxx-xxxx</code>.
        </div>
      </div>
    )
  }

  const conf = confidenceStyle[origin.confidence] ?? confidenceStyle.none

  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className="rounded-xl border border-emerald-500/30 bg-gradient-to-br from-emerald-500/5 to-slate-900/60 p-4"
    >
      <div className="flex items-start justify-between gap-3 flex-wrap">
        <div className="min-w-0">
          <div className="text-xs uppercase tracking-wider text-emerald-300/80">Phone Number</div>
          <div className="font-mono text-lg text-slate-100">{formatted}</div>
          {!valid && (
            <div className="text-[11px] text-amber-400 mt-1">
              Format not strictly valid per libphonenumber, but prefix lookup attempted.
            </div>
          )}
        </div>
        <span className={`text-xs px-2 py-1 rounded-md border ${conf.cls}`}>{conf.label}</span>
      </div>

      <div className="mt-3 grid grid-cols-2 gap-3 text-sm">
        <Field label="Prefix"   value={origin.prefix} mono />
        <Field label="Kind"     value={origin.kind} />
        <Field label="Operator" value={origin.operator + (origin.tier ? ` · ${origin.tier}` : '')} />
        <Field label="Estimated origin" value={origin.city ? `${origin.city}, ${origin.province}` : '—'} />
      </div>

      <div className="mt-3 text-[11px] text-slate-400 italic border-t border-slate-800 pt-2">
        {origin.note}
      </div>
    </motion.div>
  )
}

function Field({ label, value, mono = false }) {
  return (
    <div>
      <div className="text-[10px] uppercase tracking-wider text-slate-500">{label}</div>
      <div className={`text-slate-200 ${mono ? 'font-mono' : ''}`}>{value ?? '—'}</div>
    </div>
  )
}
