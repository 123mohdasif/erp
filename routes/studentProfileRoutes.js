import express from "express";
import { getMyProfile, upsertMyProfile } from "../controllers/studentProfileController.js";

const router = express.Router();

router.post("/upsert", upsertMyProfile); 
router.get("/get", getMyProfile);        

export default router;
