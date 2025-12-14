const invoiceService = require("../services/invoiceService");

/**
 * Get all invoices
 */
const getInvoices = async (req, res, next) => {
  try {
    const userId = req.userId;
    const { page, limit, status } = req.query;

    const result = await invoiceService.getInvoices(userId, {
      page,
      limit,
      status,
    });

    res.status(200).json({
      success: true,
      message: "Invoices retrieved successfully",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get invoice by ID
 */
const getInvoiceById = async (req, res, next) => {
  try {
    const userId = req.userId;
    const { id } = req.params;

    const invoice = await invoiceService.getInvoiceById(id, userId);

    res.status(200).json({
      success: true,
      message: "Invoice retrieved successfully",
      data: invoice,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Create invoice
 */
const createInvoice = async (req, res, next) => {
  try {
    console.log(
      "Creates Invoice Request Body:",
      JSON.stringify(req.body, null, 2)
    );
    const userId = req.userId;
    const {
      projectId,
      clientId,
      invoiceNumber,
      issueDate,
      dueDate,
      items,
      notes,
      currency,
      tax,
      discount,
      date,
    } = req.body;

    const invoice = await invoiceService.createInvoice(userId, {
      projectId,
      clientId,
      invoiceNumber,
      issueDate,
      date,
      dueDate,
      items,
      notes,
      currency,
      tax,
      discount,
    });

    res.status(201).json({
      success: true,
      message: "Invoice created successfully",
      data: invoice,
    });
  } catch (error) {
    console.error("Create Invoice Error:", error);
    console.error("Error details:", {
      message: error.message,
      status: error.status,
      stack: error.stack,
    });
    next(error);
  }
};

/**
 * Update invoice
 */
const updateInvoice = async (req, res, next) => {
  try {
    const userId = req.userId;
    const { id } = req.params;
    const updates = req.body;

    const invoice = await invoiceService.updateInvoice(id, userId, updates);

    res.status(200).json({
      success: true,
      message: "Invoice updated successfully",
      data: invoice,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Mark invoice as paid
 */
const markInvoicePaid = async (req, res, next) => {
  try {
    const userId = req.userId;
    const { id } = req.params;
    const { paidDate } = req.body || {};

    const invoice = await invoiceService.markInvoiceAsPaid(
      id,
      userId,
      paidDate
    );

    res.status(200).json({
      success: true,
      message: "Invoice marked as paid",
      data: invoice,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Download invoice (placeholder)
 */
const { generateInvoicePDF } = require("../services/pdfService");

/**
 * Download invoice PDF
 */
const downloadInvoice = async (req, res, next) => {
  try {
    const userId = req.userId;
    const { id } = req.params;

    const invoice = await invoiceService.getInvoiceById(id, userId);

    if (!invoice) {
        const error = new Error("Invoice not found");
        error.status = 404;
        throw error;
    }

    const filename = `invoice-${invoice.number}.pdf`;

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);

    generateInvoicePDF(
        invoice,
        (chunk) => res.write(chunk),
        () => res.end()
    );

  } catch (error) {
    next(error);
  }
};

/**
 * Delete invoice
 */
const deleteInvoice = async (req, res, next) => {
  try {
    const userId = req.userId;
    const { id } = req.params;

    await invoiceService.deleteInvoice(id, userId);

    res.status(200).json({
      success: true,
      message: "Invoice deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getInvoices,
  getInvoiceById,
  createInvoice,
  updateInvoice,
  markInvoicePaid,
  downloadInvoice,
  deleteInvoice,
};
