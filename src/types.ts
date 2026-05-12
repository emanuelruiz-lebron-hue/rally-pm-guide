import type { LucideIcon } from "lucide-react";

export type DomainId = "life" | "work" | "entertainment" | "study";

export type ModuleStatus = "empty" | "active" | "coming-soon";

export type SummaryItem = {
  label: string;
  value: string;
  detail: string;
};

export type Module = {
  id: string;
  title: string;
  description: string;
  icon: LucideIcon;
  status?: ModuleStatus;
  items?: string[];
  actionLabel?: string;
};

export type Domain = {
  id: DomainId;
  title: string;
  subtitle: string;
  description: string;
  accent: string;
  accentSoft: string;
  icon: LucideIcon;
  previewModules: string[];
  modules: Module[];
  summaryItems: SummaryItem[];
};
