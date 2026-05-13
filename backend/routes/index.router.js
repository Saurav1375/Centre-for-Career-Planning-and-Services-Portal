import express from "express";

import healthRoutes from "./health.routes.js";


import authRoutes from "./auth.routes.js";


import hrContactRoutes from "./hrContact.route.js";
import callLogRoutes from "./callLog.routes.js";
import Dashboard from "./dashboard.routes.js";
import companyRoutes from "./company.routes.js";
import callersStats from "./callersStats.routes.js";
import users from "./users.route.js";
import preapprovedEmailRoutes from "./preapprovedEmails.routes.js";
import notificationsRoutes from "./notifications.routes.js";
import filesRoutes from "./files.routes.js";

const router = express.Router();

// Mount each route under /api/*
router.use("/health", healthRoutes);

router.use("/auth", authRoutes);


router.use("/hr-contacts", hrContactRoutes);
router.use("/call-logs", callLogRoutes);
router.use("/dashboard", Dashboard);
router.use("/companies", companyRoutes);
router.use("/callers-stats", callersStats);
router.use("/users", users);
router.use("/preapproved-emails", preapprovedEmailRoutes);
router.use("/notifications", notificationsRoutes);
router.use("/files", filesRoutes);

export default router;
