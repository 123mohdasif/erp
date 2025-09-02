import multer from "multer";
import path from "path";


const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/timetables"); // local folder
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  }
});


const fileFilter = (req, file, cb) => {
  const ext = path.extname(file.originalname).toLowerCase();
  if (ext === ".pdf") {
    cb(null, true);
  } else {
    cb(new Error("Only PDF files allowed"), false);
  }
};

const uploadPDF = multer({ storage, fileFilter });

export default uploadPDF;
