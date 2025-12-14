import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { ClockIcon } from '@heroicons/react/24/solid';
import { calculateElapsedTime, formatDuration, isTimerRunning } from '@/utils/timerService';

/**
 * Global Timer Indicator - Shows active timer on all pages
 * Displays in navigation bar with elapsed time and pulsing animation
 */
export default function GlobalTimerIndicator() {
  const navigate = useNavigate();
  const { activeTimer } = useSelector((state) => state.timeEntries);
  const [elapsed, setElapsed] = useState(0);

  // Update elapsed time every second
  useEffect(() => {
    if (!activeTimer || !isTimerRunning(activeTimer)) {
      setElapsed(0);
      return;
    }

    // Initial calculation
    setElapsed(calculateElapsedTime(activeTimer));

    // Update every second
    const interval = setInterval(() => {
      setElapsed(calculateElapsedTime(activeTimer));
    }, 1000);

    return () => clearInterval(interval);
  }, [activeTimer]);

  // Don't show if no active timer
  if (!activeTimer || !isTimerRunning(activeTimer)) {
    return null;
  }

  const handleClick = () => {
    navigate('/time-tracking');
  };

  return (
    <button
      onClick={handleClick}
      className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-green-500/10 dark:bg-green-400/10 border border-green-500/30 dark:border-green-400/30 hover:bg-green-500/20 dark:hover:bg-green-400/20 transition-all group"
      title="Click to view timer"
    >
      {/* Pulsing indicator */}
      <div className="relative">
        <div className="w-2 h-2 bg-green-500 dark:bg-green-400 rounded-full animate-pulse" />
        <div className="absolute inset-0 w-2 h-2 bg-green-500 dark:bg-green-400 rounded-full animate-ping opacity-75" />
      </div>

      {/* Timer icon */}
      <ClockIcon className="w-4 h-4 text-green-600 dark:text-green-400" />

      {/* Elapsed time */}
      <span className="text-sm font-mono font-semibold text-green-700 dark:text-green-300 tabular-nums">
        {formatDuration(elapsed)}
      </span>
    </button>
  );
}
