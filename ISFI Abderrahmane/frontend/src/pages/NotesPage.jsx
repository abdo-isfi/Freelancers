import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { PlusIcon, DocumentTextIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline';
import Button from '@/components/Common/Button';
import EmptyState from '@/components/Common/EmptyState';
import { AnimatedText } from '@/components/ui/animated-shiny-text';
import { fetchNotes, deleteNote } from '@/store/notesSlice';
import NoteFormModal from '@/components/Forms/NoteFormModal';
import ConfirmationModal from '@/components/ui/confirmation-modal';
import LoadingSpinner from '@/components/Common/LoadingSpinner';

function NotesPage() {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { items: notes, loading } = useSelector((state) => state.notes);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedNote, setSelectedNote] = useState(null);
  const [deleteConfirmation, setDeleteConfirmation] = useState({
    isOpen: false,
    noteId: null,
  });

  useEffect(() => {
    dispatch(fetchNotes());
  }, [dispatch]);

  const handleAddNote = () => {
    setSelectedNote(null);
    setIsModalOpen(true);
  };

  const handleEditNote = (note) => {
    setSelectedNote(note);
    setIsModalOpen(true);
  };

  const handleDeleteClick = (id) => {
    setDeleteConfirmation({ isOpen: true, noteId: id });
  };

  const handleConfirmDelete = async () => {
    if (deleteConfirmation.noteId) {
      await dispatch(deleteNote(deleteConfirmation.noteId));
      setDeleteConfirmation({ isOpen: false, noteId: null });
    }
  };

  if (loading && notes.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="page-container">
      <div className="mb-[5px] mt-8 flex flex-col gap-4">
        <div className="text-center w-full">
          <AnimatedText 
            text={t('notes')} 
            textClassName="text-5xl font-bold text-foreground"
            className="justify-center py-2"
          />
          <p className="mt-2 text-muted-foreground">{t('organizeYourNotes')}</p>
        </div>
        <div className="w-full flex justify-end">
          <Button variant="primary" onClick={handleAddNote}>
            <PlusIcon className="h-5 w-5 mr-2" />
            {t('addNote')}
          </Button>
        </div>
      </div>

      {notes.length === 0 ? (
        <div className="card">
          <EmptyState
            icon={DocumentTextIcon}
            title={t('noNotesYet')}
            description={t('getStartedFirstNote')}
            action={
              <Button variant="primary" onClick={handleAddNote}>
                <PlusIcon className="h-5 w-5 mr-2" />
                {t('createFirstNote')}
              </Button>
            }
          />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {notes.map((note) => (
            <div
              key={note.id}
              className="rounded-lg border p-4 shadow-sm transition-all hover:shadow-md"
              style={{ backgroundColor: note.color || '#ffffff' }}
            >
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-semibold text-lg text-gray-900">{note.title}</h3>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEditNote(note)}
                    className="p-1 hover:bg-black/5 rounded-full text-gray-600 transition-colors"
                    title={t("edit")}
                  >
                    <PencilIcon className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteClick(note.id)}
                    className="p-1 hover:bg-red-100 rounded-full text-red-500 transition-colors"
                    title={t("delete")}
                  >
                    <TrashIcon className="h-4 w-4" />
                  </button>
                </div>
              </div>
              <div className="text-sm text-gray-700 whitespace-pre-wrap break-words min-h-[100px]">
                {note.content}
              </div>
              <div className="mt-4 text-xs text-gray-500">
                {new Date(note.updatedAt || note.createdAt).toLocaleDateString()}
              </div>
            </div>
          ))}
        </div>
      )}

      <NoteFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        note={selectedNote}
      />

      <ConfirmationModal
        isOpen={deleteConfirmation.isOpen}
        onClose={() => setDeleteConfirmation({ isOpen: false, noteId: null })}
        onConfirm={handleConfirmDelete}
        title={t('deleteNote')}
        message={t('deleteNoteConfirm')}
        confirmText={t('delete')}
        cancelText={t('cancel')}
        variant="danger"
      />
    </div>
  );
}

export default NotesPage;
