import assert from "node:assert/strict";
import { parseStoredTimeRange } from "./time-range-parse.ts";

assert.deepEqual(parseStoredTimeRange("08:00 AM - 09:30 PM"), {
  from: "08:00",
  to: "21:30",
});
assert.deepEqual(parseStoredTimeRange("12:00 AM - 12:00 PM"), {
  from: "00:00",
  to: "12:00",
});
assert.equal(parseStoredTimeRange(undefined), null);
assert.equal(parseStoredTimeRange(""), null);
assert.equal(parseStoredTimeRange("08:00 AM"), null);
assert.equal(parseStoredTimeRange("8 AM - 9 PM"), null);
assert.equal(parseStoredTimeRange("25:00 AM - 09:00 PM"), null);
assert.equal(parseStoredTimeRange("08:60 AM - 09:00 PM"), null);

console.log("time-range-parse tests passed");
