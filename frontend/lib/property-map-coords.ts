import type { Property } from "@/services/property.service"

/**
 * GeoJSON Point stores [longitude, latitude]. Returns Leaflet-friendly lat/lng or null.
 */
export function getPropertyMapCoords(
  property: Pick<Property, "location"> | null | undefined,
): { latitude: number; longitude: number } | null {
  const coords = property?.location?.coordinates
  if (!Array.isArray(coords) || coords.length !== 2) return null
  const [lng, lat] = coords
  if (typeof lng !== "number" || typeof lat !== "number" || Number.isNaN(lng) || Number.isNaN(lat)) {
    return null
  }
  if (lng === 0 && lat === 0) return null
  if (lng < -180 || lng > 180 || lat < -90 || lat > 90) return null
  return { latitude: lat, longitude: lng }
}

/** Opens Google Maps centered on the exact coordinates (new tab). */
export function googleMapsUrl(latitude: number, longitude: number): string {
  const q = encodeURIComponent(`${latitude},${longitude}`)
  return `https://www.google.com/maps/search/?api=1&query=${q}`
}
