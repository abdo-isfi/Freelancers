import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useDispatch, useSelector } from 'react-redux';
import { createNote, updateNote, fetchNotes } from '@/store/notesSlice';
import Modal from '../ui/modal';
import Input from '../Common/Input';
import Button from '../Common/Button';
import toast from 'react-hot-toast';

// Validation schema
const noteSchema = yup.object({
  title: yup.string().required('Title is required'),
  content: yup.string().required('Content is required'),
  color: yup.string().default('#ffffff'),
});

const COLORS = [
  { name: 'White', value: '#ffffff' },
  { name: 'Red', value: '#fee2e2' },
  { name: 'Yellow', value: '#fef3c7' },
  { name: 'Green', value: '#dcfce7' },
  { name: 'Blue', value: '#dbeafe' },
  { name: 'Purple', value: '#f3e8ff' },
];

function NoteFormModal({ isOpen, onClose, note = null }) {
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.notes);
  
  const isEditMode = !!note;

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
    setValue,
  } = useForm({
    resolver: yupResolver(noteSchema),
    defaultValues: note || { color: '#ffffff' },
  });

  const selectedColor = watch('color');

  useEffect(() => {
    if (note) {
      reset(note);
    } else {
      reset({ color: '#ffffff' });
    }
  }, [note, reset]);

  const onSubmit = async (data) => {
    try {
      if (isEditMode) {
        await dispatch(updateNote({ id: note.id, data })).unwrap();
        toast.success('Note updated successfully');
      } else {
        await dispatch(createNote(data)).unwrap();
        toast.success('Note created successfully');
      }
      dispatch(fetchNotes());
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
      title={isEditMode ? 'Edit Note' : 'Add New Note'}
      size="md"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input
          label="Title"
          {...register('title')}
          error={errors.title?.message}
          required
          placeholder="Note title..."
        />

        <div className="space-y-1">
          <label className="block text-sm font-medium text-foreground">
            Content
          </label>
          <textarea
            {...register('content')}
            rows="4"
            className={`w-full rounded-md border bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${
              errors.content ? 'border-red-500' : 'border-input'
            }`}
            placeholder="Write your note here..."
          />
          {errors.content && (
            <p className="text-xs text-red-500">{errors.content.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-foreground">
            Color
          </label>
          <div className="flex gap-2 flex-wrap">
            {COLORS.map((color) => (
              <button
                key={color.value}
                type="button"
                onClick={() => setValue('color', color.value)}
                className={`h-8 w-8 rounded-full border transition-transform hover:scale-110 ${
                  selectedColor === color.value ? 'ring-2 ring-ring ring-offset-2' : ''
                }`}
                style={{ backgroundColor: color.value }}
                title={color.name}
              />
            ))}
          </div>
          <input type="hidden" {...register('color')} />
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
            {isEditMode ? 'Update Note' : 'Create Note'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}

export default NoteFormModal;
