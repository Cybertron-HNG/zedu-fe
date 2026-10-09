"use client";

import Link from "next/link";

type SettingsPopoutProps = {
  orgSlug: string;
};

const SETTINGS_LINKS = [
  ["Account", "account"],
  ["Notifications", "notifications"],
  ["Appearance", "appearance"],
  ["Security", "security"],
];

const SettingsPopout = ({ orgSlug }: SettingsPopoutProps) => (
  <div className="flex flex-col gap-2">
    {SETTINGS_LINKS.map(([label, section]) => (
      <Link
        key={section}
        href={`/${orgSlug}/settings/personal/${section}`}
        className="rounded-md px-2 py-2 text-[13px] font-medium hover:bg-[#F2F4F7]"
      >
        {label}
      </Link>
    ))}
  </div>
);

export default SettingsPopout;
