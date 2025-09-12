import React from "react";
import { useState, useEffect } from "react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Outlet } from "react-router-dom";
// FIX: The build environment could not resolve the path alias '@'.
// Reverting to a relative path that was used previously.
import AppSidebar from "./AppSidebar";

const Dashboard = () => {
  const [role, setRole] = useState(null);

  useEffect(() => {
    // We read from localStorage only once when the component mounts
    // to ensure the role is set before rendering children.
    const storedRole = localStorage.getItem("role");
    if (storedRole) {
      setRole(storedRole);
    }
  }, []);

  return (
    <SidebarProvider>
      <AppSidebar role={role} />

      <main className="flex-1 p-6 overflow-y-auto bg-gray-50">
        <SidebarTrigger />
        <div className="w-full h-full">
          {/* Pass the role to child routes using the 'context' prop.
            The Outlet will make this object available to any child component 
            (like Assignments.jsx) that calls the useOutletContext() hook.
          */}
          <Outlet context={{ role }} />
        </div>
      </main>
      
    </SidebarProvider>
  );
};

export default Dashboard;

