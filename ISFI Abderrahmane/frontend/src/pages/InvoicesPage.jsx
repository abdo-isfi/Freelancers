import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { PlusIcon } from "@heroicons/react/24/outline";
import Button from "@/components/Common/Button";
import Modal from "@/components/Common/Modal";
import Select from "@/components/Common/Select";
import InvoiceForm from "@/components/Forms/InvoiceForm";
import InvoiceTable from "@/components/Tables/InvoiceTable";
import InvoiceDetailModal from "@/components/Modals/InvoiceDetailModal";
import { fetchInvoices, setFilters, fetchInvoiceById } from "@/store/invoicesSlice";
import { fetchClients } from "@/store/clientsSlice";
import { AnimatedText } from "@/components/ui/animated-shiny-text";

function InvoicesPage() {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState(null);

  const {
    items: invoices,
    filters,
    loading,
  } = useSelector((state) => state.invoices);
  const { items: clients } = useSelector((state) => state.clients);

  useEffect(() => {
    dispatch(fetchInvoices());
    dispatch(fetchClients());
  }, [dispatch]);

  const handleViewInvoice = async (invoice) => {
    // If the invoice in the list is summary data, fetch full details
    // Assuming fetchInvoiceById updates state.invoices.currentInvoice, but we can also just fetch and set local state
    // For simplicity, let's fetch individual invoice to ensure we have items etc.
    try {
        const result = await dispatch(fetchInvoiceById(invoice.id)).unwrap();
        setSelectedInvoice(result);
    } catch (e) {
        console.error("Failed to fetch invoice details", e);
        // Fallback to showing what we have if fetch fails
        setSelectedInvoice(invoice);
    }
  };

  const statusOptions = [
    { value: "all", label: t("allStatuses") },
    { value: "paid", label: t("paid") },
    { value: "unpaid", label: t("unpaid") },
    { value: "overdue", label: t("overdue") },
  ];

  const clientOptions = [
    { value: "", label: t("allClients") },
    ...clients.map((client) => ({
      value: client.id.toString(),
      label: client.name,
    })),
  ];

  const filteredInvoices = invoices.filter((invoice) => {
    if (filters.status !== "all" && invoice.status !== filters.status) {
      return false;
    }
    if (filters.clientId && invoice.clientId !== parseInt(filters.clientId)) {
      return false;
    }
    return true;
  });

  const totalAmount = filteredInvoices.reduce(
    (sum, inv) => sum + (inv.totalAmount || 0),
    0
  );
  const paidAmount = filteredInvoices
    .filter((inv) => inv.status === "paid")
    .reduce((sum, inv) => sum + (inv.totalAmount || 0), 0);
  const unpaidAmount = filteredInvoices
    .filter((inv) => inv.status === "unpaid")
    .reduce((sum, inv) => sum + (inv.totalAmount || 0), 0);

  return (
    <div className="page-container">
      <div className="mb-[5px] mt-8 flex flex-col gap-4">
        <div className="text-center w-full">
          <AnimatedText
            text={t("invoices")}
            textClassName="text-5xl font-bold text-foreground"
            className="justify-center py-2"
          />
          <p className="mt-2 text-muted-foreground">{t("manageInvoices")}</p>
        </div>
        <div className="w-full flex justify-end">
          <Button variant="primary" onClick={() => setIsCreateModalOpen(true)}>
            <PlusIcon className="h-5 w-5 mr-2" />
            {t("newInvoice")}
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="stats-grid mb-8">
        <div className="card">
          <p className="text-sm text-muted-foreground">
            {t("total")} {t("invoices")}
          </p>
          <p className="mt-1 text-2xl font-semibold text-foreground">
            {filteredInvoices.length}
          </p>
        </div>
        <div className="card">
          <p className="text-sm text-muted-foreground">
            {t("total")} {t("amount")}
          </p>
          <p className="mt-1 text-2xl font-semibold text-foreground">
            ${totalAmount.toFixed(2)}
          </p>
        </div>
        <div className="card">
          <p className="text-sm text-muted-foreground">{t("paid")}</p>
          <p className="mt-1 text-2xl font-semibold text-green-600">
            ${paidAmount.toFixed(2)}
          </p>
        </div>
        <div className="card">
          <p className="text-sm text-muted-foreground">{t("unpaid")}</p>
          <p className="mt-1 text-2xl font-semibold text-yellow-600">
            ${unpaidAmount.toFixed(2)}
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="card mb-6">
        <div className="filter-grid">
          <Select
            label={t("status")}
            value={filters.status}
            onChange={(e) => dispatch(setFilters({ status: e.target.value }))}
            options={statusOptions}
          />
          <Select
            label={t("client")}
            value={filters.clientId || ""}
            onChange={(e) => dispatch(setFilters({ clientId: e.target.value }))}
            options={clientOptions}
          />
          <div className="flex items-end">
            <Button
              variant="ghost"
              onClick={() =>
                dispatch(setFilters({ status: "all", clientId: null }))
              }
              className="w-full"
            >
              {t("clearFilters")}
            </Button>
          </div>
        </div>
      </div>

      {/* Invoices Table */}
      <div className="card">
        <InvoiceTable
          invoices={filteredInvoices}
          onView={handleViewInvoice}
        />
      </div>

      {/* Create Invoice Modal */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Create New Invoice"
        size="xl"
      >
        <InvoiceForm onSuccess={() => setIsCreateModalOpen(false)} />
      </Modal>

      {/* Invoice Detail Modal */}
      <InvoiceDetailModal
        isOpen={!!selectedInvoice}
        onClose={() => setSelectedInvoice(null)}
        invoice={selectedInvoice}
      />
    </div>
  );
}
// Note: I realized I need to restructure InvoicesPage to manage the selection state correctly.
// Let me rewriting the component slightly to encompass the new modal.


export default InvoicesPage;
