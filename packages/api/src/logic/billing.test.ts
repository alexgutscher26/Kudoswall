import { describe, it, expect } from "bun:test";
import { getWorkspacePermissions } from "./billing";
import { PLANS } from "../config/plans";

describe("getWorkspacePermissions", () => {
  it("enforces Free tier limits accurately (10 testimonials, 1 widget, 1 project)", () => {
    const permissions = getWorkspacePermissions({
      plan: "free",
      subscriptionStatus: "active",
      projectsCount: 1,
      testimonialsCount: 8,
      widgetsCount: 1,
    });

    expect(permissions.effectivePlan).toBe("free");
    expect(permissions.isPro).toBe(false);
    expect(permissions.limits.maxTestimonials).toBe(10);
    expect(permissions.limits.maxWidgets).toBe(1);
    expect(permissions.limits.maxProjects).toBe(1);
    expect(permissions.limits.maxVideoSizeMb).toBe(60);

    expect(permissions.canAddTestimonial).toBe(true); // 8 < 10
    expect(permissions.canAddWidget).toBe(false); // 1 >= 1 (1-widget limit reached)
    expect(permissions.canAddProject).toBe(false); // 1 >= 1 (1-project limit reached)
  });

  it("blocks adding testimonials when Free limit of 10 is reached", () => {
    const permissions = getWorkspacePermissions({
      plan: "free",
      subscriptionStatus: "active",
      projectsCount: 1,
      testimonialsCount: 10,
      widgetsCount: 1,
    });

    expect(permissions.canAddTestimonial).toBe(false);
  });

  it("grants full Pro Reverse Trial access for accounts in trialing status", () => {
    const futureDate = new Date(Date.now() + 10 * 24 * 60 * 60 * 1000); // 10 days left
    const permissions = getWorkspacePermissions({
      plan: "plan_1",
      subscriptionStatus: "trialing",
      trialEndsAt: futureDate,
      projectsCount: 2,
      testimonialsCount: 25,
      widgetsCount: 4,
    });

    expect(permissions.effectivePlan).toBe("plan_1");
    expect(permissions.isPro).toBe(true);
    expect(permissions.isTrialing).toBe(true);
    expect(permissions.isTrialExpired).toBe(false);
    expect(permissions.trialDaysRemaining).toBeGreaterThanOrEqual(9);
    expect(permissions.canAddTestimonial).toBe(true);
    expect(permissions.canAddWidget).toBe(true);
    expect(permissions.limits.maxWidgets).toBe(Infinity);
  });

  it("downgrades to Free tier once trial date has passed", () => {
    const pastDate = new Date(Date.now() - 2 * 24 * 60 * 60 * 1000); // 2 days ago
    const permissions = getWorkspacePermissions({
      plan: "plan_1",
      subscriptionStatus: "trialing",
      trialEndsAt: pastDate,
      projectsCount: 1,
      testimonialsCount: 12,
      widgetsCount: 2,
    });

    expect(permissions.effectivePlan).toBe("free");
    expect(permissions.isPro).toBe(false);
    expect(permissions.isTrialing).toBe(false);
    expect(permissions.isTrialExpired).toBe(true);
    expect(permissions.trialDaysRemaining).toBe(0);
    expect(permissions.canAddTestimonial).toBe(false); // 12 >= 10
    expect(permissions.canAddWidget).toBe(false); // 2 >= 1
  });

  it("handles paid Pro, LTD, and Agency plans with unlimited widgets", () => {
    for (const paidPlan of ["plan_1", "plan_2", "plan_3", "ltd"]) {
      const permissions = getWorkspacePermissions({
        plan: paidPlan,
        subscriptionStatus: "active",
        projectsCount: 1,
        testimonialsCount: 150,
        widgetsCount: 10,
      });

      expect(permissions.isPro).toBe(true);
      expect(permissions.canAddWidget).toBe(true);
      expect(permissions.canAddTestimonial).toBe(true);
      expect(permissions.limits.maxWidgets).toBe(Infinity);
    }
  });
});
