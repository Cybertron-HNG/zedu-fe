type ReplyPreview = {
  user_id?: string;
};

type EditableMessage = {
  user_id?: string;
  message_count?: number | string;
  messages?: ReplyPreview[] | null;
};

/**
 * True when someone other than the author may have replied to the message.
 *
 * Replies are only listed as a preview, so when the reply count is higher
 * than the preview shows, the hidden replies are treated as replies from
 * other people. Editing is then hidden, which is the safe side.
 */
export function hasRepliesFromOthers(item?: EditableMessage | null) {
  if (!item) return false;

  const replyCount = Number(item.message_count) || 0;
  if (replyCount <= 0) return false;

  const previews = Array.isArray(item.messages) ? item.messages : [];
  if (previews.some((reply) => reply?.user_id !== item.user_id)) return true;

  return previews.length < replyCount;
}

/** Only the author may edit, and only until someone else has replied. */
export function canEditMessage(
  currentUserId: string | undefined,
  item?: EditableMessage | null
) {
  if (!currentUserId || !item || item.user_id !== currentUserId) return false;
  return !hasRepliesFromOthers(item);
}
