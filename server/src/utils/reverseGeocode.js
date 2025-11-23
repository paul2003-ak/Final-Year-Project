import axios from "axios";

export const reverseGeocode = async (lat, lng) => {
  try {
    const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`;
    const res = await axios.get(url, {
      headers: { "User-Agent": "NearestBikeRepairApp/1.0" },
      timeout: 10000,
    });
    return res.data.display_name || null;
  } catch (err) {
    console.warn(`⚠️ Reverse geocode failed for ${lat},${lng}: ${err.message}`);
    return null;
  }
};
