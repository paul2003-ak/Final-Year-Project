import { useEffect, useRef, useState } from "react";
import polyline from "@mapbox/polyline";

const RouteMap = ({ userLat, userLng, destLat, destLng, polyline: encodedPolyline }) => {
  const mapDivRef = useRef(null);
  const [sdkReady, setSdkReady] = useState(false);
  const [error, setError] = useState(null);

  // Load SDK
  useEffect(() => {
    const check = setInterval(() => {
      if (window.OlaMaps) {
        console.log("✅ OlaMaps loaded");
        setSdkReady(true);
        clearInterval(check);
      }
    }, 100);

    setTimeout(() => {
      clearInterval(check);
      if (!window.OlaMaps) setError("OLA Maps SDK failed to load");
    }, 5000);

    return () => clearInterval(check);
  }, []);

  // Initialize map
  useEffect(() => {
    if (!sdkReady || !mapDivRef.current) return;

    try {
      const apiKey = import.meta.env.VITE_OLA_MAPS_API_KEY;

      console.log("API KEY:", apiKey);

      const olaMaps = new window.OlaMaps({
        apiKey
      });

      console.log("🗺️ Creating map...");

      const map = olaMaps.init({
        style: "https://api.olamaps.io/tiles/vector/v1/styles/default-light-standard/style.json",
        container: mapDivRef.current,
        center: [userLng, userLat],
        zoom: 14
      });

      map.on("load", () => {
        console.log("✅ Map loaded!");

        // Decode polyline
        const coords = polyline.decode(encodedPolyline).map(p => [p[1], p[0]]);

        // Add route
        map.addSource("route", {
          type: "geojson",
          data: {
            type: "Feature",
            geometry: {
              type: "LineString",
              coordinates: coords
            }
          }
        });

        map.addLayer({
          id: "route-line",
          type: "line",
          source: "route",
          paint: {
            "line-color": "#ff0055",
            "line-width": 4
          }
        });

        // Markers
        new window.OlaMaps.Marker({ color: "blue" })
          .setLngLat([userLng, userLat])
          .addTo(map);

        new window.OlaMaps.Marker({ color: "red" })
          .setLngLat([destLng, destLat])
          .addTo(map);

        // Fit bounds
        const bounds = new window.OlaMaps.LngLatBounds();
        coords.forEach((c) => bounds.extend(c));
        map.fitBounds(bounds, { padding: 60 });

      });
    } catch (err) {
      console.error(err);
      setError(err.message);
    }
  }, [sdkReady]);

  if (error) {
    return <div className="w-full h-96 bg-red-100 flex items-center justify-center">{error}</div>;
  }

  return (
    <div
      ref={mapDivRef}
      style={{ width: "100%", height: "450px", borderRadius: "12px" }}
      className="shadow-md"
    ></div>
  );
};

export default RouteMap;
