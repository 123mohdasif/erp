import React from "react";
import StudentComplaints from "./StudentComplaints.jsx";
import TeacherComplaints from "./TeacherComplaints.jsx";

function Complaints() {
  // Assuming role is stored in localStorage after login
  const role = localStorage.getItem("role"); // "student" or "admin"

  return (
    <div>
      {role === "student" && <StudentComplaints />}
      {(role === "admin" || role === "teacher") && <TeacherComplaints />}
      {!role && <p>Please log in to access complaints</p>}
    </div>
  );
}

export default Complaints;