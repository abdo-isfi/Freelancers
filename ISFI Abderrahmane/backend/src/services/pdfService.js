const PDFDocument = require('pdfkit');

/**
 * Generate Invoice PDF
 * Matches the design of the Frontend "Print/View" Modal
 * @param {Object} invoice - The invoice object
 * @param {Object} dataCallback - Callback to handle data chunks
 * @param {Object} endCallback - Callback to handle end of stream
 */
function generateInvoicePDF(invoice, dataCallback, endCallback) {
  const doc = new PDFDocument({ margin: 50, size: 'A4' });

  doc.on('data', dataCallback);
  doc.on('end', endCallback);

  // Common styles
  const grayColor = '#6B7280'; // text-gray-500
  const darkColor = '#111827'; // text-gray-900
  const borderColor = '#E5E7EB'; // border-gray-200
  const primaryColor = '#2563EB'; // Blue for Total
  
  // Helper to draw rounded box
  function drawRoundedBox(x, y, w, h) {
    doc.roundedRect(x, y, w, h, 8) // 8px radius
       .strokeColor(borderColor)
       .lineWidth(1)
       .stroke();
  }

  // 1. Header: Invoice Title
  const invoiceNum = invoice.invoiceNumber || invoice.number || 'DRAFT';
  doc
    .fillColor(grayColor)
    .font('Helvetica-Bold')
    .fontSize(24)
    .text(`Invoice #${invoiceNum}`, 50, 50);

  // 2. Status Section (Box)
  const statusTop = 90;
  drawRoundedBox(50, statusTop, 495, 60);

  const statusColor = invoice.status === 'paid' ? '#059669' : (invoice.status === 'overdue' ? '#DC2626' : '#D97706');
  const statusText = invoice.status ? invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1) : 'Unpaid';

  doc
    .fontSize(10)
    .fillColor(darkColor)
    .text('Status:', 70, statusTop + 24)
    .fillColor(statusColor)
    .font('Helvetica-Bold')
    .text(statusText, 115, statusTop + 24);
  
  // 3. Bill To Section
  const billToLabelTop = statusTop + 80;
  doc
    .font('Helvetica-Bold')
    .fontSize(10)
    .fillColor(grayColor)
    .text('BILL TO', 50, billToLabelTop);

  const billToBoxTop = billToLabelTop + 15;
  const billToBoxHeight = 100;
  drawRoundedBox(50, billToBoxTop, 495, billToBoxHeight);

  const clientName = invoice.Client?.name || invoice.clientName || 'Unknown Client';
  const clientEmail = invoice.Client?.contact_email || invoice.Client?.email || '';
  const clientAddress = invoice.Client?.billing_address || invoice.Client?.address || '';

  doc
    .font('Helvetica-Bold')
    .fontSize(14)
    .fillColor(grayColor) // Matches the screenshot grayish bold
    .text(clientName, 70, billToBoxTop + 20)
    .font('Helvetica')
    .fontSize(10)
    .fillColor(darkColor)
    .text(clientEmail, 70, billToBoxTop + 45)
    .text(clientAddress, 70, billToBoxTop + 60, { width: 450 });

  // 4. Dates Section
  const datesLabelTop = billToBoxTop + billToBoxHeight + 30;
  doc
    .font('Helvetica-Bold')
    .fontSize(10)
    .fillColor(grayColor)
    .text('DATES', 50, datesLabelTop);

  const datesContentTop = datesLabelTop + 20;
  
  // Issued
  doc
    .font('Helvetica')
    .fontSize(10)
    .fillColor(grayColor)
    .text('Issued', 70, datesContentTop)
    .fontSize(12)
    .fillColor(grayColor) // Screenshot shows gray date
    .text(formatDate(invoice.issueDate || invoice.issue_date), 70, datesContentTop + 20);

  // Due
  doc
    .font('Helvetica')
    .fontSize(10)
    .fillColor(grayColor)
    .text('Due', 300, datesContentTop)
    .fontSize(12)
    .fillColor(grayColor)
    .text(formatDate(invoice.dueDate || invoice.due_date), 300, datesContentTop + 20);

  // 5. Items Section
  const itemsLabelTop = datesContentTop + 50;
  doc
    .font('Helvetica-Bold')
    .fontSize(10)
    .fillColor(grayColor)
    .text('ITEMS', 50, itemsLabelTop);

  const itemsBoxTop = itemsLabelTop + 15;
  // We need to calculate height based on items, or do a fixed min height
  // For simplicity, let's draw the box *after* we draw items if we want exact wraparound,
  // or primarily just use the box style for the container.
  // The screenshot shows a box containing the table.
  
  // Let's start the table
  const tableTop = itemsBoxTop;
  const tableHeaderTop = tableTop + 15;
  
  doc
    .font('Helvetica-Bold')
    .fontSize(10)
    .fillColor(grayColor);

  // Columns: Description (50), Qty (350), Rate (420), Amount (500-right)
  doc.text('Description', 70, tableHeaderTop);
  doc.text('Qty', 350, tableHeaderTop);
  doc.text('Rate', 420, tableHeaderTop);
  doc.text('Amount', 490, tableHeaderTop, { align: 'right', width: 50 }); // adjust for right align

  // Divider line
  const headerBottom = tableHeaderTop + 20;
  doc
    .strokeColor(borderColor)
    .moveTo(50, headerBottom)
    .lineTo(545, headerBottom)
    .stroke();

  let y = headerBottom + 15;
  const items = invoice.InvoiceItems || invoice.items || [];
  
  if (items.length > 0) {
    doc.font('Helvetica').fillColor(darkColor).fontSize(10);
    
    items.forEach((item) => {
      const quantity = item.quantity || 0;
      const rate = item.unit_price || item.rate || 0;
      const amount = quantity * rate;
      
      doc.text(item.description, 70, y);
      doc.text(quantity, 350, y);
      doc.text(formatCurrency(rate, invoice.currency), 420, y);
      doc.text(formatCurrency(amount, invoice.currency), 490, y, { align: 'right', width: 50 });
      
      y += 25; // Row height
    });
  } else {
    doc.font('Helvetica').fillColor(grayColor).fontSize(10);
    doc.text('No items listed', 70, y, { align: 'center', width: 475 });
    y += 40;
  }

  // Draw the rounded box around items
  const itemsBoxHeight = Math.max(100, y - itemsBoxTop + 15); // Min height 100
  drawRoundedBox(50, itemsBoxTop, 495, itemsBoxHeight);

  // 6. Totals Section
  const totalsBoxTop = itemsBoxTop + itemsBoxHeight + 30;
  const totalsBoxHeight = 100;
  drawRoundedBox(50, totalsBoxTop, 495, totalsBoxHeight);

  // Subtotal
  const subtotalY = totalsBoxTop + 20;
  const subtotal = calculateSubtotal(items);
  
  doc
    .font('Helvetica')
    .fontSize(10)
    .fillColor(darkColor)
    .text('Subtotal', 70, subtotalY)
    .text(formatCurrency(subtotal, invoice.currency), 400, subtotalY, { align: 'right', width: 140 });

  // Divider
  const totalsDividerY = subtotalY + 25;
  doc
    .strokeColor(darkColor) // Screenshot has a darker divider inside this box
    .lineWidth(1)
    .moveTo(70, totalsDividerY)
    .lineTo(525, totalsDividerY)
    .stroke();

  // Total
  const totalY = totalsDividerY + 20;
  const total = invoice.total_ttc || invoice.totalAmount || subtotal; // Simpler fallback

  doc
    .font('Helvetica-Bold')
    .fontSize(16) // Large
    .fillColor(grayColor)
    .text('Total', 70, totalY)
    .fillColor(primaryColor) // Blue
    .text(formatCurrency(total, invoice.currency), 400, totalY, { align: 'right', width: 140 });


  doc.end();
}

// Helpers
function formatCurrency(amount, currency = 'USD') {
  return parseFloat(amount || 0).toFixed(2); // Screenshot just shows number, maybe add symbol if needed, user showed "$2.00" in total
}

function formatDate(date) {
  if (!date) return 'N/A';
  const d = new Date(date);
  if (isNaN(d.getTime())) return 'N/A';
  return d.toLocaleDateString('en-US'); // MM/DD/YYYY format in screenshot
}

function calculateSubtotal(items) {
  return items.reduce((sum, item) => {
    const qty = item.quantity || 0;
    const rate = item.unit_price || item.rate || 0;
    return sum + (qty * rate);
  }, 0);
}

module.exports = {
  generateInvoicePDF
};
