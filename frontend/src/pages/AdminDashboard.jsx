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
      fetchPotholes();
    } catch (err) {
      alert("Failed to update status");
    }
  };

  useEffect(() => {
    fetchPotholes();
  }, [status, sort]);

  // 📊 COUNTS
  const reportedCount = potholes.filter(p => p.status === "reported").length;
  const inProgressCount = potholes.filter(p => p.status === "in-progress").length;
  const fixedCount = potholes.filter(p => p.status === "fixed").length;

  return (
    <div className="flex min-h-screen bg-gray-100">
      
      {/* ⬅️ LEFT SIDEBAR */}
      <aside className="w-72 bg-white shadow-lg p-6 flex flex-col justify-between">
        <div>
          <h2 className="text-2xl font-bold mb-6 text-gray-800">
            Admin Panel
          </h2>

          <div className="space-y-4">
            <StatCard title="Total Potholes" value={potholes.length} color="bg-blue-600" />
            <StatCard title="Reported" value={reportedCount} color="bg-red-600" />
            <StatCard title="In Progress" value={inProgressCount} color="bg-yellow-500" />
            <StatCard title="Fixed" value={fixedCount} color="bg-green-600" />
          </div>
        </div>

        {/* LOGOUT */}
        <button
          onClick={() => {
            localStorage.clear();
            window.location.href = "/";
          }}
          className="mt-6 bg-red-600 text-white py-2 rounded hover:bg-red-700"
        >
          Logout
        </button>
      </aside>

      {/* ➡️ RIGHT CONTENT */}
      <main className="flex-1 p-8">
        <h1 className="text-3xl font-bold mb-6">Pothole Reports</h1>

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
                className="bg-white p-4 rounded-lg shadow flex justify-between items-center"
              >
                {/* INFO */}
                <div>
                  <p className="font-semibold">
                    Severity: <span className="text-red-600">{p.severity}</span>
                  </p>
                  <p className="text-sm text-gray-600">
                    Reported by: {p.detectedBy?.name}
                  </p>
                </div>

                {/* STATUS + IMAGE */}
                <div className="flex items-center gap-4">
                  <span
                    className={`text-white text-xs px-3 py-1 rounded-full ${statusColors[p.status]}`}
                  >
                    {p.status}
                  </span>

                  <select
                    className="border p-1 rounded text-sm"
                    value={p.status}
                    onChange={(e) =>
                      updateStatus(p._id, e.target.value)
                    }
                  >
                    <option value="reported">Reported</option>
                    <option value="in-progress">In Progress</option>
                    <option value="fixed">Fixed</option>
                  </select>

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
      </main>
    </div>
  );
};

/* 📦 SMALL STAT CARD COMPONENT */
const StatCard = ({ title, value, color }) => (
  <div className={`p-4 rounded-lg text-white ${color}`}>
    <p className="text-sm">{title}</p>
    <h3 className="text-2xl font-bold">{value}</h3>
  </div>
);

export default AdminDashboard;
