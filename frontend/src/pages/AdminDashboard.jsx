import { useEffect, useState } from "react";
import axios from "axios";

const AdminDashboard = () => {
  const [potholes, setPotholes] = useState([]);
  const [status, setStatus] = useState("");
  const [sort, setSort] = useState("");
  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem("token");

  const statusColors = {
    reported: "bg-red-500",
    "in-progress": "bg-yellow-500",
    fixed: "bg-green-500",
  };

  const fetchPotholes = async () => {
    try {
      setLoading(true);

      const res = await axios.get(
        "http://localhost:5000/api/admin/potholes",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          params: { status, sort },
        }
      );

      setPotholes(res.data.potholes);
    } catch (err) {
      console.error(err);
      alert("Failed to fetch potholes");
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id, newStatus) => {
    try {
      await axios.put(
        `http://localhost:5000/api/admin/potholes/${id}/status`,
        { status: newStatus },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      fetchPotholes(); // refresh list
    } catch (err) {
      alert("Failed to update status");
    }
  };

  useEffect(() => {
    fetchPotholes();
  }, [status, sort]);

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>

      {/* FILTERS */}
      <div className="flex gap-4 mb-6">
        <select
          className="p-2 border rounded"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
        >
          <option value="">All Status</option>
          <option value="reported">Reported</option>
          <option value="in-progress">In Progress</option>
          <option value="fixed">Fixed</option>
        </select>

        <select
          className="p-2 border rounded"
          value={sort}
          onChange={(e) => setSort(e.target.value)}
        >
          <option value="">Sort by Severity</option>
          <option value="low">Low → High</option>
          <option value="high">High → Low</option>
        </select>
      </div>

      {/* LIST */}
      {loading ? (
        <p>Loading...</p>
      ) : potholes.length === 0 ? (
        <p>No potholes found</p>
      ) : (
        <div className="grid gap-4">
          {potholes.map((p) => (
            <div
              key={p._id}
              className="bg-white p-4 rounded shadow flex justify-between items-center"
            >
              {/* LEFT INFO */}
              <div>
                <p className="font-semibold">
                  Severity:{" "}
                  <span className="text-red-600">{p.severity}</span>
                </p>
                <p className="text-sm text-gray-500">
                  Location: {p.location.latitude}, {p.location.longitude}
                </p>
                <p className="text-sm">
                  Reported by: {p.detectedBy?.name}
                </p>
              </div>

              {/* STATUS + IMAGE */}
              <div className="flex items-center gap-4">
                {/* STATUS */}
                <div className="flex flex-row items-center gap-2">
                  <span
                    className={`text-white text-xs px-3  py-1 mr-4 rounded-full ${
                      statusColors[p.status]
                    }`}
                  >
                    {p.status}
                  </span>

                  <select
                    className="border p-1 rounded text-sm ml-4"
                    value={p.status}
                    onChange={(e) =>
                      updateStatus(p._id, e.target.value)
                    }
                  >
                    <option value="reported">Reported</option>
                    <option value="in-progress">In Progress</option>
                    <option value="fixed">Fixed</option>
                  </select>
                </div>

                {/* IMAGE */}
                <img
                  src={`http://localhost:5000${p.imageUrl}`}
                  alt="pothole"
                  className="w-32 h-20 object-cover rounded"
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
