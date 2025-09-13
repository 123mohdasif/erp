import React from "react";
// No CSS import is needed anymore!

function NotificationList({ notifications, onDelete, role }) {
  const isStudent = role === "student";

  // Define the two different list item styles using Tailwind classes
  
  // Style for the "student-card" variant. Replicates the gradient, left-border, and hover-transform.
  const studentItemStyles = 
    "block p-5 rounded-lg bg-gradient-to-r from-blue-50 to-cyan-50 " + 
    "border-l-4 border-cyan-600 shadow-sm transition-all duration-200 " +
    "transform hover:-translate-y-0.5 hover:shadow-md";

  // Standard item style for teachers. A clean, flexible row.
  const teacherItemStyles = 
    "flex justify-between items-center p-4 rounded-lg bg-slate-50 " +
    "border border-slate-200 transition-all hover:shadow-sm";

  return (
    // Main container is now a card, matching the ERP design language
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      
      {/* Card Header */}
      <div className="p-5 border-b border-slate-200">
        <h2 className="text-xl font-semibold text-slate-800">
          Notifications
        </h2>
      </div>

      {/* Card Body: Contains either the empty message or the list */}
      <div>
        {notifications.length === 0 ? (
          // "No notifications" message
          <p className="p-6 text-center text-slate-500">
            No notifications available.
          </p>
        ) : (
          // The list itself. We use a flex column with gap to space items.
          <ul className="flex flex-col gap-3 p-5">
            {notifications.map((n) => (
              <li
                key={n.id}
                // Dynamically apply the correct style based on role
                className={isStudent ? studentItemStyles : teacherItemStyles}
              >
                {/* Notification Text Content */}
                <div>
                  <strong className="text-base font-semibold text-slate-800">
                    {n.title}
                  </strong>
                  <p className="text-sm text-slate-600 mt-1">
                    {n.description}
                  </p>
                </div>

                {/* Conditional Delete Button for Teacher */}
                {role === "teacher" && (
                  <button
                    // Tailwind version of .delete-btn
                    className="bg-red-500 text-white text-sm font-medium py-1.5 px-3 rounded-md transition-all duration-200
                               hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 ml-4"
                    onClick={() => onDelete(n.id)}
                  >
                    Delete
                  </button>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default NotificationList;