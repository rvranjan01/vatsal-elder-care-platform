import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ElderDashboard from "./pages/ElderDashboard";
import FamilyDashboard from "./pages/FamilyDashboard";
import Health from "./pages/Health";
import Games from "./pages/Games";
import Yoga from "./pages/Yoga";
import Booking from "./pages/Booking";
import Chatbot from "./pages/Chatbot";

function App() {
  return (
    <Router>
      <Navbar />
      <div className="container mt-4">
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/elder-dashboard" element={<ElderDashboard />} />
          <Route path="/family-dashboard" element={<FamilyDashboard />} />
          <Route path="/health" element={<Health />} />
          <Route path="/games" element={<Games />} />
          <Route path="/yoga" element={<Yoga />} />
          <Route path="/booking" element={<Booking />} />
          <Route path="/chatbot" element={<Chatbot />} />
        </Routes>
      </div>
      <Footer />
    </Router>
  );
}

export default App;



// Test 
// import Login from "./pages/Login";

// function App() {
//   return <Login />;
// }

// export default App;
