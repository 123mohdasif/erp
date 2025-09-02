import express from "express";
import cors from "cors";
import dotenv from "dotenv";


// Import all routes
import studentRoutes from "./routes/studentRoutes.js";
import complaintRoutes from "./routes/complaintRoutes.js";
import attendanceRoutes from "./routes/attendanceRoutes.js";
import studentBulkRoutes from "./routes/studentBulkRoutes.js";
import teacherRoutes from "./routes/teacherRoutes.js";
import assignmentRoutes from "./routes/assignmentRoutes.js";
import testUploadRoutes from "./routes/testUploadRoutes.js";
import notificationRoutes from "./routes/notificationRoutes.js";
import timeTableRoutes from "./routes/timeTableRoutes.js";
import booklistRoutes from "./routes/booklistRoutes.js";
import studentProfileRoutes from "./routes/studentProfileRoutes.js";
import resultRoutes from "./routes/resultRoutes.js";
import leaveApplicationRoutes from "./routes/leaveApplicationRoutes.js";

dotenv.config();


const app = express();


app.use(cors());
app.use(express.json());


// Serve uploaded PDFs
app.use("/uploads/timetables", express.static("uploads/timetables"));
app.use("/api/students", studentRoutes);
app.use("/api/students/profile", studentProfileRoutes);
app.use("/api/complaints", complaintRoutes);
app.use("/api/attendance", attendanceRoutes);
app.use("/api/student-bulk", studentBulkRoutes);
app.use("/api/teachers", teacherRoutes);
app.use("/api/test", testUploadRoutes);
app.use("/api/assignments", assignmentRoutes);
app.use("/uploads/assignments", express.static("uploads/assignments"));
app.use("/api/notifications", notificationRoutes);
app.use("/api/timetables", timeTableRoutes);
app.use("/api/booklists",booklistRoutes);
app.use('/api/results', resultRoutes);
app.use("/api/leave-applications", leaveApplicationRoutes);


app.use((req, res) => {
  res.status(404).send(`No route for ${req.method} ${req.originalUrl}`);
});



const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
