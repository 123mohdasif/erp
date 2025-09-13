import React, { useState } from "react";

function AddComplaint({ onComplaintAdded }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:5000/api/complaints", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ title, description }),
      });
      const data = await res.json();
      if (res.ok) {
        alert("Complaint submitted successfully!");
        setTitle("");
        setDescription("");
        onComplaintAdded();
      } else {
        alert(data.message || "Error submitting complaint");
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="complaint-form">
      <h3>Submit a Complaint</h3>
      <input
        type="text"
        placeholder="Title"
        value={title}
        required
        onChange={(e) => setTitle(e.target.value)}
      />
      <textarea
        placeholder="Description"
        value={description}
        required
        onChange={(e) => setDescription(e.target.value)}
      />
      <button type="submit">Submit</button>
    </form>
  );
}

export default AddComplaint;
