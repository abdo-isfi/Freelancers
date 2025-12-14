import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { fetchClients, deleteClient } from "@/store/clientsSlice";
import { PlusIcon, PencilIcon, TrashIcon } from "@heroicons/react/24/outline";
import Button from "@/components/Common/Button";
import EmptyState from "@/components/Common/EmptyState";
import LoadingSpinner from "@/components/Common/LoadingSpinner";
import Pagination from "@/components/Common/Pagination";
import ClientFormModal from "@/components/Forms/ClientFormModal";
import ConfirmationModal from "@/components/ui/confirmation-modal";
import { formatDate } from "@/utils/formatDate";
import toast from "react-hot-toast";
import { AnimatedText } from "@/components/ui/animated-shiny-text";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

function ClientsPage() {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const {
    items: clients,
    loading,
    pagination,
  } = useSelector((state) => state.clients);
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedClient, setSelectedClient] = useState(null);

  // Delete modal state
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [clientToDelete, setClientToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    dispatch(fetchClients({ page: currentPage, limit: 20 }));
  }, [dispatch, currentPage]);

  const handleAddClient = () => {
    setSelectedClient(null);
    setIsModalOpen(true);
  };

  const handleEditClient = (client) => {
    setSelectedClient(client);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedClient(null);
  };

  // Open delete confirmation modal
  const handleDeleteClick = (client) => {
    setClientToDelete(client);
    setIsDeleteModalOpen(true);
  };

  // Perform the actual delete
  const handleConfirmDelete = async () => {
    if (!clientToDelete) return;

    setIsDeleting(true);
    try {
      await dispatch(deleteClient(clientToDelete.id)).unwrap();
      toast.success("Client deleted successfully");
      // No need to re-fetch if the slice updates logic is correct.
      // State is updated optimistically/immediately by Redux.
    } catch (error) {
      toast.error(error.message || "Failed to delete client");
    } finally {
      setIsDeleting(false);
      setIsDeleteModalOpen(false);
      setClientToDelete(null);
    }
  };

  const handleCloseDeleteModal = () => {
    if (isDeleting) return; // Prevent closing while deleting
    setIsDeleteModalOpen(false);
    setClientToDelete(null);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  if (loading && clients.length === 0) {
    return (
      <div className="p-6">
        <LoadingSpinner size="lg" className="py-12" />
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-[5px] mt-8 flex flex-col gap-4">
        <div className="text-center w-full">
          <AnimatedText
            text={t("clients")}
            textClassName="text-5xl font-bold text-foreground"
            className="justify-center py-2"
          />
          <p className="mt-2 text-muted-foreground">
            {t("manageClientRelationships")}
          </p>
        </div>
        <div className="w-full flex justify-end">
          <Button variant="primary" onClick={handleAddClient}>
            <PlusIcon className="h-5 w-5 mr-2" />
            {t("addClient")}
          </Button>
        </div>
      </div>

      {/* Content */}
      {clients.length === 0 ? (
        <div className="card">
          <EmptyState
            title={t("noClientsYet")}
            description={t("getStartedFirstClient")}
            action={
              <Button variant="primary" onClick={handleAddClient}>
                <PlusIcon className="h-5 w-5 mr-2" />
                {t("addFirstClient")}
              </Button>
            }
          />
        </div>
      ) : (
        <>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t("clientName")}</TableHead>
                <TableHead>{t("email")}</TableHead>
                <TableHead>{t("phone")}</TableHead>
                <TableHead>{t("company")}</TableHead>
                <TableHead>{t("date")}</TableHead>
                <TableHead className="text-right">{t("actions")}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {clients.map((client) => (
                <TableRow key={client.id}>
                  <TableCell className="font-medium text-foreground">
                    {client.name}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {client.email}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {client.phone || "-"}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {client.company || "-"}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {formatDate(client.createdAt || client.created_at)}
                  </TableCell>
                  <TableCell className="text-right">
                    <button
                      onClick={() => handleEditClient(client)}
                      className="text-primary hover:text-primary/90 mr-3 transition-colors"
                      title={t("edit")}
                    >
                      <PencilIcon className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => handleDeleteClick(client)}
                      className="text-destructive hover:text-destructive/90 transition-colors"
                      title={t("delete")}
                    >
                      <TrashIcon className="h-5 w-5" />
                    </button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {pagination.totalPages > 1 && (
            <Pagination
              currentPage={currentPage}
              totalPages={pagination.totalPages}
              onPageChange={handlePageChange}
              className="mt-4"
            />
          )}
        </>
      )}

      {/* Client Form Modal */}
      <ClientFormModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        client={selectedClient}
      />

      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={handleCloseDeleteModal}
        onConfirm={handleConfirmDelete}
        title="Delete Client"
        message={`Are you sure you want to delete ${clientToDelete?.name}? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        variant="danger"
        loading={isDeleting}
      />
    </div>
  );
}

export default ClientsPage;
