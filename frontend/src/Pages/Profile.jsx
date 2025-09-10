

import { useState, useEffect } from "react";
import { getProfile, upsertProfile } from "../api/studentApi";
import "./Profile.css";

export default function Profile() {
  const token = localStorage.getItem("token");

  const emptyProfile = {
    name: "",
    rollnumber: "",
    class: "",
    dob: "",
    gender: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
    guardian_name: "",
    guardian_phone: "",
    admission_year: "",
    photo_url: ""
  };

  const [profile, setProfile] = useState({ ...emptyProfile });
  const [formData, setFormData] = useState({ ...emptyProfile });
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Convert Google Drive link to direct image link
  const convertGoogleDriveLink = (url) => {
    if (!url) return "";
    const match = url.match(/\/d\/([a-zA-Z0-9_-]+)/);
    if (match && match[1]) {
      return `https://drive.google.com/uc?export=view&id=${match[1]}`;
    }
    return url;
  };

  // Fetch profile on load
  useEffect(() => {
    const fetchProfile = async () => {
      if (!token) return setLoading(false);

      try {
        const res = await getProfile(token);
        if (res?.data?.profile) {
          setProfile(res.data.profile);
          setFormData(res.data.profile);
        }
      } catch (err) {
        console.log("Error fetching profile:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [token]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "photo_url" ? convertGoogleDriveLink(value) : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    if (!token) {
      setMessage("No token found — please login.");
      return;
    }

    try {
      const res = await upsertProfile(token, formData);
      setMessage(res.data?.message || "Profile saved successfully");
      setProfile(formData);
      setIsModalOpen(false);
    } catch (err) {
      console.error("Error saving profile:", err);
      setMessage(err?.response?.data?.message || "Error saving profile");
    }
  };

  if (loading) return <div className="profile-container"><p>Loading...</p></div>;

  return (
    <div className="profile-container">
      <h2>Student Profile</h2>
      {message && <p className="message">{message}</p>}

      <div className="profile-main">
        <div className="profile-photo">
          <img 
            src={profile.photo_url || "/default-profile.jpg"} 
            alt="Profile" 
            style={{ width: "150px", height: "150px", borderRadius: "50%", objectFit: "cover" }}
          />
        </div>
        <div className="profile-details">
          <table className="profile-table">
            <tbody>
              <tr><th>Name</th><td>{profile.name}</td></tr>
              <tr><th>Roll Number</th><td>{profile.rollnumber}</td></tr>
              <tr><th>Class</th><td>{profile.class}</td></tr>
              <tr><th>Date of Birth</th><td>{profile.dob}</td></tr>
              <tr><th>Gender</th><td>{profile.gender}</td></tr>
              <tr><th>Phone</th><td>{profile.phone}</td></tr>
              <tr><th>Address</th><td>{profile.address}</td></tr>
              <tr><th>City</th><td>{profile.city}</td></tr>
              <tr><th>State</th><td>{profile.state}</td></tr>
              <tr><th>Pincode</th><td>{profile.pincode}</td></tr>
              <tr><th>Guardian Name</th><td>{profile.guardian_name}</td></tr>
              <tr><th>Guardian Phone</th><td>{profile.guardian_phone}</td></tr>
              <tr><th>Admission Year</th><td>{profile.admission_year}</td></tr>
            </tbody>
          </table>

          <button className="profile-btn" onClick={() => setIsModalOpen(true)}>
            {profile.name ? "Edit Profile" : "Create Profile"}
          </button>
        </div>
      </div>

      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>{profile.name ? "Edit Profile" : "Create Profile"}</h3>
            <form onSubmit={handleSubmit}>
              {Object.keys(emptyProfile).map((key) => {
                if (key === "photo_url") {
                  return (
                    <div className="form-row" key={key}>
                      <label>Photo URL (Google Drive or direct link)</label>
                      <input
                        type="text"
                        name={key}
                        value={formData[key] || ""}
                        onChange={handleChange}
                      />
                      {formData[key] && (
                        <img
                          src={formData[key]}
                          alt="Preview"
                          style={{ width: "100px", height: "100px", marginTop: "10px", borderRadius: "50%", objectFit: "cover" }}
                        />
                      )}
                    </div>
                  );
                }

                if (key === "gender") {
                  return (
                    <div className="form-row" key={key}>
                      <label>Gender</label>
                      <select name={key} value={formData[key] || ""} onChange={handleChange}>
                        <option value="">Select</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                  );
                }

                if (key === "dob") {
                  return (
                    <div className="form-row" key={key}>
                      <label>Date of Birth</label>
                      <input type="date" name={key} value={formData[key] || ""} onChange={handleChange} />
                    </div>
                  );
                }

                return (
                  <div className="form-row" key={key}>
                    <label>{key.replace("_", " ").toUpperCase()}</label>
                    <input type="text" name={key} value={formData[key] || ""} onChange={handleChange} />
                  </div>
                );
              })}

              <div className="modal-buttons">
                <button type="submit" className="profile-btn">Save</button>
                <button type="button" className="profile-btn cancel" onClick={() => setIsModalOpen(false)}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}



