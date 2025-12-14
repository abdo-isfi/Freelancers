import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useDispatch, useSelector } from 'react-redux';
import { createProject, updateProject } from '@/store/projectsSlice';
import { fetchClients } from '@/store/clientsSlice';
import Modal from '../Common/Modal';
import Input from '../Common/Input';
import Button from '../Common/Button';
import toast from 'react-hot-toast';

// Validation schema
const projectSchema = yup.object({
  name: yup.string().required('Name is required').min(2, 'Name must be at least 2 characters'),
  description: yup.string(),
  clientId: yup.number().required('Client is required').positive('Please select a client'),
  status: yup.string().oneOf(['active', 'paused', 'finished']),
  billingType: yup.string().oneOf(['hourly', 'day_rate', 'fixed_price']).required('Billing type is required'),
  startDate: yup.date().nullable().transform((curr, orig) => (orig === '' ? null : curr)),
  endDateEstimated: yup.date().nullable().transform((curr, orig) => (orig === '' ? null : curr)),
  budget: yup.number().min(0, 'Budget must be positive'),
});

function ProjectFormModal({ isOpen, onClose, project = null }) {
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.projects);
  const { items: clients } = useSelector((state) => state.clients);
  
  const isEditMode = !!project;

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(projectSchema),
    defaultValues: project || { status: 'active', billingType: 'fixed_price' },
  });

  useEffect(() => {
    // Fetch clients for dropdown
    dispatch(fetchClients({ limit: 100 }));
  }, [dispatch]);

  useEffect(() => {
    if (project) {
      reset(project);
    } else {
      reset({ status: 'active', billingType: 'fixed_price' });
    }
  }, [project, reset]);

  const onSubmit = async (data) => {
    // Force integer conversion to be safe
    const budget = data.budget ? Number(data.budget) : undefined;
    
    const payload = {
        ...data,
        clientId: data.clientId ? parseInt(data.clientId, 10) : undefined,
        fixedAmount: data.billingType === 'fixed_price' ? budget : undefined,
        hourlyRate: data.billingType === 'hourly' ? budget : undefined,
        dayRate: data.billingType === 'day_rate' ? budget : undefined,
        startDate: data.startDate || undefined,
        endDateEstimated: data.endDateEstimated || undefined,
    };

    try {
      if (isEditMode) {
        await dispatch(updateProject({ id: project.id, data: payload })).unwrap();
        toast.success('Project updated successfully');
      } else {
        await dispatch(createProject(payload)).unwrap();
        toast.success('Project created successfully');
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
      title={isEditMode ? 'Edit Project' : 'Add New Project'}
      size="lg"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input
          label="Project Name"
          {...register('name')}
          error={errors.name?.message}
          required
        />

        <div>
          <label className="block text-sm font-medium text-foreground mb-1">
            Client <span className="text-red-500">*</span>
          </label>
          <select
            {...register('clientId')}
            className={`input-field ${errors.clientId ? 'border-red-500' : ''}`}
          >
            <option value="">Select a client...</option>
            {clients.map((client) => (
              <option key={client.id} value={client.id}>
                {client.name}
              </option>
            ))}
          </select>
          {errors.clientId && (
            <p className="mt-1 text-sm text-red-600">{errors.clientId.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-1">
            Description
          </label>
          <textarea
            {...register('description')}
            rows={4}
            className="input-field"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">
              Billing Type
            </label>
            <select
              {...register('billingType')}
              className={`input-field ${errors.billingType ? 'border-red-500' : ''}`}
            >
              <option value="fixed_price">Fixed Price</option>
              <option value="hourly">Hourly Rate</option>
              <option value="day_rate">Day Rate</option>
            </select>
            {errors.billingType && (
              <p className="mt-1 text-sm text-red-600">{errors.billingType.message}</p>
            )}
          </div>

          <Input
            label="Budget / Rate"
            type="number"
            step="0.01"
            {...register('budget')}
            error={errors.budget?.message}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">
              Status
            </label>
            <select {...register('status')} className="input-field">
              <option value="active">Active</option>
              <option value="paused">Paused</option>
              <option value="finished">Finished</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Start Date"
            type="date"
            {...register('startDate')}
            error={errors.startDate?.message}
          />

          <Input
            label="End Date"
            type="date"
            {...register('endDateEstimated')}
            error={errors.endDateEstimated?.message}
          />
        </div>

        <div className="flex justify-end gap-3 pt-4">
          <Button
            type="button"
            variant="secondary"
            onClick={handleClose}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="primary"
            loading={loading}
            disabled={loading}
          >
            {isEditMode ? 'Update Project' : 'Create Project'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}

export default ProjectFormModal;
