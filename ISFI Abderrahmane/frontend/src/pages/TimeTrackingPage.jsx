import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { PlusIcon } from "@heroicons/react/24/outline";
import Button from "@/components/Common/Button";
import Modal from "@/components/Common/Modal";
import TimerWidget from "@/components/Widgets/TimerWidget";
import TimeEntryForm from "@/components/Forms/TimeEntryForm";
import TimeEntryTable from "@/components/Tables/TimeEntryTable";
import Select from "@/components/Common/Select";
import { fetchTimeEntries } from "@/store/timeEntriesSlice";
import { fetchProjects } from "@/store/projectsSlice";
import { fetchTasks } from "@/store/tasksSlice";
import { AnimatedText } from "@/components/ui/animated-shiny-text";
import { formatDecimalHours } from "@/utils/formatTime";

function TimeTrackingPage() {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filterProject, setFilterProject] = useState("");

  const { items: timeEntries, loading } = useSelector(
    (state) => state.timeEntries
  );
  const { items: projects } = useSelector((state) => state.projects);

  const [selectedViewEntry, setSelectedViewEntry] = useState(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [entryToEdit, setEntryToEdit] = useState(null);

  useEffect(() => {
    dispatch(fetchTimeEntries());
    dispatch(fetchProjects());
    dispatch(fetchTasks());
  }, [dispatch]);

  const projectOptions = [
    { value: "", label: t("allProjects") || "All Projects" },
    ...projects.map((project) => ({
      value: project.id.toString(),
      label: project.name,
    })),
  ];

  const filteredEntries = filterProject
    ? timeEntries.filter((entry) => entry.projectId === parseInt(filterProject))
    : timeEntries;

  // Calculate statistics
  const calculateTotalHours = (entries) => {
    return entries.reduce((sum, entry) => {
      const minutes = parseFloat(entry.durationMinutes || 0);
      return sum + minutes / 60;
    }, 0);
  };

  const totalHours = calculateTotalHours(filteredEntries);

  const thisWeekHours = calculateTotalHours(
    timeEntries.filter((entry) => {
      const entryDate = new Date(entry.date);
      const today = new Date();
      const firstDayOfWeek = new Date(
        today.setDate(today.getDate() - today.getDay())
      ); // Sunday
      firstDayOfWeek.setHours(0, 0, 0, 0);
      return entryDate >= firstDayOfWeek;
    })
  );

  // Calculate unique days with entries to get better average
  const uniqueDays = new Set(
    filteredEntries.map((e) => new Date(e.date).toDateString())
  ).size;
  const averagePerDay = uniqueDays > 0 ? totalHours / uniqueDays : 0;

  const handleViewEntry = (entry) => {
    setSelectedViewEntry(entry);
    setIsViewModalOpen(true);
  };

  const handleEditEntry = (entry) => {
    setEntryToEdit(entry);
    setIsModalOpen(true);
  };

  const handleAddNew = () => {
    setEntryToEdit(null);
    setIsModalOpen(true);
  };

  return (
    <div className="page-container">
      <div className="mb-[5px] mt-8 flex flex-col gap-4">
        <div className="text-center w-full">
          <AnimatedText
            text={t("timeTracking")}
            textClassName="text-5xl font-bold text-foreground"
            className="justify-center py-2"
          />
          <p className="mt-2 text-muted-foreground">{t("trackYourTime")}</p>
        </div>
        <div className="w-full flex justify-end">
          <Button variant="primary" onClick={handleAddNew}>
            <PlusIcon className="h-5 w-5 mr-2" />
            {t("addTimeEntry")}
          </Button>
        </div>
      </div>

      {/* Timer Widget */}
      <div className="mb-6">
        <TimerWidget />
      </div>

      {/* Stats */}
      <div className="stats-grid mb-6">
        <div className="card">
          <p className="text-sm text-muted-foreground">{t("total")} Entries</p>
          <p className="mt-1 text-2xl font-semibold text-foreground">
            {filteredEntries.length}
          </p>
        </div>
        <div className="card">
          <p className="text-sm text-muted-foreground">
            {t("total")} {t("hours")}
          </p>
          <p className="mt-1 text-2xl font-semibold text-foreground">
            {formatDecimalHours(totalHours)}
          </p>
        </div>
        <div className="card">
          <p className="text-sm text-muted-foreground">{t("thisWeek")}</p>
          <p className="mt-1 text-2xl font-semibold text-foreground">
            {formatDecimalHours(thisWeekHours)}
          </p>
        </div>
        <div className="card">
          <p className="text-sm text-muted-foreground">{t("averagePerDay")}</p>
          <p className="mt-1 text-2xl font-semibold text-foreground">
            {formatDecimalHours(averagePerDay)}
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="card mb-6">
        <div className="flex items-center gap-4">
          <div className="flex-1">
            <Select
              label={t("filterByProject")}
              value={filterProject}
              onChange={(e) => setFilterProject(e.target.value)}
              options={projectOptions}
            />
          </div>
          {filterProject && (
            <Button
              variant="ghost"
              onClick={() => setFilterProject("")}
              className="mt-7"
            >
              {t("clearFilters")}
            </Button>
          )}
        </div>
      </div>

      {/* Time Entries Table */}
      <div className="card">
        <h2 className="text-lg font-semibold text-foreground mb-4">
          {t("timeEntries")}
        </h2>
        <TimeEntryTable 
            entries={filteredEntries} 
            onView={handleViewEntry}
            onEdit={handleEditEntry}
        />
      </div>

      {/* Manual Entry Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={entryToEdit ? "Edit Time Entry" : "Add Manual Time Entry"}
        size="lg"
      >
        <TimeEntryForm 
            onSuccess={() => setIsModalOpen(false)} 
            initialData={entryToEdit}
        />
      </Modal>

      {/* View Entry Details Modal */}
      <Modal
        isOpen={isViewModalOpen}
        onClose={() => setIsViewModalOpen(false)}
        title="Time Entry Details"
        size="md"
      >
        {selectedViewEntry && (
          <div className="space-y-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Project</p>
              <p className="text-lg font-semibold text-foreground">
                {projects.find((p) => p.id === selectedViewEntry.projectId)?.name || "Unknown Project"}
              </p>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
               <div>
                  <p className="text-sm font-medium text-muted-foreground">Date</p>
                  <p className="text-foreground">{new Date(selectedViewEntry.date).toLocaleDateString()}</p>
               </div>
               <div>
                  <p className="text-sm font-medium text-muted-foreground">Duration</p>
                  <p className="text-foreground font-semibold">{formatDecimalHours(selectedViewEntry.duration || selectedViewEntry.durationMinutes / 60)}</p>
               </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
               <div>
                  <p className="text-sm font-medium text-muted-foreground">Start Time</p>
                  <p className="text-foreground">{selectedViewEntry.startTime || '-'}</p>
               </div>
               <div>
                  <p className="text-sm font-medium text-muted-foreground">End Time</p>
                  <p className="text-foreground">{selectedViewEntry.endTime || '-'}</p>
               </div>
            </div>

            <div>
              <p className="text-sm font-medium text-muted-foreground">Description</p>
              <p className="text-foreground whitespace-pre-wrap">
                {selectedViewEntry.description || "No description provided."}
              </p>
            </div>
            
            <div className="flex justify-end pt-4">
                <Button variant="secondary" onClick={() => setIsViewModalOpen(false)}>
                    Close
                </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}

export default TimeTrackingPage;
