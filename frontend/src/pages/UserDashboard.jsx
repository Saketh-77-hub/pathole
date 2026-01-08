import { useEffect, useState } from "react";
import axios from "axios";
import { GoogleMap, Marker, useJsApiLoader } from "@react-google-maps/api";

const UserDashboard = () => {
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
  });

  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [location, setLocation] = useState({
    latitude: null,
    longitude: null,
    heading: null,
  });
  const [nearbyPotholes, setNearbyPotholes] = useState([]);
  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!navigator.geolocation) {
      alert("Geolocation not supported by your browser");
      return;
    }

    const watchId = navigator.geolocation.watchPosition(
      (position) => {
        setLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          heading: position.coords.heading ?? null,
        });
      },
      (error) => {
        console.error("Geolocation error:", error);
        alert("Unable to access location. Please allow location access.");
      },
      {
        enableHighAccuracy: true,
        maximumAge: 0,
        timeout: 10000,
      }
    );

    return () => navigator.geolocation.clearWatch(watchId);
  }, []);

  useEffect(() => {
    if (location.latitude === null || location.longitude === null) return;

    axios
      .get("http://localhost:5000/api/potholes/nearby", {
        params: {
          lat: location.latitude,
          lng: location.longitude,
          radius: 300,
        },
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setNearbyPotholes(res.data))
      .catch((err) => console.error(err));
  }, [location.latitude, location.longitude, token]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!image || location.latitude === null) {
      alert("Image and location are required");
      return;
    }

    try {
      setLoading(true);

      const formData = new FormData();
      formData.append("image", image);
      formData.append("latitude", location.latitude);
      formData.append("longitude", location.longitude);

      await axios.post("http://localhost:5000/api/potholes", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      alert("Pothole reported successfully ✅");
      setImage(null);
      setPreview(null);
    } catch (err) {
      console.error(err);
      alert("Failed to report pothole ❌");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (nearbyPotholes.length > 0) {
      alert(`⚠️ ${nearbyPotholes.length} pothole(s) nearby`);
    }
  }, [nearbyPotholes]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 p-6">
      <div className="flex justify-end mb-4">
  <button
    onClick={() => {
      localStorage.clear(); // Clear all localStorage items
      window.location.href = "/"; // Redirect to login page
    }}
    className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
  >
    Logout
  </button>
</div>
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* 🗺️ MAP SECTION */}
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="px-6 py-4 border-b">
            <h2 className="text-xl font-semibold">Live Location & Nearby Potholes</h2>
            <p className="text-sm text-gray-500">
              Real-time tracking within 300 meters
            </p>
          </div>

          {isLoaded && location.latitude && location.longitude && (
            <GoogleMap
              center={{ lat: location.latitude, lng: location.longitude }}
              zoom={16}
              mapContainerStyle={{ width: "100%", height: "520px" }}
            >
              <Marker
                position={{ lat: location.latitude, lng: location.longitude }}
                label="You"
              />

              {nearbyPotholes.map((p) => (
                <Marker
                  key={p._id}
                  position={{
                    lat: p.location.coordinates[1],
                    lng: p.location.coordinates[0],
                  }}
                />
              ))}
            </GoogleMap>
          )}
        </div>

        {/* 📸 REPORT PANEL */}
        <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-6 h-fit">
          <h2 className="text-xl font-semibold mb-4">Report a Pothole</h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-sm font-medium">Upload Image</label>
              <input
                type="file"
                accept="image/*"
                capture="environment"
                onChange={handleImageChange}
                className="mt-1 w-full border rounded px-3 py-2"
                required
              />
            </div>

            {preview && (
              <img
                src={preview}
                alt="Preview"
                className="w-full h-44 object-cover rounded-lg border"
              />
            )}

            <div className="text-sm bg-gray-50 p-3 rounded-lg">
              <p>📍 <b>Latitude:</b> {location.latitude}</p>
              <p>📍 <b>Longitude:</b> {location.longitude}</p>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 transition text-white py-2 rounded-lg font-medium"
            >
              {loading ? "Submitting..." : "Submit Report"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
