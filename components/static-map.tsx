import Image from "next/image"

interface StaticMapProps {
  latitude: number
  longitude: number
  zoom: number
  width: number
  height: number
  title?: string
  className?: string
}

export default function StaticMap({ latitude, longitude, zoom, width, height, title, className }: StaticMapProps) {
  // Instead of using Mapbox, we'll use a placeholder map image
  return (
    <div className={`relative overflow-hidden rounded-lg ${className}`}>
      <div className="absolute inset-0 flex items-center justify-center bg-muted/50">
        <div className="text-center p-4">
          <p className="font-medium">Map Location</p>
          <p className="text-sm text-muted-foreground">
            {title || "Location"}: {latitude.toFixed(6)}, {longitude.toFixed(6)}
          </p>
        </div>
      </div>
      <Image
        src={`/placeholder.svg?height=${height}&width=${width}&text=Map+at+${latitude.toFixed(2)}%2C${longitude.toFixed(2)}`}
        alt={`Map location at ${latitude}, ${longitude}`}
        width={width}
        height={height}
        className="w-full h-auto"
      />
    </div>
  )
}
