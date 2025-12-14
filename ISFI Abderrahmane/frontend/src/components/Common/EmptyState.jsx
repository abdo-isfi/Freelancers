import { InboxIcon } from '@heroicons/react/24/outline';

/**
 * Empty State Component
 */
function EmptyState({ 
  icon: Icon = InboxIcon,
  title = 'No data',
  description = 'Get started by creating a new item.',
  action 
}) {
  return (
    <div className="text-center py-12">
      <Icon className="mx-auto h-12 w-12 text-muted-foreground" />
      <h3 className="mt-2 text-sm font-medium text-foreground">{title}</h3>
      <p className="mt-1 text-sm text-muted-foreground">{description}</p>
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}

export default EmptyState;
