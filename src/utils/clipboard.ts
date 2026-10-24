export const copyToClipboard = async (text: string): Promise<boolean> => {
  if (!text) return false;

  try {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      await navigator.clipboard.writeText(text);
      return true;
    }

    if (typeof document === "undefined") return false;

    const textarea = document.createElement("textarea");
    textarea.value = text;
    textarea.style.position = "fixed";
    textarea.style.opacity = "0";
    document.body.appendChild(textarea);
    textarea.focus();
    textarea.select();
    const copied = document.execCommand("copy");
    document.body.removeChild(textarea);
    return copied;
  } catch {
    return false;
  }
};

export const getDisplayName = (user: any): string =>
  user?.display_name ||
  user?.displayName ||
  user?.full_name ||
  user?.fullName ||
  user?.username ||
  user?.name ||
  "";

export const getMemberId = (user: any): string =>
  String(user?.user_id ?? user?.id ?? "");

export const buildProfileLink = (user: any): string => {
  if (typeof window === "undefined") return "";

  const origin = window.location.origin;
  const orgSlug = window.location.pathname.split("/").filter(Boolean)[0] ?? "";
  const channelId = user?.channel_id;
  const participantId = user?.participant_id ?? user?.user_id ?? user?.id;

  if (orgSlug && channelId && participantId) {
    return `${origin}/${orgSlug}/home/people/${channelId}/${participantId}/dm`;
  }

  return orgSlug ? `${origin}/${orgSlug}/home/people` : origin;
};
