import type { ReactNode } from "react";

export type SidebarPopoutKey =
  | "dms"
  | "people"
  | "files"
  | "buzz"
  | "notifications"
  | "settings";

export type PreviewStatus = "idle" | "loading" | "loaded" | "error";

export type DmPreviewItem = {
  channel_id?: string | number;
  channels_id?: string | number;
  username?: string;
  participants?: {
    full_name?: string;
    username?: string;
  }[];
  preview_message?: string;
  preview_thread?: {
    message?: string;
  }[];
};

export type PersonPreviewItem = {
  id?: string | number;
  user_id?: string | number;
  name?: string;
  full_name?: string;
  username?: string;
  email?: string;
  role?: string;
  job_title?: string;
  online?: boolean;
};

export type FilePreviewItem = {
  id?: string | number;
  file_name?: string;
  file_type?: string;
};

export type NotificationPreviewItem = {
  id?: string | number;
  title?: string;
  message?: string;
  sent_at?: string;
  created_at?: string;
};

export type BuzzPreviewMember = {
  id?: string | number;
  name?: string;
  username?: string;
  email?: string;
};

export type PopoutContent = {
  title: string;
  action: string;
  content: ReactNode;
};

export type PopoutControls = {
  showPreview: (preview: SidebarPopoutKey, element: HTMLElement) => void;
  schedulePreviewClose: () => void;
};

export type SidebarPopoutProviderProps = {
  children: (controls: PopoutControls) => ReactNode;
  renderPreview: (preview: SidebarPopoutKey) => PopoutContent | null;
  onPreviewChange: (preview: SidebarPopoutKey | null) => void;
};
