import { describe, it, expect, mock, beforeEach } from "bun:test";
import * as React from "react";

const mockSend = mock();
const mockConstructor = mock();

class ResendMock {
  emails = {
    send: mockSend,
  };
  constructor(apiKey: string) {
    mockConstructor(apiKey);
  }
}

mock.module("resend", () => {
  return {
    Resend: ResendMock,
  };
});

import { EmailService } from "./service";
import { WelcomeEmail } from "../emails/welcome";
import { FirstTestimonialEmail } from "../emails/first-testimonial";
import { ActivationNudgeEmail } from "../emails/activation-nudge";
import { UpgradePromptEmail } from "../emails/upgrade-prompt";
import { WeeklyDigestEmail } from "../emails/weekly-digest";
import { ReEngagementEmail } from "../emails/re-engagement";

describe("EmailService", () => {
  const apiKey = "test-api-key";
  let service: EmailService;

  beforeEach(() => {
    mockSend.mockClear();
    mockConstructor.mockClear();
    service = new EmailService(apiKey);
  });

  it("should initialize Resend with the provided API key", () => {
    expect(mockConstructor).toHaveBeenCalledWith(apiKey);
  });

  it("should send welcome email", async () => {
    await service.sendWelcomeEmail("test@example.com", "John");

    expect(mockSend).toHaveBeenCalledWith({
      from: "Alex from KudosWall <alex@kudoswall.org>",
      to: "test@example.com",
      subject: "Welcome to KudosWall! 👋",
      react: React.createElement(WelcomeEmail, { userName: "John" }),
    });
  });

  it("should send first testimonial email", async () => {
    await service.sendFirstTestimonialEmail(
      "test@example.com",
      "John",
      "Alice",
      "Great product!",
      5,
    );

    expect(mockSend).toHaveBeenCalledWith({
      from: "Alex from KudosWall <alex@kudoswall.org>",
      to: "test@example.com",
      subject: "Your first testimonial just came in 👀",
      react: React.createElement(FirstTestimonialEmail, {
        userName: "John",
        authorName: "Alice",
        content: "Great product!",
        rating: 5,
      }),
    });
  });

  it("should send activation nudge email", async () => {
    await service.sendActivationNudge("test@example.com", "John");

    expect(mockSend).toHaveBeenCalledWith({
      from: "Alex from KudosWall <alex@kudoswall.org>",
      to: "test@example.com",
      subject: "Don't leave your social proof on the table 📈",
      react: React.createElement(ActivationNudgeEmail, { userName: "John" }),
    });
  });

  it("should send upgrade prompt email", async () => {
    await service.sendUpgradePrompt("test@example.com", "John", "limit-hit", 100);

    expect(mockSend).toHaveBeenCalledWith({
      from: "Alex from KudosWall <alex@kudoswall.org>",
      to: "test@example.com",
      subject: "You're crushing it! (And hitting your limit) 🚀",
      react: React.createElement(UpgradePromptEmail, { userName: "John", type: "limit-hit", approvedCount: 100 }),
    });
  });

  it("should send weekly digest email", async () => {
    const data = {
      newTestimonials: 5,
      totalViews: 100,
      conversionRate: "5%",
      topTestimonial: { content: "Amazing!", author: "Bob" },
    };
    await service.sendWeeklyDigest("test@example.com", "John", data);

    expect(mockSend).toHaveBeenCalledWith({
      from: "Alex from KudosWall <alex@kudoswall.org>",
      to: "test@example.com",
      subject: "Your week on KudosWall: Statistics and highlights 📊",
      react: React.createElement(WeeklyDigestEmail, {
        userName: "John",
        ...data,
      }),
    });
  });

  it("should send re-engagement email", async () => {
    await service.sendReEngagementEmail("test@example.com", "John");

    expect(mockSend).toHaveBeenCalledWith({
      from: "Alex from KudosWall <alex@kudoswall.org>",
      to: "test@example.com",
      subject: "Is your Wall of Love getting lonely? 🥺",
      react: React.createElement(ReEngagementEmail, { userName: "John" }),
    });
  });
});
