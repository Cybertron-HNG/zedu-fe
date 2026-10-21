import test from "node:test";
import assert from "node:assert/strict";
import {
  buildOrganisationInvitesUrl,
  buildOrganisationUsersUrl,
} from "./search-urls.ts";

function searchParam(url) {
  return new URL(url, "http://localhost").searchParams.get("search");
}

test("encodes plus-addressed emails without losing the plus", () => {
  const url = buildOrganisationUsersUrl("org-1", {
    page: 1,
    limit: 20,
    search: "alex+qa@example.com",
  });
  assert.equal(searchParam(url), "alex+qa@example.com");
});

test("encodes ampersands so they stay inside the search value", () => {
  const url = buildOrganisationUsersUrl("org-1", {
    page: 1,
    limit: 20,
    search: "A&B",
  });
  assert.equal(searchParam(url), "A&B");
});

test("encodes hash characters", () => {
  const url = buildOrganisationInvitesUrl("org-1", {
    page: 2,
    limit: 20,
    search: "Alex#1",
  });
  assert.equal(searchParam(url), "Alex#1");
});

test("round-trips a plain search term", () => {
  const url = buildOrganisationInvitesUrl("org-1", {
    page: 1,
    limit: 20,
    search: "alex",
  });
  assert.equal(searchParam(url), "alex");
});

test("keeps an empty search as an empty parameter", () => {
  const url = buildOrganisationUsersUrl("org-1", {
    page: 1,
    limit: 20,
    search: "",
  });
  assert.equal(searchParam(url), "");
});

test("omits role when not provided and includes it when provided", () => {
  const withoutRole = buildOrganisationUsersUrl("org-1", {
    page: 1,
    limit: 20,
    search: "",
  });
  assert.equal(
    new URL(withoutRole, "http://localhost").searchParams.get("role"),
    null
  );

  const withRole = buildOrganisationInvitesUrl("org-1", {
    page: 1,
    limit: 20,
    search: "",
    role: "admin",
  });
  const parsed = new URL(withRole, "http://localhost");
  assert.equal(parsed.searchParams.get("role"), "admin");
  assert.equal(parsed.pathname, "/organisations/org-1/invites");
});
