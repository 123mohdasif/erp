import React, { useEffect, useState } from "react";
import axios from "axios";
import NotificationList from "../components/NotificationList";

function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const role = localStorage.getItem("role")?.toLowerCase();
  const token = localStorage.getItem("token");

  // --- No changes to your state or data fetching logic ---

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

      // Refetch logic (same as original)
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

  // --- NEW Tailwind UI Structure ---

  return (
    // Page container, matching the light-gray content area from the inspiration
    <div className="p-4 md:p-8 bg-slate-100 min-h-full">
      {/* Page Header, matching the style of "Student Profile" */}
      <h1 className="text-3xl font-bold text-slate-800 mb-6">
        Notifications Module
      </h1>

      {/* Main content grid: Form on the left, List on the right. Stacks on mobile. */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Conditional Form Card for Teachers */}
        {role === "teacher" && (
          // Card for the creation form
          <div className="lg:col-span-1 bg-white p-6 rounded-lg shadow-md h-fit">
            <h3 className="text-xl font-semibold text-slate-700 mb-5">
              Create Notification
            </h3>
            <div className="space-y-4">
              <input
                type="text"
                className="block w-full rounded-md border-slate-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                placeholder="Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
              <input
                type="text"
                className="block w-full rounded-md border-slate-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                placeholder="Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
              <button
                className="w-full bg-indigo-600 text-white font-semibold py-2 px-4 rounded-lg shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-all"
                onClick={handleAdd}
              >
                Add Notification
              </button>
            </div>
          </div>
        )}

        {/* Notification List Area */}
        {/* Adjust column span if the teacher form is not present */}
        <div
          className={
            role === "teacher" ? "lg:col-span-2" : "lg:col-span-3"
          }
        >
          <NotificationList
            notifications={notifications}
            onDelete={handleDelete}
            role={role}
          />
        </div>
      </div>
    </div>
  );
}

export default Notifications;