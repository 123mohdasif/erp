import React from "react";
import { useState } from "react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Outlet } from "react-router-dom";
// FIX: Changed the import to use the project's path alias, which is standard for shadcn/ui.
// This resolves the "Could not resolve" error by looking for the component in the correct directory.
import AppSidebar from "@/components/AppSidebar";

const Dashboard = () => {

  const [user,SetUser]=useState(null);

  const role=localStorage.getItem("role");
  return (
    // The SidebarProvider creates the main flex container for the page.
    // The AppSidebar and the <main> element should be its direct children.
    <SidebarProvider>
      
      {/* AppSidebar is the first flex item. It renders the sidebar and its placeholder gap. */}
      <AppSidebar />

      {/* The <main> content area is the second flex item. 
          The "flex-1" class tells it to grow and fill all remaining space. */}
      <main className="flex-1 p-6 overflow-y-auto bg-gray-50">
        <SidebarTrigger />
        <div className="w-full h-full">
          <Outlet  role={role}/>
        </div>
      </main>
      
    </SidebarProvider>
  );
};

export default Dashboard;

