import assert from "node:assert/strict";
import test from "node:test";

const {
  hasMoreReplyPages,
  isIndividualDmType,
  openSearchMessageResult,
  resolveSearchDeepLink,
  shouldFetchSearchReply,
} = await import("./navigate.ts");

const storage = new Map();
globalThis.localStorage = {
  getItem: (key) => storage.get(key) ?? null,
  setItem: (key, value) => storage.set(key, String(value)),
  removeItem: (key) => storage.delete(key),
};

const makeResult = ({
  messageId = "reply-9",
  parentId = "parent-1",
  channelId = "channel-1",
  channelType = "channel",
} = {}) => ({
  user: { user_id: "user-1", user_name: "Ada", avatar_url: "" },
  messages: [
    {
      message_id: messageId,
      message: "Search result",
      timestamp: "2026-10-15T12:00:00Z",
    },
  ],
  thread: { id: parentId },
  channel: {
    channel_id: channelId,
    channel_name: "general",
    ...(channelType ? { channel_type: channelType } : {}),
  },
});

async function navigate(result, options = {}) {
  const pushes = [];
  await openSearchMessageResult({
    result,
    orgSlug: "acme",
    router: { push: (href) => pushes.push(href) },
    dispatch: () => {},
    ...options,
  });
  return pushes[0];
}

test("routes channel, individual-DM, and group-DM roots and replies", async () => {
  const cases = [
    ["channel", "parent-1", "/acme/home/channels/channel-1"],
    ["channel", "reply-9", "/acme/home/channels/channel-1"],
    ["dm", "parent-1", "/acme/dms/channel-1"],
    ["dm", "reply-9", "/acme/dms/channel-1"],
    ["groupdm", "parent-1", "/acme/dms/channel-1"],
    ["groupdm", "reply-9", "/acme/dms/channel-1"],
  ];

  for (const [channelType, messageId, path] of cases) {
    const query =
      messageId === "parent-1"
        ? "?thread_id=parent-1"
        : "?thread_id=parent-1&message_id=reply-9";
    assert.equal(
      await navigate(makeResult({ channelType, messageId })),
      `${path}${query}`
    );
  }
});

test("uses loaded state when search results omit channel_type", async () => {
  assert.match(
    await navigate(makeResult({ channelId: "dm-1", channelType: "" }), {
      dms: [{ channel_id: "dm-1" }],
      channels: [],
    }),
    /^\/acme\/dms\/dm-1\?/
  );
});

test("uses the participants endpoint for an unloaded DM", async () => {
  const requests = [];
  const href = await navigate(
    makeResult({ channelId: "dm-2", channelType: "" }),
    {
      orgId: "org-7",
      dms: [],
      channels: [],
      getDmParticipants: async (url) => {
        requests.push(url);
        return { status: 200 };
      },
    }
  );

  assert.deepEqual(requests, ["/organisations/org-7/dms/participants/dm-2"]);
  assert.match(href, /^\/acme\/dms\/dm-2\?/);
});

test("classifies backend DM types", () => {
  assert.equal(isIndividualDmType("dm"), true);
  assert.equal(isIndividualDmType("bot"), true);
  assert.equal(isIndividualDmType("groupdm"), false);
});

test("loads reply pages only while a search target is missing", () => {
  assert.equal(
    shouldFetchSearchReply("reply-9", [{ id: "reply-1" }], true),
    true
  );
  assert.equal(
    shouldFetchSearchReply("reply-9", [{ id: "reply-9" }], true),
    false
  );
  assert.equal(
    shouldFetchSearchReply("reply-9", [{ id: "reply-1" }], false),
    false
  );
  assert.equal(hasMoreReplyPages(30), true);
  assert.equal(hasMoreReplyPages(29), false);
});

test("keeps a reply link pending until its parent finishes loading", () => {
  const parent = { thread_id: "parent-1" };
  assert.deepEqual(
    resolveSearchDeepLink("parent-1", "reply-9", [parent], true),
    {
      status: "pending",
    }
  );
  assert.deepEqual(resolveSearchDeepLink("parent-1", "reply-9", [], false), {
    status: "pending",
  });
  assert.deepEqual(
    resolveSearchDeepLink("parent-1", "reply-9", [parent], false),
    {
      status: "reply",
      parent,
    }
  );
});
