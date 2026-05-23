import { motion, AnimatePresence } from 'framer-motion'

const confidenceStyle = {
  high:   { label: 'High confidence',   cls: 'text-emerald-300 bg-emerald-500/15 border-emerald-500/30' },
  medium: { label: 'Medium confidence', cls: 'text-amber-300 bg-amber-500/15 border-amber-500/30' },
  low:    { label: 'Low confidence',    cls: 'text-orange-300 bg-orange-500/15 border-orange-500/30' },
  none:   { label: 'Unknown',           cls: 'text-rose-300 bg-rose-500/15 border-rose-500/30' },
}

export function PhoneInfoCard({ lookup }) {
  const { prefixData, apiData, apiStatus, apiError, formatted, valid } = lookup

  if (!formatted) return null

  const showInvalid = formatted && prefixData?.confidence === 'none' && apiStatus !== 'loading'

  // Merge: prefer API values for carrier/type, prefix table for estimated city.
  const carrier   = apiData?.carrier   ?? prefixData?.operator  ?? '—'
  const lineType  = apiData?.type      ?? prefixData?.kind       ?? '—'
  const apiCity   = apiData?.location && apiData.location !== 'Indonesia' ? apiData.location : null
  const estCity   = prefixData?.city   ? `${prefixData.city}, ${prefixData.province}` : null
  const cityLabel = apiCity ?? estCity ?? '—'
  const citySource = apiCity ? 'api' : estCity ? 'estimated' : 'unknown'

  const conf = prefixData?.confidence ? (confidenceStyle[prefixData.confidence] ?? confidenceStyle.none) : null

  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className="rounded-xl border border-emerald-500/30 bg-gradient-to-br from-emerald-500/5 to-slate-900/60 p-4 space-y-3"
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-3 flex-wrap">
        <div>
          <div className="text-[10px] uppercase tracking-wider text-emerald-300/80 mb-0.5">Phone Number</div>
          <div className="font-mono text-base sm:text-lg text-slate-100 break-all">{formatted}</div>
          {!valid && (
            <div className="text-[11px] text-amber-400 mt-0.5">
              Not strictly valid — lookup attempted anyway.
            </div>
          )}
        </div>
        <div className="flex flex-col items-end gap-1">
          {apiStatus === 'ok' && (
            <span className="text-[10px] px-1.5 py-0.5 rounded border border-emerald-400/40 text-emerald-300 bg-emerald-500/10">
              ✓ Real API data
            </span>
          )}
          {apiStatus === 'no-key' && (
            <span className="text-[10px] px-1.5 py-0.5 rounded border border-slate-600 text-slate-400 bg-slate-800/60">
              Prefix only — no API key
            </span>
          )}
          {conf && (
            <span className={`text-[10px] px-1.5 py-0.5 rounded border ${conf.cls}`}>
              {conf.label}
            </span>
          )}
        </div>
      </div>

      {/* API loading / error */}
      <AnimatePresence>
        {apiStatus === 'loading' && (
          <motion.div
            key="loading"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="flex items-center gap-2 text-xs text-slate-400"
          >
            <span className="inline-block w-3 h-3 border-2 border-emerald-500/50 border-t-emerald-300 rounded-full animate-spin" />
            Fetching real carrier data…
          </motion.div>
        )}
        {apiStatus === 'error' && (
          <motion.div
            key="err"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="text-[11px] text-rose-300 bg-rose-500/10 border border-rose-500/30 rounded-md px-2 py-1.5"
          >
            API error: {apiError}
          </motion.div>
        )}
        {apiStatus === 'no-key' && (
          <motion.div
            key="nokey"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="text-[11px] text-slate-400 bg-slate-800/50 border border-slate-700 rounded-md px-2 py-1.5"
          >
            Add <code className="font-mono text-emerald-300">VITE_ABSTRACT_API_KEY</code> ke{' '}
            <code className="font-mono">.env</code> untuk data carrier real.{' '}
            Daftar gratis di <span className="text-slate-300">abstractapi.com</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Data grid */}
      <div className="grid grid-cols-2 gap-3 text-sm">
        <Field
          label="Operator / Carrier"
          value={carrier}
          badge={apiData?.carrier ? 'real' : 'estimated'}
        />
        <Field
          label="Line type"
          value={lineType}
          badge={apiData?.type ? 'real' : 'estimated'}
        />
        <Field
          label="Prefix"
          value={prefixData?.prefix ?? '—'}
          mono
        />
        <Field
          label="Location"
          value={cityLabel}
          badge={citySource}
        />
      </div>

      {/* Note */}
      {prefixData?.note && (
        <div className="text-[11px] text-slate-500 italic border-t border-slate-800/80 pt-2">
          {prefixData.note}
        </div>
      )}
    </motion.div>
  )
}

function Field({ label, value, mono = false, badge }) {
  const badgeMap = {
    real: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
    estimated: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
    unknown: 'text-slate-500 bg-slate-800 border-slate-700',
  }
  return (
    <div>
      <div className="text-[10px] uppercase tracking-wider text-slate-500 mb-0.5">{label}</div>
      <div className={`text-slate-200 flex items-center gap-1.5 flex-wrap ${mono ? 'font-mono' : ''}`}>
        <span>{value ?? '—'}</span>
        {badge && badge !== 'unknown' && (
          <span className={`text-[9px] px-1 py-0.5 rounded border ${badgeMap[badge]}`}>
            {badge}
          </span>
        )}
      </div>
    </div>
  )
}
