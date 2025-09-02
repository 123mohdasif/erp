import { createTimetableInDB, getTimetablesFromDB, deleteTimetableFromDB } from "../model/timetableModel.js";

export const uploadTimetable = async (req, res) => {
  try {
    const { title } = req.body;
    const uploaded_by = req.user.id;

    if (!req.file) return res.status(400).json({ error: "PDF file is required" });

    const filename = req.file.filename;
    const view_url = `${req.protocol}://${req.get("host")}/uploads/timetables/${filename}`;
    const download_url = `${req.protocol}://${req.get("host")}/download/timetables/${filename}`;

    const timetableId = await createTimetableInDB({ title, file_url: filename, uploaded_by });

    res.status(201).json({ 
      message: "Timetable uploaded successfully", 
      timetableId, 
      view_url, 
      download_url 
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

// Any logged-in user can view timetables
export const getTimetables = async (req, res) => {
  try {
    const timetables = await getTimetablesFromDB();

    // Add view_url and download_url
    const host = `${req.protocol}://${req.get("host")}`;
    const result = timetables.map(t => ({
      ...t,
      view_url: `${host}/uploads/timetables/${t.file_url}`,
      download_url: `${host}/download/timetables/${t.file_url}`
    }));

    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

export const deleteTimetable = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await deleteTimetableFromDB(id);

    if (!deleted) return res.status(404).json({ error: "Timetable not found" });
    res.json({ message: "Timetable deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};
