import React, { createContext, useContext, useState } from 'react';
import { serverurl } from '../App';

const TheaterContext = createContext();

export const useTheaterContext = () => {
  const context = useContext(TheaterContext);
  if (!context) {
    throw new Error('useTheaterContext must be used within a TheaterProvider');
  }
  return context;
};

export const TheaterProvider = ({ children }) => {
  const [location, setLocation] = useState(null);
  const [theaters, setTheaters] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Function to get user's current location
  const fetchLocation = () => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocation is not supported by your browser'));
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          const userLocation = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };
          setLocation(userLocation);
          resolve(userLocation);
        },
        (error) => {
          reject(error);
        }
      );
    });
  };

  // Function to fetch nearby theaters
 const fetchNearbyTheaters = async (lat, lng) => {
  setLoading(true);
  setError(null);

  try {
    const response = await fetch(
      `${serverurl}/api/shops/nearby?lat=${lat}&lng=${lng}&radius=1500&types=movie_theater&withCentroid=true`
    );

    if (!response.ok) {
      throw new Error('Failed to fetch nearby theaters');
    }

    const data = await response.json();

    console.log("🎬 NEARBY THEATERS FETCHED:", data.data);
    // 👉 FIX HERE
    setTheaters(data.data || []);
    return data.data || [];

  } catch (err) {
    setError(err.message);
    throw err;
  } finally {
    setLoading(false);
  }
};


  // Function to initialize location and fetch theaters
  const initializeLocationAndTheaters = async () => {
    try {
      const userLocation = await fetchLocation();
      await fetchNearbyTheaters(userLocation.lat, userLocation.lng);
    } catch (err) {
      setError(err.message);
    }
  };

  const value = {
    location,
    theaters,
    loading,
    error,
    fetchLocation,
    fetchNearbyTheaters,
    initializeLocationAndTheaters,
    setLocation,
    setTheaters,
    setLoading,
    setError
  };

  return (
    <TheaterContext.Provider value={value}>
      {children}
    </TheaterContext.Provider>
  );
};