const express = require("express");
const {
  getDashboardSummary,
} = require("../controllers/dashboardController");

const { verifyToken } = require("../middlewares/authMiddleware");

const router = express.Router();

router.use(verifyToken);

router.get("/summary", getDashboardSummary);

module.exports = router;
