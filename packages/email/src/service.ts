import { Resend } from "resend";
import * as React from "react";
import { WelcomeEmail } from "../emails/welcome";
import { FirstTestimonialEmail } from "../emails/first-testimonial";
import { ActivationNudgeEmail } from "../emails/activation-nudge";
import { UpgradePromptEmail } from "../emails/upgrade-prompt";
import { WeeklyDigestEmail } from "../emails/weekly-digest";
import { ReEngagementEmail } from "../emails/re-engagement";
import { TeamInviteEmail } from "../emails/team-invite";

export class EmailService {
  public resend: Resend;
  private from: string;

  constructor(apiKey: string, from?: string) {
    this.resend = new Resend(apiKey || "re_dummy_key_for_build");
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
}
