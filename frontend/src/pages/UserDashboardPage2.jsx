import { useEffect, useState } from "react";
import axios from "axios";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Circle,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

const UserDashboardPage2 = () => {
  const [location, setLocation] = useState({
    latitude: null,
    longitude: null,
  });

  const [allPotholes, setAllPotholes] = useState([]);
  const [nearPotholes, setNearPotholes] = useState([]);

  const token = localStorage.getItem("token");

  // 📍 Live Location
  useEffect(() => {
    const watchId = navigator.geolocation.watchPosition(
      (position) => {
        setLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
      },
      (error) => console.error(error),
      { enableHighAccuracy: true }
    );

    return () => navigator.geolocation.clearWatch(watchId);
  }, []);

  // 🌍 Fetch All Potholes
  useEffect(() => {
    axios
      .get("http://localhost:5000/api/potholes", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setAllPotholes(res.data))
      .catch((err) => console.error(err));
  }, [token]);

  // 📏 Distance Function
  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371e3;
    const φ1 = (lat1 * Math.PI) / 180;
    const φ2 = (lat2 * Math.PI) / 180;
    const Δφ = ((lat2 - lat1) * Math.PI) / 180;
    const Δλ = ((lon2 - lon1) * Math.PI) / 180;

    const a =
      Math.sin(Δφ / 2) ** 2 +
      Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) ** 2;

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  // 🔴 Detect Near Potholes (300 meters)
useEffect(() => {
  if (location.latitude === null || location.longitude === null) return;

  axios
    .get("http://localhost:5000/api/potholes/nearby", {
      params: {
        lat: location.latitude,
        lng: location.longitude,
        radius: 100,
      },
      headers: { Authorization: `Bearer ${token}` },
    })
    .then((res) => setNearPotholes(res.data))
    .catch((err) => console.error(err));
}, [location.latitude, location.longitude, token]);


  // 🔔 Notification
  useEffect(() => {
    if (nearPotholes.length > 0) {
      alert(`⚠️ ${nearPotholes.length} pothole(s) nearby`);
    }
  }, [nearPotholes]);

  // 🎨 Custom Icons
  const greenIcon = new L.Icon({
    iconUrl:
      "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-green.png",
    shadowUrl:
      "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
  });

  const redIcon = new L.Icon({
    iconUrl:
      "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png",
    shadowUrl:
      "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
  });

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      {location.latitude !== null && location.longitude !== null && (
        <MapContainer
          center={[location.latitude, location.longitude]}
          zoom={16}
          style={{ height: "600px", width: "100%" }}
        >
          <TileLayer
            attribution="© OpenStreetMap"
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {/* 📍 User Marker */}
          <Marker position={[location.latitude, location.longitude]}>
            <Popup>You are here</Popup>
          </Marker>

          {/* 🔵 Radius */}
          <Circle
            center={[location.latitude, location.longitude]}
            radius={300}
            pathOptions={{ color: "blue" }}
          />

          {/* 🚧 Pothole Markers */}
          {allPotholes
            .filter((p) => p.location?.coordinates?.length === 2)
            .map((p) => {
              const lat = p.location.coordinates[1];
              const lng = p.location.coordinates[0];

              const isNear = nearPotholes.some(
                (near) => near._id === p._id
              );

              return (
                <Marker
                  key={p._id}
                  position={[lat, lng]}
                  icon={isNear ? redIcon : greenIcon}
                >
                  <Popup>
                    🚧 Pothole <br />
                    {isNear ? "⚠️ Nearby!" : "Normal Distance"}
                  </Popup>
                </Marker>
              );
            })}
        </MapContainer>
      )}
    </div>
  );
};

export default UserDashboardPage2;
