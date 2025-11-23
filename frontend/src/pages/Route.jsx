import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import { MapPin, Navigation, Clock, ArrowRight, Sparkles, Compass } from "lucide-react";
import { serverurl } from "../App";
import RouteMap from "../components/RouteMap";
import backgroundImage from '../assets/routeimage.jpg'; // Import background image

const RoutePage = () => {
  const { state } = useLocation();
  const { userLat, userLng, destLat, destLng, name } = state;

  const [route, setRoute] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchRoute = async () => {
    try {
      console.log("📍 USER:", userLat, userLng);
      console.log("📍 DEST:", destLat, destLng);

      const res = await axios.post(`${serverurl}/api/shops/distance`, {
        origLat: userLat,
        origLng: userLng,
        destLat,
        destLng
      });

      console.log("✅ ROUTE DATA:", res.data);

      if (!res.data.polyline) {
        throw new Error("No polyline in response");
      }

      setRoute(res.data);
      setLoading(false);
    } catch (err) {
      console.error("❌ Route error:", err);
      setError(err.message || "Failed to fetch route");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRoute();
  }, []);

  return (
    <div 
        className="min-h-screen bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${backgroundImage})` }}
    >
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-lg border-b border-purple-100 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-6 py-6">
          <div className="flex items-center space-x-3">
            <div className="bg-gradient-to-br from-purple-600 to-pink-600 p-3 rounded-2xl shadow-lg">
              <Compass className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                Route to {name}
              </h1>
              <p className="text-sm text-gray-500 mt-1">Navigate with confidence</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-8">
        {loading && (
          <div className="text-center py-20 bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl">
            <div className="relative inline-block">
              <div className="animate-spin rounded-full h-20 w-20 border-4 border-purple-200 border-t-purple-600 mx-auto"></div>
              <Sparkles className="w-8 h-8 text-purple-600 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 animate-pulse" />
            </div>
            <p className="text-xl text-gray-700 mt-6 font-medium">Calculating best route...</p>
            <p className="text-sm text-gray-500 mt-2">This will only take a moment</p>
          </div>
        )}

        {error && (
          <div className="bg-gradient-to-br from-red-50/80 to-pink-50/80 border-2 border-red-200 rounded-3xl p-8 text-center shadow-xl animate-pulse backdrop-blur-sm">
            <div className="bg-red-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-3xl">⚠️</span>
            </div>
            <p className="text-red-700 font-semibold text-lg mb-2">Oops! Something went wrong</p>
            <p className="text-red-600 mb-6">{error}</p>
            <button 
              onClick={fetchRoute}
              className="px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-full hover:shadow-2xl transform hover:scale-105 transition-all duration-300 font-semibold"
            >
              Try Again
            </button>
          </div>
        )}

        {route && (
          <div className="space-y-6">
            {/* Quick Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-3xl p-6 text-white shadow-2xl transform hover:scale-105 transition-all duration-300 backdrop-blur-sm bg-white/20">
                <div className="flex items-center justify-between mb-3">
                  <MapPin className="w-8 h-8 opacity-80" />
                  <div className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-semibold">
                    Distance
                  </div>
                </div>
                <p className="text-4xl font-bold">
                  {route.distance ? `${(route.distance / 1000).toFixed(1)}` : '0'}
                </p>
                <p className="text-purple-100 text-sm mt-1">kilometers away</p>
              </div>

              <div className="bg-gradient-to-br from-pink-500 to-pink-600 rounded-3xl p-6 text-white shadow-2xl transform hover:scale-105 transition-all duration-300 backdrop-blur-sm bg-white/20">
                <div className="flex items-center justify-between mb-3">
                  <Clock className="w-8 h-8 opacity-80" />
                  <div className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-semibold">
                    Duration
                  </div>
                </div>
                <p className="text-4xl font-bold">
                  {route.duration ? Math.ceil(route.duration / 60) : '0'}
                </p>
                <p className="text-pink-100 text-sm mt-1">minutes travel time</p>
              </div>

              <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-3xl p-6 text-white shadow-2xl transform hover:scale-105 transition-all duration-300 backdrop-blur-sm bg-white/20">
                <div className="flex items-center justify-between mb-3">
                  <Navigation className="w-8 h-8 opacity-80" />
                  <div className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-semibold">
                    Steps
                  </div>
                </div>
                <p className="text-4xl font-bold">
                  {route.steps?.length || 0}
                </p>
                <p className="text-blue-100 text-sm mt-1">navigation steps</p>
              </div>
            </div>

            {/* Map Container */}
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl overflow-hidden border border-purple-100">
              <div className="bg-gradient-to-r from-purple-600 to-pink-600 px-6 py-4">
                <h2 className="text-xl font-bold text-white flex items-center">
                  <MapPin className="w-5 h-5 mr-2" />
                  Interactive Route Map
                </h2>
              </div>
              <div className="p-2">
                <RouteMap
                  userLat={userLat}
                  userLng={userLng}
                  destLat={destLat}
                  destLng={destLng}
                  polyline={route.polyline}
                />
              </div>
            </div>

            {/* Step-by-Step Directions */}
            {route.steps && route.steps.length > 0 && (
              <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl p-8 border border-purple-100">
                <div className="flex items-center mb-6">
                  <div className="bg-gradient-to-br from-purple-600 to-pink-600 p-3 rounded-2xl shadow-lg mr-4">
                    <Navigation className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-gray-800">Turn-by-Turn Directions</h3>
                    <p className="text-sm text-gray-500">Follow these steps to reach your destination</p>
                  </div>
                </div>
                
                <div className="space-y-3">
                  {route.steps.map((step, idx) => (
                    <div 
                      key={idx} 
                      className="group relative flex items-start space-x-4 p-5 bg-gradient-to-r from-purple-50/80 to-pink-50/80 rounded-2xl hover:shadow-lg transition-all duration-300 border border-purple-100 hover:border-purple-300 backdrop-blur-sm"
                    >
                      <div className="flex-shrink-0">
                        <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-pink-600 text-white rounded-full flex items-center justify-center font-bold shadow-lg group-hover:scale-110 transition-transform">
                          {idx + 1}
                        </div>
                      </div>
                      <div className="flex-1 pt-1">
                        <p className="text-gray-800 font-medium leading-relaxed">
                          {step.instructions || step.name || 'Continue on your route'}
                        </p>
                      </div>
                      <ArrowRight className="w-5 h-5 text-purple-400 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0 mt-2" />
                    </div>
                  ))}
                </div>

                <div className="mt-8 p-6 bg-gradient-to-r from-green-50/80 to-emerald-50/80 rounded-2xl border border-green-200 backdrop-blur-sm">
                  <div className="flex items-center">
                    <div className="bg-green-500 p-2 rounded-full mr-3">
                      <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <div>
                      <p className="font-semibold text-green-800">You'll arrive at your destination</p>
                      <p className="text-sm text-green-600">Safe travels!</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default RoutePage;