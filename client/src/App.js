import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

import LandingPage from "./pages/LandingPage";
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
import DoctorsList from "./pages/DoctorsList";
import DoctorBooking from "./pages/DoctorBooking";

import ViewNurseProfile from "./pages/ViewNurseProfile";
import NurseBooking from "./pages/NurseBooking";
import NursesList from "./pages/NursesList";
import ProviderDashboard from "./pages/ProviderDashboard";
import Health from "./pages/Health";
import Games from "./pages/Games";
// .........
import GamesPage from "./pages/games/GamesPage";
import GamePlayPage from "./pages/games/GamePlayPage";
import GameScorePage from "./pages/games/GameScorePage";
import GameDetailPage from "./pages/games/GameDetailPage";

import MedicinesPage from "./pages/MedicinesPage";
// ..............
import Yoga from "./pages/Yoga";
import Events from "./pages/Events";
import Booking from "./pages/Booking";
import Chatbot from "./pages/Chatbot";

function AppContent() {
  const location = useLocation();

  // Pages where navbar and footer should NOT be shown
  const hideNavFooterRoutes = ["/", "/login", "/signup"];
  const showNavFooter = !hideNavFooterRoutes.includes(location.pathname);

  return (
    <>
      {showNavFooter && <Navbar />}
      <div className={showNavFooter ? "container mt-4" : ""}>
        <Routes>
          <Route path="/" element={<LandingPage />} />
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
          <Route path="/doctors" element={<DoctorsList />} />
          <Route path="/nurses" element={<NursesList />} />
          {/* <Route path="/companions/:id" element={<CompanionProfile />} /> */}
          <Route path="/companions/:id" element={<ViewCompanionProfile />} />
          <Route path="/companions/:id/book" element={<CompanionBooking />} />
          <Route path="/doctors/:id" element={<ViewDoctorProfile />} />
          <Route path="/doctors/:id/book" element={<DoctorBooking />} />
          <Route path="/nurses/:id" element={<ViewNurseProfile />} />
          <Route path="/nurses/:id/book" element={<NurseBooking />} />
          <Route path="/provider-dashboard" element={<ProviderDashboard />} />
          <Route path="/health" element={<Health />} />
          <Route path="/medicines" element={<MedicinesPage />} />
          {/* <Route path="/games" element={<Games />} /> */}
          <Route path="/games" element={<GamesPage />} />
          <Route path="/games/:gameId" element={<GameDetailPage />} />
          <Route path="/games/:gameId/play" element={<GamePlayPage />} />
          <Route path="/games/:gameId/scores" element={<GameScorePage />} />
          <Route path="/yoga" element={<Yoga />} />
          <Route path="/events" element={<Events />} />
          <Route path="/booking" element={<Booking />} />
          <Route path="/chatbot" element={<Chatbot />} />
        </Routes>
      </div>
      {showNavFooter && <Footer />}
    </>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
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
