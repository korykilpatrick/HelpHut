import * as React from 'react';
import { Bell } from 'lucide-react';
import { BaseDropdown, DropdownHeader, DropdownSection, DropdownItem } from '../base/BaseDropdown';
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

  const trigger = (
    <BaseButton variant="ghost" size="icon" className="relative">
      <Bell className="h-5 w-5" />
      {unreadCount > 0 && (
        <span className="absolute right-1 top-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] font-medium text-primary-foreground">
          {unreadCount}
        </span>
      )}
      <span className="sr-only">Open notifications</span>
    </BaseButton>
  );

  return (
    <BaseDropdown trigger={trigger}>
      <DropdownHeader className="justify-between">
        <span className="text-sm font-semibold text-gray-900">Notifications</span>
        {unreadCount > 0 && (
          <span className="text-xs font-medium text-primary">{unreadCount} new</span>
        )}
      </DropdownHeader>
      <DropdownSection>
        {notifications.length === 0 ? (
          <div className="py-4 text-center text-sm text-gray-500">
            No notifications
          </div>
        ) : (
          notifications.map((notification) => (
            <DropdownItem key={notification.id} className="flex flex-col items-start gap-1">
              <div className="flex items-center gap-x-2">
                <span className="font-medium">{notification.title}</span>
                {!notification.read && (
                  <span className="h-2 w-2 rounded-full bg-primary" />
                )}
              </div>
              <p className="text-xs text-gray-500">{notification.message}</p>
            </DropdownItem>
          ))
        )}
      </DropdownSection>
    </BaseDropdown>
  );
} 