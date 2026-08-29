import { describe, it, expect } from "bun:test";
import { isDisposableEmail } from "./disposable-domains";

describe("isDisposableEmail", () => {
  it("detects known temporary and burner email domains", () => {
    expect(isDisposableEmail("user@mailinator.com")).toBe(true);
    expect(isDisposableEmail("test@guerrillamail.com")).toBe(true);
    expect(isDisposableEmail("temp@10minutemail.com")).toBe(true);
    expect(isDisposableEmail("fake@tempmail.com")).toBe(true);
    expect(isDisposableEmail("anonymous@yopmail.com")).toBe(true);
    expect(isDisposableEmail("bot@trashmail.com")).toBe(true);
  });

  it("allows standard legitimate email domains", () => {
    expect(isDisposableEmail("alex@gmail.com")).toBe(false);
    expect(isDisposableEmail("sarah@company.co")).toBe(false);
    expect(isDisposableEmail("dev@kudoswall.org")).toBe(false);
    expect(isDisposableEmail("team@outlook.com")).toBe(false);
    expect(isDisposableEmail("founder@startup.io")).toBe(false);
  });

  it("handles empty or malformed inputs safely", () => {
    expect(isDisposableEmail("")).toBe(false);
    expect(isDisposableEmail("invalid-email")).toBe(false);
    expect(isDisposableEmail("@mailinator.com")).toBe(true);
  });
});
