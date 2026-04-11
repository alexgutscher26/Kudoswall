import { describe, test, expect, mock, beforeEach } from "bun:test";

const mockSendWelcomeEmail = mock(() => Promise.resolve());

mock.module("@my-better-t-app/email", () => {
  return {
    EmailService: class {
      sendWelcomeEmail = mockSendWelcomeEmail;
    }
  };
});

import { getOrCreateWorkspace } from "./dashboard";

describe("getOrCreateWorkspace", () => {
  let db: any;
  let insertValuesMock: ReturnType<typeof mock>;

  beforeEach(() => {
    mockSendWelcomeEmail.mockClear();

    insertValuesMock = mock(() => Promise.resolve());
    db = {
      query: {
        workspace: {
          findFirst: mock(() => Promise.resolve(null)),
        },
        user: {
          findFirst: mock(() => Promise.resolve({ id: "user-1", email: "test@example.com", name: "John Doe" })),
        },
      },
      insert: mock(() => ({
        values: insertValuesMock,
      })),
    };
  });

  test("should return existing workspace if it exists", async () => {
    const existingWorkspace = { id: "ws-1", ownerId: "user-1", name: "Existing WS" };
    db.query.workspace.findFirst.mockResolvedValue(existingWorkspace);

    const result = await getOrCreateWorkspace(db, "user-1", "John Doe");

    expect(result).toEqual(existingWorkspace);
    expect(db.query.workspace.findFirst).toHaveBeenCalledTimes(1);
    expect(db.insert).not.toHaveBeenCalled();
    expect(mockSendWelcomeEmail).not.toHaveBeenCalled();
  });

  test("should create a new workspace and send welcome email if it does not exist", async () => {
    const result = await getOrCreateWorkspace(db, "user-1", "John Doe");

    expect(result.ownerId).toBe("user-1");
    expect(result.name).toBe("John Doe's Workspace");
    expect(result.slug).toMatch(/^john-doe-[a-z0-9]{4}$/);
    expect(result.id).toBeDefined();

    const expectedOnboarding = JSON.stringify({
      step1: false,
      step2: false,
      step3: false,
      step4: false,
      step5: false,
    });
    expect(result.onboardingStatus).toBe(expectedOnboarding);

    expect(db.insert).toHaveBeenCalledTimes(1);
    expect(insertValuesMock).toHaveBeenCalledWith(result);

    expect(db.query.user.findFirst).toHaveBeenCalledTimes(1);
    expect(mockSendWelcomeEmail).toHaveBeenCalledTimes(1);
    expect(mockSendWelcomeEmail).toHaveBeenCalledWith("test@example.com", "John Doe");
  });

  test("should catch and log error if welcome email fails to send", async () => {
    const consoleErrorSpy = mock(() => {});
    const originalConsoleError = console.error;
    console.error = consoleErrorSpy;

    mockSendWelcomeEmail.mockRejectedValue(new Error("Email failed"));

    const result = await getOrCreateWorkspace(db, "user-1", "John Doe");

    expect(result.ownerId).toBe("user-1");
    expect(mockSendWelcomeEmail).toHaveBeenCalledTimes(1);
    expect(consoleErrorSpy).toHaveBeenCalledWith("Failed to send welcome email", expect.any(Error));

    console.error = originalConsoleError;
  });

  test("should not send email if user email is not found", async () => {
    db.query.user.findFirst.mockResolvedValue({ id: "user-1", email: null, name: "John Doe" });

    const result = await getOrCreateWorkspace(db, "user-1", "John Doe");

    expect(result.ownerId).toBe("user-1");
    expect(db.query.user.findFirst).toHaveBeenCalledTimes(1);
    expect(mockSendWelcomeEmail).not.toHaveBeenCalled();
  });
});
