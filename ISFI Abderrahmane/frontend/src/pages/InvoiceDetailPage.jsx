import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchInvoices } from '../store/invoicesSlice';
import * as invoicesAPI from '../api/invoicesAPI';
import {
  ArrowLeftIcon,
  PencilIcon,
  TrashIcon,
  ArrowDownTrayIcon,
  CheckCircleIcon,
  DocumentArrowDownIcon,
  PrinterIcon,
} from "@heroicons/react/24/outline";
import Button from "@/components/Common/Button";
import LoadingSpinner from "@/components/Common/LoadingSpinner";
import ErrorMessage from "@/components/Common/ErrorMessage";
import {
  fetchInvoiceById,
  deleteInvoice,
  markInvoiceAsPaid,
  downloadInvoice,
} from "@/store/invoicesSlice";
import { AnimatedText } from "@/components/ui/animated-shiny-text";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

function InvoiceDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const {
    currentInvoice: invoice,
    loading,
    error,
  } = useSelector((state) => state.invoices);

  useEffect(() => {
    dispatch(fetchInvoiceById(id));
  }, [dispatch, id]);

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this invoice?")) {
      await dispatch(deleteInvoice(id));
      navigate("/invoices");
    }
  };

  const handleMarkAsPaid = async () => {
    await dispatch(markInvoiceAsPaid(id));
  };

  const handleDownload = async () => {
    await dispatch(downloadInvoice(id));
  };

  if (loading && !invoice) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <ErrorMessage message={error} />
      </div>
    );
  }

  if (!invoice) {
    return (
      <div className="p-6">
        <LoadingSpinner />
      </div>
    );
  }

  const subtotal =
    invoice.items?.reduce((sum, item) => sum + item.quantity * item.rate, 0) ||
    0;
  const tax = (subtotal * (invoice.taxRate || 0)) / 100;
  const discount = (subtotal * (invoice.discountRate || 0)) / 100;
  const total = subtotal + tax - discount;

  return (
    <div className="page-container">
      {/* Header */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <Button variant="ghost" onClick={() => navigate("/invoices")}>
            <ArrowLeftIcon className="h-5 w-5 mr-2" />
            {t('backToInvoices')}
          </Button>

          <div className="flex gap-2">
            <Button 
              variant="secondary" 
              onClick={handleDownloadPDF}
              disabled={isDownloading}
            >
              {isDownloading ? (
                <LoadingSpinner size="sm" className="mr-2" />
              ) : (
                <ArrowDownTrayIcon className="h-5 w-5 mr-2" />
              )}
              {t('downloadPDF') || 'Download PDF'}
            </Button>
            {invoice.status !== "paid" && (
              <Button variant="success" onClick={handleMarkAsPaid}>
                <CheckCircleIcon className="h-5 w-5 mr-2" />
                Mark as Paid
              </Button>
            )}
            <Button variant="secondary">
              <PencilIcon className="h-5 w-5 mr-2" />
              Edit
            </Button>
            <Button variant="danger" onClick={handleDelete}>
              <TrashIcon className="h-5 w-5 mr-2" />
              Delete
            </Button>
          </div>
        </div>

        <div className="text-center">
          <AnimatedText
            text={`Invoice #${invoice.invoiceNumber}`}
            textClassName="text-5xl font-bold text-foreground"
            className="justify-center py-2"
          />
          <p className="mt-2 text-muted-foreground">
            {invoice.clientName || "Client"}
          </p>
        </div>
      </div>

      {/* Invoice Details */}
      <div className="card mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div>
            <p className="text-sm text-muted-foreground mb-1">Invoice Date</p>
            <p className="text-foreground font-medium">
              {new Date(invoice.date).toLocaleDateString()}
            </p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground mb-1">Due Date</p>
            <p className="text-foreground font-medium">
              {invoice.dueDate
                ? new Date(invoice.dueDate).toLocaleDateString()
                : "N/A"}
            </p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground mb-1">Status</p>
            <span
              className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                invoice.status === "paid"
                  ? "bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300"
                  : invoice.status === "overdue"
                  ? "bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300"
                  : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/40 dark:text-yellow-300"
              }`}
            >
              {invoice.status}
            </span>
          </div>
        </div>

        {invoice.notes && (
          <div>
            <p className="text-sm text-muted-foreground mb-1">Notes</p>
            <p className="text-foreground">{invoice.notes}</p>
          </div>
        )}
      </div>

      {/* Line Items */}
      <div className="card">
        <h2 className="text-lg font-semibold text-foreground mb-4">
          Line Items
        </h2>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Description</TableHead>
              <TableHead className="text-right">Quantity</TableHead>
              <TableHead className="text-right">Rate</TableHead>
              <TableHead className="text-right">Amount</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {invoice.items?.map((item, index) => (
              <TableRow key={index}>
                <TableCell className="text-foreground">
                  {item.description}
                </TableCell>
                <TableCell className="text-muted-foreground text-right">
                  {item.quantity}
                </TableCell>
                <TableCell className="text-muted-foreground text-right">
                  ${item.rate.toFixed(2)}
                </TableCell>
                <TableCell className="font-medium text-right">
                  ${(item.quantity * item.rate).toFixed(2)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {/* Totals */}
        <div className="mt-6 border-t border-border pt-4">
          <div className="flex justify-end">
            <div className="w-64 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Subtotal</span>
                <span className="text-foreground">${subtotal.toFixed(2)}</span>
              </div>
              {invoice.taxRate > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">
                    Tax ({invoice.taxRate}%)
                  </span>
                  <span className="text-foreground">${tax.toFixed(2)}</span>
                </div>
              )}
              {invoice.discountRate > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">
                    Discount ({invoice.discountRate}%)
                  </span>
                  <span className="text-foreground">
                    -${discount.toFixed(2)}
                  </span>
                </div>
              )}
              <div className="flex justify-between text-lg font-semibold border-t border-border pt-2">
                <span className="text-foreground">Total</span>
                <span className="text-foreground">${total.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default InvoiceDetailPage;
