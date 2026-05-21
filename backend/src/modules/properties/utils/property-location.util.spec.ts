import {
  normalizePropertyLocationFields,
  isLocationPayloadTouched,
} from './property-location.util';

describe('property-location.util', () => {
  it('maps latitude/longitude to GeoJSON Point [lng, lat]', () => {
    const out = normalizePropertyLocationFields({
      title: 'Test',
      latitude: 6.5244,
      longitude: 3.3792,
    });
    expect(out.title).toBe('Test');
    expect(out).not.toHaveProperty('latitude');
    expect(out).not.toHaveProperty('longitude');
    expect(out.location).toEqual({
      type: 'Point',
      coordinates: [3.3792, 6.5244],
    });
  });

  it('keeps GeoJSON location as Point', () => {
    const out = normalizePropertyLocationFields({
      location: { type: 'Point', coordinates: [3.5, 6.4] },
    });
    expect(out.location).toEqual({
      type: 'Point',
      coordinates: [3.5, 6.4],
    });
  });

  it('detects touched location payload', () => {
    expect(isLocationPayloadTouched({ title: 'a' })).toBe(false);
    expect(isLocationPayloadTouched({ latitude: 1 })).toBe(true);
    expect(isLocationPayloadTouched({ longitude: 1 })).toBe(true);
    expect(isLocationPayloadTouched({ location: {} })).toBe(true);
  });
});
