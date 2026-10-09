"use client";

import type { PersonPreviewItem } from "./types";
import PreviewRow from "./preview-row";

type PeoplePopoutProps = {
  people: PersonPreviewItem[];
};

const COLORS = ["bg-[#E87932]", "bg-[#279E7A]", "bg-[#8B4ED8]", "bg-[#3979E8]"];

const PeoplePopout = ({ people }: PeoplePopoutProps) => (
  <>
    {people.length > 0 ? (
      <div className="flex flex-col gap-3">
        {people.slice(0, 4).map((person, index) => {
          const name =
            person?.name ||
            person?.full_name ||
            person?.username ||
            person?.email ||
            "Organization member";

          return (
            <PreviewRow
              key={person?.id ?? person?.user_id ?? `${name}-${index}`}
              initial={name.trim().charAt(0).toUpperCase()}
              avatarClassName={`flex size-9 shrink-0 items-center justify-center rounded-[9px] text-sm font-semibold text-white ${COLORS[index % COLORS.length]}`}
              title={name}
              titleClassName="truncate text-[13px] font-semibold"
              description={
                person?.role || person?.job_title || "Organization member"
              }
              descriptionClassName="truncate text-xs text-[#5959A8]"
              contentClassName="min-w-0 flex-1"
              trailing={
                <span className="shrink-0 text-xs text-[#5959A8]">
                  {person?.online ? "Active" : "Away"}
                </span>
              }
            />
          );
        })}
      </div>
    ) : (
      <p className="text-sm text-[#667085]">No people to show</p>
    )}
  </>
);

export default PeoplePopout;
