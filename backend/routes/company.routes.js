import express from "express";
import {
  createCompany,
  getAllCompanies,
  getCompanyById,
  updateCompany,
  deleteCompany,
} from "../controllers/company.controller.js";
import { protectRoute, trackActivity } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/", protectRoute, trackActivity, createCompany);
router.get("/", protectRoute, trackActivity, getAllCompanies);
router.get("/:id", protectRoute, trackActivity, getCompanyById);
router.put("/:id", protectRoute, trackActivity, updateCompany);
router.delete("/:id", protectRoute, trackActivity, deleteCompany);

export default router;
