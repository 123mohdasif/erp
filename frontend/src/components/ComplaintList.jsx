import React, { useEffect, useState } from "react";
import ComplaintCard from "./ComplaintCard";
import "../styles/ComplaintModule.css";

function ComplaintList({ role }) {
  const [complaints, setComplaints] = useState([]);

  const fetchComplaints = async () => {
    try {
      const token = localStorage.getItem("token");
      const url =
        role === "teacher" || role === "admin"
          ? "http://localhost:5000/api/complaints"
          : "http://localhost:5000/api/complaints/my";

      const res = await fetch(url, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setComplaints(data.complaints);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (role) fetchComplaints();
  }, [role]);

  return (
    <div className="complaint-list">
      {complaints.map((c) => (
        <ComplaintCard
          key={c.id}
          complaint={c}
          role={role}
          onStatusUpdate={fetchComplaints}
        />
      ))}
    </div>
  );
}

export default ComplaintList;
