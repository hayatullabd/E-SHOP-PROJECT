import React from "react";
import AdminSidebar from "./Layout/AdminSidebar";
import AdminNav from "./Layout/AdminNav";
import DashboardNavbar from "../Shared/DashboardNavbar";

const DashboardLayout = ({ children }) => {
  const mobile = false;
  return (
    <div className=" flex items-start bg-[#f9faff]">
      <div className=" hidden md:block">
        <AdminSidebar />
      </div>

      <div className=" w-full h-screen overflow-y-auto">
        <DashboardNavbar />
        <div className="md:px-8 px-3 py-8">{children}</div>
      </div>
    </div>
  );
};

export default DashboardLayout;
