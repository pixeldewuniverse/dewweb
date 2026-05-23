import { useMemo, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

import { INDONESIA_BTS_REFERENCE } from './data/btsReference'
import { approximateCoordinatesFor } from './data/phonePrefix'
import { nearestBts, haversineKm } from './lib/geo'
import { usePhoneLookup } from './hooks/usePhoneLookup'
import { ModeTabs } from './components/ModeTabs'
import { PhoneInfoCard } from './components/PhoneInfoCard'
import { ScanPanel } from './components/ScanPanel'

export default function App() {
  const [mode, setMode] = useState('phone')
  const [phoneRaw, setPhoneRaw] = useState('')
  const [gpsState, setGpsState] = useState({ status: 'idle', point: null, error: null })

  const lookup = usePhoneLookup(phoneRaw)
  const { prefixData, apiData, formatted } = lookup

  // Determine effective operator for highlighting nearest BTS card.
  const effectiveOperator = apiData?.carrier ?? prefixData?.operator ?? null

  // Approximate coordinates: prefer API location if it returned a city name.
  const phonePoint = useMemo(() => {
    // If AbstractAPI returned a real city (not just "Indonesia"), try to match it in BTS list.
    if (apiData?.location && apiData.location !== 'Indonesia') {
      const btsByCity = INDONESIA_BTS_REFERENCE.filter(
        (b) => b.city.toLowerCase() === apiData.location.toLowerCase()
      )
      if (btsByCity.length > 0) {
        const lat = btsByCity.reduce((s, b) => s + b.lat, 0) / btsByCity.length
        const lon = btsByCity.reduce((s, b) => s + b.lon, 0) / btsByCity.length
        return { lat, lon }
      }
    }
    // Fall back to prefix-table estimated city.
    return approximateCoordinatesFor(prefixData, INDONESIA_BTS_REFERENCE)
  }, [apiData, prefixData])

  const phoneNearest = useMemo(() => nearestBts(phonePoint, INDONESIA_BTS_REFERENCE, 5), [phonePoint])
  const gpsNearest   = useMemo(() => nearestBts(gpsState.point, INDONESIA_BTS_REFERENCE, 5), [gpsState.point])

  const showPhone   = mode === 'phone'   || mode === 'compare'
  const showGps     = mode === 'gps'     || mode === 'compare'
  const showCompare = mode === 'compare' && phonePoint && gpsState.point

  const mismatch = useMemo(() => {
    if (!showCompare) return null
    const distance = haversineKm(phonePoint, gpsState.point)
    const phoneOp = phoneNearest[0]?.operator
    const gpsOp   = gpsNearest[0]?.operator
    return {
      distanceKm: distance,
      isLocationMismatch: distance > 50,
      operatorMismatch: phoneOp && gpsOp && phoneOp !== gpsOp,
      phoneOp,
      gpsOp,
    }
  }, [showCompare, phonePoint, gpsState.point, phoneNearest, gpsNearest])

  function requestGps() {
    if (!navigator.geolocation) {
      setGpsState({ status: 'error', point: null, error: 'Geolocation not supported by this browser.' })
      return
    }
    setGpsState({ status: 'loading', point: null, error: null })
    navigator.geolocation.getCurrentPosition(
      (pos) => setGpsState({ status: 'ok', point: { lat: pos.coords.latitude, lon: pos.coords.longitude }, error: null }),
      (err) => setGpsState({ status: 'error', point: null, error: err.message }),
      { enableHighAccuracy: true, timeout: 15000 }
    )
  }

  function useDemoGps(city) {
    const coords = {
      Jakarta:    { lat: -6.2088, lon: 106.8456 },
      Bandung:    { lat: -6.9175, lon: 107.6191 },
      Surabaya:   { lat: -7.2575, lon: 112.7521 },
      Yogyakarta: { lat: -7.7956, lon: 110.3695 },
      Denpasar:   { lat: -8.6705, lon: 115.2126 },
    }
    setGpsState({ status: 'ok', point: coords[city], error: null })
  }

  return (
    <div className="min-h-screen text-slate-100">
      <Header />

      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-5">
        <ModeTabs mode={mode} onChange={setMode} />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {showPhone && (
            <PhoneInputSection phoneRaw={phoneRaw} setPhoneRaw={setPhoneRaw} lookup={lookup} />
          )}
          {showGps && (
            <GpsSection gpsState={gpsState} onRequest={requestGps} onDemo={useDemoGps} />
          )}
        </div>

        {/* Mismatch banner */}
        <AnimatePresence>
          {mismatch && (mismatch.isLocationMismatch || mismatch.operatorMismatch) && (
            <motion.div
              key="mismatch"
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="rounded-xl border border-amber-400/50 bg-amber-400/10 p-4 text-sm"
            >
              <div className="font-semibold text-amber-200">⚠ Location mismatch detected</div>
              <ul className="mt-1 text-amber-200/80 list-disc list-inside space-y-0.5">
                {mismatch.isLocationMismatch && (
                  <li>
                    Phone origin vs device GPS ~{mismatch.distanceKm.toFixed(0)} km apart.
                  </li>
                )}
                {mismatch.operatorMismatch && (
                  <li>
                    Nearest operator berbeda — phone area: <b>{mismatch.phoneOp}</b>, GPS area: <b>{mismatch.gpsOp}</b>.
                  </li>
                )}
              </ul>
            </motion.div>
          )}
        </AnimatePresence>

        {/* BTS panels */}
        <div className={`grid gap-4 ${mode === 'compare' ? 'md:grid-cols-2' : 'grid-cols-1'}`}>
          {showPhone && (
            <ScanPanel
              title="Panel A · Phone-traced BTS"
              subtitle={
                phonePoint
                  ? `Top 5 BTS terdekat — ${apiData?.location && apiData.location !== 'Indonesia' ? apiData.location : prefixData?.city ?? 'estimasi'}`
                  : phoneRaw
                  ? 'Tidak bisa estimasi lokasi dari nomor ini'
                  : 'Masukkan nomor HP untuk trace'
              }
              accent="emerald"
              point={phonePoint}
              btsList={phoneNearest}
              highlightTopOperator={effectiveOperator}
            />
          )}
          {showGps && (
            <ScanPanel
              title="Panel B · GPS device BTS"
              subtitle={
                gpsState.status === 'ok'      ? 'Top 5 BTS terdekat device Anda' :
                gpsState.status === 'loading' ? 'Mendapatkan lokasi…' :
                'Gunakan GPS asli atau pilih kota demo'
              }
              accent="amber"
              point={gpsState.point}
              btsList={gpsNearest}
            />
          )}
        </div>

        <Footer />
      </main>
    </div>
  )
}

function Header() {
  return (
    <header className="border-b border-slate-800/80 bg-slate-950/80 backdrop-blur sticky top-0 z-20">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-400 to-emerald-700 grid place-items-center text-slate-950 font-black"
          >
            B
          </motion.div>
          <div>
            <div className="text-sm font-semibold text-slate-100">BTS Scan Indonesia</div>
            <div className="text-[11px] text-slate-500">GPS · Phone trace · Operator insight</div>
          </div>
        </div>
        <ApiKeyBadge />
      </div>
    </header>
  )
}

function ApiKeyBadge() {
  const hasKey = Boolean(import.meta.env.VITE_ABSTRACT_API_KEY)
  return hasKey ? (
    <span className="text-[11px] text-emerald-300/90 px-2 py-1 rounded-md border border-emerald-400/30 bg-emerald-400/5">
      AbstractAPI active
    </span>
  ) : (
    <span className="text-[11px] text-amber-300/80 px-2 py-1 rounded-md border border-amber-400/30 bg-amber-400/5">
      Prefix only — no API key
    </span>
  )
}

function PhoneInputSection({ phoneRaw, setPhoneRaw, lookup }) {
  return (
    <section className="rounded-2xl border border-slate-800 bg-slate-900/40 p-4 sm:p-5 space-y-3">
      <label className="block text-xs uppercase tracking-wider text-emerald-300/80 mb-2">
        Trace phone number location
      </label>
      <input
        type="tel"
        inputMode="tel"
        autoComplete="off"
        placeholder="+62 812 3456 7890  atau  0812-3456-7890"
        value={phoneRaw}
        onChange={(e) => setPhoneRaw(e.target.value)}
        className="w-full rounded-lg bg-slate-950/80 border border-slate-700 focus:border-emerald-500/60 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 px-3 py-2 font-mono text-slate-100 placeholder:text-slate-600"
      />
      {phoneRaw && <PhoneInfoCard lookup={lookup} />}
    </section>
  )
}

function GpsSection({ gpsState, onRequest, onDemo }) {
  return (
    <section className="rounded-2xl border border-slate-800 bg-slate-900/40 p-4 sm:p-5 space-y-3">
      <label className="block text-xs uppercase tracking-wider text-amber-300/80">
        Device GPS scan
      </label>
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={onRequest}
          disabled={gpsState.status === 'loading'}
          className="rounded-lg bg-amber-400/90 text-slate-950 font-semibold px-3 py-2 text-sm hover:bg-amber-300 transition disabled:opacity-60"
        >
          {gpsState.status === 'loading' ? 'Locating…' : 'Use real GPS'}
        </button>
        {['Jakarta', 'Bandung', 'Surabaya', 'Yogyakarta', 'Denpasar'].map((c) => (
          <button
            key={c}
            type="button"
            onClick={() => onDemo(c)}
            className="rounded-lg border border-slate-700 px-2.5 py-1.5 text-xs text-slate-300 hover:bg-slate-800 hover:border-slate-600"
          >
            Demo: {c}
          </button>
        ))}
      </div>
      {gpsState.error && (
        <div className="text-xs text-rose-300 bg-rose-500/10 border border-rose-500/30 rounded-md px-2 py-1.5">
          {gpsState.error}
        </div>
      )}
      {gpsState.point && (
        <div className="rounded-lg border border-amber-500/30 bg-amber-500/5 px-3 py-2 text-sm">
          <div className="text-[10px] uppercase tracking-wider text-amber-300/80">Device coordinates</div>
          <div className="font-mono text-slate-100">
            {gpsState.point.lat.toFixed(5)}, {gpsState.point.lon.toFixed(5)}
          </div>
        </div>
      )}
    </section>
  )
}

function Footer() {
  return (
    <footer className="pt-6 border-t border-slate-900 text-[11px] text-slate-500 space-y-1">
      <p>
        Carrier & line type diambil dari <b>AbstractAPI Phone Validation</b> (real data).
        City/province untuk nomor mobile adalah estimasi prefix — nomor mobile Indonesia
        bersifat portable secara nasional.
      </p>
      <p>Built with React 19 · Vite · Tailwind CSS · Framer Motion · libphonenumber-js · AbstractAPI</p>
    </footer>
  )
}
