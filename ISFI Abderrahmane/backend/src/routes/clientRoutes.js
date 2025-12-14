const express = require("express");
const {
  getClients,
  getClientById,
  createClient,
  updateClient,
  deleteClient,
} = require("../controllers/clientController");

const { verifyToken } = require("../middlewares/authMiddleware");

const router = express.Router();

// Apply auth middleware to all routes
router.use(verifyToken);

router.get("/", getClients);
router.get("/:id", getClientById);
router.post("/", createClient);
router.put("/:id", updateClient);
router.delete("/:id", deleteClient);

module.exports = router;
