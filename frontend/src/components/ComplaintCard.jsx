import React, { useState } from "react";

function ComplaintCard({ complaint, role, onStatusUpdate }) {
  const [status, setStatus] = useState(complaint.status);
  const [feedback, setFeedback] = useState(complaint.feedback || "");

  const handleStatusChange = async (e) => {
    const newStatus = e.target.value;
    setStatus(newStatus);
    try {
      const token = localStorage.getItem("token");
      await fetch(`http://localhost:5000/api/complaints/${complaint.id}/status`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: newStatus }),
      });
      onStatusUpdate();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="complaint-card">
      <h4>{complaint.title}</h4>
      <p>{complaint.description}</p>
      <p>Status: {status}</p>

      {(role === "admin"||role==="teacher") && (
        <select value={status} onChange={handleStatusChange}>
          <option value="pending">Pending</option>
          <option value="resolved">Resolved</option>
        </select>
      )}

      {complaint.feedback && <p>Feedback: {complaint.feedback}</p>}
    </div>
  );
}

export default ComplaintCard;
