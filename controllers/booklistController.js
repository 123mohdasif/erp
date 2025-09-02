import { createBooklistInDB, getBooklistsFromDB, deleteBooklistFromDB } from "../model/booklistModel.js";

// Teacher only: upload booklist PDF
export const uploadBooklist = async (req, res) => {
  try {
    const { title } = req.body;
    const file = req.file;
    const uploaded_by = req.user.id;

    if (!title || !file) {
      return res.status(400).json({ error: "Title and PDF file are required" });
    }

    const id = await createBooklistInDB({ title, file_name: file.filename, uploaded_by });

    const view_url = `${req.protocol}://${req.get("host")}/uploads/assignments/${file.filename}`;

    res.status(201).json({
      message: "Booklist uploaded successfully",
      booklistId: id,
      view_url
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

// Any logged-in user can view
export const getBooklists = async (req, res) => {
  try {
    const booklists = await getBooklistsFromDB();

    const updated = booklists.map((b) => ({
      ...b,
      view_url: `${req.protocol}://${req.get("host")}/uploads/assignments/${b.file_name}`
    }));

    res.json(updated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

// Teacher only: delete
export const deleteBooklist = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await deleteBooklistFromDB(id);

    if (!deleted) return res.status(404).json({ error: "Booklist not found" });

    res.json({ message: "Booklist deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};
