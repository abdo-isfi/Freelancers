import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  ArrowLeftIcon,
  PencilIcon,
  TrashIcon,
  EnvelopeIcon,
  PhoneIcon,
  BuildingOfficeIcon,
} from "@heroicons/react/24/outline";
import Button from "@/components/Common/Button";
import LoadingSpinner from "@/components/Common/LoadingSpinner";
import ErrorMessage from "@/components/Common/ErrorMessage";
import EmptyState from "@/components/Common/EmptyState";
import ConfirmationModal from "@/components/ui/confirmation-modal";
import { fetchClients, deleteClient } from "@/store/clientsSlice";
import { fetchProjects } from "@/store/projectsSlice";
import { fetchInvoices } from "@/store/invoicesSlice";
import { AnimatedText } from "@/components/ui/animated-shiny-text";
import toast from "react-hot-toast";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

function ClientDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [activeTab, setActiveTab] = useState("info");

  const {
    items: clients,
    loading: clientsLoading,
    error: clientsError,
  } = useSelector((state) => state.clients);
  const { items: projects, loading: projectsLoading } = useSelector(
    (state) => state.projects
  );
  const { items: invoices, loading: invoicesLoading } = useSelector(
    (state) => state.invoices
  );

  // Delete modal state
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const client = clients.find((c) => c.id === parseInt(id));

  useEffect(() => {
    if (!client) {
      dispatch(fetchClients());
    }
    dispatch(fetchProjects({ clientId: id }));
    dispatch(fetchInvoices({ clientId: id }));
  }, [dispatch, id, client]);

  const handleDeleteClick = () => {
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    setIsDeleting(true);
    try {
      await dispatch(deleteClient(id)).unwrap();
      toast.success("Client deleted successfully");
      navigate("/clients");
    } catch (error) {
      toast.error(error.message || "Failed to delete client");
    } finally {
      setIsDeleting(false);
      setIsDeleteModalOpen(false);
    }
  };

  if (clientsLoading && !client) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (clientsError) {
    return (
      <div className="p-6">
        <ErrorMessage message={clientsError} />
      </div>
    );
  }

  if (!client) {
    return (
      <div className="p-6">
        <ErrorMessage message="Client not found" />
        <Button onClick={() => navigate("/clients")} className="mt-4">
          Back to Clients
        </Button>
      </div>
    );
  }

  const clientProjects = projects.filter((p) => p.clientId === parseInt(id));
  const clientInvoices = invoices.filter((i) => i.clientId === parseInt(id));

  const tabs = [
    { id: "info", label: "Information" },
    { id: "projects", label: `Projects (${clientProjects.length})` },
    { id: "invoices", label: `Invoices (${clientInvoices.length})` },
  ];

  return (
    <div className="page-container">
      {/* Header */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <Button variant="ghost" onClick={() => navigate("/clients")}>
            <ArrowLeftIcon className="h-5 w-5 mr-2" />
            Back to Clients
          </Button>

          <div className="flex gap-2">
            <Button variant="secondary">
              <PencilIcon className="h-5 w-5 mr-2" />
              Edit
            </Button>
            <Button variant="danger" onClick={handleDeleteClick}>
              <TrashIcon className="h-5 w-5 mr-2" />
              Delete
            </Button>
          </div>
        </div>

        <div className="text-center">
          <AnimatedText
            text={client.name}
            textClassName="text-5xl font-bold text-foreground"
            className="justify-center py-2"
          />
          <p className="mt-2 text-muted-foreground">{client.company}</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-border mb-6">
        <nav className="-mb-px flex space-x-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`
                py-4 px-1 border-b-2 font-medium text-sm transition-colors
                ${
                  activeTab === tab.id
                    ? "border-primary text-primary"
                    : "border-transparent text-muted-foreground hover:text-foreground hover:border-border"
                }
              `}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      {activeTab === "info" && (
        <div className="card">
          <h2 className="text-lg font-semibold text-foreground mb-4">
            Contact Information
          </h2>
          <div className="space-y-4">
            <div className="flex items-center">
              <EnvelopeIcon className="h-5 w-5 text-muted-foreground mr-3" />
              <div>
                <p className="text-sm text-muted-foreground">Email</p>
                <p className="text-foreground">{client.email}</p>
              </div>
            </div>
            <div className="flex items-center">
              <PhoneIcon className="h-5 w-5 text-muted-foreground mr-3" />
              <div>
                <p className="text-sm text-muted-foreground">Phone</p>
                <p className="text-foreground">{client.phone || "N/A"}</p>
              </div>
            </div>
            <div className="flex items-center">
              <BuildingOfficeIcon className="h-5 w-5 text-muted-foreground mr-3" />
              <div>
                <p className="text-sm text-muted-foreground">Company</p>
                <p className="text-foreground">{client.company || "N/A"}</p>
              </div>
            </div>
            {client.address && (
              <div>
                <p className="text-sm text-muted-foreground mb-1">Address</p>
                <p className="text-foreground">{client.address}</p>
              </div>
            )}
          </div>
        </div>
      )}

      {activeTab === "projects" && (
        <div className="card p-0 overflow-hidden">
          {projectsLoading ? (
            <div className="p-6">
              <LoadingSpinner />
            </div>
          ) : clientProjects.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Project Name</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {clientProjects.map((project) => (
                  <TableRow
                    key={project.id}
                    className="cursor-pointer hover:bg-muted/50"
                    onClick={() => navigate(`/projects/${project.id}`)}
                  >
                    <TableCell className="font-medium text-foreground">
                      {project.name}
                    </TableCell>
                    <TableCell className="text-muted-foreground max-w-md truncate">
                      {project.description}
                    </TableCell>
                    <TableCell>
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          project.status === "active"
                            ? "bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300"
                            : project.status === "completed"
                            ? "bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300"
                            : "bg-gray-100 text-gray-800 dark:bg-gray-900/40 dark:text-gray-300"
                        }`}
                      >
                        {project.status}
                      </span>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="p-6">
              <EmptyState
                title="No projects yet"
                description="This client doesn't have any projects."
              />
            </div>
          )}
        </div>
      )}

      {activeTab === "invoices" && (
        <div className="card p-0 overflow-hidden">
          {invoicesLoading ? (
            <div className="p-6">
              <LoadingSpinner />
            </div>
          ) : clientInvoices.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Invoice #</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {clientInvoices.map((invoice) => (
                  <TableRow
                    key={invoice.id}
                    className="cursor-pointer hover:bg-muted/50"
                    onClick={() => navigate(`/invoices/${invoice.id}`)}
                  >
                    <TableCell className="font-medium text-foreground">
                      {invoice.invoiceNumber}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {new Date(invoice.date).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="font-medium text-foreground">
                      ${invoice.total?.toFixed(2)}
                    </TableCell>
                    <TableCell>
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          invoice.status === "paid"
                            ? "bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300"
                            : invoice.status === "overdue"
                            ? "bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300"
                            : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/40 dark:text-yellow-300"
                        }`}
                      >
                        {invoice.status}
                      </span>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="p-6">
              <EmptyState
                title="No invoices yet"
                description="This client doesn't have any invoices."
              />
            </div>
          )}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => !isDeleting && setIsDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Delete Client"
        message={`Are you sure you want to delete ${client?.name}? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        variant="danger"
        loading={isDeleting}
      />
    </div>
  );
}

export default ClientDetailPage;
