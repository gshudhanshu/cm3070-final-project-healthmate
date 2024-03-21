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
import { ScrollArea } from "@/components/ui/scroll-area";

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
        <Button
          variant="ghost"
          size="icon"
          className="relative dark:hover:bg-slate-700"
        >
          <BellIcon className="h-[1.2rem]  w-[1.2rem] transition-all dark:rotate-0 dark:scale-100 dark:text-slate-200" />
          {notifications.length > 0 && (
            <span className="absolute flex w-2 h-2 px-1 text-xs font-semibold text-white rounded-full right-1 top-1 bg-primary"></span>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="flex flex-col gap-1 m-0 w-80"
        align="end"
        forceMount
      >
        <ScrollArea className="w-full border rounded-md h-80">
          <DropdownMenuLabel className="flex items-center justify-between px-3 py-3">
            <h4 className="font-semibold tracking-tight">Notifications</h4>

            {notifications.length > 0 && (
              <Button onClick={() => markAsReadAll()}>Read all</Button>
            )}
          </DropdownMenuLabel>

          {notifications.length === 0 ? (
            <p className="pl-2">No notifications</p>
          ) : null}
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
                <EyeIcon className="w-4 h-4" />
              </Button>
            </DropdownMenuItem>
          ))}
        </ScrollArea>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
