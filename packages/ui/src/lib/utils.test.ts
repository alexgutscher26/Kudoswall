import { describe, it, expect } from "bun:test";
import { cn } from "./utils";

describe("cn utility", () => {
  it("should merge basic class names", () => {
    expect(cn("class1", "class2")).toBe("class1 class2");
  });

  it("should handle conditional classes", () => {
    expect(cn("class1", true && "class2", false && "class3")).toBe("class1 class2");
  });

  it("should handle object syntax", () => {
    expect(cn({ class1: true, class2: false, class3: true })).toBe("class1 class3");
  });

  it("should handle arrays of classes", () => {
    expect(cn(["class1", "class2"])).toBe("class1 class2");
  });

  it("should handle nested arrays", () => {
    expect(cn(["class1", ["class2", "class3"]])).toBe("class1 class2 class3");
  });

  it("should resolve Tailwind CSS conflicts", () => {
    expect(cn("px-2 py-1", "px-4")).toBe("py-1 px-4");
    expect(cn("bg-red-500", "bg-blue-500")).toBe("bg-blue-500");
    expect(cn("text-sm", "text-lg")).toBe("text-lg");
  });

  it("should handle complex combinations", () => {
    expect(
      cn(
        "base-class",
        true && "conditional-class",
        { "object-class": true, "ignored-class": false },
        ["array-class1", "array-class2"],
        "px-2",
        "px-4",
      ),
    ).toBe("base-class conditional-class object-class array-class1 array-class2 px-4");
  });

  it("should ignore null, undefined, false, and 0", () => {
    // Note: 0 is ignored by clsx
    expect(cn("class1", null, undefined, false, 0, "class2")).toBe("class1 class2");
  });
});
