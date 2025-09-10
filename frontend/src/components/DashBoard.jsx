
import React from "react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import AppSidebar from "./AppSidebar";
const DashBoard = () => {
  return (
    <div>
       <SidebarProvider>
      <div className="flex h-screen">
        {/* Sidebar on the left */}
        <AppSidebar />

        {/* Main content */}
        <main className="flex-1 p-4">
          <SidebarTrigger />
          <h1 className="text-2xl font-bold">Hello World!</h1>
        </main>
      </div>
    </SidebarProvider>
    </div>
  );
};

export default DashBoard;