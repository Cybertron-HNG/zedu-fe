"use client";

import { stripHtmlTags } from "~/utils/utils";
import type { DmPreviewItem } from "./types";
import PreviewRow from "./preview-row";

type DmPopoutProps = {
  dms: DmPreviewItem[];
};

const COLORS = ["bg-[#E87932]", "bg-[#279E7A]", "bg-[#8B4ED8]", "bg-[#3979E8]"];

const DmPopout = ({ dms }: DmPopoutProps) => (
  <>
    {dms.length > 0 ? (
      <div className="flex flex-col gap-3">
        {dms.slice(0, 4).map((dm, index) => {
          const name =
            dm?.username ||
            dm?.participants?.[0]?.full_name ||
            dm?.participants?.[0]?.username ||
            "Direct message";
          const message =
            dm?.preview_message ||
            dm?.preview_thread?.[0]?.message ||
            "No recent message";

          return (
            <PreviewRow
              key={dm?.channel_id ?? dm?.channels_id ?? `${name}-${index}`}
              initial={name.trim().charAt(0).toUpperCase()}
              avatarClassName={`flex size-9 shrink-0 items-center justify-center rounded-[9px] text-sm font-semibold text-white ${COLORS[index % COLORS.length]}`}
              title={name}
              titleClassName="truncate text-[13px] font-semibold"
              description={stripHtmlTags(String(message))}
              descriptionClassName="truncate text-xs text-[#5959A8]"
              contentClassName="min-w-0"
            />
          );
        })}
      </div>
    ) : (
      <p className="text-sm text-[#667085]">No recent messages</p>
    )}
  </>
);

export default DmPopout;
