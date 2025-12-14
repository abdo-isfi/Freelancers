import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  PrinterIcon,
  ArrowDownTrayIcon,
  CheckCircleIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import Button from "@/components/Common/Button";
import Modal from "@/components/Common/Modal";
import LoadingSpinner from "@/components/Common/LoadingSpinner";
import {
  deleteInvoice,
  markInvoiceAsPaid,
  downloadInvoice,
} from "@/store/invoicesSlice";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

function InvoiceDetailModal({ invoice, isOpen, onClose }) {
  const dispatch = useDispatch();
  const [isDownloading, setIsDownloading] = useState(false);
  const { items: clients } = useSelector((state) => state.clients);

  if (!invoice) return null;

  const client = clients.find(c => c.id === invoice.clientId);
  // Fallback for client name if not found in list (e.g. if invoice has it embedded or we just use ID)
  const clientName = client?.name || invoice.clientName || 'Unknown Client';
  const clientEmail = client?.email || '';
  const clientAddress = client?.address || '';


  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this invoice?")) {
      await dispatch(deleteInvoice(invoice.id));
      onClose();
    }
  };

  const handleMarkAsPaid = async () => {
    await dispatch(markInvoiceAsPaid(invoice.id));
  };

  const handleDownloadPDF = async () => {
    try {
      setIsDownloading(true);
      await dispatch(downloadInvoice(invoice.id)).unwrap();
    } catch (error) {
      console.error("Failed to download PDF:", error);
    } finally {
      setIsDownloading(false);
    }
  };
  
  const handlePrint = () => {
      window.print();
  };

  const subtotal = invoice.totalAmount || 0; 
  // Note: Backend seems to return totalAmount directly. 
  // If items are present, we can recalculate or just use the total.
  // Using invoice values for display consistency.
  
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Invoice #${invoice.invoiceNumber}`}
      size="xl"
    >
        <div className="space-y-8">
            {/* Header Status & Actions */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-muted/30 p-4 rounded-lg border border-border">
                <div className="flex items-center gap-3">
                    <span className="text-sm font-medium text-muted-foreground">Status:</span>
                    <span
                        className={`text-sm px-3 py-1 rounded-full font-medium ${
                        invoice.status === "paid"
                            ? "bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300"
                            : invoice.status === "overdue"
                            ? "bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300"
                            : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/40 dark:text-yellow-300"
                        }`}
                    >
                        {invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}
                    </span>
                </div>
                
                <div className="flex flex-wrap gap-2">
                    <Button variant="outline" size="sm" onClick={handlePrint}>
                        <PrinterIcon className="w-4 h-4 mr-2" />
                        Print
                    </Button>
                    <Button 
                        variant="outline" 
                        size="sm"
                        onClick={handleDownloadPDF}
                        disabled={isDownloading}
                    >
                        {isDownloading ? <LoadingSpinner size="sm" className="mr-2" /> : <ArrowDownTrayIcon className="w-4 h-4 mr-2" />}
                        Download
                    </Button>
                    {invoice.status !== "paid" && (
                        <Button variant="success" size="sm" onClick={handleMarkAsPaid}>
                            <CheckCircleIcon className="w-4 h-4 mr-2" />
                            Mark Paid
                        </Button>
                    )}
                    <Button variant="danger" size="sm" onClick={handleDelete}>
                        <TrashIcon className="w-4 h-4 mr-2" />
                        Delete
                    </Button>
                </div>
            </div>

            {/* Client & Dates Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                    <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">Bill To</h3>
                    <div className="bg-card p-4 rounded-lg border border-border shadow-sm">
                        <p className="text-lg font-bold text-foreground">{clientName}</p>
                        {clientEmail && <p className="text-sm text-muted-foreground mt-1">{clientEmail}</p>}
                        {clientAddress && <p className="text-sm text-muted-foreground mt-2 whitespace-pre-line">{clientAddress}</p>}
                    </div>
                </div>
                <div className="space-y-4">
                     <div>
                        <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-1">Dates</h3>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-muted/30 p-3 rounded-md">
                                <span className="text-xs text-muted-foreground block">Issued</span>
                                <span className="font-medium">{new Date(invoice.issueDate).toLocaleDateString()}</span>
                            </div>
                            <div className="bg-muted/30 p-3 rounded-md">
                                <span className="text-xs text-muted-foreground block">Due</span>
                                <span className="font-medium">{invoice.dueDate ? new Date(invoice.dueDate).toLocaleDateString() : 'N/A'}</span>
                            </div>
                        </div>
                     </div>
                     {invoice.notes && (
                        <div>
                             <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-1">Notes</h3>
                             <p className="text-sm text-muted-foreground bg-muted/30 p-3 rounded-md border border-border">{invoice.notes}</p>
                        </div>
                     )}
                </div>
            </div>

            {/* Line Items */}
            <div>
                <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">Items</h3>
                <div className="rounded-lg border border-border overflow-hidden shadow-sm">
                    <Table>
                        <TableHeader>
                        <TableRow className="bg-muted">
                            <TableHead className="font-semibold text-foreground">Description</TableHead>
                            <TableHead className="text-right font-semibold text-foreground">Qty</TableHead>
                            <TableHead className="text-right font-semibold text-foreground">Rate</TableHead>
                            <TableHead className="text-right font-semibold text-foreground">Amount</TableHead>
                        </TableRow>
                        </TableHeader>
                        <TableBody>
                        {invoice.items?.map((item, index) => (
                            <TableRow key={index}>
                            <TableCell className="font-medium">{item.description}</TableCell>
                            <TableCell className="text-right">{item.quantity}</TableCell>
                            <TableCell className="text-right">${Number(item.rate).toFixed(2)}</TableCell>
                            <TableCell className="text-right font-semibold">
                                ${(item.quantity * item.rate).toFixed(2)}
                            </TableCell>
                            </TableRow>
                        ))}
                        {(!invoice.items || invoice.items.length === 0) && (
                            <TableRow>
                                <TableCell colSpan={4} className="text-center text-muted-foreground h-24">No items listed</TableCell>
                            </TableRow>
                        )}
                        </TableBody>
                    </Table>
                </div>
            </div>

            {/* Totals */}
            <div className="flex justify-end">
                <div className="w-full md:w-1/2 p-6 bg-muted/20 rounded-xl border border-border space-y-3">
                    <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Subtotal</span>
                        <span className="font-medium">${subtotal.toFixed(2)}</span>
                    </div>
                    {/* Assuming tax is calculated on top or included? Simple display for now */}
                    <div className="pt-3 border-t border-border mt-3 flex justify-between items-end">
                        <span className="text-lg font-bold">Total</span>
                        <span className="text-3xl font-bold text-primary">${subtotal.toFixed(2)}</span>
                    </div>
                </div>
            </div>
        </div>
    </Modal>
  );
}

export default InvoiceDetailModal;
