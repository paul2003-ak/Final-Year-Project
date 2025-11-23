import axios from "axios";


export const nerallstation=async(req,res)=>{
  const { lat, lng, radius = 1000, types = "" } = req.query;

  // localhost:8080/api/shops/nearby?lat=12.9716&lng=77.5946&radius=1500&types=store
  // the req.query is ? lat , lng , radius , types

  if (!lat || !lng) {
    return res.status(400).json({ error: "lat & lng are required" });
  }

  try {
    const url = `https://api.olamaps.io/places/v1/nearbysearch/advanced?location=${lat},${lng}&radius=${radius}&types=${types}&withCentroid=true`;

    const response = await axios.get(url, {
      headers: {
        "X-API-Key": process.env.OLA_MAPS_API_KEY,
      },
    });

    return res.json({
      success: true,
      count: response.data.predictions?.length || 0,
      data: response.data.predictions,
    });
  } catch (err) {
    console.error(err.message);
    return res.status(500).json({ error: "Failed to fetch shops" });
  }
}


//this is the frontend part 
// navigator.geolocation.getCurrentPosition(
//   (position) => {
//     const lat = position.coords.latitude;
//     const lng = position.coords.longitude;

//     fetch(`/api/shops/nearby?lat=${lat}&lng=${lng}`)
//       .then(res => res.json())
//       .then(data => console.log(data));
//   },
//   (error) => {
//     console.log("Location error:", error);
//   }
// );


export const getdistance = async (req, res) => {
  const { origLat, origLng, destLat, destLng } = req.body;

  try {
    const url = `https://api.olamaps.io/routing/v1/directions?origin=${origLat},${origLng}&destination=${destLat},${destLng}`;

    const response = await axios.post(url, null, {
      headers: { "X-API-Key": process.env.OLA_MAPS_API_KEY }
    });

    const route = response.data.routes[0];
    const leg = route.legs[0];

    // Calculate total distance and duration from steps
    const totalDistance = leg.steps.reduce((sum, step) => sum + (step.distance || 0), 0);
    const totalDuration = leg.steps.reduce((sum, step) => sum + (step.duration || 0), 0);

    res.json({
      polyline: route.overview_polyline,
      distance: totalDistance, // in meters
      duration: totalDuration, // in seconds
      steps: leg.steps
    });
  } catch (err) {
    console.error("Directions Error:", err.response?.data || err.message);
    res.status(500).json({ error: "Route fetch failed" });
  }
}
