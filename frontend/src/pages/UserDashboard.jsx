import { useEffect, useState } from "react";
import axios from "axios";

const UserDashboard = () => {
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [location, setLocation] = useState({
    latitude: "",
    longitude: "",
  });
  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem("token");

  /* 📍 GET CURRENT LOCATION */
  useEffect(() => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
      },
      (error) => {
        console.error(error);
        alert("Failed to get location. Please allow location access.");
      }
    );
  }, []);

  /* 📸 IMAGE HANDLER */
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
    setPreview(URL.createObjectURL(file));
  };

  /* 🚀 SUBMIT */
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!image || !location.latitude) {
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

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center items-center p-4">
      <div className="bg-white p-6 rounded shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4">Report a Pothole</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* IMAGE INPUT */}
          <div>
            <label className="block font-medium mb-1">Upload Photo</label>
            <input
              type="file"
              accept="image/*"
              capture="environment"
              onChange={handleImageChange}
              className="w-full"
              required
            />
          </div>

          {/* PREVIEW */}
          {preview && (
            <img
              src={preview}
              alt="preview"
              className="w-full h-40 object-cover rounded"
            />
          )}

          {/* LOCATION */}
          <div className="text-sm text-gray-600">
            <p>
              📍 Latitude:{" "}
              <span className="font-medium">{location.latitude}</span>
            </p>
            <p>
              📍 Longitude:{" "}
              <span className="font-medium">{location.longitude}</span>
            </p>
          </div>

          {/* SUBMIT */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
          >
            {loading ? "Submitting..." : "Submit Report"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default UserDashboard;
