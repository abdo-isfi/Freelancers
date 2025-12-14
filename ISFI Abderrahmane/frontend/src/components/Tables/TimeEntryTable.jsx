import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { PencilIcon, TrashIcon, ClockIcon } from '@heroicons/react/24/outline';
import Button from '../Common/Button';
import EmptyState from '../Common/EmptyState';
import { deleteTimeEntry } from '@/store/timeEntriesSlice';
import { showSuccess, showError } from '@/utils/toast';
import { useConfirm } from '@/hooks/useConfirm.jsx';
import { formatDuration } from '@/utils/formatTime';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

function TimeEntryTable({ entries = [], onEdit }) {
  const dispatch = useDispatch();
  const { items: projects } = useSelector((state) => state.projects);
  const { confirm, ConfirmDialog } = useConfirm();

  const handleDelete = async (id) => {
    const confirmed = await confirm({
      title: 'Delete Time Entry',
      message: 'Are you sure you want to delete this time entry? This action cannot be undone.',
      confirmText: 'Delete',
      cancelText: 'Cancel',
      variant: 'danger'
    });

    if (confirmed) {
      try {
        await dispatch(deleteTimeEntry(id)).unwrap();
        showSuccess('Time entry deleted');
      } catch (error) {
        showError('Failed to delete time entry');
      }
    }
  };

  const getProjectName = (projectId) => {
    const project = projects.find((p) => p.id === projectId);
    return project?.name || 'Unknown Project';
  };

  if (entries.length === 0) {
    return (
      <EmptyState
        icon={ClockIcon}
        title="No time entries yet"
        description="Start tracking time or add a manual entry to see your records here."
      />
    );
  }

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Date</TableHead>
            <TableHead>Project</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Duration</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {entries.map((entry) => (
            <TableRow key={entry.id}>
              <TableCell>{new Date(entry.date).toLocaleDateString()}</TableCell>
              <TableCell>{getProjectName(entry.projectId)}</TableCell>
              <TableCell className="text-muted-foreground">
                {entry.description || 'No description'}
              </TableCell>
              <TableCell className="text-medium">
                <div className="flex items-center">
                  <ClockIcon className="h-4 w-4 mr-1 text-muted-foreground" />
                  {formatDuration(entry.durationMinutes)}
                </div>
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <button
                    onClick={() => onEdit && onEdit(entry)}
                    className="p-1 rounded-md text-muted-foreground hover:text-primary hover:bg-muted transition-colors"
                    title="Edit"
                  >
                    <PencilIcon className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => handleDelete(entry.id)}
                    className="p-1 rounded-md text-muted-foreground hover:text-destructive hover:bg-muted transition-colors"
                    title="Delete"
                  >
                    <TrashIcon className="h-5 w-5" />
                  </button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <ConfirmDialog />
    </>
  );
}

export default TimeEntryTable;
