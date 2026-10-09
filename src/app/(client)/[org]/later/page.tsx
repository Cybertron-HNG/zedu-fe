"use client";

import React, { useContext, useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { DataContext } from "~/store/GlobalState";
import { ACTIONS } from "~/store/Actions";
import { DeleteSavedMessage, GetRequest } from "~/utils/new-request";
import { Bookmark, Search } from "lucide-react";
import { showInfo } from "~/components/toast/sonner";
import { buildMessageLink } from "~/utils/message-link";

const Later = () => {
  const { state, dispatch } = useContext(DataContext);
  const { orgSlug, bookmarks } = state;
  const router = useRouter();

  const [savedMessages, setSavedMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchSaved = async () => {
      const orgId = localStorage.getItem("orgId") || "";
      if (!orgId) {
        setLoading(false);
        return;
      }
      try {
        const res = await GetRequest(`/organisations/${orgId}/saved/message`);
        if (res?.status === 200 || res?.status === 201) {
          const data = res?.data?.data;
          const list = Array.isArray(data)
            ? data
            : data?.messages || data?.data || [];
          setSavedMessages(list);
        }
      } catch (err) {
        // fall through to empty state
      } finally {
        setLoading(false);
      }
    };
    fetchSaved();
  }, []);

  const handleOpenMessage = (item: any) => {
    const channelId =
      item?.channel_id || item?.channels_id || item?.channel?.id;
    const threadId = item?.thread_id;
    const messageId = item?.message_id || item?.id;

    if (!channelId || !threadId) return;

    const link = buildMessageLink({
      orgSlug,
      channelId,
      threadId,
      messageId,
      context: "channel",
    });

    const path = link.replace(window.location.origin, "");
    router.push(path);
  };

  const handleUnsave = async (e: React.MouseEvent, item: any) => {
    e.stopPropagation();
    const orgId = localStorage.getItem("orgId") || "";
    const smId = item?.id;
    const threadId = item?.thread_id;

    if (!orgId || !smId) return;

    setSavedMessages((prev) => prev.filter((m) => m?.id !== smId));

    const updatedBookmarks = (bookmarks || []).filter(
      (b: any) => b.thread_id !== threadId
    );
    dispatch({ type: ACTIONS.BOOKMARKS, payload: updatedBookmarks });

    const res = await DeleteSavedMessage(
      `/organisations/${orgId}/saved/message/${smId}`
    );

    if (res?.status === 200 || res?.status === 201) {
      showInfo("Removed from Saved");
    } else {
      showInfo("Failed to remove. Please try again.");
      setSavedMessages((prev) => [item, ...prev]);
    }
  };

  const filtered = savedMessages.filter((item: any) => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    const text = (item?.message || item?.content || "").toLowerCase();
    const user = (item?.username || item?.user?.username || "").toLowerCase();
    const channel = (
      item?.channel_name ||
      item?.channel?.name ||
      ""
    ).toLowerCase();
    return text.includes(q) || user.includes(q) || channel.includes(q);
  });

  const stripHtml = (html: string) => {
    if (!html) return "";
    return html.replace(/<[^>]*>/g, "").trim();
  };

  const formatRelativeTime = (dateStr: string) => {
    if (!dateStr) return "";
    try {
      const d = new Date(dateStr);
      if (isNaN(d.getTime()) || d.getFullYear() < 2000) return "";

      const now = new Date();
      const diffMs = now.getTime() - d.getTime();
      const diffSec = Math.floor(diffMs / 1000);
      const diffMin = Math.floor(diffSec / 60);
      const diffHr = Math.floor(diffMin / 60);
      const diffDay = Math.floor(diffHr / 24);

      if (diffSec < 60) return "just now";
      if (diffMin < 60) return `${diffMin}m ago`;
      if (diffHr < 24) return `${diffHr}h ago`;
      if (diffDay < 7) return `${diffDay}d ago`;
      if (diffDay < 30) return `${Math.floor(diffDay / 7)}w ago`;

      return d.toLocaleDateString([], {
        month: "short",
        day: "numeric",
        year: d.getFullYear() === now.getFullYear() ? undefined : "numeric",
      });
    } catch {
      return "";
    }
  };

  return (
    <div className="w-full min-h-[80vh] px-6 lg:px-10 py-6">
      {/* Header */}
      <div className="flex items-center gap-3 mb-2">
        <Bookmark size={24} className="text-blue-500" />
        <h1 className="text-2xl font-bold text-[#1D2939]">Saved</h1>
      </div>
      <p className="text-[#667085] text-sm mb-6">
        Messages and files you've saved for later
      </p>

      {/* Search */}
      <div className="relative mb-6">
        <Search
          size={18}
          className="absolute left-4 top-1/2 -translate-y-1/2 text-[#98A2B3]"
        />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search your saved items..."
          className="w-full pl-11 pr-4 py-3 rounded-lg bg-[#F9FAFB] border border-[#E6EAEF] text-sm text-[#1D2939] placeholder-[#98A2B3] outline-none focus:border-blue-400 transition"
        />
      </div>

      {/* Loading */}
      {loading && (
        <div className="flex items-center justify-center py-20 text-[#667085] text-sm">
          Loading saved messages...
        </div>
      )}

      {/* Empty state */}
      {!loading && filtered.length === 0 && (
        <div className="h-[60vh] flex flex-col items-center justify-center">
          <Image
            src="/image/empty-message.svg"
            width={100}
            height={100}
            className="size-20 lg:size-30"
            alt=""
            unoptimized
          />
          <h2 className="font-bold text-lg md:text-xl lg:text-2xl text-blue-500 mt-4">
            No saved items yet
          </h2>
          <p className="text-[#667085] text-sm mt-2 text-center max-w-md">
            When you save a message or file, it will appear here for easy access
            later.
          </p>
        </div>
      )}

      {/* List */}
      {!loading && filtered.length > 0 && (
        <div className="flex flex-col gap-3">
          {filtered.map((item: any, index: number) => {
            const senderName =
              item?.username ||
              item?.user?.username ||
              item?.user?.email ||
              "Unknown";
            const avatarUrl =
              item?.avatar_url || item?.user?.avatar_url || null;
            const preview = stripHtml(item?.message || item?.content || "");
            const channelName = item?.channel_name || item?.channel?.name || "";
            const timeStr = formatRelativeTime(
              item?.saved_at || item?.created_at
            );
            const itemId = item?.id || item?.thread_id || index;

            return (
              <div
                key={itemId}
                onClick={() => handleOpenMessage(item)}
                className="bg-white border border-[#E6EAEF] rounded-lg p-4 hover:shadow-sm hover:border-blue-300 transition cursor-pointer relative group"
              >
                <div className="flex items-start gap-3">
                  {avatarUrl ? (
                    <Image
                      src={avatarUrl}
                      width={36}
                      height={36}
                      className="rounded-full size-9 object-cover"
                      alt=""
                      unoptimized
                    />
                  ) : (
                    <div className="size-9 rounded-full bg-blue-100 flex items-center justify-center text-blue-500 font-semibold text-sm">
                      {senderName.charAt(0).toUpperCase()}
                    </div>
                  )}

                  <div className="flex-1 min-w-0 pr-10">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-semibold text-[15px] text-[#1D2939]">
                        {senderName}
                      </span>
                      {timeStr && (
                        <span className="text-xs text-[#98A2B3]">
                          {timeStr}
                        </span>
                      )}
                    </div>

                    <p className="text-[14px] text-[#344054] break-words line-clamp-3">
                      {preview || "(No preview available)"}
                    </p>

                    {channelName && (
                      <div className="mt-2">
                        <span className="inline-flex items-center gap-1 text-xs text-blue-500 font-medium">
                          # {channelName}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Unsave bookmark — always visible */}
                  <button
                    onClick={(e) => handleUnsave(e, item)}
                    className="absolute right-3 top-3 p-2 hover:bg-gray-100 rounded transition"
                    title="Unsave"
                    aria-label="Unsave message"
                  >
                    <Bookmark
                      size={18}
                      className="text-blue-500 fill-blue-500"
                    />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Later;
