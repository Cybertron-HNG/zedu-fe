import test from "node:test";
import assert from "node:assert/strict";
import { convertTo24Hour, parseStoredTimeRange } from "./time-range.ts";

test("parses a stored window back to 24-hour values", () => {
  assert.deepEqual(parseStoredTimeRange("09:15 AM - 06:45 PM"), {
    from: "09:15",
    to: "18:45",
  });
});

test("round-trips midnight and noon", () => {
  assert.deepEqual(parseStoredTimeRange("12:00 AM - 12:00 PM"), {
    from: "00:00",
    to: "12:00",
  });
});

test("returns null when the stored window is missing", () => {
  assert.equal(parseStoredTimeRange(undefined), null);
  assert.equal(parseStoredTimeRange(null), null);
  assert.equal(parseStoredTimeRange(""), null);
  assert.equal(parseStoredTimeRange({}), null);
});

test("returns null when the stored window is malformed", () => {
  assert.equal(parseStoredTimeRange("NaN:undefined - 06:45 PM"), null);
  assert.equal(parseStoredTimeRange("09:15 AM"), null);
  assert.equal(parseStoredTimeRange("13:15 PM - 06:45 PM"), null);
  assert.equal(parseStoredTimeRange("09:15 AM - 06:75 PM"), null);
});

test("rejects values the old splitter turned into NaN:undefined", () => {
  assert.equal(convertTo24Hour("NaN:undefined"), null);
  assert.equal(convertTo24Hour(""), null);
  assert.equal(convertTo24Hour("09:15"), null);
});
