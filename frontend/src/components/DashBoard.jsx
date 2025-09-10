
import React from "react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Routes, Route } from "react-router-dom";
import AppSidebar from "./AppSidebar";


import Profile from "../pages/Profile";
import Attendance from "../pages/Attendance";
import CalendarPage from "../pages/CalendarPage";
import Assignments from "../pages/Assignments";
import Fees from "../pages/Fees";

const Dashboard = () => {
  return (
    <SidebarProvider>
      <div className="flex h-screen">

        <AppSidebar />

        <main className="flex-1 p-4">
          <SidebarTrigger />

          <Routes>
            <Route
              path="/"
              element={<h1 className="text-2xl font-bold">Welcome to Dashboard</h1>}
            />
            <Route path="profile" element={<Profile />} />
            <Route path="attendance" element={<Attendance />} />
            <Route path="calendar" element={<CalendarPage />} />
            <Route path="assignments" element={<Assignments />} />
            <Route path="fees" element={<Fees />} />
          </Routes>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default Dashboard;


