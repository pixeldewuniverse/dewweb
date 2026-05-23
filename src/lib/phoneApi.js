// AbstractAPI Phone Validation
// Docs: https://www.abstractapi.com/api/phone-validation-api
// Free: 500 req/month — sign up at abstractapi.com, copy key to .env as VITE_ABSTRACT_API_KEY

const API_KEY = import.meta.env.VITE_ABSTRACT_API_KEY
const BASE_URL = 'https://phonevalidation.abstractapi.com/v1/'

// Simple in-memory cache so re-renders don't re-hit the API.
const cache = new Map()

/**
 * Validate & enrich a phone number via AbstractAPI.
 *
 * @param {string} internationalNumber  e.g. "+62812XXXXXXX"
 * @param {AbortSignal} [signal]
 * @returns {Promise<AbstractApiResult | null>}
 *
 * AbstractApiResult shape:
 * {
 *   phone: "628123456789",
 *   valid: true,
 *   format: { international: "+62 812-345-6789", local: "0812-345-6789" },
 *   country: { code: "ID", name: "Indonesia", prefix: "+62" },
 *   location: "Indonesia",   // city for fixed lines, country for mobile
 *   type: "mobile",          // "mobile" | "landline" | "voip" | "unknown"
 *   carrier: "Telkomsel",
 * }
 */
export async function lookupPhoneApi(internationalNumber, signal) {
  if (!API_KEY || !internationalNumber) return null

  const cacheKey = internationalNumber.replace(/\s/g, '')
  if (cache.has(cacheKey)) return cache.get(cacheKey)

  const url = `${BASE_URL}?api_key=${encodeURIComponent(API_KEY)}&phone=${encodeURIComponent(cacheKey)}`
  const res = await fetch(url, { signal })

  if (!res.ok) {
    // 429 = rate limited, 401 = bad key
    const text = await res.text().catch(() => '')
    throw Object.assign(new Error(`AbstractAPI ${res.status}`), { status: res.status, body: text })
  }

  const data = await res.json()
  cache.set(cacheKey, data)
  return data
}

export function hasApiKey() {
  return Boolean(API_KEY)
}
