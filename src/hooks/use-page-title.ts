import { useEffect, useRef } from "react";

// Every page under [org] inherits one static title from its layout, and the
// section layouts are client components, so they can't export their own
// metadata. Set "<Section> | Zedu" from the path instead.
const SECTION_TITLES: Record<string, string> = {
  home: "Home",
  channels: "Channels",
  dm: "DMs",
  dms: "DMs",
  people: "People",
  colleagues: "People",
  files: "Files",
  buzzs: "Buzzes",
  threads: "Threads",
  notifications: "Notifications",
  search: "Search",
  later: "Later",
  settings: "Settings",
};

const getPageTitle = (pathname: string): string | null => {
  // pathname looks like /<org>/<section>/<subsection>/...
  const [, , section, subsection] = pathname.split("/");
  if (!section) return null;

  if (section === "home" && subsection && SECTION_TITLES[subsection]) {
    return `${SECTION_TITLES[subsection]} | Zedu`;
  }

  return SECTION_TITLES[section] ? `${SECTION_TITLES[section]} | Zedu` : null;
};

const usePageTitle = (pathname: string) => {
  const defaultTitle = useRef<string | null>(null);

  useEffect(() => {
    if (defaultTitle.current === null) defaultTitle.current = document.title;
    const title = getPageTitle(pathname) ?? defaultTitle.current;

    // Next.js can add its metadata <title> after this effect runs, so keep
    // every <title> in sync while this page is open.
    const apply = () => {
      document.querySelectorAll("title").forEach((el) => {
        if (el.textContent !== title) el.textContent = title;
      });
    };

    apply();
    const observer = new MutationObserver(apply);
    observer.observe(document.head, {
      childList: true,
      subtree: true,
      characterData: true,
    });

    return () => observer.disconnect();
  }, [pathname]);
};

export default usePageTitle;
