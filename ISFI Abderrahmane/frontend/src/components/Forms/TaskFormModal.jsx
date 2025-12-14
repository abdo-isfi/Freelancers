import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useDispatch, useSelector } from 'react-redux';
import { createTask, updateTask } from '@/store/tasksSlice';
import { fetchProjects } from '@/store/projectsSlice';
import Modal from '../Common/Modal';
import Input from '../Common/Input';
import Button from '../Common/Button';
import toast from 'react-hot-toast';

// Validation schema
const taskSchema = yup.object({
  title: yup.string().required('Title is required'),
  description: yup.string(),
  projectId: yup.number().required('Project is required').positive('Please select a project'),
  status: yup.string().oneOf(['todo', 'in_progress', 'completed']),
  priority: yup.string().oneOf(['low', 'medium', 'high']),
  dueDate: yup.date(),
  estimatedHours: yup.number().min(0, 'Must be positive'),
});

function TaskFormModal({ isOpen, onClose, task = null }) {
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.tasks);
  const { items: projects } = useSelector((state) => state.projects);
  
  const isEditMode = !!task;

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(taskSchema),
    defaultValues: task || { status: 'todo', priority: 'medium' },
  });

  useEffect(() => {
    dispatch(fetchProjects({ limit: 100 }));
  }, [dispatch]);

  useEffect(() => {
    if (task) {
      reset(task);
    } else {
      reset({ status: 'todo', priority: 'medium' });
    }
  }, [task, reset]);

  const onSubmit = async (data) => {
    try {
      if (isEditMode) {
        await dispatch(updateTask({ id: task.id, data })).unwrap();
        toast.success('Task updated successfully');
      } else {
        await dispatch(createTask(data)).unwrap();
        toast.success('Task created successfully');
      }
      onClose();
      reset();
    } catch (error) {
      toast.error(error.message || 'An error occurred');
    }
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={isEditMode ? 'Edit Task' : 'Add New Task'}
      size="md"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input
          label="Task Title"
          {...register('title')}
          error={errors.title?.message}
          required
        />

        <div>
          <label className="block text-sm font-medium text-foreground mb-1">
            Project <span className="text-red-500">*</span>
          </label>
          <select
            {...register('projectId')}
            className={`input-field ${errors.projectId ? 'border-red-500' : ''}`}
          >
            <option value="">Select a project...</option>
            {projects.map((project) => (
              <option key={project.id} value={project.id}>
                {project.name}
              </option>
            ))}
          </select>
          {errors.projectId && (
            <p className="mt-1 text-sm text-red-600">{errors.projectId.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-1">
            Description
          </label>
          <textarea
            {...register('description')}
            rows={3}
            className="input-field"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">
              Status
            </label>
            <select {...register('status')} className="input-field">
              <option value="todo">To Do</option>
              <option value="in_progress">In Progress</option>
              <option value="completed">Completed</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-1">
              Priority
            </label>
            <select {...register('priority')} className="input-field">
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Due Date"
            type="date"
            {...register('dueDate')}
            error={errors.dueDate?.message}
          />

          <Input
            label="Estimated Hours"
            type="number"
            step="0.5"
            {...register('estimatedHours')}
            error={errors.estimatedHours?.message}
          />
        </div>

        <div className="flex justify-end gap-3 pt-4">
          <Button type="button" variant="secondary" onClick={handleClose} disabled={loading}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" loading={loading} disabled={loading}>
            {isEditMode ? 'Update Task' : 'Create Task'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}

export default TaskFormModal;
