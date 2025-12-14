import { useTranslation } from 'react-i18next';
import { ClockIcon, DocumentTextIcon, BriefcaseIcon } from '@heroicons/react/24/outline';

function RecentActivity({ activities = [] }) {
  const { t } = useTranslation();

  const getIcon = (type) => {
    switch (type) {
      case 'time_entry':
        return <ClockIcon className="h-5 w-5 text-blue-500" />;
      case 'invoice':
        return <DocumentTextIcon className="h-5 w-5 text-green-500" />;
      case 'project':
        return <BriefcaseIcon className="h-5 w-5 text-purple-500" />;
      default:
        return <ClockIcon className="h-5 w-5 text-gray-500" />;
    }
  };

  const formatTime = (date) => {
    const now = new Date();
    const activityDate = new Date(date);
    const diffInHours = Math.floor((now - activityDate) / (1000 * 60 * 60));

    if (diffInHours < 1) return t('justNow');
    if (diffInHours < 24) return t('hoursAgo', { count: diffInHours });
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays === 1) return t('yesterday');
    if (diffInDays < 7) return t('daysAgo', { count: diffInDays });
    return activityDate.toLocaleDateString();
  };

  if (activities.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">{t('noRecentActivity')}</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {activities.map((activity, index) => (
        <div key={index} className="flex items-start gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors">
          <div className="mt-0.5">{getIcon(activity.type)}</div>
          <div className="flex-1 min-w-0">
            <p className="text-sm text-foreground font-medium">{activity.title}</p>
            <p className="text-xs text-muted-foreground mt-1">{activity.description}</p>
            <p className="text-xs text-muted-foreground mt-1">{formatTime(activity.timestamp)}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

export default RecentActivity;
