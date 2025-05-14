'use client';

import { useEffect, useRef, useState } from "react"
import mapboxgl from "mapbox-gl"
import "mapbox-gl/dist/mapbox-gl.css"

interface MapBoxProps {
  initialView?: {
    longitude: number
    latitude: number
    zoom: number
  }
  markers?: Array<{
    id: string
    longitude: number
    latitude: number
    title?: string
    description?: string
  }>
  height?: string
  width?: string
  className?: string
  onMarkerClick?: (markerId: string) => void
}

export default function MapBox({
  initialView = { longitude: -74.5, latitude: 40, zoom: 9 },
  markers = [],
  height = "100%",
  width = "100%",
  className = "",
  onMarkerClick,
}: MapBoxProps) {
  const mapContainer = useRef<HTMLDivElement>(null)
  const map = useRef<mapboxgl.Map | null>(null)
  const [mapLoaded, setMapLoaded] = useState(false)
  const [tokenMissing, setTokenMissing] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  // Fetch the token from our API route
  useEffect(() => {
    async function fetchToken() {
      try {
        const response = await fetch("/api/mapbox-token")
        const data = await response.json()

        if (data.token) {
          mapboxgl.accessToken = data.token
          setIsLoading(false)
        } else {
          setTokenMissing(true)
          setIsLoading(false)
        }
      } catch (error) {
        console.error("Error fetching Mapbox token:", error)
        setTokenMissing(true)
        setIsLoading(false)
      }
    }

    fetchToken()
  }, [])

  // Initialize map when component mounts and token is loaded
  useEffect(() => {
    if (isLoading || tokenMissing || !mapContainer.current) return

    try {
      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: "mapbox://styles/mapbox/light-v11",
        center: [initialView.longitude, initialView.latitude],
        zoom: initialView.zoom,
      })

      map.current.on("load", () => {
        setMapLoaded(true)
      })
    } catch (error) {
      console.error("Error initializing map:", error)
      setTokenMissing(true)
    }

    // Clean up on unmount
    return () => {
      if (map.current) {
        map.current.remove()
      }
    }
  }, [initialView.latitude, initialView.longitude, initialView.zoom, isLoading, tokenMissing])

  // Add markers when map is loaded or markers change
  useEffect(() => {
    if (!mapLoaded || !map.current) return

    // Clear existing markers
    const existingMarkers = document.querySelectorAll(".mapboxgl-marker")
    existingMarkers.forEach((marker) => marker.remove())

    // Add new markers
    markers.forEach((marker) => {
      const el = document.createElement("div")
      el.className = "marker"
      el.style.backgroundImage = "url(https://docs.mapbox.com/mapbox-gl-js/assets/pin.svg)"
      el.style.width = "30px"
      el.style.height = "30px"
      el.style.backgroundSize = "100%"
      el.style.cursor = "pointer"

      // Add data attribute for identification
      el.setAttribute("data-marker-id", marker.id)

      // Add click event
      el.addEventListener("click", () => {
        if (onMarkerClick) {
          onMarkerClick(marker.id)
        }
      })

      // Add popup if title or description exists
      if (marker.title || marker.description) {
        const popup = new mapboxgl.Popup({ offset: 25 }).setHTML(
          `<h3>${marker.title || ""}</h3><p>${marker.description || ""}</p>`,
        )

        new mapboxgl.Marker(el).setLngLat([marker.longitude, marker.latitude]).setPopup(popup).addTo(map.current!)
      } else {
        new mapboxgl.Marker(el).setLngLat([marker.longitude, marker.latitude]).addTo(map.current!)
      }
    })
  }, [mapLoaded, markers, onMarkerClick])

  if (isLoading) {
    return (
      <div
        className={`flex items-center justify-center rounded-lg border border-dashed bg-muted/50 ${className}`}
        style={{ height, width }}
      >
        <div className="text-center p-4">
          <p className="font-medium">Loading map...</p>
        </div>
      </div>
    )
  }

  if (tokenMissing) {
    return (
      <div
        className={`flex items-center justify-center rounded-lg border border-dashed bg-muted/50 ${className}`}
        style={{ height, width }}
      >
        <div className="text-center p-4">
          <p className="font-medium">Map unavailable</p>
          <p className="text-sm text-muted-foreground">Mapbox token is missing or invalid</p>
        </div>
      </div>
    )
  }

  return (
    <div ref={mapContainer} className={`relative overflow-hidden rounded-lg ${className}`} style={{ height, width }} />
  )
}
