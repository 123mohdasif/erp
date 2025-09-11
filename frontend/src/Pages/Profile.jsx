

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

  if (loading) return <div className="w-full h-full flex justify-center items-center"><p>Loading...</p></div>;

  return (
    <div className="w-full h-full p-8 rounded-xl bg-white shadow-lg hover:shadow-2xl transition-all duration-300">
    <h2 className="text-center mb-6 text-2xl font-bold text-blue-500 drop-shadow">
      Student Profile
    </h2>
      {message && <p className="text-center text-green-600 mb-4 font-semibold">{message}</p>}

      <div className="flex flex-wrap gap-8 items-start">
        {/* Profile Photo */}
        <div className="flex-shrink-0 text-center">
          <img
            src={profile.photo_url || "/default-profile.jpg"}
            alt="Profile"
            className="w-40 h-40 rounded-full object-cover border-4 border-blue-500 shadow-md hover:scale-105 hover:shadow-lg transition-transform duration-300 cursor-pointer"
          />
        </div>

        {/* Profile Details */}
        <div className="flex-1">
          <table className="w-full border-collapse bg-gray-50 rounded-lg shadow-md overflow-hidden">
            <tbody>
              <tr><th className="w-1/3 bg-blue-50 px-4 py-3 text-gray-700 font-semibold">Name</th><td className="px-4 py-3">{profile.name}</td></tr>
              <tr><th className="bg-blue-50 px-4 py-3 text-gray-700 font-semibold">Roll Number</th><td className="px-4 py-3">{profile.rollnumber}</td></tr>
              <tr><th className="bg-blue-50 px-4 py-3 text-gray-700 font-semibold">Class</th><td className="px-4 py-3">{profile.class}</td></tr>
              <tr><th className="bg-blue-50 px-4 py-3 text-gray-700 font-semibold">Date of Birth</th><td className="px-4 py-3">{profile.dob}</td></tr>
              <tr><th className="bg-blue-50 px-4 py-3 text-gray-700 font-semibold">Gender</th><td className="px-4 py-3">{profile.gender}</td></tr>
              <tr><th className="bg-blue-50 px-4 py-3 text-gray-700 font-semibold">Phone</th><td className="px-4 py-3">{profile.phone}</td></tr>
              <tr><th className="bg-blue-50 px-4 py-3 text-gray-700 font-semibold">Address</th><td className="px-4 py-3">{profile.address}</td></tr>
              <tr><th className="bg-blue-50 px-4 py-3 text-gray-700 font-semibold">City</th><td className="px-4 py-3">{profile.city}</td></tr>
              <tr><th className="bg-blue-50 px-4 py-3 text-gray-700 font-semibold">State</th><td className="px-4 py-3">{profile.state}</td></tr>
              <tr><th className="bg-blue-50 px-4 py-3 text-gray-700 font-semibold">Pincode</th><td className="px-4 py-3">{profile.pincode}</td></tr>
              <tr><th className="bg-blue-50 px-4 py-3 text-gray-700 font-semibold">Guardian Name</th><td className="px-4 py-3">{profile.guardian_name}</td></tr>
              <tr><th className="bg-blue-50 px-4 py-3 text-gray-700 font-semibold">Guardian Phone</th><td className="px-4 py-3">{profile.guardian_phone}</td></tr>
              <tr><th className="bg-blue-50 px-4 py-3 text-gray-700 font-semibold">Admission Year</th><td className="px-4 py-3">{profile.admission_year}</td></tr>
            </tbody>
          </table>

          <button
            className="block w-56 mx-auto mt-6 py-3 bg-blue-500 text-white rounded-lg font-semibold shadow-md hover:bg-blue-600 hover:scale-105 transition-transform duration-300"
            onClick={() => setIsModalOpen(true)}
          >
            {profile.name ? "Edit Profile" : "Create Profile"}
          </button>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-40 z-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-lg shadow-lg">
            <h3 className="text-lg font-bold mb-4">{profile.name ? "Edit Profile" : "Create Profile"}</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              {Object.keys(emptyProfile).map((key) => {
                if (key === "photo_url") {
                  return (
                    <div key={key}>
                      <label className="block text-sm font-medium mb-1">Photo URL</label>
                      <input
                        type="text"
                        name={key}
                        value={formData[key] || ""}
                        onChange={handleChange}
                        className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-400 outline-none"
                      />
                      {formData[key] && (
                        <img src={formData[key]} alt="Preview" className="w-24 h-24 rounded-full mt-2 object-cover" />
                      )}
                    </div>
                  );
                }

                if (key === "gender") {
                  return (
                    <div key={key}>
                      <label className="block text-sm font-medium mb-1">Gender</label>
                      <select
                        name={key}
                        value={formData[key] || ""}
                        onChange={handleChange}
                        className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-400 outline-none"
                      >
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
                    <div key={key}>
                      <label className="block text-sm font-medium mb-1">Date of Birth</label>
                      <input
                        type="date"
                        name={key}
                        value={formData[key] || ""}
                        onChange={handleChange}
                        className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-400 outline-none"
                      />
                    </div>
                  );
                }

                return (
                  <div key={key}>
                    <label className="block text-sm font-medium mb-1">{key.replace("_", " ").toUpperCase()}</label>
                    <input
                      type="text"
                      name={key}
                      value={formData[key] || ""}
                      onChange={handleChange}
                      className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-400 outline-none"
                    />
                  </div>
                );
              })}

              <div className="flex justify-end gap-3">
                <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">Save</button>
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 bg-gray-400 text-white rounded-lg hover:bg-gray-500">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}



