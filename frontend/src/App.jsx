import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import AdminDashboard from "./pages/AdminDashboard";
import UserDashboard from "./pages/UserDashboard";


function App() {
  return (
    <Router>
      <Routes>
        {/* Auth Routes */}
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* Later */}
        <Route path="/admin" element={<AdminDashboard />} /> 
        <Route path="/user" element={<UserDashboard />} /> 
      </Routes>
    </Router>
  );
}

export default App;
