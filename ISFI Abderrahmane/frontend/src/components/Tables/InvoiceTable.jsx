import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  EyeIcon,
  ArrowDownTrayIcon,
  CheckCircleIcon,
  TrashIcon,
} from '@heroicons/react/24/outline';
import { DocumentTextIcon } from '@heroicons/react/24/solid';
import EmptyState from '../Common/EmptyState';
import { deleteInvoice, markInvoiceAsPaid, downloadInvoice } from '@/store/invoicesSlice';
import { showSuccess, showError } from '@/utils/toast';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

function InvoiceTable({ invoices = [], onView }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { items: clients } = useSelector((state) => state.clients);

  const getClientName = (clientId) => {
    const client = clients.find((c) => c.id === clientId);
    return client?.name || 'Unknown Client';
  };

  const handleMarkAsPaid = async (id, e) => {
    e.stopPropagation();
    try {
      await dispatch(markInvoiceAsPaid(id)).unwrap();
      showSuccess('Invoice marked as paid');
    } catch (error) {
      showError('Failed to mark invoice as paid');
    }
  };

  const handleDownload = async (id, e) => {
    e.stopPropagation();
    try {
      await dispatch(downloadInvoice(id)).unwrap();
      // Success message is handled in component but good to have feedback
      // showSuccess('Invoice downloaded'); // slice might not return anything for blob
    } catch (error) {
      console.error(error);
      showError('Failed to download invoice');
    }
  };

  const handleDelete = async (id, e) => {
    e.stopPropagation();
    if (window.confirm('Are you sure you want to delete this invoice?')) {
      try {
        await dispatch(deleteInvoice(id)).unwrap();
        showSuccess('Invoice deleted');
      } catch (error) {
        console.error("Delete failed", error);
        showError('Failed to delete invoice');
      }
    }
  };

  const handleView = (invoice, e) => {
    e.stopPropagation(); // prevent row click if needed, though row click also views
    if (onView) {
        onView(invoice);
    } else {
        navigate(`/invoices/${invoice.id}`);
    }
  }

  const getStatusBadge = (status) => {
    const badges = {
      paid: 'bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300',
      unpaid: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/40 dark:text-yellow-300',
      overdue: 'bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300',
    };
    return badges[status] || badges.unpaid;
  };

  if (invoices.length === 0) {
    return (
      <EmptyState
        icon={DocumentTextIcon}
        title="No invoices yet"
        description="Create your first invoice to start billing clients."
      />
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Invoice #</TableHead>
          <TableHead>Client</TableHead>
          <TableHead>Date</TableHead>
          <TableHead>Due Date</TableHead>
          <TableHead>Amount</TableHead>
          <TableHead>Status</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {invoices.map((invoice) => (
          <TableRow
            key={invoice.id}
            className="cursor-pointer hover:bg-muted/50 transition-colors"
            onClick={() => onView ? onView(invoice) : navigate(`/invoices/${invoice.id}`)}
          >
            <TableCell className="font-medium text-foreground">
              {invoice.invoiceNumber}
            </TableCell>
            <TableCell>{getClientName(invoice.clientId)}</TableCell>
            <TableCell className="text-muted-foreground">
              {new Date(invoice.issueDate).toLocaleDateString()}
            </TableCell>
            <TableCell className="text-muted-foreground">
              {invoice.dueDate ? new Date(invoice.dueDate).toLocaleDateString() : 'N/A'}
            </TableCell>
            <TableCell className="font-medium">
              ${invoice.totalAmount?.toFixed(2)}
            </TableCell>
            <TableCell>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBadge(invoice.status)}`}>
                {invoice.status}
              </span>
            </TableCell>
            <TableCell className="text-right">
              <div className="flex justify-end gap-2">
                <button
                  onClick={(e) => handleView(invoice, e)}
                  className="p-1 rounded-md text-muted-foreground hover:text-primary hover:bg-muted transition-colors"
                  title="View"
                >
                  <EyeIcon className="h-5 w-5" />
                </button>
                <button
                  onClick={(e) => handleDownload(invoice.id, e)}
                  className="p-1 rounded-md text-muted-foreground hover:text-blue-500 hover:bg-muted transition-colors"
                  title="Download"
                >
                  <ArrowDownTrayIcon className="h-5 w-5" />
                </button>
                {invoice.status !== 'paid' && (
                  <button
                    onClick={(e) => handleMarkAsPaid(invoice.id, e)}
                    className="p-1 rounded-md text-muted-foreground hover:text-green-500 hover:bg-muted transition-colors"
                    title="Mark as Paid"
                  >
                    <CheckCircleIcon className="h-5 w-5" />
                  </button>
                )}
                <button
                  onClick={(e) => handleDelete(invoice.id, e)}
                  className="p-1 rounded-md text-muted-foreground hover:text-destructive hover:bg-muted transition-colors"
                  title="Delete"
                >
                  <TrashIcon className="h-5 w-5" />
                </button>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

export default InvoiceTable;
