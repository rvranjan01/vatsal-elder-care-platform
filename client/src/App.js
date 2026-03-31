import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

import Login from "./pages/Login";
import Signup from "./pages/Signup";
import AdminDashboard from "./pages/AdminDashboard";
import ElderDashboard from "./pages/ElderDashboard";
import FamilyDashboard from "./pages/FamilyDashboard";
import DoctorDashboard from "./pages/DoctorDashboard";
import CompanionDashboard from "./pages/CompanionDashboard";
import NurseDashboard from "./pages/NurseDashboard";
import DoctorProfile from "./pages/DoctorProfile";
import CompanionList from "./pages/CompanionList";
import CompanionProfile from "./pages/CompanionProfile";
import CompanionBooking from "./pages/CompanionBooking";
import ViewCompanionProfile from "./pages/ViewCompanionProfile";
import ViewDoctorProfile from "./pages/ViewDoctorProfile";
import DoctorBooking from "./pages/DoctorBooking";

import ViewNurseProfile from "./pages/ViewNurseProfile";
import NurseBooking from "./pages/NurseBooking";
import ProviderDashboard from "./pages/ProviderDashboard";
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
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/admin-dashboard" element={<AdminDashboard />} />
          <Route path="/elder-dashboard" element={<ElderDashboard />} />
          <Route path="/family-dashboard" element={<FamilyDashboard />} />
          <Route path="/doctor-dashboard" element={<DoctorDashboard />} />
          <Route path="/companion-dashboard" element={<CompanionDashboard />} />
          <Route path="/nurse-dashboard" element={<NurseDashboard />} />
          <Route path="/doctor-profile" element={<DoctorProfile />} />
          <Route path="/companions" element={<CompanionList />} />
          {/* <Route path="/companions/:id" element={<CompanionProfile />} /> */}
          <Route path="/companions/:id" element={<ViewCompanionProfile />} />
          <Route path="/companions/:id/book" element={<CompanionBooking />} />
          <Route path="/doctors/:id" element={<ViewDoctorProfile />} />
          <Route path="/doctors/:id/book" element={<DoctorBooking />} />
          <Route path="/nurses/:id" element={<ViewNurseProfile />} />
          <Route path="/nurses/:id/book" element={<NurseBooking />} />
          <Route path="/provider-dashboard" element={<ProviderDashboard />} />
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
