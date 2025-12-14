const express = require("express");
const {
  getProjects,
  getProjectById,
  createProject,
  updateProject,
  deleteProject,
} = require("../controllers/projectController");
const { verifyToken } = require("../middlewares/authMiddleware");
const { projectValidation } = require("../middlewares/validationMiddleware");
const { validationResult } = require('express-validator');

const router = express.Router();

router.use(verifyToken);

router.get("/", getProjects);
router.get("/:id", projectValidation.getById, getProjectById);
router.post("/", projectValidation.create, createProject);
router.put("/:id", projectValidation.update, updateProject);
router.delete("/:id", projectValidation.delete, deleteProject);

module.exports = router;
