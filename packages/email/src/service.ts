import { Resend } from "resend";
import * as React from "react";
import { WelcomeEmail } from "../emails/welcome";
import { FirstTestimonialEmail } from "../emails/first-testimonial";
import { ActivationNudgeEmail } from "../emails/activation-nudge";
import { UpgradePromptEmail } from "../emails/upgrade-prompt";
import { WeeklyDigestEmail } from "../emails/weekly-digest";
import { ReEngagementEmail } from "../emails/re-engagement";
import { TeamInviteEmail } from "../emails/team-invite";
import { TrialExpiringEmail } from "../emails/trial-expiring";
import { CancellationEmail } from "../emails/cancellation";
import { SuspiciousLoginEmail } from "../emails/suspicious-login";
import { SubmissionConfirmationEmail } from "../emails/submission-confirmation";

export class EmailService {
  public resend: Resend;
  private from: string;

  constructor(apiKey: string, from?: string) {
    this.resend = new Resend(apiKey);
    this.from = from || "Alex from KudosWall <alex@kudoswall.org>";
  }

  async sendWelcomeEmail(to: string, userName: string) {
    return this.resend.emails.send({
      from: this.from,
      to,
      subject: "Welcome to KudosWall! 👋",
      react: React.createElement(WelcomeEmail, { userName }),
    });
  }

  async sendFirstTestimonialEmail(
    to: string,
    userName: string,
    authorName: string,
    content: string,
    rating: number,
  ) {
    return this.resend.emails.send({
      from: this.from,
      to,
      subject: "Your first testimonial just came in 👀",
      react: React.createElement(FirstTestimonialEmail, {
        userName,
        authorName,
        content,
        rating,
      }),
    });
  }

  async sendActivationNudge(to: string, userName: string) {
    return this.resend.emails.send({
      from: this.from,
      to,
      subject: "Don't leave your social proof on the table 📈",
      react: React.createElement(ActivationNudgeEmail, { userName }),
    });
  }

  async sendUpgradePrompt(to: string, userName: string, approvedCount: number) {
    return this.resend.emails.send({
      from: this.from,
      to,
      subject: "You're crushing it! (And hitting your limit) 🚀",
      react: React.createElement(UpgradePromptEmail, { userName, approvedCount }),
    });
  }

  async sendWeeklyDigest(
    to: string,
    userName: string,
    data: {
      newTestimonials: number;
      totalViews: number;
      conversionRate: string;
      topTestimonial?: { content: string; author: string };
    },
  ) {
    return this.resend.emails.send({
      from: this.from,
      to,
      subject: "Your week on KudosWall: Statistics and highlights 📊",
      react: React.createElement(WeeklyDigestEmail, {
        userName,
        ...data,
      }),
    });
  }

  async sendReEngagementEmail(to: string, userName: string) {
    return this.resend.emails.send({
      from: this.from,
      to,
      subject: "Is your Wall of Love getting lonely? 🥺",
      react: React.createElement(ReEngagementEmail, { userName }),
    });
  }

  async sendInviteEmail(
    to: string,
    inviterName: string,
    workspaceName: string,
    inviteLink: string,
  ) {
    return this.resend.emails.send({
      from: this.from,
      to,
      subject: `You've been invited to join ${workspaceName} on KudosWall`,
      react: React.createElement(TeamInviteEmail, {
        inviterName,
        workspaceName,
        inviteLink,
      }),
    });
  }

  async sendTrialExpiringEmail(to: string, userName: string, expiryDate: string) {
    return this.resend.emails.send({
      from: this.from,
      to,
      subject: "Your Pro trial is ending soon! ⏳",
      react: React.createElement(TrialExpiringEmail, { userName, expiryDate }),
    });
  }

  async sendCancellationEmail(to: string, userName: string) {
    return this.resend.emails.send({
      from: this.from,
      to,
      subject: "Your KudosWall subscription has been canceled",
      react: React.createElement(CancellationEmail, { userName }),
    });
  }

  async sendSuspiciousLoginEmail(
    to: string,
    userName: string,
    data: {
      ipAddress: string;
      userAgent: string;
      location?: string;
      time: string;
    },
  ) {
    return this.resend.emails.send({
      from: this.from,
      to,
      subject: "Security Alert: New login detected on KudosWall 🛡️",
      react: React.createElement(SuspiciousLoginEmail, {
        userName,
        ...data,
      }),
    });
  }

  async sendSubmissionConfirmationEmail(
    to: string,
    authorName: string,
    projectName: string,
    thankYouMessage?: string | null,
    fromName?: string | null,
  ) {
    const from = fromName ? `${fromName} via KudosWall <alex@kudoswall.org>` : this.from;

    return this.resend.emails.send({
      from,
      to,
      subject: `Thank you for your feedback!`,
      react: React.createElement(SubmissionConfirmationEmail, {
        authorName,
        projectName,
        thankYouMessage,
      }),
    });
  }
}
