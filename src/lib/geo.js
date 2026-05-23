// Haversine distance in kilometers between two lat/lon points.
export function haversineKm(a, b) {
  const R = 6371
  const toRad = (d) => (d * Math.PI) / 180
  const dLat = toRad(b.lat - a.lat)
  const dLon = toRad(b.lon - a.lon)
  const lat1 = toRad(a.lat)
  const lat2 = toRad(b.lat)
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLon / 2) ** 2
  return 2 * R * Math.asin(Math.sqrt(h))
}

export function nearestBts(point, btsList, limit = 5) {
  if (!point) return []
  return btsList
    .map((b) => ({ ...b, distanceKm: haversineKm(point, b) }))
    .sort((a, b) => a.distanceKm - b.distanceKm)
    .slice(0, limit)
}
