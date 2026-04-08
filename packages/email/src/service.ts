import { Resend } from "resend";
import * as React from "react";
import { WelcomeEmail } from "./templates/welcome";
import { FirstTestimonialEmail } from "./templates/first-testimonial";

export class EmailService {
  public resend: Resend;
  private from = "Alex from KudosWall <alex@kudoswall.org>";

  constructor(apiKey: string) {
    this.resend = new Resend(apiKey);
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

  // Placeholder for paid plan emails (TODO)
  async sendActivationNudge(to: string, userName: string) {
    // TODO: Implement reactivation logic
    console.log(`[TODO] Activation nudge to ${to}`);
  }

  async sendUpgradePrompt(to: string, userName: string) {
    // TODO: Implement migration logic for 5th testimonial
    console.log(`[TODO] Upgrade prompt for ${to}`);
  }
}
