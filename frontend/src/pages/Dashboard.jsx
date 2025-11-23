import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheaterContext } from '../context/TheaterContext';
import { Film, MapPin, LogOut, Star, Navigation, Search } from 'lucide-react';
import axios from 'axios'
import { serverurl } from '../App';
import backgroundImage from '../assets/finalimage.jpg'; // Added background image import

const Dashboard = () => {
    const navigate = useNavigate();
    const { location, theaters, loading, error, initializeLocationAndTheaters } = useTheaterContext();

    useEffect(() => {
        // Initialize location and fetch theaters when component mounts
        initializeLocationAndTheaters();
    }, []);

    const handleLogout = () => {
        // Clear any user data and navigate to login
        navigate('/');
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Fetching your location and nearby Theater...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center bg-white p-8 rounded-xl shadow-md max-w-md">
                    <div className="text-red-500 text-5xl mb-4">⚠️</div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Error</h2>
                    <p className="text-gray-600 mb-4">{error}</p>
                    <button
                        onClick={initializeLocationAndTheaters}
                        className="bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
                    >
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    const handleBestRoute = async () => {
        try {
            if (!location) return alert("Location not ready");

            // GET nearby places (theaters/hospitals/etc)
            const res = await axios.get(
                `${serverurl}/api/shops/nearby?lat=${location.lat}&lng=${location.lng}&radius=1500&types=movie_theater&withCentroid=true`
            );

            const places = res.data.data;

            // CALL AI API
            const ai = await axios.post(`${serverurl}/api/ai/bestlocation`, {
                userLat: location.lat,
                userLng: location.lng,
                places,
            });

            const best = ai.data.best;

            navigate("/route", {
                state: {
                    userLat: location.lat,
                    userLng: location.lng,
                    destLat: best.lat,
                    destLng: best.lng,
                    name: best.name,
                },
            });
        } catch (err) {
            console.error(err);
            alert("AI route failed");
        }
    };

    return (
        <div 
            className="min-h-screen bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: `url(${backgroundImage})` }}
        >
            {/* Navigation Bar */}
            <nav className="bg-white/90 backdrop-blur-sm shadow-md sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <div className="flex items-center space-x-3">
                            <Film className="w-8 h-8 text-purple-600" />
                            <h1 className="text-2xl font-bold text-gray-900">Movie Theaters</h1>
                        </div>

                        <div className="flex items-center space-x-4">
                            {location && (
                                <div className="hidden sm:flex items-center space-x-2 text-sm text-gray-600 bg-gray-100/80 px-4 py-2 rounded-lg">
                                    <MapPin className="w-4 h-4 text-purple-600" />
                                    <span>
                                        {location.lat.toFixed(4)}, {location.lng.toFixed(4)}
                                    </span>
                                </div>
                            )}

                            <button
                                onClick={handleLogout}
                                className="flex items-center space-x-2 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-colors"
                            >
                                <LogOut className="w-4 h-4" />
                                <span>Logout</span>
                            </button>

                            {/* ai part */}
                            <button
                                onClick={() => handleBestRoute()}
                                className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg"
                            >
                                ⚡ Smart AI Best Route
                            </button>

                        </div>
                    </div>
                </div>
            </nav>

            {/* Dashboard Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Stats Card */}
                <div className="bg-gradient-to-r from-purple-600/90 to-pink-600/90 backdrop-blur-sm rounded-2xl shadow-xl p-8 mb-8 text-white">
                    <div className="flex items-center justify-between">
                        <div>
                            <h2 className="text-3xl font-bold mb-2">Welcome to Your Dashboard</h2>
                            <p className="text-purple-100">
                                User
                            </p>
                        </div>
                        <div className="text-center bg-white/20 backdrop-blur-sm rounded-xl p-6">
                            <div className="text-4xl font-bold">{theaters.length}</div>
                            <div className="text-sm text-purple-100 mt-1">Theaters Found</div>
                        </div>
                    </div>
                </div>

                {/* Theaters Section */}
                <div className="mb-6 flex items-center justify-between">
                    <h3 className="text-2xl font-bold text-gray-900 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-lg">Nearby Theater</h3>
                    <div className="flex items-center space-x-2 text-sm text-gray-600 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-lg">
                        <Search className="w-4 h-4" />
                        <span>Within 1500m radius</span>
                    </div>
                </div>

                {/* Theaters Grid */}
                {theaters.length === 0 ? (
                    <div className="text-center bg-white/80 backdrop-blur-sm rounded-2xl shadow-md p-12">
                        <Film className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-600 text-lg">No Theater found nearby</p>
                        <p className="text-gray-500 text-sm mt-2">Try adjusting your location or search radius</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {theaters.map((theater, index) => (
                            <div
                                key={index}
                                className="bg-white/90 backdrop-blur-sm rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden group"
                            >
                                {/* Theater Header */}
                                <div className="relative h-40 bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                                    <Film className="w-16 h-16 text-white/80 group-hover:scale-110 transition-transform duration-300" />

                                    {/* {theater.rating && (
                                        <div className="absolute top-4 right-4 bg-yellow-400 text-yellow-900 px-3 py-1 rounded-full text-sm font-bold flex items-center space-x-1">
                                            <Star className="w-4 h-4 fill-current" />
                                            <span>{theater.rating}</span>
                                        </div>
                                    )} */}
                                </div>

                                {/* Theater Info */}
                                <div className="p-5">
                                    {/* Name */}
                                    <h4 className="text-lg font-bold text-gray-900 mb-3 group-hover:text-purple-600 transition-colors">
                                        {theater?.structured_formatting?.main_text ||
                                            theater?.name ||
                                            "Movie Theater"}
                                    </h4>

                                    {/* Address */}
                                    {(theater?.structured_formatting?.secondary_text ||
                                        theater?.description) && (
                                            <div className="flex items-start space-x-2 text-gray-600 text-sm mb-2">
                                                <MapPin className="w-10 h-10 mt-0.5 text-purple-600" />
                                                <span>
                                                    {theater?.structured_formatting?.secondary_text ||
                                                        theater?.description}
                                                </span>
                                            </div>
                                        )}

                                    {/* Distance */}
                                    {theater.distance && (
                                        <div className="flex items-center space-x-2 text-gray-600 text-sm mb-2">
                                            <Navigation className="w-4 h-4 text-purple-600" />
                                            <span>{theater.distance} away</span>
                                        </div>
                                    )}

                                    {/* Phone */}
                                    {theater.phone && (
                                        <p className="text-gray-600 text-sm mb-3">📞 {theater.phone}</p>
                                    )}

                                    {/* Open Now */}
                                    {theater.openNow !== undefined && (
                                        <div className="mb-4">
                                            <span
                                                className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${theater.openNow
                                                    ? "bg-green-100 text-green-700 border border-green-300"
                                                    : "bg-red-100 text-red-700 border border-red-300"
                                                    }`}
                                            >
                                                {theater.openNow ? "● Open Now" : "● Closed"}
                                            </span>
                                        </div>
                                    )}

                                    <button
                                        onClick={() =>
                                            navigate('/route', {
                                                state: {
                                                    userLat: location.lat,
                                                    userLng: location.lng,

                                                    // FIX: support ALL possible Ola coordinate structures
                                                    destLat:
                                                        theater.geometry?.location?.lat ||
                                                        theater.centroid?.latitude ||
                                                        theater.location?.lat,

                                                    destLng:
                                                        theater.geometry?.location?.lng ||
                                                        theater.centroid?.longitude ||
                                                        theater.location?.lng,

                                                    name: theater?.structured_formatting?.main_text,
                                                }
                                            })
                                        }
                                        className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold py-2.5 rounded-lg transition-all duration-300">
                                        View Route
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>

                )}
            </div>
        </div>
    )
}

export default Dashboard;