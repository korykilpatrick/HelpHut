import * as React from 'react';
import * as PopoverPrimitive from '@radix-ui/react-popover';
import { Bell } from 'lucide-react';
import { cn } from '../../../core/utils/cn';
import { BaseButton } from '../base/BaseButton';

interface Notification {
  id: string;
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
}

export function NotificationCenter() {
  const [notifications] = React.useState<Notification[]>([
    {
      id: '1',
      title: 'New Donation Request',
      message: 'Food Bank Austin has requested a donation pickup.',
      timestamp: new Date(),
      read: false,
    },
    // Add more notifications as needed
  ]);

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <PopoverPrimitive.Root>
      <PopoverPrimitive.Trigger asChild>
        <BaseButton variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <span className="absolute right-1 top-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] font-medium text-primary-foreground">
              {unreadCount}
            </span>
          )}
          <span className="sr-only">Open notifications</span>
        </BaseButton>
      </PopoverPrimitive.Trigger>
      <PopoverPrimitive.Portal>
        <PopoverPrimitive.Content
          className={cn(
            'z-50 w-80 rounded-md border bg-popover p-4 text-popover-foreground shadow-md outline-none',
            'data-[state=open]:animate-in data-[state=closed]:animate-out',
            'data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0',
            'data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95',
            'data-[side=bottom]:slide-in-from-top-2',
            'data-[side=left]:slide-in-from-right-2',
            'data-[side=right]:slide-in-from-left-2',
            'data-[side=top]:slide-in-from-bottom-2',
          )}
          sideOffset={5}
          align="end"
        >
          <div className="flex flex-col gap-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-semibold">Notifications</h4>
              {unreadCount > 0 && (
                <BaseButton variant="ghost" size="sm" className="text-xs">
                  Mark all as read
                </BaseButton>
              )}
            </div>
            <div className="flex flex-col gap-y-2">
              {notifications.length > 0 ? (
                notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={cn(
                      'rounded-md p-3 text-sm',
                      !notification.read && 'bg-muted'
                    )}
                  >
                    <div className="flex items-start justify-between gap-x-2">
                      <div className="flex-1">
                        <p className="font-medium">{notification.title}</p>
                        <p className="text-muted-foreground">{notification.message}</p>
                      </div>
                      <time className="text-xs text-muted-foreground">
                        {new Intl.RelativeTimeFormat('en', { numeric: 'auto' }).format(
                          -Math.round((Date.now() - notification.timestamp.getTime()) / 60000),
                          'minute'
                        )}
                      </time>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-center text-sm text-muted-foreground">
                  No notifications
                </p>
              )}
            </div>
          </div>
        </PopoverPrimitive.Content>
      </PopoverPrimitive.Portal>
    </PopoverPrimitive.Root>
  );
} 