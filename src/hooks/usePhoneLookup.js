import { useState, useEffect, useRef } from 'react'
import { parsePhoneNumberFromString } from 'libphonenumber-js'
import { lookupPhoneOrigin, normalizePhone } from '../data/phonePrefix'
import { lookupPhoneApi, hasApiKey } from '../lib/phoneApi'

/**
 * Combined phone lookup: AbstractAPI (real carrier/type) + local prefix table (estimated city).
 *
 * Returns:
 * {
 *   prefixData,      // from local prefix table (always, instant)
 *   apiData,         // from AbstractAPI (null if no key or pending)
 *   apiStatus,       // 'idle' | 'loading' | 'ok' | 'error' | 'no-key'
 *   apiError,        // string | null
 *   formatted,       // libphonenumber formatted string
 *   international,   // "+62812..." form for API
 *   valid,           // libphonenumber validity
 * }
 */
export function usePhoneLookup(rawInput) {
  const [apiData, setApiData] = useState(null)
  const [apiStatus, setApiStatus] = useState('idle')
  const [apiError, setApiError] = useState(null)
  const abortRef = useRef(null)

  const normalized = normalizePhone(rawInput)
  const parsed = normalized ? parsePhoneNumberFromString(normalized, 'ID') : null
  const valid = !!(parsed?.isValid())
  const international = parsed?.format('E.164') ?? null
  const formatted = parsed?.formatInternational() ?? normalized ?? ''

  const prefixData = normalized ? lookupPhoneOrigin(rawInput) : null

  useEffect(() => {
    // Cancel any inflight request when input changes.
    abortRef.current?.abort()
    setApiData(null)
    setApiError(null)

    if (!normalized) {
      setApiStatus('idle')
      return
    }

    if (!hasApiKey()) {
      setApiStatus('no-key')
      return
    }

    // Use international form if we have it, fall back to local normalized form.
    const queryNum = international ?? normalized

    const controller = new AbortController()
    abortRef.current = controller

    setApiStatus('loading')
    lookupPhoneApi(queryNum, controller.signal)
      .then((data) => {
        if (controller.signal.aborted) return
        setApiData(data)
        setApiStatus('ok')
      })
      .catch((err) => {
        if (err.name === 'AbortError') return
        const msg =
          err.status === 401 ? 'Invalid API key — check VITE_ABSTRACT_API_KEY in .env' :
          err.status === 429 ? 'Rate limit reached (500/month exceeded)' :
          err.message || 'API request failed'
        setApiError(msg)
        setApiStatus('error')
      })

    return () => controller.abort()
  }, [normalized, international])

  return { prefixData, apiData, apiStatus, apiError, formatted, international, valid }
}
