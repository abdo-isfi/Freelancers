import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Select from '../Common/Select';
import Button from '../Common/Button';
import { createTimeEntry, updateTimeEntry } from '@/store/timeEntriesSlice';
import { showSuccess, showError } from '@/utils/toast';
import { formatDecimalHours } from '@/utils/formatTime';

function TimeEntryForm({ onSuccess, initialData }) {
  const dispatch = useDispatch();
  const { items: projects } = useSelector((state) => state.projects);
  const { items: tasks } = useSelector((state) => state.tasks);

  const [formData, setFormData] = useState({
    projectId: '',
    taskId: '',
    date: new Date().toISOString().split('T')[0],
    startTime: '',
    endTime: '',
    description: '',
  });

  const [errors, setErrors] = useState({});

  // Helper to extract time in HH:mm format from various formats
  const extractTime = (timeValue) => {
    if (!timeValue) return '';
    // If it's already in HH:mm format, return as-is
    if (/^\d{2}:\d{2}(:\d{2})?$/.test(timeValue)) {
      return timeValue.substring(0, 5); // Return HH:mm only
    }
    // If it's an ISO datetime string, extract the time portion
    if (timeValue.includes('T')) {
      const timePart = timeValue.split('T')[1];
      return timePart ? timePart.substring(0, 5) : '';
    }
    return timeValue;
  };

  useEffect(() => {
    if (initialData) {
      setFormData({
        projectId: initialData.projectId?.toString() || '',
        taskId: initialData.taskId?.toString() || '',
        date: initialData.date ? new Date(initialData.date).toISOString().split('T')[0] : '',
        startTime: extractTime(initialData.startTime),
        endTime: extractTime(initialData.endTime),
        description: initialData.description || '',
      });
    } else {
        // Reset if no initialData (for adding new)
        setFormData({
            projectId: '',
            taskId: '',
            date: new Date().toISOString().split('T')[0],
            startTime: '',
            endTime: '',
            description: '',
        });
    }
  }, [initialData]);

  const projectOptions = projects.map((project) => ({
    value: project.id.toString(),
    label: project.name,
  }));

  const taskOptions = tasks
    .filter((task) => !formData.projectId || task.projectId === parseInt(formData.projectId))
    .map((task) => ({
      value: task.id.toString(),
      label: task.title,
    }));

  const calculateDuration = () => {
    if (!formData.startTime || !formData.endTime) return 0;

    const start = new Date(`${formData.date}T${formData.startTime}`);
    const end = new Date(`${formData.date}T${formData.endTime}`);
    const diffMs = end - start;
    const diffHours = diffMs / (1000 * 60 * 60);

    return diffHours > 0 ? diffHours : 0;
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.projectId) newErrors.projectId = 'Project is required';
    if (!formData.date) newErrors.date = 'Date is required';
    if (!formData.startTime) newErrors.startTime = 'Start time is required';
    if (!formData.endTime) newErrors.endTime = 'End time is required';

    const duration = calculateDuration();
    if (duration <= 0) {
      newErrors.endTime = 'End time must be after start time';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) return;

    try {
      const duration = calculateDuration();
      const entryData = {
        projectId: parseInt(formData.projectId),
        taskId: formData.taskId ? parseInt(formData.taskId) : null,
        date: formData.date,
        startTime: formData.startTime,
        endTime: formData.endTime,
        duration,
        description: formData.description,
      };

      if (initialData?.id) {
        await dispatch(updateTimeEntry({ id: initialData.id, data: entryData })).unwrap();
        showSuccess('Time entry updated');
      } else {
        await dispatch(createTimeEntry(entryData)).unwrap();
        showSuccess('Time entry created');
      }

      // Reset form if not editing (or just close modal via onSuccess)
      if (!initialData) {
        setFormData({
            projectId: '',
            taskId: '',
            date: new Date().toISOString().split('T')[0],
            startTime: '',
            endTime: '',
            description: '',
        });
      }

      if (onSuccess) onSuccess();
    } catch (error) {
      showError(initialData?.id ? 'Failed to update time entry' : 'Failed to create time entry');
    }
  };

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: '' }));
    }
  };

  const duration = calculateDuration();

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Select
        label="Project *"
        value={formData.projectId}
        onChange={(e) => handleChange('projectId', e.target.value)}
        options={projectOptions}
        placeholder="Select a project"
        error={errors.projectId}
      />

      <Select
        label="Task (optional)"
        value={formData.taskId}
        onChange={(e) => handleChange('taskId', e.target.value)}
        options={taskOptions}
        placeholder="Select a task"
        disabled={!formData.projectId}
      />

      <div>
        <label className="block text-sm font-medium text-foreground mb-2">
          Date *
        </label>
        <input
          type="date"
          value={formData.date}
          onChange={(e) => handleChange('date', e.target.value)}
          className={`w-full px-4 py-2.5 rounded-lg border bg-background text-foreground ${
            errors.date ? 'border-red-500' : 'border-border'
          } focus:border-primary focus:ring-2 focus:ring-primary/20`}
        />
        {errors.date && <p className="mt-1.5 text-sm text-red-500">{errors.date}</p>}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Start Time *
          </label>
          <input
            type="time"
            value={formData.startTime}
            onChange={(e) => handleChange('startTime', e.target.value)}
            className={`w-full px-4 py-2.5 rounded-lg border bg-background text-foreground ${
              errors.startTime ? 'border-red-500' : 'border-border'
            } focus:border-primary focus:ring-2 focus:ring-primary/20`}
          />
          {errors.startTime && <p className="mt-1.5 text-sm text-red-500">{errors.startTime}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            End Time *
          </label>
          <input
            type="time"
            value={formData.endTime}
            onChange={(e) => handleChange('endTime', e.target.value)}
            className={`w-full px-4 py-2.5 rounded-lg border bg-background text-foreground ${
              errors.endTime ? 'border-red-500' : 'border-border'
            } focus:border-primary focus:ring-2 focus:ring-primary/20`}
          />
          {errors.endTime && <p className="mt-1.5 text-sm text-red-500">{errors.endTime}</p>}
        </div>
      </div>

      {duration > 0 && (
        <div className="p-3 bg-muted rounded-lg">
          <p className="text-sm text-muted-foreground">
            Duration: <span className="font-semibold text-foreground">{formatDecimalHours(duration)}</span>
          </p>
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-foreground mb-2">
          Description (optional)
        </label>
        <textarea
          value={formData.description}
          onChange={(e) => handleChange('description', e.target.value)}
          placeholder="What did you work on?"
          rows={3}
          className="w-full px-4 py-2.5 rounded-lg border border-border bg-background text-foreground focus:border-primary focus:ring-2 focus:ring-primary/20"
        />
      </div>

      <Button type="submit" variant="primary" className="w-full">
        Add Time Entry
      </Button>
    </form>
  );
}

export default TimeEntryForm;
