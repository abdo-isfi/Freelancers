import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  ArrowLeftIcon,
  PencilIcon,
  TrashIcon,
  ClockIcon,
  CheckCircleIcon,
} from "@heroicons/react/24/outline";
import Button from "@/components/Common/Button";
import LoadingSpinner from "@/components/Common/LoadingSpinner";
import ErrorMessage from "@/components/Common/ErrorMessage";
import EmptyState from "@/components/Common/EmptyState";
import ConfirmationModal from "@/components/ui/confirmation-modal";
import { fetchProjects, deleteProject } from "@/store/projectsSlice";
import { fetchTasks } from "@/store/tasksSlice";
import { fetchTimeEntries } from "@/store/timeEntriesSlice";
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

function ProjectDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [activeTab, setActiveTab] = useState("overview");

  const {
    items: projects,
    loading: projectsLoading,
    error: projectsError,
  } = useSelector((state) => state.projects);
  const { items: tasks, loading: tasksLoading } = useSelector(
    (state) => state.tasks
  );
  const { items: timeEntries, loading: timeEntriesLoading } = useSelector(
    (state) => state.timeEntries
  );
  const { items: invoices, loading: invoicesLoading } = useSelector(
    (state) => state.invoices
  );

  // Delete modal state
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const project = projects.find((p) => p.id === parseInt(id));

  useEffect(() => {
    if (!project) {
      dispatch(fetchProjects());
    }
    dispatch(fetchTasks({ projectId: id }));
    dispatch(fetchTimeEntries({ projectId: id }));
    dispatch(fetchInvoices({ projectId: id }));
  }, [dispatch, id, project]);

  const handleDeleteClick = () => {
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    setIsDeleting(true);
    try {
      await dispatch(deleteProject(id)).unwrap();
      toast.success("Project deleted successfully");
      navigate("/projects");
    } catch (error) {
      toast.error(error.message || "Failed to delete project");
    } finally {
      setIsDeleting(false);
      setIsDeleteModalOpen(false);
    }
  };

  if (projectsLoading && !project) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (projectsError) {
    return (
      <div className="p-6">
        <ErrorMessage message={projectsError} />
      </div>
    );
  }

  if (!project) {
    return (
      <div className="p-6">
        <ErrorMessage message="Project not found" />
        <Button onClick={() => navigate("/projects")} className="mt-4">
          Back to Projects
        </Button>
      </div>
    );
  }

  const projectTasks = tasks.filter((t) => t.projectId === parseInt(id));
  const projectTimeEntries = timeEntries.filter(
    (te) => te.projectId === parseInt(id)
  );
  const projectInvoices = invoices.filter((i) => i.projectId === parseInt(id));

  const completedTasks = projectTasks.filter(
    (t) => t.status === "completed"
  ).length;
  const totalHours = projectTimeEntries.reduce(
    (sum, entry) => sum + (entry.duration || 0),
    0
  );

  const tabs = [
    { id: "overview", label: "Overview" },
    { id: "tasks", label: `Tasks (${projectTasks.length})` },
    { id: "time", label: `Time Entries (${projectTimeEntries.length})` },
    { id: "invoices", label: `Invoices (${projectInvoices.length})` },
  ];

  return (
    <div className="page-container">
      {/* Header */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <Button variant="ghost" onClick={() => navigate("/projects")}>
            <ArrowLeftIcon className="h-5 w-5 mr-2" />
            Back to Projects
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
            text={project.name}
            textClassName="text-5xl font-bold text-foreground"
            className="justify-center py-2"
          />
          <p className="mt-2 text-muted-foreground">{project.description}</p>
        </div>
      </div>

      {/* Stats */}
      <div className="stats-grid mb-6">
        <div className="card">
          <p className="text-sm text-muted-foreground">Status</p>
          <p className="mt-1 text-lg font-semibold text-foreground capitalize">
            {project.status}
          </p>
        </div>
        <div className="card">
          <p className="text-sm text-muted-foreground">Tasks Completed</p>
          <p className="mt-1 text-lg font-semibold text-foreground">
            {completedTasks} / {projectTasks.length}
          </p>
        </div>
        <div className="card">
          <p className="text-sm text-muted-foreground">Total Hours</p>
          <p className="mt-1 text-lg font-semibold text-foreground">
            {totalHours.toFixed(1)}h
          </p>
        </div>
        <div className="card">
          <p className="text-sm text-muted-foreground">Budget</p>
          <p className="mt-1 text-lg font-semibold text-foreground">
            ${project.budget?.toFixed(2) || "0.00"}
          </p>
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
      {activeTab === "overview" && (
        <div className="space-y-6">
          <div className="card">
            <h2 className="text-lg font-semibold text-foreground mb-4">
              Project Details
            </h2>
            <div className="space-y-3">
              <div>
                <p className="text-sm text-muted-foreground">Description</p>
                <p className="text-foreground">
                  {project.description || "No description"}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Start Date</p>
                <p className="text-foreground">
                  {project.startDate
                    ? new Date(project.startDate).toLocaleDateString()
                    : "N/A"}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">End Date</p>
                <p className="text-foreground">
                  {project.endDate
                    ? new Date(project.endDate).toLocaleDateString()
                    : "N/A"}
                </p>
              </div>
            </div>
          </div>

          {/* Progress */}
          <div className="card">
            <h2 className="text-lg font-semibold text-foreground mb-4">
              Progress
            </h2>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Tasks Completion</span>
                <span className="text-foreground font-medium">
                  {projectTasks.length > 0
                    ? Math.round((completedTasks / projectTasks.length) * 100)
                    : 0}
                  %
                </span>
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <div
                  className="bg-primary h-2 rounded-full transition-all"
                  style={{
                    width: `${
                      projectTasks.length > 0
                        ? (completedTasks / projectTasks.length) * 100
                        : 0
                    }%`,
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === "tasks" && (
        <div className="card p-0 overflow-hidden">
          {tasksLoading ? (
            <div className="p-6">
              <LoadingSpinner />
            </div>
          ) : projectTasks.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Status</TableHead>
                  <TableHead>Title</TableHead>
                  <TableHead>Priority</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {projectTasks.map((task) => (
                  <TableRow
                    key={task.id}
                    className="cursor-pointer hover:bg-muted/50"
                    onClick={() => navigate(`/tasks`)}
                  >
                    <TableCell>
                      {task.status === "completed" ? (
                        <CheckCircleIcon className="h-5 w-5 text-green-500" />
                      ) : (
                        <div className="h-5 w-5 border-2 border-muted-foreground rounded-full" />
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="font-medium text-foreground">
                        {task.title}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {task.description}
                      </div>
                    </TableCell>
                    <TableCell>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          task.priority === "high"
                            ? "bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300"
                            : task.priority === "medium"
                            ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/40 dark:text-yellow-300"
                            : "bg-gray-100 text-gray-800 dark:bg-gray-900/40 dark:text-gray-300"
                        }`}
                      >
                        {task.priority}
                      </span>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="p-6">
              <EmptyState
                title="No tasks yet"
                description="This project doesn't have any tasks."
              />
            </div>
          )}
        </div>
      )}

      {activeTab === "time" && (
        <div className="card p-0 overflow-hidden">
          {timeEntriesLoading ? (
            <div className="p-6">
              <LoadingSpinner />
            </div>
          ) : projectTimeEntries.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Duration</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {projectTimeEntries.map((entry) => (
                  <TableRow
                    key={entry.id}
                    className="cursor-pointer hover:bg-muted/50"
                  >
                    <TableCell className="text-muted-foreground">
                      {new Date(entry.date).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {entry.description || "No description"}
                    </TableCell>
                    <TableCell className="font-medium text-foreground">
                      <div className="flex items-center">
                        <ClockIcon className="h-4 w-4 mr-1 text-muted-foreground" />
                        {entry.duration?.toFixed(1)}h
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="p-6">
              <EmptyState
                title="No time entries yet"
                description="No time has been tracked for this project."
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
          ) : projectInvoices.length > 0 ? (
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
                {projectInvoices.map((invoice) => (
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
                description="This project doesn't have any invoices."
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
        title="Delete Project"
        message={`Are you sure you want to delete ${project?.name}? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        variant="danger"
        loading={isDeleting}
      />
    </div>
  );
}

export default ProjectDetailPage;
