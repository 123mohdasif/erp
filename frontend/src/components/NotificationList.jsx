import React from "react";
import "./NotificationList.css";

function NotificationList({ notifications, onDelete, role }) {
  return (
    <div className="notification-container">
      <h2 className="notification-title">Notifications</h2>
      {notifications.length === 0 && <p className="no-notifications">No notifications available.</p>}

      <ul className="notification-list">
        {notifications.map((n) => (
          <li
            key={n.id}
            className={`notification-item ${
              role === "student" ? "student-card" : ""
            }`}
          >
            <div>
              <strong className="notification-item-title">{n.title}</strong>
              <p className="notification-item-desc">{n.description}</p>
            </div>

            {role === "teacher" && (
              <button className="delete-btn" onClick={() => onDelete(n.id)}>
                Delete
              </button>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default NotificationList;
