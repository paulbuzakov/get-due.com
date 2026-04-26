import type { ReactNode } from 'react';
import { InboxIcon } from 'lucide-react';
import Button from './Button';

interface EmptyStateProps {
  icon?: ReactNode;
  title: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
}

export default function EmptyState({ icon, title, description, actionLabel, onAction }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      <div className="mb-4 text-stone-300 dark:text-stone-600">
        {icon || <InboxIcon size={48} />}
      </div>
      <h3 className="text-lg font-medium text-stone-700 dark:text-stone-300 mb-1">{title}</h3>
      {description && <p className="text-sm text-stone-400 dark:text-stone-500 max-w-sm mb-6">{description}</p>}
      {actionLabel && onAction && (
        <Button onClick={onAction} size="md">
          {actionLabel}
        </Button>
      )}
    </div>
  );
}
