import express from "express";

import healthRoutes from "./health.routes.js";
// Legacy MongoDB routes — disabled after migration to MariaDB
// import jobRouter from "./jobs.routes.js";
// import alumniRouter from "./alumni/alumni.routes.js";
// import studentRouter from "./student.routes.js";
import authRoutes from "./auth.routes.js";
import threadRoutes from "./thread.routes.js";
// import statsRouter from "./stats.routes.js";
// import referalRouter from "./referral.routes.js";
// import resumeRouter from "./resume.routes.js";
// import applicationRoutes from "./application.routes.js";
// import profileRouter from "./profile.routes.js";
// import savedJobsRouter from "./savedJobs.route.js";

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
// router.use("/jobs", jobRouter);
// router.use("/alumni", alumniRouter);
// router.use("/student", studentRouter);
router.use("/auth", authRoutes);
router.use("/threads", threadRoutes);
// router.use("/stats", statsRouter);
// router.use("/referrals", referalRouter);
// router.use("/resume", resumeRouter);
// router.use("/applications", applicationRoutes);
// router.use("/saved-jobs", savedJobsRouter);
// router.use("/profile", profileRouter);

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
