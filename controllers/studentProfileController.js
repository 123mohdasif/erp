import jwt from "jsonwebtoken";
import { getProfileByStudentId, createProfile, updateProfile } from "../model/studentProfileModel.js";

// Get profile
export const getMyProfile = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ message: "No token provided" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const studentId = decoded.id;

    const profile = await getProfileByStudentId(studentId);
    console.log(profile);
    
    return res.status(200).json({ profile: profile || {} });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: err.message });
  }
};

export const upsertMyProfile = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ message: "No token provided" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const studentId = decoded.id;

    const existing = await getProfileByStudentId(studentId);

    // Check if profile actually exists in DB
    if (!existing || !existing.id) {
      const profileId = await createProfile(studentId, req.body);
      return res.status(201).json({ message: "Profile created successfully", profileId });
    } else {
      await updateProfile(studentId, req.body);
      return res.status(200).json({ message: "Profile updated successfully" });
    }
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: err.message });
  }
};
