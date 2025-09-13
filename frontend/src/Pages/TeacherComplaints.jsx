import React from "react";
import ComplaintList from "../components/ComplaintList.jsx";
import "../styles/ComplaintModule.css";
function TeacherComplaints() {
  return (
    <div className="complaint-module">
      <h2>Teacher Complaint Dashboard</h2>
      <ComplaintList role="admin" />
    </div>
  );
}

export default TeacherComplaints;
