import React from "react";
import AddComplaint from "../components/AddComplaints.jsx";
import ComplaintList from "../components/ComplaintList.jsx";
import "../styles/ComplaintModule.css";
function StudentComplaints() {
  const [refresh, setRefresh] = React.useState(false);

  return (
    <div className="complaint-module">
      <h2>Student Complaint Portal</h2>
      <AddComplaint onComplaintAdded={() => setRefresh(!refresh)} />
      <ComplaintList key={refresh} role="student" />
    </div>
  );
}

export default StudentComplaints;
