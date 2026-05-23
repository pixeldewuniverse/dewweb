// Mapping prefix nomor HP Indonesia → operator + estimated origin region.
//
// CATATAN AKURASI:
// Nomor mobile (08xx) di Indonesia bersifat portable secara nasional dan TIDAK
// terikat geografi. Kolom city/province di sini hanyalah ESTIMASI berdasarkan
// area aktivasi SIM secara historis, dan akan sering meleset. Hanya nomor fixed
// line (021, 022, dst) yang punya korelasi geografis sebenarnya.
//
// Data ini disusun untuk tujuan demo/edukasi.

// 4-digit prefix mapping (most specific first).
const MOBILE_PREFIX_4 = {
  '0811': { operator: 'Telkomsel', city: 'Jakarta',    province: 'DKI Jakarta',         tier: 'kartuHALO',   confidence: 'medium' },
  '0812': { operator: 'Telkomsel', city: 'Jakarta',    province: 'DKI Jakarta',         tier: 'simPATI',     confidence: 'low' },
  '0813': { operator: 'Telkomsel', city: 'Surabaya',   province: 'Jawa Timur',          tier: 'simPATI',     confidence: 'low' },
  '0821': { operator: 'Telkomsel', city: 'Bandung',    province: 'Jawa Barat',          tier: 'simPATI',     confidence: 'low' },
  '0822': { operator: 'Telkomsel', city: 'Medan',      province: 'Sumatera Utara',      tier: 'simPATI',     confidence: 'low' },
  '0823': { operator: 'Telkomsel', city: 'Makassar',   province: 'Sulawesi Selatan',    tier: 'Kartu As',    confidence: 'low' },
  '0851': { operator: 'Telkomsel', city: 'Yogyakarta', province: 'DI Yogyakarta',       tier: 'Kartu As',    confidence: 'low' },
  '0852': { operator: 'Telkomsel', city: 'Denpasar',   province: 'Bali',                tier: 'Kartu As',    confidence: 'low' },
  '0853': { operator: 'Telkomsel', city: 'Semarang',   province: 'Jawa Tengah',         tier: 'Kartu As',    confidence: 'low' },

  '0814': { operator: 'Indosat',   city: 'Jakarta',    province: 'DKI Jakarta',         tier: 'IM3',         confidence: 'low' },
  '0815': { operator: 'Indosat',   city: 'Jakarta',    province: 'DKI Jakarta',         tier: 'IM3 Mentari', confidence: 'low' },
  '0816': { operator: 'Indosat',   city: 'Jakarta',    province: 'DKI Jakarta',         tier: 'IM3 Mentari', confidence: 'low' },
  '0855': { operator: 'Indosat',   city: 'Surabaya',   province: 'Jawa Timur',          tier: 'IM3 Matrix',  confidence: 'low' },
  '0856': { operator: 'Indosat',   city: 'Surabaya',   province: 'Jawa Timur',          tier: 'IM3',         confidence: 'low' },
  '0857': { operator: 'Indosat',   city: 'Bandung',    province: 'Jawa Barat',          tier: 'IM3',         confidence: 'low' },
  '0858': { operator: 'Indosat',   city: 'Medan',      province: 'Sumatera Utara',      tier: 'IM3',         confidence: 'low' },

  '0817': { operator: 'XL Axiata', city: 'Jakarta',    province: 'DKI Jakarta',         tier: 'XL Prabayar', confidence: 'low' },
  '0818': { operator: 'XL Axiata', city: 'Jakarta',    province: 'DKI Jakarta',         tier: 'XL Prabayar', confidence: 'low' },
  '0819': { operator: 'XL Axiata', city: 'Jakarta',    province: 'DKI Jakarta',         tier: 'XL Prabayar', confidence: 'low' },
  '0859': { operator: 'XL Axiata', city: 'Bandung',    province: 'Jawa Barat',          tier: 'XL Prabayar', confidence: 'low' },
  '0877': { operator: 'XL Axiata', city: 'Surabaya',   province: 'Jawa Timur',          tier: 'XL Prabayar', confidence: 'low' },
  '0878': { operator: 'XL Axiata', city: 'Yogyakarta', province: 'DI Yogyakarta',       tier: 'XL Prabayar', confidence: 'low' },

  '0895': { operator: 'Tri',       city: 'Jakarta',    province: 'DKI Jakarta',         tier: '3 Prabayar',  confidence: 'low' },
  '0896': { operator: 'Tri',       city: 'Bandung',    province: 'Jawa Barat',          tier: '3 Prabayar',  confidence: 'low' },
  '0897': { operator: 'Tri',       city: 'Surabaya',   province: 'Jawa Timur',          tier: '3 Prabayar',  confidence: 'low' },
  '0898': { operator: 'Tri',       city: 'Medan',      province: 'Sumatera Utara',      tier: '3 Prabayar',  confidence: 'low' },
  '0899': { operator: 'Tri',       city: 'Makassar',   province: 'Sulawesi Selatan',    tier: '3 Prabayar',  confidence: 'low' },

  '0881': { operator: 'Smartfren', city: 'Jakarta',    province: 'DKI Jakarta',         tier: 'Smartfren',   confidence: 'low' },
  '0882': { operator: 'Smartfren', city: 'Bandung',    province: 'Jawa Barat',          tier: 'Smartfren',   confidence: 'low' },
  '0883': { operator: 'Smartfren', city: 'Surabaya',   province: 'Jawa Timur',          tier: 'Smartfren',   confidence: 'low' },
  '0884': { operator: 'Smartfren', city: 'Medan',      province: 'Sumatera Utara',      tier: 'Smartfren',   confidence: 'low' },
  '0885': { operator: 'Smartfren', city: 'Yogyakarta', province: 'DI Yogyakarta',       tier: 'Smartfren',   confidence: 'low' },
  '0886': { operator: 'Smartfren', city: 'Semarang',   province: 'Jawa Tengah',         tier: 'Smartfren',   confidence: 'low' },
  '0887': { operator: 'Smartfren', city: 'Makassar',   province: 'Sulawesi Selatan',    tier: 'Smartfren',   confidence: 'low' },
  '0888': { operator: 'Smartfren', city: 'Denpasar',   province: 'Bali',                tier: 'Smartfren',   confidence: 'low' },
  '0889': { operator: 'Smartfren', city: 'Palembang',  province: 'Sumatera Selatan',    tier: 'Smartfren',   confidence: 'low' },
}

// 3-digit fixed-line area codes — these ARE actually geographic.
const FIXED_PREFIX_3 = {
  '021': { city: 'Jakarta',       province: 'DKI Jakarta',         confidence: 'high' },
  '022': { city: 'Bandung',       province: 'Jawa Barat',          confidence: 'high' },
  '024': { city: 'Semarang',      province: 'Jawa Tengah',         confidence: 'high' },
  '031': { city: 'Surabaya',      province: 'Jawa Timur',          confidence: 'high' },
  '061': { city: 'Medan',         province: 'Sumatera Utara',      confidence: 'high' },
  '0274': { city: 'Yogyakarta',   province: 'DI Yogyakarta',       confidence: 'high' },
  '0341': { city: 'Malang',       province: 'Jawa Timur',          confidence: 'high' },
  '0361': { city: 'Denpasar',     province: 'Bali',                confidence: 'high' },
  '0411': { city: 'Makassar',     province: 'Sulawesi Selatan',    confidence: 'high' },
  '0711': { city: 'Palembang',    province: 'Sumatera Selatan',    confidence: 'high' },
  '0761': { city: 'Pekanbaru',    province: 'Riau',                confidence: 'high' },
  '0542': { city: 'Balikpapan',   province: 'Kalimantan Timur',    confidence: 'high' },
}

/**
 * Normalize a raw user-entered phone string into a 0xxxxxx local form.
 * Accepts: "+62 812 ...", "62-812-...", "0812-...", "(0812) ...", with spaces/dashes/dots.
 */
export function normalizePhone(raw) {
  if (!raw) return ''
  let n = String(raw).trim().replace(/[\s\-().]/g, '')
  if (n.startsWith('+62')) n = '0' + n.slice(3)
  else if (n.startsWith('62')) n = '0' + n.slice(2)
  return n
}

/**
 * Look up operator + estimated region for an Indonesian phone number.
 * Returns null if no mapping is found.
 */
export function lookupPhoneOrigin(raw) {
  const n = normalizePhone(raw)
  if (!n || !/^0\d{6,13}$/.test(n)) return null

  // Mobile: 4-digit prefix (08xx)
  if (n.startsWith('08')) {
    const p4 = n.slice(0, 4)
    const hit = MOBILE_PREFIX_4[p4]
    if (hit) {
      return {
        kind: 'mobile',
        prefix: p4,
        operator: hit.operator,
        tier: hit.tier,
        city: hit.city,
        province: hit.province,
        confidence: hit.confidence,
        note: 'Mobile numbers are portable nationally — origin region is an estimate based on historical SIM activation areas.',
      }
    }
    return {
      kind: 'mobile',
      prefix: p4,
      operator: 'Unknown',
      tier: null,
      city: null,
      province: null,
      confidence: 'none',
      note: 'Prefix not in mapping database.',
    }
  }

  // Fixed line: try 4-digit then 3-digit area code
  const p4 = n.slice(0, 4)
  const p3 = n.slice(0, 3)
  const hit4 = FIXED_PREFIX_3[p4]
  const hit3 = FIXED_PREFIX_3[p3]
  const hit = hit4 || hit3
  if (hit) {
    return {
      kind: 'fixed',
      prefix: hit4 ? p4 : p3,
      operator: 'Telkom (PSTN)',
      tier: null,
      city: hit.city,
      province: hit.province,
      confidence: hit.confidence,
      note: 'Fixed-line area codes are geographically anchored.',
    }
  }

  return {
    kind: 'unknown',
    prefix: n.slice(0, 4),
    operator: 'Unknown',
    tier: null,
    city: null,
    province: null,
    confidence: 'none',
    note: 'Prefix not recognized as Indonesian mobile or fixed line.',
  }
}

/**
 * Find approximate (lat, lon) for the city/province in a phone origin lookup,
 * using the BTS reference list as a city centroid source.
 */
export function approximateCoordinatesFor(origin, btsList) {
  if (!origin || !origin.city) return null
  const matches = btsList.filter((b) => b.city === origin.city)
  if (matches.length === 0) return null
  const lat = matches.reduce((s, b) => s + b.lat, 0) / matches.length
  const lon = matches.reduce((s, b) => s + b.lon, 0) / matches.length
  return { lat, lon }
}
