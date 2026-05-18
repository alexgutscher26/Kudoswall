import { describe, expect, test, beforeEach, afterEach, jest } from "bun:test";
import { checkRateLimit } from "./rateLimit";

describe("checkRateLimit", () => {
  beforeEach(() => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date("2024-01-01T00:00:00.000Z"));
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  test("allows requests under the default limit", () => {
    const ip = "ip-happy-path";
    for (let i = 0; i < 50; i++) {
      expect(checkRateLimit(ip)).toBe(true);
    }
  });

  test("blocks requests over the default limit", () => {
    const ip = "ip-exceed-limit";
    // Default limit is 100
    for (let i = 0; i < 100; i++) {
      expect(checkRateLimit(ip)).toBe(true);
    }
    // 101st request should be blocked
    expect(checkRateLimit(ip)).toBe(false);
    expect(checkRateLimit(ip)).toBe(false);
  });

  test("resets limit after 1 minute window", () => {
    const ip = "ip-window-reset";
    const limit = 5;

    for (let i = 0; i < limit; i++) {
      expect(checkRateLimit(ip, limit)).toBe(true);
    }

    // Now blocked
    expect(checkRateLimit(ip, limit)).toBe(false);

    // Advance time by 60 seconds. The reset condition is `now > resetTime`,
    // so at exactly 60s it is equal, not strictly greater.
    jest.setSystemTime(new Date("2024-01-01T00:01:00.000Z"));
    expect(checkRateLimit(ip, limit)).toBe(false);

    // Advance by 60 seconds and 1 millisecond, it should reset
    jest.setSystemTime(new Date("2024-01-01T00:01:00.001Z"));
    expect(checkRateLimit(ip, limit)).toBe(true);
  });

  test("tracks independent IPs separately", () => {
    const ip1 = "ip-independent-1";
    const ip2 = "ip-independent-2";
    const limit = 2;

    expect(checkRateLimit(ip1, limit)).toBe(true);
    expect(checkRateLimit(ip1, limit)).toBe(true);
    expect(checkRateLimit(ip1, limit)).toBe(false); // ip1 blocked

    // ip2 should still be allowed
    expect(checkRateLimit(ip2, limit)).toBe(true);
    expect(checkRateLimit(ip2, limit)).toBe(true);
    expect(checkRateLimit(ip2, limit)).toBe(false); // ip2 blocked
  });

  test("respects custom limits", () => {
    const ip = "ip-custom-limit";
    const limit = 10;

    for (let i = 0; i < 10; i++) {
      expect(checkRateLimit(ip, limit)).toBe(true);
    }

    // 11th request blocked
    expect(checkRateLimit(ip, limit)).toBe(false);
  });
});
