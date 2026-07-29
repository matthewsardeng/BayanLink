import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import {
  BARANGAY_INFO,
  CATEGORIES,
  PUROKS,
  ISSUES,
  PROPOSALS,
  FEED,
  type Issue,
  type IssueCategory,
  type IssueStatus,
  type Severity,
  type Proposal,
  type FeedItem,
} from "@/data/barangay";

// Server-side state store
class ServerBayanStore {
  private issues: Issue[] = [];
  private proposals: Proposal[] = [];
  private feed: FeedItem[] = [];

  constructor() {
    this.init();
  }

  private init() {
    this.issues = [...ISSUES];
    this.proposals = [...PROPOSALS];
    this.feed = [...FEED];
  }

  public getIssues(): Issue[] {
    return this.issues;
  }

  public getProposals(): Proposal[] {
    return this.proposals;
  }

  public getFeed(): FeedItem[] {
    return this.feed;
  }

  public addIssue(data: {
    purok: string;
    street?: string;
    summary: string;
    category?: IssueCategory;
    anonymous?: boolean;
    imageUrl?: string;
  }): Issue {
    const today = new Date().toISOString().split("T")[0];
    const codeNumber = (this.issues.length + 1).toString().padStart(2, "0");
    const code = `BAL-2026-${codeNumber}`;
    const id = Date.now().toString();

    const isUrgent = /wire|sunog|fire|kuryente|baha|flood|aksidente|accident|kriminal|sakuna/i.test(
      data.summary,
    );

    const category: IssueCategory = data.category || (isUrgent ? "Flooding" : "Safety Hazard");
    const severity: Severity = isUrgent ? "Critical" : "Moderate";

    const x = Math.floor(Math.random() * 75) + 10;
    const y = Math.floor(Math.random() * 65) + 15;

    const newIssue: Issue = {
      id,
      code,
      title: `${category} report in ${data.purok}`,
      category,
      severity,
      status: "Reported",
      purok: data.purok,
      street: data.street || data.purok,
      reportedAt: today,
      confirmations: 1,
      households: Math.floor(Math.random() * 15) + 5,
      impact: isUrgent ? 85 : 45,
      lat: BARANGAY_INFO.coordinates.lat + (Math.random() - 0.5) * 0.008,
      lng: BARANGAY_INFO.coordinates.lng + (Math.random() - 0.5) * 0.008,
      x,
      y,
      summary: data.summary,
      nextAction: "Initial verification by Barangay Inspector",
      eta: "Within 24-48 hours",
      department: "Barangay Public Safety & Engineering",
      anonymous: data.anonymous,
      timeline: [
        {
          status: "Reported",
          at: `${today} 09:00`,
          by: data.anonymous ? "Resident (Anonymous)" : "Balibago Resident",
          note: "Official public report registered via BayanLink platform",
        },
      ],
    };

    this.issues.unshift(newIssue);

    const newFeedItem: FeedItem = {
      id: `f-${id}`,
      time: "Just now",
      title: `New ${category} report submitted`,
      detail: `${newIssue.title} (${data.purok})`,
      kind: isUrgent ? "Alerts" : "Issues",
      distance: data.purok,
    };

    this.feed.unshift(newFeedItem);

    return newIssue;
  }

  public confirmIssue(id: string): Issue | null {
    const issue = this.issues.find((i) => i.id === id);
    if (issue) {
      issue.confirmations += 1;
      issue.impact = Math.min(100, issue.impact + 2);
      return issue;
    }
    return null;
  }

  public updateIssueStatus(id: string, status: IssueStatus, note: string): Issue | null {
    const issue = this.issues.find((i) => i.id === id);
    if (issue) {
      const now = new Date();
      const dateStr = `${now.toISOString().split("T")[0]} ${now.getHours().toString().padStart(2, "0")}:${now.getMinutes().toString().padStart(2, "0")}`;

      issue.status = status;
      issue.timeline.push({
        status,
        at: dateStr,
        by: "Barangay Inspector",
        note: note || `Status updated to ${status}`,
      });
      return issue;
    }
    return null;
  }

  public voteProposal(id: string): Proposal | null {
    const proposal = this.proposals.find((p) => p.id === id);
    if (proposal) {
      proposal.votes += 1;
      return proposal;
    }
    return null;
  }
}

export const serverStore = new ServerBayanStore();

// Zod Schema Validation for RPC endpoints
export const reportInputSchema = z.object({
  purok: z.string().min(1, "Zone or Purok is required"),
  street: z.string().optional(),
  summary: z.string().min(10, "Summary must be at least 10 characters"),
  category: z.string().optional(),
  anonymous: z.boolean().optional(),
});

// TanStack Start Server Functions (RPC endpoints)
export const getIssuesServerFn = createServerFn({ method: "GET" }).handler(async () => {
  return serverStore.getIssues();
});

export const createIssueServerFn = createServerFn({ method: "POST" })
  .validator((data: unknown) => reportInputSchema.parse(data))
  .handler(async ({ data }) => {
    const issue = serverStore.addIssue({
      purok: data.purok,
      street: data.street,
      summary: data.summary,
      category: data.category as IssueCategory | undefined,
      anonymous: data.anonymous,
    });
    return issue;
  });

export const confirmIssueServerFn = createServerFn({ method: "POST" })
  .validator((data: unknown) => z.object({ id: z.string() }).parse(data))
  .handler(async ({ data }) => {
    return serverStore.confirmIssue(data.id);
  });

export const updateIssueStatusServerFn = createServerFn({ method: "POST" })
  .validator((data: unknown) =>
    z
      .object({
        id: z.string(),
        status: z.string(),
        note: z.string(),
      })
      .parse(data),
  )
  .handler(async ({ data }) => {
    return serverStore.updateIssueStatus(data.id, data.status as IssueStatus, data.note);
  });

export const getProposalsServerFn = createServerFn({ method: "GET" }).handler(async () => {
  return serverStore.getProposals();
});

export const voteProposalServerFn = createServerFn({ method: "POST" })
  .validator((data: unknown) => z.object({ id: z.string() }).parse(data))
  .handler(async ({ data }) => {
    return serverStore.voteProposal(data.id);
  });

export const getFeedServerFn = createServerFn({ method: "GET" }).handler(async () => {
  return serverStore.getFeed();
});
