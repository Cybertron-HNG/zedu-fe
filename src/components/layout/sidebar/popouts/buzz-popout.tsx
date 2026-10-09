"use client";

import { PhoneCallIcon } from "lucide-react";
import moment from "moment";
import {
  getBuzzTitle,
  isBuzzActive,
} from "~/app/(client)/[org]/_components/buzzs/buzz-utils";
import type { OrgBuzz } from "~/types/buzzs";
import type { BuzzPreviewMember, PreviewStatus } from "./types";

type BuzzPopoutProps = {
  buzzes: OrgBuzz[];
  members: BuzzPreviewMember[];
  status: PreviewStatus;
};

const BuzzPopout = ({ buzzes, members, status }: BuzzPopoutProps) => (
  <>
    {status === "loading" && (
      <p className="text-sm text-[#667085]">Loading buzzs...</p>
    )}
    {status === "error" && (
      <p className="text-sm text-[#B42318]">Unable to load buzz preview.</p>
    )}
    {status === "loaded" && buzzes.length === 0 && (
      <p className="text-sm text-[#667085]">No recent buzzs</p>
    )}
    {status === "loaded" && buzzes.length > 0 && (
      <div className="flex flex-col gap-3">
        {buzzes.map((buzz) => {
          const host = members.find((member) => member.id === buzz.host_id);
          const hostName =
            host?.name ||
            host?.username ||
            host?.email?.split("@")[0] ||
            "Someone";
          const active = isBuzzActive(buzz);

          return (
            <div key={buzz.buzz_id} className="flex min-w-0 items-center gap-3">
              <span
                className={`flex size-9 shrink-0 items-center justify-center rounded-[9px] text-sm font-semibold ${active ? "bg-[#ECFDF3] text-[#067647]" : "bg-[#F2F4F7] text-[#667085]"}`}
              >
                <PhoneCallIcon size={17} />
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-[13px] font-semibold">
                  {getBuzzTitle(buzz, hostName)}
                </p>
                <p className="truncate text-xs text-[#5959A8]">
                  {active ? "Live now" : "Ended"} ·{" "}
                  {moment(buzz.started_at || buzz.created_at).fromNow()}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    )}
  </>
);

export default BuzzPopout;
