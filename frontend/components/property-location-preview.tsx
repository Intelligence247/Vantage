"use client"

import { useEffect } from "react"
import { MapContainer, TileLayer, Marker, useMap } from "react-leaflet"
import L from "leaflet"
import "leaflet/dist/leaflet.css"

type PropertyLocationPreviewProps = {
  latitude: number
  longitude: number
  className?: string
  /** When true (e.g. full-screen dialog), users can zoom with the scroll wheel. */
  scrollWheelZoom?: boolean
  /** Draggable pin; use with `onCoordinatesChange` to save adjusted position. */
  draggableMarker?: boolean
  onCoordinatesChange?: (latitude: number, longitude: number) => void
  /**
   * Stable key for the Leaflet map instance (use on edit forms with draggable marker so the map
   * does not remount on every small coordinate change).
   */
  stableMapKey?: string
}

function MapCenterSync({ latitude, longitude }: { latitude: number; longitude: number }) {
  const map = useMap()
  useEffect(() => {
    map.setView([latitude, longitude], map.getZoom(), { animate: false })
  }, [latitude, longitude, map])
  return null
}

/** OpenStreetMap preview (Leaflet). Client-only — load with `next/dynamic` `{ ssr: false }`. */
export function PropertyLocationPreview({
  latitude,
  longitude,
  className,
  scrollWheelZoom = false,
  draggableMarker = false,
  onCoordinatesChange,
  stableMapKey,
}: PropertyLocationPreviewProps) {
  useEffect(() => {
    const proto = L.Icon.Default.prototype as unknown as { _getIconUrl?: () => string }
    delete proto._getIconUrl
    L.Icon.Default.mergeOptions({
      iconRetinaUrl:
        "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
      iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
      shadowUrl:
        "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
    })
  }, [])

  return (
    <div
      className={
        className ??
        "relative h-56 w-full max-w-2xl overflow-hidden rounded-xl border border-border bg-muted"
      }
    >
      <MapContainer
        key={
          stableMapKey && draggableMarker
            ? `${stableMapKey}-${scrollWheelZoom ? "wheel" : "nowheel"}`
            : `${latitude.toFixed(5)}-${longitude.toFixed(5)}-${scrollWheelZoom ? "wheel" : "nowheel"}`
        }
        center={[latitude, longitude]}
        zoom={15}
        scrollWheelZoom={scrollWheelZoom}
        className="z-0 h-full w-full [&_.leaflet-container]:isolate [&_.leaflet-container]:h-full [&_.leaflet-container]:w-full"
        style={{ height: "100%", width: "100%" }}
      >
        {!draggableMarker && <MapCenterSync latitude={latitude} longitude={longitude} />}
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker
          position={[latitude, longitude]}
          draggable={draggableMarker}
          eventHandlers={
            draggableMarker && onCoordinatesChange
              ? {
                  dragend: (e) => {
                    const ll = (e.target as L.Marker).getLatLng()
                    onCoordinatesChange(ll.lat, ll.lng)
                  },
                }
              : undefined
          }
        />
      </MapContainer>
    </div>
  )
}
