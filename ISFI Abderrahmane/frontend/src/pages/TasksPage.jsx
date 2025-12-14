import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { fetchTasks, deleteTask } from '../store/tasksSlice';
import { PlusIcon, PencilIcon, TrashIcon, CheckCircleIcon } from '@heroicons/react/24/outline';
import Button from '../components/Common/Button';
import EmptyState from '../components/Common/EmptyState';
import LoadingSpinner from '../components/Common/LoadingSpinner';
import Pagination from '../components/Common/Pagination';
import TaskFormModal from '../components/Forms/TaskFormModal';
import ConfirmationModal from '../components/ui/confirmation-modal';
import { formatDate } from '../utils/formatDate';
import toast from 'react-hot-toast';
import { AnimatedText } from '../components/ui/animated-shiny-text';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../components/ui/table';

const statusColors = {
  todo: 'bg-gray-100 text-gray-800 dark:bg-gray-900/40 dark:text-gray-300',
  in_progress: 'bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300',
  completed: 'bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300',
};

const statusLabels = {
  todo: 'To Do',
  in_progress: 'In Progress',
  completed: 'Completed',
};

const priorityColors = {
  low: 'bg-gray-100 text-gray-600 dark:bg-gray-900/40 dark:text-gray-300',
  medium: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/40 dark:text-yellow-300',
  high: 'bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300',
};

const priorityLabels = {
  low: 'Low',
  medium: 'Medium',
  high: 'High',
};

function TasksPage() {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { items: tasks, loading, pagination } = useSelector((state) => state.tasks);
  const [currentPage, setCurrentPage] = useState(1);
  const [filterStatus, setFilterStatus] = useState('');
  const [filterPriority, setFilterPriority] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);

  // Delete modal state
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    dispatch(fetchTasks({ 
      page: currentPage, 
      limit: 20,
      status: filterStatus,
      priority: filterPriority
    }));
  }, [dispatch, currentPage, filterStatus, filterPriority]);

  const handleAddTask = () => {
    setSelectedTask(null);
    setIsModalOpen(true);
  };

  const handleEditTask = (task) => {
    setSelectedTask(task);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedTask(null);
  };

  const handleDeleteClick = (task) => {
    setTaskToDelete(task);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!taskToDelete) return;
    
    setIsDeleting(true);
    try {
      await dispatch(deleteTask(taskToDelete.id)).unwrap();
      toast.success('Task deleted successfully');
    } catch (error) {
      toast.error(error.message || 'Failed to delete task');
    } finally {
      setIsDeleting(false);
      setIsDeleteModalOpen(false);
      setTaskToDelete(null);
    }
  };

  const handleCloseDeleteModal = () => {
    if (isDeleting) return;
    setIsDeleteModalOpen(false);
    setTaskToDelete(null);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  if (loading && tasks.length === 0) {
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
            text={t('tasks')} 
            textClassName="text-5xl font-bold text-foreground"
            className="justify-center py-2"
          />
          <p className="mt-2 text-muted-foreground">{t('manageYourTasks')}</p>
        </div>
        <div className="w-full flex justify-between items-end">
          <div className="flex gap-4">
             <div className="w-40">
                <label className="text-sm font-medium mb-1 block">Status</label>
                <select 
                  className="w-full border rounded-md p-2 bg-[var(--color-surface)] text-foreground"
                  value={filterStatus}
                  onChange={(e) => {
                      setFilterStatus(e.target.value);
                      setCurrentPage(1); // Reset to page 1 on filter change
                  }}
                >
                  <option value="">All Statuses</option>
                  <option value="todo">To Do</option>
                  <option value="in_progress">In Progress</option>
                  <option value="completed">Completed</option>
                </select>
             </div>
             <div className="w-40">
                <label className="text-sm font-medium mb-1 block">Priority</label>
                <select 
                  className="w-full border rounded-md p-2 bg-[var(--color-surface)] text-foreground"
                  value={filterPriority}
                  onChange={(e) => {
                      setFilterPriority(e.target.value);
                      setCurrentPage(1);
                  }}
                >
                  <option value="">All Priorities</option>
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
             </div>
          </div>

          <Button variant="primary" onClick={handleAddTask}>
            <PlusIcon className="h-5 w-5 mr-2" />
            {t('addTask')}
          </Button>
        </div>
      </div>

      {/* Content */}
      {tasks.length === 0 ? (
        <div className="card">
          <EmptyState
            icon={CheckCircleIcon}
            title={t('noTasksYet')}
            description={t('getStartedFirstTask')}
            action={
              <Button variant="primary" onClick={handleAddTask}>
                <PlusIcon className="h-5 w-5 mr-2" />
                {t('createFirstTask')}
              </Button>
            }
          />
        </div>
      ) : (
        <>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Task</TableHead>
                <TableHead>Project</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Priority</TableHead>
                <TableHead>Due Date</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {tasks.map((task) => (
                <TableRow key={task.id}>
                  <TableCell>
                    <div className="text-sm font-medium text-foreground">
                      {task.title}
                    </div>
                    {task.description && (
                      <div className="text-sm text-muted-foreground truncate max-w-xs">
                        {task.description}
                      </div>
                    )}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {task.Project?.name || task.project?.name || '-'}
                  </TableCell>
                  <TableCell>
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${statusColors[task.status]}`}>
                      {statusLabels[task.status]}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${priorityColors[task.priority]}`}>
                      {priorityLabels[task.priority]}
                    </span>
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {task.dueDate ? formatDate(task.dueDate) : '-'}
                  </TableCell>
                  <TableCell className="text-right font-medium">
                    <button
                      onClick={() => handleEditTask(task)}
                      className="text-primary hover:text-primary/90 mr-3 transition-colors"
                      title={t('edit')}
                    >
                      <PencilIcon className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => handleDeleteClick(task)}
                      className="text-destructive hover:text-destructive/90 transition-colors"
                      title={t('delete')}
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

      {/* Task Form Modal */}
      <TaskFormModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        task={selectedTask}
      />

      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={handleCloseDeleteModal}
        onConfirm={handleConfirmDelete}
        title="Delete Task"
        message={`Are you sure you want to delete ${taskToDelete?.title}? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        variant="danger"
        loading={isDeleting}
      />
    </div>
  );
}

export default TasksPage;

