import {
  submitApplication,
  getAllApplications,
  giveFeedback,
  deleteApplication,
  getStudentApplications,
} from "../model/leaveApplicationModel.js";


export const submitApp = async (req, res) => {
  try {
    const applicationText = req.body.application_text;

    if (!applicationText || applicationText.trim() === "") {
      return res.status(400).json({ error: "Application text is required" });
    }

    // req.user comes from token → must contain rollnumber, name, class
    const data = {
      student_name: req.user.name || "Unknown",  // fallback in case it's missing
      student_class: req.user.class || "Not Provided",
      rollnumber: req.user.rollnumber || "Not Provided",
      application_text: applicationText,
    };

    await submitApplication(data);

    res.status(201).json({ message: "Application submitted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};



export const viewAllApps = async (req, res) => {
  try {
    const [apps] = await getAllApplications();
    res.json(apps);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const giveAppFeedback = async (req, res) => {
  try {
    const { id } = req.params;
    await giveFeedback(id, req.body.feedback);
    res.json({ message: "Feedback updated successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const removeApplication = async (req, res) => {
  try {
    await deleteApplication(req.params.id);
    res.json({ message: "Application deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const viewStudentApps = async (req, res) => {
  try {
    const [apps] = await getStudentApplications(req.user.rollnumber);
    res.json(apps);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
