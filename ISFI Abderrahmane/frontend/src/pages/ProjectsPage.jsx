import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { fetchProjects, deleteProject } from "../store/projectsSlice";
import {
  PlusIcon,
  PencilIcon,
  TrashIcon,
  BriefcaseIcon,
} from "@heroicons/react/24/outline";
import Button from "../components/Common/Button";
import EmptyState from "../components/Common/EmptyState";
import LoadingSpinner from "../components/Common/LoadingSpinner";
import Pagination from "../components/Common/Pagination";
import ProjectFormModal from "../components/Forms/ProjectFormModal";
import { formatDate } from "../utils/formatDate";
import { formatCurrency } from "../utils/formatCurrency";
import toast from "react-hot-toast";
import { AnimatedText } from "../components/ui/animated-shiny-text";
import { useConfirm } from "../hooks/useConfirm.jsx";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../components/ui/table";

const statusColors = {
  active:
    "bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300",
  on_hold:
    "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/40 dark:text-yellow-300",
  completed: "bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300",
  cancelled: "bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300",
};

const statusLabels = {
  active: "Active",
  on_hold: "On Hold",
  completed: "Completed",
  cancelled: "Cancelled",
};

function ProjectsPage() {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const {
    items: projects,
    loading,
    pagination,
  } = useSelector((state) => state.projects);
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const { confirm, ConfirmDialog } = useConfirm();

  useEffect(() => {
    dispatch(fetchProjects({ page: currentPage, limit: 20 }));
  }, [dispatch, currentPage]);

  const handleAddProject = () => {
    setSelectedProject(null);
    setIsModalOpen(true);
  };

  const handleEditProject = (project) => {
    setSelectedProject(project);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedProject(null);
  };

  const handleDelete = async (id) => {
    const confirmed = await confirm({
      title: "Delete Project",
      message:
        "Are you sure you want to delete this project? This action cannot be undone.",
      confirmText: "Delete",
      cancelText: "Cancel",
      variant: "danger",
    });

    if (confirmed) {
      try {
        await dispatch(deleteProject(id)).unwrap();
        toast.success("Project deleted successfully");
        dispatch(fetchProjects({ page: currentPage, limit: 20 }));
      } catch (error) {
        toast.error(error.message || "Failed to delete project");
      }
    }
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  if (loading && projects.length === 0) {
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
            text={t("projects")}
            textClassName="text-5xl font-bold text-foreground"
            className="justify-center py-2"
          />
          <p className="mt-2 text-muted-foreground">
            {t("manageClientProjects")}
          </p>
        </div>
        <div className="w-full flex justify-end">
          <Button variant="primary" onClick={handleAddProject}>
            <PlusIcon className="h-5 w-5 mr-2" />
            {t("addProject")}
          </Button>
        </div>
      </div>

      {/* Content */}
      {projects.length === 0 ? (
        <div className="card">
          <EmptyState
            icon={BriefcaseIcon}
            title={t("noProjectsYet")}
            description={t("getStartedFirstProject")}
            action={
              <Button variant="primary" onClick={handleAddProject}>
                <PlusIcon className="h-5 w-5 mr-2" />
                {t("createFirstProject")}
              </Button>
            }
          />
        </div>
      ) : (
        <>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t("projectName")}</TableHead>
                <TableHead>{t("client")}</TableHead>
                <TableHead>{t("status")}</TableHead>
                <TableHead>{t("budget")}</TableHead>
                <TableHead>{t("date")}</TableHead>
                <TableHead className="text-right">{t("actions")}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {projects.map((project) => (
                <TableRow key={project.id}>
                  <TableCell>
                    <div className="text-sm font-medium text-foreground">
                      {project.name}
                    </div>
                    {project.description && (
                      <div className="text-sm text-muted-foreground truncate max-w-xs">
                        {project.description}
                      </div>
                    )}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {project.Client?.name || project.client?.name || "-"}
                  </TableCell>
                  <TableCell>
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        statusColors[project.status]
                      }`}
                    >
                      {statusLabels[project.status]}
                    </span>
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {project.fixedAmount
                      ? formatCurrency(project.fixedAmount)
                      : project.hourlyRate
                      ? `${formatCurrency(project.hourlyRate)}/hr`
                      : project.dayRate || project.day_rate
                      ? `${formatCurrency(
                          project.dayRate || project.day_rate
                        )}/day`
                      : project.budget
                      ? formatCurrency(project.budget)
                      : "-"}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {project.startDate ? formatDate(project.startDate) : "-"}
                  </TableCell>
                  <TableCell className="text-right font-medium">
                    <button
                      onClick={() => handleEditProject(project)}
                      className="text-primary hover:text-primary/90 mr-3 transition-colors"
                      title={t("edit")}
                    >
                      <PencilIcon className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => handleDelete(project.id)}
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

      {/* Project Form Modal */}
      <ProjectFormModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        project={selectedProject}
      />

      {/* Confirm Dialog */}
      <ConfirmDialog />
    </div>
  );
}

export default ProjectsPage;
