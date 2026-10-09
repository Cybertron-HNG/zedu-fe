"use client";

import Link from "next/link";
import type { FilePreviewItem, PreviewStatus } from "./types";
import PreviewRow from "./preview-row";

type FilesPopoutProps = {
  files: FilePreviewItem[];
  status: PreviewStatus;
  orgSlug: string;
};

const COLORS = ["bg-[#3979E8]", "bg-[#D92D70]", "bg-[#3979E8]"];

const FilesPopout = ({ files, status, orgSlug }: FilesPopoutProps) => (
  <>
    {status === "loading" && (
      <p className="text-sm text-[#667085]">Loading files...</p>
    )}
    {status === "error" && (
      <p className="text-sm text-[#B42318]">Unable to load file preview.</p>
    )}
    {status === "loaded" && files.length === 0 && (
      <p className="text-sm text-[#667085]">No recent files</p>
    )}
    {status === "loaded" && files.length > 0 && (
      <div className="flex flex-col gap-3">
        {files.map((file, index) => {
          const name = file.file_name || "Untitled file";

          return (
            <PreviewRow
              key={file.id ?? `${name}-${index}`}
              initial={name.charAt(0).toUpperCase()}
              avatarClassName={`flex size-9 shrink-0 items-center justify-center rounded-[9px] text-sm font-semibold text-white ${COLORS[index % COLORS.length]}`}
              title={name}
              titleClassName="truncate text-[13px] font-semibold"
              description={file.file_type || "File"}
              descriptionClassName="truncate text-xs text-[#5959A8]"
              contentClassName="min-w-0"
            />
          );
        })}
      </div>
    )}
    <Link
      href={`/${orgSlug}/files`}
      className="mt-4 inline-flex text-xs font-medium text-[#5959A8] hover:underline"
    >
      View all files
    </Link>
  </>
);

export default FilesPopout;
