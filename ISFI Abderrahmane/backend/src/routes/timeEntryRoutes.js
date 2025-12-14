const express = require("express");
const {
  getTimeEntries,
  createTimeEntry,
  updateTimeEntry,
  deleteTimeEntry,
  startTimeEntry,
  stopTimeEntry,
} = require("../controllers/timeEntryController");

const { verifyToken } = require("../middlewares/authMiddleware");

const router = express.Router();

router.use(verifyToken);

router.get("/", getTimeEntries);
router.post("/", createTimeEntry);
router.put("/:id", updateTimeEntry);
router.delete("/:id", deleteTimeEntry);
router.post("/start", startTimeEntry);
router.post("/:id/stop", stopTimeEntry);

module.exports = router;
