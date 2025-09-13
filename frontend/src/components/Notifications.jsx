import React, { useEffect, useState } from "react";
import axios from "axios";
import NotificationList from "../components/NotificationList";
import "./Notifications.css"; // import CSS

function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const role = localStorage.getItem("role")?.toLowerCase();
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/notifications", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setNotifications(res.data);
      } catch (err) {
        console.error("Error fetching notifications:", err);
      }
    };
    fetchNotifications();
  }, [token]);

  const handleAdd = async () => {
    if (!title.trim() || !description.trim()) return alert("Fill all fields");

    try {
      await axios.post(
        "http://localhost:5000/api/notifications",
        { title, description },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const res = await axios.get("http://localhost:5000/api/notifications", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setNotifications(res.data);

      setTitle("");
      setDescription("");
    } catch (err) {
      console.error("Error creating notification:", err);
      alert("Failed to create notification");
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/notifications/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setNotifications(notifications.filter((n) => n.id !== id));
    } catch (err) {
      console.error("Error deleting notification:", err);
      alert("Failed to delete notification");
    }
  };

  return (
    <div className="notifications-page">
      <h1 className="notifications-header">Notifications Module</h1>

      {role === "teacher" && (
        <div className="create-notification-form">
          <h3>Create Notification</h3>
          <input
            className="input-field"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <input
            className="input-field"
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <button className="add-btn" onClick={handleAdd}>Add</button>
        </div>
      )}

      <NotificationList
        notifications={notifications}
        onDelete={handleDelete}
        role={role}
      />
    </div>
  );
}

export default Notifications;
