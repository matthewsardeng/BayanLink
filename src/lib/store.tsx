import React, { createContext, useContext, useEffect, useState } from "react";
import {
  ISSUES,
  PROPOSALS,
  FEED,
  BARANGAY_INFO,
  INITIAL_SERVICE_APPLICATIONS,
  type Issue,
  type Proposal,
  type FeedItem,
  type IssueStatus,
  type IssueCategory,
  type Severity,
  type ServiceApplication,
} from "@/data/barangay";
import {
  getIssuesServerFn,
  createIssueServerFn,
  confirmIssueServerFn,
  updateIssueStatusServerFn,
  getProposalsServerFn,
  voteProposalServerFn,
  getFeedServerFn,
} from "@/api/backend";

const STORAGE_KEY_ISSUES = "bayanlink_issues_v2";
const STORAGE_KEY_PROPOSALS = "bayanlink_proposals_v2";
const STORAGE_KEY_FEED = "bayanlink_feed_v2";
const STORAGE_KEY_LANG = "bayanlink_language_v2";
const STORAGE_KEY_SVC_APPS = "bayanlink_svc_apps_v2";

export type Language = "en" | "tl" | "pam";

type BayanStoreContextType = {
  issues: Issue[];
  proposals: Proposal[];
  feed: FeedItem[];
  serviceApplications: ServiceApplication[];
  language: Language;
  setLanguage: (lang: Language) => void;
  addIssue: (data: {
    title: string;
    category: IssueCategory;
    purok: string;
    street?: string;
    summary: string;
    anonymous?: boolean;
    imageUrl?: string;
  }) => Promise<Issue>;
  confirmIssue: (id: string) => Promise<void>;
  updateIssueStatus: (id: string, status: IssueStatus, note: string) => Promise<void>;
  deleteIssue: (id: string) => Promise<void>;
  voteProposal: (id: string) => Promise<void>;
  addProposal: (data: { title: string; purok: string; blurb: string; goal: number }) => Promise<Proposal>;
  applyForService: (data: {
    serviceId: string;
    serviceName: string;
    applicantName: string;
    purpose: string;
    purok: string;
  }) => Promise<ServiceApplication>;
};

const BayanStoreContext = createContext<BayanStoreContextType | null>(null);

export function BayanStoreProvider({ children }: { children: React.ReactNode }) {
  const [issues, setIssues] = useState<Issue[]>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem(STORAGE_KEY_ISSUES);
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch (e) {
          console.error("Failed to load issues from localStorage", e);
        }
      }
    }
    return ISSUES;
  });

  const [proposals, setProposals] = useState<Proposal[]>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem(STORAGE_KEY_PROPOSALS);
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch (e) {
          console.error("Failed to load proposals from localStorage", e);
        }
      }
    }
    return PROPOSALS;
  });

  const [feed, setFeed] = useState<FeedItem[]>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem(STORAGE_KEY_FEED);
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch (e) {
          console.error("Failed to load feed from localStorage", e);
        }
      }
    }
    return FEED;
  });

  const [serviceApplications, setServiceApplications] = useState<ServiceApplication[]>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem(STORAGE_KEY_SVC_APPS);
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch (e) {
          console.error("Failed to load service applications from localStorage", e);
        }
      }
    }
    return INITIAL_SERVICE_APPLICATIONS;
  });

  const [language, setLanguageState] = useState<Language>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem(STORAGE_KEY_LANG) as Language;
      if (saved && ["en", "tl", "pam"].includes(saved)) {
        return saved;
      }
    }
    return "en";
  });

  // Fetch initial data from server backend
  useEffect(() => {
    let mounted = true;

    async function syncWithServer() {
      try {
        const [serverIssues, serverProposals, serverFeed] = await Promise.all([
          getIssuesServerFn(),
          getProposalsServerFn(),
          getFeedServerFn(),
        ]);

        if (mounted) {
          if (Array.isArray(serverIssues) && serverIssues.length > 0) {
            setIssues(serverIssues);
          }
          if (Array.isArray(serverProposals) && serverProposals.length > 0) {
            setProposals(serverProposals);
          }
          if (Array.isArray(serverFeed) && serverFeed.length > 0) {
            setFeed(serverFeed);
          }
        }
      } catch (err) {
        console.warn("Server backend sync offline, using local store", err);
      }
    }

    syncWithServer();

    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_ISSUES, JSON.stringify(issues));
  }, [issues]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_PROPOSALS, JSON.stringify(proposals));
  }, [proposals]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_FEED, JSON.stringify(feed));
  }, [feed]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_SVC_APPS, JSON.stringify(serviceApplications));
  }, [serviceApplications]);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem(STORAGE_KEY_LANG, lang);
  };

  const addIssue = async (data: {
    title: string;
    category: IssueCategory;
    purok: string;
    street?: string;
    summary: string;
    anonymous?: boolean;
    imageUrl?: string;
  }): Promise<Issue> => {
    let newIssue: Issue;

    try {
      newIssue = await createIssueServerFn({
        data: {
          purok: data.purok,
          street: data.street,
          summary: data.summary,
          category: data.category,
          anonymous: data.anonymous,
        },
      });
    } catch (e) {
      console.warn("Backend server call failed, creating issue locally", e);
      const today = new Date().toISOString().split("T")[0];
      const codeNumber = (issues.length + 1).toString().padStart(2, "0");
      const code = `BAL-2026-${codeNumber}`;
      const id = Date.now().toString();

      newIssue = {
        id,
        code,
        title: `${data.category} report in ${data.purok}`,
        category: data.category,
        severity: "Moderate",
        status: "Reported",
        purok: data.purok,
        street: data.street || data.purok,
        reportedAt: today,
        confirmations: 1,
        households: 10,
        impact: 50,
        lat: BARANGAY_INFO.coordinates.lat + (Math.random() - 0.5) * 0.008,
        lng: BARANGAY_INFO.coordinates.lng + (Math.random() - 0.5) * 0.008,
        x: Math.floor(Math.random() * 75) + 10,
        y: Math.floor(Math.random() * 65) + 15,
        summary: data.summary,
        nextAction: "Verification by Barangay Inspector",
        eta: "Within 24-48 hours",
        department: "Barangay Public Works",
        anonymous: data.anonymous,
        timeline: [
          {
            status: "Reported",
            at: `${today} 09:00`,
            by: data.anonymous ? "Resident (Anonymous)" : "Balibago Resident",
            note: "Report registered via BayanLink console",
          },
        ],
      };
    }

    setIssues((prev) => [newIssue, ...prev]);

    const newFeedItem: FeedItem = {
      id: `f-${newIssue.id}`,
      time: "Just now",
      title: `New ${data.category} report submitted`,
      detail: `${newIssue.title} (${data.purok})`,
      kind: "Issues",
      distance: data.purok,
    };

    setFeed((prev) => [newFeedItem, ...prev]);

    return newIssue;
  };

  const confirmIssue = async (id: string) => {
    try {
      await confirmIssueServerFn({ data: { id } });
    } catch (e) {
      console.warn("Server backend call failed, updating confirmation locally", e);
    }

    setIssues((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          return {
            ...item,
            confirmations: item.confirmations + 1,
            impact: Math.min(100, item.impact + 2),
          };
        }
        return item;
      }),
    );
  };

  const updateIssueStatus = async (id: string, status: IssueStatus, note: string) => {
    try {
      await updateIssueStatusServerFn({ data: { id, status, note } });
    } catch (e) {
      console.warn("Server backend call failed, updating status locally", e);
    }

    const now = new Date();
    const dateStr = `${now.toISOString().split("T")[0]} ${now.getHours().toString().padStart(2, "0")}:${now.getMinutes().toString().padStart(2, "0")}`;

    setIssues((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          return {
            ...item,
            status,
            timeline: [
              ...item.timeline,
              {
                status,
                at: dateStr,
                by: "Barangay Balibago Admin",
                note: note || `Status updated to ${status}`,
              },
            ],
          };
        }
        return item;
      }),
    );
  };

  const voteProposal = async (id: string) => {
    try {
      await voteProposalServerFn({ data: { id } });
    } catch (e) {
      console.warn("Server backend call failed, voting locally", e);
    }

    setProposals((prev) =>
      prev.map((p) => {
        if (p.id === id) {
          return {
            ...p,
            votes: p.votes + 1,
          };
        }
        return p;
      }),
    );
  };

  const addProposal = async (data: {
    title: string;
    purok: string;
    blurb: string;
    goal: number;
  }): Promise<Proposal> => {
    const newProposal: Proposal = {
      id: `prop-${Date.now()}`,
      title: data.title,
      purok: data.purok,
      blurb: data.blurb,
      votes: 1,
      goal: data.goal || 100,
      submittedBy: "Balibago Resident",
    };
    setProposals((prev) => [newProposal, ...prev]);

    const newFeedItem: FeedItem = {
      id: `f-${newProposal.id}`,
      time: "Just now",
      title: `New community proposal submitted`,
      detail: `${newProposal.title} (${data.purok})`,
      kind: "Announcements",
      distance: data.purok,
    };
    setFeed((prev) => [newFeedItem, ...prev]);

    return newProposal;
  };

  const applyForService = async (data: {
    serviceId: string;
    serviceName: string;
    applicantName: string;
    purpose: string;
    purok: string;
  }): Promise<ServiceApplication> => {
    const now = new Date();
    const dateStr = `${now.toISOString().split("T")[0]} ${now.getHours().toString().padStart(2, "0")}:${now.getMinutes().toString().padStart(2, "0")}`;
    const codeNumber = (serviceApplications.length + 1).toString().padStart(2, "0");
    const code = `SVC-2026-${codeNumber}`;

    const newApp: ServiceApplication = {
      id: `app-${Date.now()}`,
      code,
      serviceId: data.serviceId,
      serviceName: data.serviceName,
      applicantName: data.applicantName,
      purpose: data.purpose,
      purok: data.purok,
      status: "Pending",
      submittedAt: dateStr,
    };

    setServiceApplications((prev) => [newApp, ...prev]);

    const newFeedItem: FeedItem = {
      id: `f-${newApp.id}`,
      time: "Just now",
      title: `Service Application Logged: ${data.serviceName}`,
      detail: `Application ${code} submitted for ${data.applicantName}`,
      kind: "Services",
      distance: data.purok,
    };
    setFeed((prev) => [newFeedItem, ...prev]);

    return newApp;
  };

  const deleteIssue = async (id: string) => {
    setIssues((prev) => prev.filter((i) => i.id !== id));
  };

  return (
    <BayanStoreContext.Provider
      value={{
        issues,
        proposals,
        feed,
        serviceApplications,
        language,
        setLanguage,
        addIssue,
        confirmIssue,
        updateIssueStatus,
        deleteIssue,
        voteProposal,
        addProposal,
        applyForService,
      }}
    >
      {children}
    </BayanStoreContext.Provider>
  );
}

export function useBayanStore() {
  const ctx = useContext(BayanStoreContext);
  if (!ctx) {
    throw new Error("useBayanStore must be used within a BayanStoreProvider");
  }
  return ctx;
}
