const express = require("express");

const authRoutes = require("./authRoutes");
const clientRoutes = require("./clientRoutes");
const projectRoutes = require("./projectRoutes");
const taskRoutes = require("./taskRoutes");
const timeEntryRoutes = require("./timeEntryRoutes");
const invoiceRoutes = require("./invoiceRoutes");
const noteRoutes = require("./noteRoutes");
const dashboardRoutes = require("./dashboardRoutes");
const healthRoutes = require("./healthRoutes");
const itemRoutes = require("./itemRoutes");

const router = express.Router();

router.use("/health", healthRoutes);
router.use("/auth", authRoutes);
router.use("/clients", clientRoutes);
router.use("/projects", projectRoutes);
router.use("/tasks", taskRoutes);
router.use("/time-entries", timeEntryRoutes);
router.use("/invoices", invoiceRoutes);
router.use("/notes", noteRoutes);
router.use("/dashboard", dashboardRoutes);
router.use("/items", itemRoutes);

module.exports = router;

