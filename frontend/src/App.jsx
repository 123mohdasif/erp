


import { Routes, Route } from "react-router-dom";

import Dashboard from "./components/Dashboard.jsx";
import FuzzyText from "./animations/FuzzyText.jsx";
import SignUp from "./components/SignUp.jsx";
import SignIn from "./components/SignIn.jsx";
import Profile from "./pages/Profile.jsx";
// import Attendance from "./pages/Attendance.jsx";
import Notifications from "./components/Notifications.jsx";
import CalendarPage from "./pages/CalendarPage.jsx";
import Assignments from "./pages/Assignments.jsx";
import Fees from "./pages/Fees.jsx";


function App() {
  return (
    <Routes>
      <Route path="/signup" element={<SignUp />} />
      <Route path="/signin" element={<SignIn />} />
      <Route path="/" element={<SignUp />} />

      {/* Dashboard with nested routes */}
      <Route path="/dashboard" element={<Dashboard />}>
        <Route index element={<h1 className="text-2xl font-bold">Welcome to Dashboard</h1>} />
        <Route path="profile" element={<Profile />} />
        <Route path="notifications" element={<Notifications />} />
        <Route path="calendar" element={<CalendarPage />} />
        <Route path="assignments" element={<Assignments />} />
        <Route path="fees" element={<Fees />} />
      </Route>

      {/* Catch-all 404 Route */}
      <Route
        path="*"
        element={
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              height: "100vh",
              fontFamily: "sans-serif",
            }}
          >
            <div style={{ fontSize: "6rem", fontWeight: "bold" }}>
              <FuzzyText
                baseIntensity={0.1}
                hoverIntensity={0.4}
                enableHover={true}
              >
                404
              </FuzzyText>
            </div>
            <p style={{ fontSize: "1.5rem", color: "#555" }}>Page Not Found</p>
          </div>
        }
      />
    </Routes>
  );
}

export default App;


