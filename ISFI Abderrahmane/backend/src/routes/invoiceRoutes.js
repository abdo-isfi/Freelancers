const express = require("express");
const {
  getInvoices,
  getInvoiceById,
  createInvoice,
  updateInvoice,
  markInvoicePaid,
  downloadInvoice,
} = require("../controllers/invoiceController");

const { verifyToken } = require("../middlewares/authMiddleware");

const router = express.Router();

router.use(verifyToken);

router.get("/", getInvoices);
router.get("/:id", getInvoiceById);
router.post("/", createInvoice);
router.put("/:id", updateInvoice);
router.post("/:id/mark-paid", markInvoicePaid);
router.get("/:id/download", downloadInvoice);

module.exports = router;
