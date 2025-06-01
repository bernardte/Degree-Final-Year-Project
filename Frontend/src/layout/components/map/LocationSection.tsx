import { SetStateAction, useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L, { Icon } from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-routing-machine/dist/leaflet-routing-machine.css";
import markerList from "@/constant/markerList";
import Routing from "./Routing";
import useToast from "@/hooks/useToast";

// Custom hotel icon
const hotelIcon = new Icon({
  iconUrl: "/location.png",
  iconSize: [38, 38],
});

const Location = ({ title, setDirection }: { title: string, setDirection: React.Dispatch<SetStateAction<string []>> }) => {
  const [city, setCity] = useState("");
  const [userLocation, setUserLocation] = useState<[number, number] | null>(
    null,
  );
  const [nearestHotel, setNearestHotel] = useState<
    (typeof markerList)[0] | null
  >(null);

  const [showDistance, setShowDistance] = useState(false);
  const { showToast } = useToast();

  const handleSearch = async () => {
    if (!city) return;
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(city)}`,
      );
      const data = await response.json();
      if (data.length > 0) {
        const { lat, lon } = data[0];
        setUserLocation([parseFloat(lat), parseFloat(lon)]);
      } else {
        showToast("warn", "Location not found. Please try again.");
      }

      setCity("");
    } catch (err) {
      console.error("Geocoding error:", err);
    }
  };

  useEffect(() => {
    if (userLocation) {
      const userLatLng = L.latLng(userLocation);
      /**
       * Represents the minimum distance initialized to a very large value (Infinity).
       * This variable is typically used to track the smallest distance encountered
       * during a computation or iteration process.
       */
      let minDist = Infinity;
      let nearest = null;
      markerList.forEach((marker) => {
        const hotelLatLng = L.latLng(marker.geoCode as [number, number]);
        const dist = userLatLng.distanceTo(hotelLatLng);
        if (dist < minDist) {
          minDist = dist;
          nearest = marker;
        }
      });
      setNearestHotel(nearest);
      setShowDistance(true);

      const timer = setTimeout(() => setShowDistance(false), 6000);
      return () => clearTimeout(timer);
    }
  }, [userLocation]);

  return (
    <div className="relative h-[370px] w-screen">
      <h2 className="bg-gradient-to-r from-cyan-500 to-blue-600 bg-clip-text pb-8 text-center text-5xl font-bold text-transparent">
        {title}
      </h2>
      <MapContainer
        center={userLocation || [5.4141, 100.3288]}
        zoom={6}
        className="z-0 h-[300px] w-full"
      >
        <TileLayer
          attribution='&copy; <a href="https://carto.com/">CARTO</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          maxZoom={19}
          minZoom={3}
        />

        {/* Always show hotel markers with custom icon */}
        {markerList.map((marker, index) => (
          <Marker
            key={index}
            position={marker.geoCode as [number, number]}
            icon={hotelIcon}
          >
            <Popup>{marker.popup}</Popup>
          </Marker>
        ))}

        {/* Show user location only when available */}
        {userLocation && (
          <Marker position={userLocation}>
            <Popup>Your location</Popup>
          </Marker>
        )}

        {/* Routing shown only after user types location */}
        {userLocation && nearestHotel && (
          <Routing
            from={userLocation}
            to={nearestHotel.geoCode as [number, number]}
            onInstruction={setDirection}
          />
        )}
      </MapContainer>


      {/* Search bar at the bottom center of the screen */}
      <div className="absolute bottom-6 left-1/2 z-[10] flex w-[90%] max-w-xl -translate-x-1/2 transform flex-col items-center justify-between gap-4 rounded-lg border border-gray-200 bg-white p-4 shadow-lg sm:flex-row">
        <input
          type="text"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          placeholder="Enter your current location"
          className="w-full flex-1 rounded-md border border-gray-300 px-4 py-2 text-gray-700 shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
        />
        <button
          onClick={handleSearch}
          className="w-full rounded-md bg-blue-600 px-6 py-2 font-medium text-white shadow transition duration-200 hover:bg-blue-700 sm:w-auto"
        >
          Search
        </button>
      </div>

      {/* Distance popup */}
      {nearestHotel && userLocation && showDistance && (
        <div className="absolute top-1 left-1/2 z-[999] -translate-x-1/2 rounded-md border-l-4 border-green-600 bg-green-50 px-6 py-4 text-green-700 shadow-md">
          <p>
            Hotel Distance:{" "}
            <span className="font-semibold">{nearestHotel.popup}</span> (
            <span className="font-semibold">
              {(
                L.latLng(userLocation).distanceTo(
                  L.latLng(nearestHotel.geoCode as [number, number]),
                ) / 1000
              ).toFixed(2)}{" "}
              km
            </span>
            )
          </p>
        </div>
      )}
    </div>
  );
};

export default Location;
