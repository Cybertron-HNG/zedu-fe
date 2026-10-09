"use client";

import type { ReactNode } from "react";

type PreviewRowProps = {
  initial: string;
  avatarClassName: string;
  title: string;
  titleClassName: string;
  description: ReactNode;
  descriptionClassName: string;
  contentClassName: string;
  trailing?: ReactNode;
};

const PreviewRow = ({
  initial,
  avatarClassName,
  title,
  titleClassName,
  description,
  descriptionClassName,
  contentClassName,
  trailing,
}: PreviewRowProps) => (
  <div className="flex min-w-0 items-center gap-3">
    <span className={avatarClassName}>{initial}</span>
    <div className={contentClassName}>
      <p className={titleClassName}>{title}</p>
      <p className={descriptionClassName}>{description}</p>
    </div>
    {trailing}
  </div>
);

export default PreviewRow;
