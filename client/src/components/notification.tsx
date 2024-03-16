"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { BellIcon, EyeIcon } from "@heroicons/react/24/outline";
import { useNotificationStore } from "@/store/useNotificationStore";
import { useAuthStore } from "@/store/useAuthStore";
import { useEffect } from "react";

import dayjs from "dayjs";
import timezone from "dayjs/plugin/timezone.js";
import utc from "dayjs/plugin/utc.js";
import relativeTime from "dayjs/plugin/relativeTime.js";
dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(relativeTime);

export function Notification() {
  const { fetchNotifications, notifications, markAsRead, markAsReadAll } =
    useNotificationStore();
  const { user } = useAuthStore();
  useEffect(() => {
    if (!user) return;
    fetchNotifications();
  }, [user]);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="dark:hover:bg-slate-700">
          <BellIcon className="h-[1.2rem] w-[1.2rem]  transition-all dark:rotate-0 dark:scale-100 dark:text-slate-200" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="m-0 flex w-80 flex-col gap-1"
        align="end"
        forceMount
      >
        <DropdownMenuLabel className="flex items-center justify-between px-3 py-3">
          <h4 className="text- scroll-m-20 font-semibold tracking-tight">
            Notifications
          </h4>{" "}
          <Button onClick={markAsReadAll}>Read all</Button>
        </DropdownMenuLabel>

        {notifications.length === 0 ? <p>No notifications</p> : null}
        {notifications.map((notification) => (
          <DropdownMenuItem
            key={notification.id}
            className={`m-0 flex items-start justify-between p-2 ${
              !notification.is_read ? "bg-primary" : "dark:bg-slate-700"
            } `}
          >
            <div className="flex flex-col">
              <p
                className={`text-sm font-medium ${
                  !notification.is_read ? "dark:text-background" : ""
                }`}
              >
                {notification.text}
              </p>
              <p
                className={`text-xs leading-none text-muted-foreground ${
                  !notification.is_read ? "text-slate-700" : ""
                }`}
              >
                {dayjs(notification.created_at).fromNow()}
              </p>
            </div>
            <Button
              variant="outline"
              className="p-3"
              onClick={() => {
                markAsRead(notification.id);
              }}
            >
              <EyeIcon className="h-4 w-4" />
            </Button>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
