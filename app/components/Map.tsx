interface MapProps {
  lat: number
  lng: number
}

const Map = ({ lat, lng }: MapProps) => {
  const mapSrc = `https://www.google.com/maps?q=${lat},${lng}&hl=en&z=14&output=embed`

  return (
    <div className="w-full h-[450px]">
      <iframe
        src="https://www.google.com/maps?q=39.886667,-103.890111&hl=en&z=14&output=embed"
        width="100%"
        height="100%"
        style={{ border: 0 }}
        allowFullScreen
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
      ></iframe>
    </div>
  )
}

export default Map

