"use client";

import Link from "next/link";
import moment from "moment";
import type { NotificationPreviewItem, PreviewStatus } from "./types";

type NotificationsPopoutProps = {
  notifications: NotificationPreviewItem[];
  status: PreviewStatus;
  orgSlug: string;
};

const NotificationsPopout = ({
  notifications,
  status,
  orgSlug,
}: NotificationsPopoutProps) => (
  <>
    {status === "loading" && (
      <p className="text-sm text-[#667085]">Loading notifications...</p>
    )}
    {status === "error" && (
      <p className="text-sm text-[#B42318]">
        Unable to load notification preview.
      </p>
    )}
    {status === "loaded" && notifications.length === 0 && (
      <p className="text-sm text-[#667085]">No recent notifications</p>
    )}
    {status === "loaded" && notifications.length > 0 && (
      <div className="flex flex-col gap-3">
        {notifications.map((notification, index) => (
          <div
            key={notification.id ?? `${notification.title}-${index}`}
            className="flex min-w-0 items-start gap-3"
          >
            <span className="flex size-9 shrink-0 items-center justify-center rounded-[9px] bg-[#5F5FE1] text-sm font-semibold text-white">
              {(notification.title || "N").charAt(0).toUpperCase()}
            </span>
            <div className="min-w-0 flex-1">
              <p className="truncate text-[13px] font-semibold">
                {notification.title || "Notification"}
              </p>
              <p className="line-clamp-2 text-xs text-[#5959A8]">
                {notification.message || ""}
              </p>
            </div>
            <span className="shrink-0 text-[11px] text-[#5959A8]">
              {moment(
                notification.sent_at || notification.created_at
              ).fromNow()}
            </span>
          </div>
        ))}
      </div>
    )}
    <Link
      href={`/${orgSlug}/notifications`}
      className="mt-4 inline-flex text-xs font-medium text-[#5959A8] hover:underline"
    >
      View all notifications
    </Link>
  </>
);

export default NotificationsPopout;
