/**
 * GeoJSON Point for MongoDB 2dsphere: coordinates are [longitude, latitude].
 * Browser / Leaflet typically expose latitude first — use `latitude` + `longitude`
 * on the API body, or send full GeoJSON `location`.
 */
export function normalizePropertyLocationFields(
  input: Record<string, unknown>,
): Record<string, unknown> {
  const {
    latitude,
    longitude,
    location,
    ...rest
  } = input as {
    latitude?: number;
    longitude?: number;
    location?: { type?: string; coordinates?: [number, number] };
    [key: string]: unknown;
  };

  let mongoLocation: { type: 'Point'; coordinates: [number, number] } | undefined;

  if (
    location &&
    Array.isArray(location.coordinates) &&
    location.coordinates.length === 2
  ) {
    const [lng, lat] = location.coordinates;
    mongoLocation = { type: 'Point', coordinates: [lng, lat] };
  } else if (typeof latitude === 'number' && typeof longitude === 'number') {
    mongoLocation = {
      type: 'Point',
      coordinates: [longitude, latitude],
    };
  }

  const out: Record<string, unknown> = { ...rest };
  if (mongoLocation) {
    out.location = mongoLocation;
  }
  return out;
}

/** True if the client sent any map-related field (create or partial update). */
export function isLocationPayloadTouched(input: Record<string, unknown>): boolean {
  return (
    'location' in input ||
    'latitude' in input ||
    'longitude' in input
  );
}
