"use client";

import { PhoneCallIcon } from "lucide-react";
import React, { useContext, useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { DataContext } from "~/store/GlobalState";
import { ACTIONS } from "~/store/Actions";
import { GetRequest } from "~/utils/new-request";
import type { OrgBuzz } from "~/types/buzzs";
import {
  BellIcon,
  DMsIcon,
  GearIcon,
  HomeIcon,
  PeopleIcon,
  AgentsIcon,
  FileIcon,
} from "~/svgs";
import ProfileDropdown from "~/app/(client)/[org]/_components/profile-dropdown";
import UseHomeChannel from "~/app/(client)/[org]/home/channels/hooks/home-channels";
import { SidebarPopoutProvider } from "./popouts/popout-wrapper";
import DmPopout from "./popouts/dm-popout";
import PeoplePopout from "./popouts/people-popout";
import FilesPopout from "./popouts/files-popout";
import BuzzPopout from "./popouts/buzz-popout";
import NotificationsPopout from "./popouts/notifications-popout";
import SettingsPopout from "./popouts/settings-popout";
import type {
  FilePreviewItem,
  NotificationPreviewItem,
  PreviewStatus,
  SidebarPopoutKey,
} from "./popouts/types";
import {
  clearNotificationBadgeRegistry,
  isHomeRoute,
  isNotificationsRoute,
} from "~/lib/notifications/notification-badge";

const SideBar: React.FC = () => {
  return <SideBarContent />;
};

const SideBarContent: React.FC = () => {
  const pathname = usePathname();
  const { state, dispatch } = useContext(DataContext);
  const { user, orgSlug, notificationBadgeState } = state;
  const [activePreviewForData, setActivePreviewForData] =
    useState<SidebarPopoutKey | null>(null);
  const [filePreview, setFilePreview] = useState<FilePreviewItem[]>([]);
  const [filePreviewStatus, setFilePreviewStatus] =
    useState<PreviewStatus>("idle");
  const filePreviewOrgId = useRef<string | null>(null);
  const [buzzPreview, setBuzzPreview] = useState<OrgBuzz[]>([]);
  const [buzzPreviewStatus, setBuzzPreviewStatus] =
    useState<PreviewStatus>("idle");
  const buzzPreviewOrgId = useRef<string | null>(null);
  const [notificationPreview, setNotificationPreview] = useState<
    NotificationPreviewItem[]
  >([]);
  const [notificationPreviewStatus, setNotificationPreviewStatus] =
    useState<PreviewStatus>("idle");
  const notificationPreviewOrgId = useRef<string | null>(null);
  const channelId = localStorage.getItem("channelId") || "";
  const notificationBadgeCount = notificationBadgeState?.count ?? 0;

  useEffect(() => {
    if (!isHomeRoute(pathname) && !isNotificationsRoute(pathname)) return;

    clearNotificationBadgeRegistry();
    dispatch({ type: ACTIONS.CLEAR_NOTIFICATION_BADGE });
  }, [pathname, dispatch]);

  useEffect(() => {
    if (activePreviewForData !== "files") return;

    const orgId =
      state?.orgId ||
      (typeof window !== "undefined" ? localStorage.getItem("orgId") : null);
    if (!orgId || filePreviewOrgId.current === orgId) return;

    let cancelled = false;
    const loadFiles = async () => {
      setFilePreviewStatus("loading");

      try {
        const response = await GetRequest("/files?mode=all&page=1&limit=3");
        if (cancelled) return;

        const files = response?.data?.data?.files;
        if (response?.status !== 200 || !Array.isArray(files)) {
          console.error("Failed to load sidebar file preview", response);
          setFilePreviewStatus("error");
          return;
        }

        setFilePreview(files);
        filePreviewOrgId.current = orgId;
        setFilePreviewStatus("loaded");
      } catch (error) {
        if (!cancelled) {
          console.error("Failed to load sidebar file preview:", error);
          setFilePreviewStatus("error");
        }
      }
    };

    void loadFiles();

    return () => {
      cancelled = true;
    };
  }, [activePreviewForData, state?.orgId]);

  useEffect(() => {
    if (activePreviewForData !== "buzz") return;

    const orgId =
      state?.orgId ||
      (typeof window !== "undefined" ? localStorage.getItem("orgId") : null);
    if (!orgId || buzzPreviewOrgId.current === orgId) return;

    let cancelled = false;
    const loadBuzzes = async () => {
      setBuzzPreviewStatus("loading");

      try {
        const response = await GetRequest("/buzz/org/all?page=1&limit=4");
        if (cancelled) return;

        const buzzes = response?.data?.data?.buzzes;
        if (
          (response?.status !== 200 && response?.status !== 201) ||
          !Array.isArray(buzzes)
        ) {
          console.error("Failed to load sidebar buzz preview", response);
          setBuzzPreviewStatus("error");
          return;
        }

        setBuzzPreview(buzzes);
        buzzPreviewOrgId.current = orgId;
        setBuzzPreviewStatus("loaded");
      } catch (error) {
        if (!cancelled) {
          console.error("Failed to load sidebar buzz preview:", error);
          setBuzzPreviewStatus("error");
        }
      }
    };

    void loadBuzzes();

    return () => {
      cancelled = true;
    };
  }, [activePreviewForData, state?.orgId]);

  useEffect(() => {
    if (activePreviewForData !== "notifications") return;

    const orgId =
      state?.orgId ||
      (typeof window !== "undefined" ? localStorage.getItem("orgId") : null);
    if (!orgId || notificationPreviewOrgId.current === orgId) return;

    let cancelled = false;
    const loadNotifications = async () => {
      setNotificationPreviewStatus("loading");

      try {
        const response = await GetRequest(
          `/organisations/${orgId}/users/onesignal?page=1&limit=4`
        );
        if (cancelled) return;

        const notifications = response?.data?.data?.notifications;
        if (
          (response?.status !== 200 && response?.status !== 201) ||
          !Array.isArray(notifications)
        ) {
          console.error(
            "Failed to load sidebar notification preview",
            response
          );
          setNotificationPreviewStatus("error");
          return;
        }

        setNotificationPreview(notifications);
        notificationPreviewOrgId.current = orgId;
        setNotificationPreviewStatus("loaded");
      } catch (error) {
        if (!cancelled) {
          console.error("Failed to load sidebar notification preview:", error);
          setNotificationPreviewStatus("error");
        }
      }
    };

    void loadNotifications();

    return () => {
      cancelled = true;
    };
  }, [activePreviewForData, state?.orgId]);

  // set channel name to empty string
  const searchValue = () => {
    localStorage.setItem("channelName", "");
    dispatch({ type: ACTIONS.OPEN_SIDEBAR, payload: false });
  };

  const renderPreview = (preview: SidebarPopoutKey) => {
    switch (preview) {
      case "dms":
        return {
          title: "Direct messages",
          action: "Unreads",
          content: (
            <DmPopout dms={Array.isArray(state?.dms) ? state.dms : []} />
          ),
        };
      case "people":
        return {
          title: "People",
          action: "Online",
          content: (
            <PeoplePopout
              people={Array.isArray(state?.orgMembers) ? state.orgMembers : []}
            />
          ),
        };
      case "files":
        return {
          title: "Files",
          action: "Recent",
          content: (
            <FilesPopout
              files={filePreview}
              status={filePreviewStatus}
              orgSlug={orgSlug}
            />
          ),
        };
      case "buzz":
        return {
          title: "Buzz",
          action: "Recent",
          content: (
            <BuzzPopout
              buzzes={buzzPreview}
              members={state?.orgMembers || []}
              status={buzzPreviewStatus}
            />
          ),
        };
      case "notifications":
        return {
          title: "Notifications",
          action: `${notificationBadgeCount} unread`,
          content: (
            <NotificationsPopout
              notifications={notificationPreview}
              status={notificationPreviewStatus}
              orgSlug={orgSlug}
            />
          ),
        };
      case "settings":
        return {
          title: "Settings",
          action: "Personal",
          content: <SettingsPopout orgSlug={orgSlug} />,
        };
    }
  };

  //

  return (
    <>
      <UseHomeChannel />
      <SidebarPopoutProvider
        renderPreview={renderPreview}
        onPreviewChange={setActivePreviewForData}
      >
        {({ showPreview, schedulePreviewClose }) => (
          <div
            className={`fixed w-[80px] min-w-[90px] h-screen bg-blue-500 top-[40px] z-30 lg:translate-x-0 transition-transform duration-300 ease-in-out
               ${state?.openSidebar === true ? "translate-x-0" : "-translate-x-full"}`}
          >
            <div
              className="flex h-[calc(100dvh-50px)] mt-4 pt-1 pb-3 justify-center"
              onClick={searchValue}
            >
              <div
                className={`bg-blue-300 h-full rounded-[8px] px-[10px] py-4 flex flex-col items-center overflow-y-auto no-scrollbar`}
              >
                {!pathname.includes(`/${orgSlug}/welcome`) &&
                  !pathname.includes(`/${orgSlug}/invited`) && (
                    <div className="h-full w-full text-[#344054] rounded-[16px] z-auto flex flex-col justify-between">
                      <div className="relative flex flex-col h-full justify-between">
                        <div
                          className="flex flex-col gap-3 md:gap-0.5 items-center text-[12px]"
                          onClick={() =>
                            dispatch({
                              type: ACTIONS.OPEN_SIDEBAR,
                              payload: false,
                            })
                          }
                          onMouseLeave={schedulePreviewClose}
                        >
                          <Link
                            href={
                              channelId
                                ? `/${orgSlug}/home/channels/${channelId}`
                                : `/${orgSlug}`
                            }
                            className={`flex flex-col group items-center justify-center p-1 ${
                              pathname === `/${orgSlug}/home`
                                ? "font-medium scale-[1.05]"
                                : "hover:font-medium "
                            } `}
                          >
                            <span
                              className={` rounded-[7px] p-2 ${
                                pathname === `/${orgSlug}` ||
                                pathname?.includes("/home")
                                  ? "bg-blue-200"
                                  : "group-hover:bg-blue-200"
                              }`}
                            >
                              <HomeIcon />
                            </span>
                            <span className="text-white text-[12px]">Home</span>
                          </Link>

                          <Link
                            href={`/${orgSlug}/dm`}
                            onMouseEnter={(event) =>
                              showPreview("dms", event.currentTarget)
                            }
                            onFocus={(event) =>
                              showPreview("dms", event.currentTarget)
                            }
                            className={`flex flex-col group items-center justify-center p-1 ${
                              pathname === `/${orgSlug}`
                                ? "font-medium scale-[1.05]"
                                : "hover:font-medium "
                            } `}
                          >
                            <span
                              className={` rounded-[7px] p-2 ${
                                pathname?.includes(`/${orgSlug}/dm`)
                                  ? "bg-blue-200"
                                  : "group-hover:bg-blue-200"
                              }`}
                            >
                              <DMsIcon />
                            </span>
                            <span className="text-white  text-[12px]">DMs</span>
                          </Link>

                          <Link
                            href={`/${orgSlug}/people`}
                            onMouseEnter={(event) =>
                              showPreview("people", event.currentTarget)
                            }
                            onFocus={(event) =>
                              showPreview("people", event.currentTarget)
                            }
                            className={`flex flex-col group items-center justify-center p-1 ${
                              pathname?.includes(`/${orgSlug}/people`)
                                ? "font-medium scale-[1.05]"
                                : "hover:font-medium "
                            } `}
                          >
                            <span
                              className={`rounded-[7px] p-2 ${
                                pathname?.includes(`/${orgSlug}/people`)
                                  ? "bg-blue-200"
                                  : "group-hover:bg-blue-200"
                              }`}
                            >
                              <PeopleIcon />
                            </span>
                            <span className="text-white  text-[12px]">
                              People
                            </span>
                          </Link>

                          {/* <Link
                        href={`/${orgSlug}/colleagues`}
                        className={`flex flex-col group items-center justify-center p-1 ${
                          pathname === `/${orgSlug}/colleagues`
                            ? "font-medium scale-[1.05]"
                            : "hover:font-medium "
                        } `}
                      >
                        <span
                          className={` rounded-[7px] p-2 ${
                            pathname?.includes(`/${orgSlug}/colleagues`)
                              ? "bg-blue-200"
                              : "group-hover:bg-blue-200"
                          }`}
                        >
                          <AgentsIcon />
                        </span>
                        <div className="text-white  text-[12px] text-center">
                          Agents
                        </div>
                      </Link> */}

                          {/* <Link
                        href={`/${orgSlug}/later`}
                        className={`flex flex-col group items-center justify-center p-1 ${
                          pathname === `/${orgSlug}/later`
                            ? "font-medium scale-[1.05]"
                            : "hover:font-medium "
                        } `}
                      >
                        <span
                          className={` rounded-[7px] p-2 ${
                            pathname?.includes(`/${orgSlug}/later`)
                              ? "bg-blue-200"
                              : "group-hover:bg-blue-200"
                          }`}
                        >
                          <Bookmark color="white" size={20} />
                        </span>
                        <span className="text-white  text-[12px]">Later</span>
                      </Link> */}

                          <Link
                            href={`/${orgSlug}/files`}
                            onMouseEnter={(event) =>
                              showPreview("files", event.currentTarget)
                            }
                            onFocus={(event) =>
                              showPreview("files", event.currentTarget)
                            }
                            className={`flex flex-col group items-center justify-center p-1 ${
                              pathname === `/${orgSlug}/files`
                                ? "font-medium scale-[1.05]"
                                : "hover:font-medium "
                            } `}
                          >
                            <span
                              className={` rounded-[7px] p-2 block ${
                                pathname?.includes(`/${orgSlug}/files`)
                                  ? "bg-blue-200"
                                  : "group-hover:bg-blue-200"
                              }`}
                            >
                              <FileIcon />
                            </span>
                            <span className="text-white  text-[12px]">
                              Files
                            </span>
                          </Link>

                          <Link
                            href={`/${orgSlug}/buzz`}
                            onMouseEnter={(event) =>
                              showPreview("buzz", event.currentTarget)
                            }
                            onFocus={(event) =>
                              showPreview("buzz", event.currentTarget)
                            }
                            className={`flex flex-col group items-center justify-center p-1 ${
                              pathname === `/${orgSlug}/buzz`
                                ? "font-medium scale-[1.05]"
                                : "hover:font-medium "
                            } `}
                          >
                            <span
                              className={` rounded-[7px] p-2 block ${
                                pathname?.includes(`/${orgSlug}/buzz`)
                                  ? "bg-blue-200"
                                  : "group-hover:bg-blue-200"
                              }`}
                            >
                              <PhoneCallIcon color="white" size={20} />
                            </span>
                            <span className="text-white  text-[12px]">
                              Buzz
                            </span>
                          </Link>
                        </div>

                        <div
                          className="relative flex flex-col items-center overflow-visible"
                          onMouseLeave={schedulePreviewClose}
                        >
                          <Link
                            href={`/${orgSlug}/notifications`}
                            onMouseEnter={(event) =>
                              showPreview("notifications", event.currentTarget)
                            }
                            onFocus={(event) =>
                              showPreview("notifications", event.currentTarget)
                            }
                            className={`flex flex-col group z-50 cursor-pointer items-center justify-center w-full p-1 ${
                              pathname === `/${orgSlug}/notifications`
                                ? "font-medium scale-[1.05]"
                                : "hover:font-medium "
                            } `}
                          >
                            <span
                              className={`relative overflow-visible p-2 rounded-[7px]  ${
                                pathname?.includes(`/${orgSlug}/notifications`)
                                  ? "bg-blue-200"
                                  : "group-hover:bg-blue-200"
                              }`}
                            >
                              <BellIcon />
                              {notificationBadgeCount > 0 && (
                                <span className="pointer-events-none absolute -right-1 -top-1 z-10 flex min-h-[18px] min-w-[18px] items-center justify-center rounded-full border-2 border-blue-300 bg-[#F04438] px-1 text-[10px] font-semibold leading-none text-white">
                                  {notificationBadgeCount > 99
                                    ? "99+"
                                    : notificationBadgeCount}
                                </span>
                              )}
                            </span>
                          </Link>

                          <Link
                            href={`/${orgSlug}/settings/personal/account`}
                            onMouseEnter={(event) =>
                              showPreview("settings", event.currentTarget)
                            }
                            onFocus={(event) =>
                              showPreview("settings", event.currentTarget)
                            }
                            className={`flex flex-col group z-50 cursor-pointer mb-2 items-center justify-center w-full ${
                              pathname === `/${orgSlug}/settings`
                                ? "font-medium scale-[1.05]"
                                : "hover:font-medium "
                            } `}
                          >
                            <span
                              className={`p-2 rounded-[7px]  ${
                                pathname?.includes(`/${orgSlug}/settings`)
                                  ? "bg-blue-200"
                                  : "group-hover:bg-blue-200"
                              }`}
                            >
                              <GearIcon />
                            </span>
                          </Link>

                          <ProfileDropdown user={user} />
                        </div>
                      </div>
                    </div>
                  )}
              </div>
            </div>
          </div>
        )}
      </SidebarPopoutProvider>
    </>
  );
};

export default SideBar;
