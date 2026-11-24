// Run with your preferred runner (e.g. `npx vitest`). Kept dependency-free for now.
import { discountPct, formatPrice } from "../lib/utils/format";
import assert from "node:assert";

assert.equal(discountPct("800", "1000"), 20);
assert.equal(discountPct("1000", null), 0);
assert.match(formatPrice("2499"), /2,499/);
console.log("format tests passed");
