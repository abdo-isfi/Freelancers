import { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { PlayIcon, PauseIcon, StopIcon } from '@heroicons/react/24/solid';
import Button from '../Common/Button';
import Select from '../Common/Select';
import { startTimer, stopTimer, setActiveTimer, clearActiveTimer } from '@/store/timeEntriesSlice';
import { showSuccess, showError } from '@/utils/toast';
import { 
  calculateElapsedTime, 
  formatDuration, 
  isTimerRunning,
  createTimerState,
  pauseTimer,
  resumeTimer,
  saveActiveTimer
} from '@/utils/timerService';

function TimerWidget() {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { activeTimer } = useSelector((state) => state.timeEntries);
  const { items: projects } = useSelector((state) => state.projects);

  const [selectedProject, setSelectedProject] = useState('');
  const [description, setDescription] = useState('');
  const [displayTime, setDisplayTime] = useState(0);
  const intervalRef = useRef(null);

  // Update display time every second if timer is running
  useEffect(() => {
    if (activeTimer && isTimerRunning(activeTimer)) {
      // Initial calculation
      setDisplayTime(calculateElapsedTime(activeTimer));

      // Update every second
      intervalRef.current = setInterval(() => {
        setDisplayTime(calculateElapsedTime(activeTimer));
      }, 1000);
    } else {
      // Timer is paused or stopped
      if (activeTimer) {
        setDisplayTime(calculateElapsedTime(activeTimer));
      } else {
        setDisplayTime(0);
      }
      
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [activeTimer]);

  // Load timer data into form fields when activeTimer changes
  useEffect(() => {
    if (activeTimer) {
      setSelectedProject(activeTimer.projectId?.toString() || '');
      setDescription(activeTimer.description || '');
    }
  }, [activeTimer]);

  const handleStart = async () => {
    if (!selectedProject) {
      showError('Please select a project');
      return;
    }

    try {
      const timerData = {
        projectId: parseInt(selectedProject, 10),
        description,
      };

      const result = await dispatch(startTimer(timerData)).unwrap();
      
      // Create timer state with backend response
      const newTimer = createTimerState({
        id: result.id,
        projectId: parseInt(selectedProject, 10),
        description,
      });
      
      // Save to Redux and localStorage
      dispatch(setActiveTimer(newTimer));
      saveActiveTimer(newTimer);
      
      showSuccess('Timer started');
    } catch (error) {
      showError('Failed to start timer');
    }
  };

  const handlePause = () => {
    if (!activeTimer) return;
    
    const pausedTimer = pauseTimer(activeTimer);
    dispatch(setActiveTimer(pausedTimer));
    saveActiveTimer(pausedTimer);
    showSuccess('Timer paused');
  };

  const handleResume = () => {
    if (!activeTimer) return;
    
    const resumedTimer = resumeTimer(activeTimer);
    dispatch(setActiveTimer(resumedTimer));
    saveActiveTimer(resumedTimer);
    showSuccess('Timer resumed');
  };

  const handleStop = async () => {
    if (!activeTimer) return;

    try {
      await dispatch(stopTimer(activeTimer.id)).unwrap();
      dispatch(clearActiveTimer());
      saveActiveTimer(null);
      setSelectedProject('');
      setDescription('');
      showSuccess('Time entry saved');
    } catch (error) {
      // Check if it's a 404 error (timer not found)
      const is404 = 
        error?.status === 404 || 
        error?.response?.status === 404 ||
        error?.message?.includes('404') ||
        error?.message?.includes('not found');
      
      if (is404) {
        showError('Timer not found. Clearing local timer.');
        dispatch(clearActiveTimer());
        saveActiveTimer(null);
        setSelectedProject('');
        setDescription('');
      } else {
        showError('Failed to stop timer');
      }
    }
  };

  const projectOptions = projects.map((project) => ({
    value: project.id.toString(),
    label: project.name,
  }));

  return (
    <div className="card">
      <div className="text-center mb-6">
        <h2 className="text-6xl font-bold text-foreground mb-2 font-mono">
          {formatDuration(displayTime)}
        </h2>
        <p className="text-muted-foreground">
          {activeTimer && isTimerRunning(activeTimer) ? 'Timer running...' : activeTimer ? 'Timer paused' : t('noActiveTimer')}
        </p>
      </div>

      {!activeTimer ? (
        <div className="space-y-4">
          <Select
            label={t('project')}
            value={selectedProject}
            onChange={(e) => setSelectedProject(e.target.value)}
            options={projectOptions}
            placeholder={t('selectProject')}
          />
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              {t('descriptionOptional')}
            </label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder={t('whatAreYouWorkingOn')}
              className="w-full px-4 py-2.5 rounded-lg border border-border bg-background text-foreground focus:border-primary focus:ring-2 focus:ring-primary/20"
            />
          </div>
          <Button variant="primary" size="lg" onClick={handleStart} className="w-full">
            <PlayIcon className="h-6 w-6 mr-2" />
            {t('startTimer')}
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          <div>
            <p className="text-sm text-muted-foreground">Project</p>
            <p className="text-foreground font-medium">
              {projects.find((p) => p.id === parseInt(selectedProject))?.name || 'Unknown'}
            </p>
          </div>
          {description && (
            <div>
              <p className="text-sm text-muted-foreground">Description</p>
              <p className="text-foreground">{description}</p>
            </div>
          )}
          <div className="flex gap-3">
            {isTimerRunning(activeTimer) ? (
              <Button variant="secondary" size="lg" onClick={handlePause} className="flex-1">
                <PauseIcon className="h-6 w-6 mr-2" />
                Pause
              </Button>
            ) : (
              <Button variant="primary" size="lg" onClick={handleResume} className="flex-1">
                <PlayIcon className="h-6 w-6 mr-2" />
                Resume
              </Button>
            )}
            <Button variant="danger" size="lg" onClick={handleStop} className="flex-1">
              <StopIcon className="h-6 w-6 mr-2" />
              Stop & Save
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

export default TimerWidget;
