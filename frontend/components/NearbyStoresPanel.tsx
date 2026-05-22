"use client";
import { useEffect, useState } from "react";
import { getNearbyStores, StoreResult } from "@/lib/api";
import { MapPin, Star, Navigation, ExternalLink, Loader2, AlertCircle, RefreshCw, Map } from "lucide-react";

interface Props {
  componentName?: string;
}

export default function NearbyStoresPanel({ componentName }: Props) {
  const [stores, setStores] = useState<StoreResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [locationDenied, setLocationDenied] = useState(false);
  const [userLat, setUserLat] = useState<number | null>(null);
  const [userLng, setUserLng] = useState<number | null>(null);

  const fetchStores = (lat: number, lng: number) => {
    setLoading(true);
    setError("");
    // Always search for "electronics store" regardless of component name
    getNearbyStores("electronics store components", lat, lng)
      .then(results => setStores(results))
      .catch(() => setError("Failed to fetch nearby stores. Try again."))
      .finally(() => setLoading(false));
  };

  const requestLocation = () => {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser.");
      return;
    }
    setLoading(true);
    setError("");
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        setUserLat(latitude);
        setUserLng(longitude);
        fetchStores(latitude, longitude);
      },
      (err) => {
        setLocationDenied(err.code === 1);
        setError(
          err.code === 1
            ? "Location access denied. Please allow location in your browser settings and try again."
            : "Unable to get your location. Please try again."
        );
        setLoading(false);
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  useEffect(() => {
    requestLocation();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const openGoogleMapsSearch = () => {
    if (userLat && userLng) {
      window.open(
        `https://www.google.com/maps/search/electronics+store/@${userLat},${userLng},14z`,
        "_blank"
      );
    } else {
      window.open("https://www.google.com/maps/search/electronics+store+near+me", "_blank");
    }
  };

  if (locationDenied) {
    return (
      <div className="flex flex-col gap-3">
        <div className="flex items-start gap-3 text-yellow-400 bg-yellow-950/30 border border-yellow-800/50 rounded-xl p-4">
          <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-medium text-sm">Location access denied</p>
            <p className="text-yellow-500/70 text-xs mt-1">
              Enable location in your browser settings, then click retry.
            </p>
          </div>
        </div>
        <button
          onClick={() => { setLocationDenied(false); requestLocation(); }}
          className="flex items-center justify-center gap-2 bg-gray-800 hover:bg-gray-700 border border-gray-700 text-gray-300 text-sm py-2.5 rounded-xl transition-colors"
        >
          <RefreshCw className="w-4 h-4" /> Retry with location
        </button>
        <button
          onClick={openGoogleMapsSearch}
          className="flex items-center justify-center gap-2 bg-blue-950/60 hover:bg-blue-900/60 border border-blue-800/50 text-blue-400 text-sm py-2.5 rounded-xl transition-colors"
        >
          <Map className="w-4 h-4" /> Search on Google Maps
        </button>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center gap-3 py-8 text-gray-400">
        <div className="relative">
          <Loader2 className="w-8 h-8 animate-spin text-cyan-400" />
          <div className="absolute inset-0 rounded-full border-2 border-cyan-400/20 animate-ping" />
        </div>
        <p className="text-sm">Finding nearby electronics stores...</p>
        <p className="text-xs text-gray-600">Using your live location</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col gap-3">
        <div className="flex items-center gap-2 text-red-400 bg-red-950/30 border border-red-800/50 rounded-xl p-4 text-sm">
          <AlertCircle className="w-4 h-4 flex-shrink-0" /> {error}
        </div>
        <button
          onClick={requestLocation}
          className="flex items-center justify-center gap-2 bg-gray-800 hover:bg-gray-700 border border-gray-700 text-gray-300 text-sm py-2.5 rounded-xl transition-colors"
        >
          <RefreshCw className="w-4 h-4" /> Try again
        </button>
      </div>
    );
  }

  if (stores.length === 0) {
    return (
      <div className="flex flex-col gap-3">
        <p className="text-gray-500 text-sm text-center py-4">No electronics stores found nearby.</p>
        <button
          onClick={openGoogleMapsSearch}
          className="flex items-center justify-center gap-2 bg-blue-950/60 hover:bg-blue-900/60 border border-blue-800/50 text-blue-400 text-sm py-2.5 rounded-xl transition-colors"
        >
          <Map className="w-4 h-4" /> Search on Google Maps
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {/* Live location badge + Google Maps button */}
      <div className="flex items-center justify-between mb-1">
        <div className="flex items-center gap-2 text-xs text-green-400">
          <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
          Live location active
        </div>
        <button
          onClick={openGoogleMapsSearch}
          className="flex items-center gap-1.5 text-xs text-blue-400 hover:text-blue-300 bg-blue-950/40 border border-blue-800/40 px-3 py-1.5 rounded-full transition-colors"
        >
          <Map className="w-3.5 h-3.5" /> View on Google Maps
        </button>
      </div>

      {stores.map((store) => (
        <div key={store.place_id} className="bg-gray-900 border border-gray-800 hover:border-cyan-800/50 rounded-xl p-4 flex items-start gap-3 transition-all hover:-translate-y-0.5">
          <div className="p-2 bg-cyan-950 rounded-lg flex-shrink-0">
            <MapPin className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-2">
              <h4 className="text-white font-medium text-sm truncate">{store.name}</h4>
              <span className={`text-xs px-2 py-0.5 rounded-full flex-shrink-0 font-medium ${
                store.open_now === true
                  ? "bg-green-950 text-green-400 border border-green-800/50"
                  : store.open_now === false
                  ? "bg-red-950 text-red-400 border border-red-800/50"
                  : "bg-gray-800 text-gray-500 border border-gray-700"
              }`}>
                {store.open_now === true ? "Open" : store.open_now === false ? "Closed" : "Unknown"}
              </span>
            </div>
            <p className="text-gray-400 text-xs mt-0.5 truncate">{store.address}</p>
            <div className="flex items-center gap-3 mt-2">
              {store.rating && (
                <span className="flex items-center gap-1 text-yellow-400 text-xs">
                  <Star className="w-3 h-3 fill-yellow-400" />
                  {store.rating}
                  {store.total_ratings && (
                    <span className="text-gray-500">({store.total_ratings})</span>
                  )}
                </span>
              )}
              {store.distance_km && (
                <span className="flex items-center gap-1 text-gray-400 text-xs">
                  <Navigation className="w-3 h-3" /> {store.distance_km} km
                </span>
              )}
            </div>
          </div>
          <a
            href={store.maps_url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-500 hover:text-cyan-400 transition-colors flex-shrink-0 p-1"
            title="Open in Google Maps"
          >
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>
      ))}

      <button
        onClick={requestLocation}
        className="flex items-center justify-center gap-2 text-xs text-gray-500 hover:text-gray-300 transition-colors mt-1"
      >
        <RefreshCw className="w-3.5 h-3.5" /> Refresh stores
      </button>
    </div>
  );
}
