import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import {
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  BarChart3,
  Bell,
  Check,
  CheckCircle2,
  ChevronDown,
  CircleHelp,
  Code2,
  Copy,
  Download,
  FileText,
  GitBranch,
  Globe2,
  History,
  LayoutDashboard,
  Link2,
  ListFilter,
  Menu,
  MessageSquareText,
  Play,
  Plus,
  Search,
  Settings,
  ShieldCheck,
  Sparkles,
  Target,
  Terminal,
  UserRound,
  X,
  Zap,
  Eye,
  Sliders,
  RefreshCw,
  ShoppingCart,
  Store,
  Globe,
} from "lucide-react";

import { SkipLink } from "../components/SkipLink";
import { FocusTrap } from "../components/FocusTrap";
import { HeatmapPreview } from "../components/HeatmapPreview";
import { PersonaSimulator } from "../components/PersonaSimulator";
import { BeforeAfterView } from "../components/BeforeAfterView";
import { CopilotPanel } from "../components/CopilotPanel";
import { ReportExporter } from "../components/ReportExporter";

import {
  Issue,
  Severity,
  initialIssues,
  userJourneys,
  presetTargets,
  getIssuesForUrl,
  calculateHealthScore,
  getSeverityStats,
  getCategoryScores,
} from "../lib/scanEngine";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "AccessLens — Audit the experience, not just the code" },
      { name: "description", content: "Accessibility auditing for rendered websites, user journeys, and developer-ready fixes." },
      { property: "og:title", content: "AccessLens — Audit the experience, not just the code" },
      { property: "og:description", content: "Find detectable accessibility barriers, understand their impact, and ship actionable fixes." },
    ],
  }),
  component: AccessLens,
});

type View = "overview" | "scan" | "issues" | "journeys" | "before-after" | "copilot" | "reports" | "integrations" | "settings";

const severityMeta: Record<Severity, { label: string; className: string; dot: string }> = {
  critical: { label: "Critical", className: "bg-critical/10 text-critical border-critical/20", dot: "bg-critical" },
  serious: { label: "Serious", className: "bg-serious/10 text-serious border-serious/20", dot: "bg-serious" },
  moderate: { label: "Moderate", className: "bg-moderate/15 text-navy border-moderate/30", dot: "bg-moderate" },
};

const navItems: { id: View; label: string; icon: typeof LayoutDashboard }[] = [
  { id: "overview", label: "Overview", icon: LayoutDashboard },
  { id: "scan", label: "New scan", icon: Plus },
  { id: "issues", label: "Issues", icon: AlertCircle },
  { id: "journeys", label: "User journeys", icon: Target },
  { id: "before-after", label: "Before / After", icon: Sliders },
  { id: "copilot", label: "Copilot AI", icon: Sparkles },
  { id: "reports", label: "Reports", icon: FileText },
  { id: "integrations", label: "Integrations", icon: GitBranch },
  { id: "settings", label: "Settings", icon: Settings },
];

function AccessLens() {
  const [inApp, setInApp] = useState(false);
  const [view, setView] = useState<View>("overview");
  const [mobileNav, setMobileNav] = useState(false);
  const [url, setUrl] = useState("www.amazon.in");
  const [issuesList, setIssuesList] = useState<Issue[]>(() => getIssuesForUrl("www.amazon.in"));
  const [selectedIssue, setSelectedIssue] = useState<Issue | null>(null);
  const [scanRunning, setScanRunning] = useState(false);
  const [scanDone, setScanDone] = useState(true);
  const [liveAnnouncement, setLiveAnnouncement] = useState("");
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const announce = (msg: string) => {
    setLiveAnnouncement(msg);
  };

  const showToast = (msg: string) => {
    setToastMsg(msg);
    announce(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  const openDemo = () => {
    setInApp(true);
    setView("overview");
    setScanDone(true);
    announce("Loaded AccessLens Audit Dashboard.");
  };

  const runScan = (targetUrlToScan?: string) => {
    const scanUrl = targetUrlToScan || url;
    setInApp(true);
    setSelectedIssue(null);
    setView("scan");
    setScanRunning(true);
    setScanDone(false);
    announce(`Starting accessibility audit scan for ${scanUrl}...`);

    window.setTimeout(() => {
      const newFindings = getIssuesForUrl(scanUrl);
      setIssuesList(newFindings);
      setScanRunning(false);
      setScanDone(true);
      setView("overview");
      announce(`Audit complete for ${scanUrl}! Loaded ${newFindings.length} findings.`);
      showToast(`Scan finished for ${scanUrl}! Health score updated.`);
    }, 1800);
  };

  const handleUpdateIssueStatus = (issueId: number, status: "open" | "fixed" | "ignored") => {
    setIssuesList((prev) =>
      prev.map((item) => (item.id === issueId ? { ...item, status } : item))
    );
    if (selectedIssue && selectedIssue.id === issueId) {
      setSelectedIssue((prev) => (prev ? { ...prev, status } : null));
    }
    const actionText = status === "fixed" ? "marked as fixed" : status === "ignored" ? "ignored" : "re-opened";
    showToast(`Issue #${issueId} ${actionText}. Health score updated!`);
  };

  if (!inApp) return <Landing onDemo={openDemo} onScan={() => runScan("www.amazon.in")} />;

  return (
    <div className="min-h-screen bg-canvas text-ink antialiased">
      <SkipLink />
      {/* Screen Reader Live Region */}
      <div role="status" aria-live="polite" className="sr-only">
        {liveAnnouncement}
      </div>

      {/* Accessible Toast Notification */}
      {toastMsg && (
        <div
          role="alert"
          aria-live="assertive"
          className="fixed bottom-5 right-5 z-50 flex items-center gap-3 rounded-lg border border-passed/30 bg-navy px-4 py-3 text-xs font-semibold text-surface shadow-xl animate-rise"
        >
          <CheckCircle2 className="size-4 text-passed shrink-0" />
          <span>{toastMsg}</span>
        </div>
      )}

      <AppShell
        view={view}
        setView={(next) => {
          setView(next);
          setSelectedIssue(null);
          setMobileNav(false);
          announce(`Navigated to ${next} view.`);
        }}
        mobileNav={mobileNav}
        setMobileNav={setMobileNav}
        onNewScan={() => {
          setView("scan");
          setScanDone(false);
        }}
        openIssuesCount={issuesList.filter((i) => i.status === "open").length}
        activeTarget={url}
      >
        {selectedIssue ? (
          <IssueDetail
            issue={selectedIssue}
            allIssues={issuesList}
            targetUrl={url}
            onBack={() => setSelectedIssue(null)}
            onUpdateStatus={handleUpdateIssueStatus}
            onSelectOtherIssue={setSelectedIssue}
          />
        ) : view === "overview" ? (
          <Overview
            url={url}
            issues={issuesList}
            onIssue={setSelectedIssue}
            onScan={() => setView("scan")}
            scanDone={scanDone}
            onNavigate={(v) => setView(v)}
          />
        ) : view === "scan" ? (
          <NewScan
            url={url}
            setUrl={setUrl}
            running={scanRunning}
            done={scanDone}
            onStart={(target) => runScan(target)}
          />
        ) : view === "issues" ? (
          <Issues issues={issuesList} onIssue={setSelectedIssue} />
        ) : view === "journeys" ? (
          <Journeys issues={issuesList} onIssue={setSelectedIssue} />
        ) : view === "before-after" ? (
          <BeforeAfterView issues={issuesList} onReScan={() => runScan(url)} />
        ) : view === "copilot" ? (
          <div className="mx-auto max-w-4xl animate-rise space-y-5">
            <PageHeading
              eyebrow="Workspace / AI Copilot"
              title="AccessLens Copilot"
              description="Ask any web accessibility question, request code patches, or clarify WCAG 2.2 rules."
            />
            <CopilotPanel issue={null} />
          </div>
        ) : view === "reports" ? (
          <Reports issues={issuesList} url={url} />
        ) : view === "integrations" ? (
          <Integrations issues={issuesList} />
        ) : (
          <SettingsView />
        )}
      </AppShell>
    </div>
  );
}

function Landing({ onDemo, onScan }: { onDemo: () => void; onScan: () => void }) {
  return (
    <div className="min-h-screen bg-canvas text-ink antialiased">
      <header className="sticky top-0 z-30 border-b border-rule bg-surface/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-3.5">
          <Brand />
          <nav aria-label="Landing Navigation" className="hidden items-center gap-7 text-[13px] font-medium text-navy md:flex">
            <a className="text-navy hover:text-action transition-colors" href="#method">Method</a>
            <a className="hover:text-action transition-colors" href="#journey">Journey</a>
            <a className="hover:text-action transition-colors" href="#reports">Reports</a>
          </nav>
          <div className="flex items-center gap-3">
            <button onClick={onDemo} className="rounded-md border border-rule px-3 py-1.5 text-[13px] font-semibold text-navy hover:bg-ink/5">
              Sign in
            </button>
            <button
              onClick={onDemo}
              className="rounded-md bg-navy px-3.5 py-1.5 text-[13px] font-semibold text-surface transition-colors hover:bg-action focus-visible:ring-2 focus-visible:ring-action"
            >
              Try Demo (www.amazon.in)
            </button>
          </div>
        </div>
      </header>
      <main id="main-content">
        <section className="relative border-b border-rule">
          <div className="mx-auto grid max-w-6xl items-center gap-10 px-6 py-14 lg:grid-cols-12 lg:py-20">
            <div className="animate-rise lg:col-span-5">
              <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-action font-bold">Automated accessibility audit</p>
              <h1 className="mt-5 max-w-[18ch] text-balance text-5xl font-extrabold leading-[1.03] tracking-tight text-navy">
                Audit the experience, not just the code.
              </h1>
              <p className="mt-5 max-w-[46ch] text-pretty text-[15px] leading-relaxed text-muted">
                AccessLens analyzes real rendered websites (e.g. <code className="font-mono font-bold text-navy">www.amazon.in</code>, <code className="font-mono font-bold text-navy">github.com</code>, or custom URLs) for accessibility barriers.
              </p>
              <div className="mt-7 flex flex-wrap items-center gap-3">
                <button
                  onClick={onScan}
                  className="rounded-md bg-navy px-5 py-2.5 text-sm font-semibold text-surface transition-colors hover:bg-action focus-visible:ring-2 focus-visible:ring-action"
                >
                  Scan www.amazon.in
                </button>
                <button
                  onClick={onDemo}
                  className="rounded-md border border-rule px-5 py-2.5 text-sm font-semibold text-navy hover:bg-ink/5 focus-visible:ring-2 focus-visible:ring-action"
                >
                  View Demo Report
                </button>
              </div>
              <div className="mt-8 grid grid-cols-3 gap-4 border-t border-rule pt-5">
                <Stat value="214" label="Rules checked" />
                <Stat value="WCAG 2.2" label="A · AA · AAA" />
                <Stat value="5" label="Test personas" />
              </div>
            </div>
            <div className="animate-rise lg:col-span-7" style={{ animationDelay: "100ms" }}>
              <ReportMockup onIssue={onDemo} />
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

function AppShell({
  children,
  view,
  setView,
  mobileNav,
  setMobileNav,
  onNewScan,
  openIssuesCount,
  activeTarget,
}: {
  children: React.ReactNode;
  view: View;
  setView: (view: View) => void;
  mobileNav: boolean;
  setMobileNav: (value: boolean) => void;
  onNewScan: () => void;
  openIssuesCount: number;
  activeTarget: string;
}) {
  return (
    <div className="flex min-h-screen">
      <aside
        aria-label="Sidebar Navigation"
        className={`fixed inset-y-0 left-0 z-40 flex w-64 flex-col border-r border-rule bg-surface transition-transform lg:static lg:translate-x-0 ${
          mobileNav ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex h-16 items-center justify-between border-b border-rule px-5">
          <Brand />
          <button
            onClick={() => setMobileNav(false)}
            className="rounded-md p-1.5 text-navy hover:bg-ink/5 lg:hidden"
            aria-label="Close sidebar navigation"
          >
            <X className="size-5" />
          </button>
        </div>
        <div className="flex-1 px-3 py-5 overflow-y-auto">
          <p className="px-3 pb-2 font-mono text-[10px] uppercase tracking-[0.17em] text-muted font-bold">Workspace</p>
          <nav aria-label="Main navigation" className="space-y-1">
            {navItems.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setView(id)}
                className={`flex w-full items-center gap-3 rounded-md px-3 py-2.5 text-left text-sm font-semibold transition-colors ${
                  view === id
                    ? "bg-navy text-surface font-bold shadow-xs"
                    : "text-navy hover:bg-ink/5"
                }`}
              >
                <Icon className="size-4 shrink-0" />
                <span>{label}</span>
                {id === "issues" && (
                  <span
                    className={`ml-auto rounded-full px-2 py-0.5 font-mono text-[10px] ${
                      view === id ? "bg-surface/20 text-surface" : "bg-critical/10 text-critical font-bold"
                    }`}
                  >
                    {openIssuesCount}
                  </span>
                )}
              </button>
            ))}
          </nav>
          <div className="mt-7 rounded-lg border border-rule bg-canvas p-3 shadow-xs">
            <div className="flex items-center gap-2">
              <span className="relative size-2 rounded-full bg-passed">
                <span className="absolute size-2 animate-ping rounded-full bg-passed/50" />
              </span>
              <span className="text-xs font-bold text-navy truncate">{activeTarget}</span>
            </div>
            <p className="mt-1.5 truncate font-mono text-[10px] text-muted">Target Audit Active</p>
            <button
              onClick={onNewScan}
              className="mt-3 flex w-full items-center justify-center gap-2 rounded-md border border-rule bg-surface py-1.5 text-xs font-bold text-navy transition hover:bg-ink/5"
            >
              <Plus className="size-3.5" /> New scan
            </button>
          </div>
        </div>
        <div className="border-t border-rule p-3">
          <div className="flex items-center gap-3 rounded-md px-3 py-2">
            <div className="grid size-8 place-items-center rounded-full bg-navy text-xs font-bold text-surface">
              JD
            </div>
            <div className="min-w-0">
              <p className="truncate text-xs font-bold text-navy">Jordan Davis</p>
              <p className="truncate font-mono text-[10px] text-muted">Pro Auditor Workspace</p>
            </div>
          </div>
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-rule bg-surface/80 px-4 backdrop-blur-md lg:px-8">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileNav(!mobileNav)}
              className="rounded-md p-2 text-navy hover:bg-ink/5 lg:hidden"
              aria-label="Open navigation menu"
            >
              <Menu className="size-5" />
            </button>
            <div className="hidden items-center gap-2 text-xs text-navy sm:flex font-medium">
              <Search className="size-4 text-muted" />
              <span>Search target sites, findings, user journeys…</span>
              <kbd className="ml-2 rounded border border-rule px-1.5 py-0.5 font-mono text-[9px] text-muted">⌘K</kbd>
            </div>
            <span className="font-mono text-[10px] uppercase tracking-wider text-navy font-bold sm:hidden">
              AccessLens
            </span>
          </div>
          <div className="flex items-center gap-3">
            <button className="rounded-md p-2 text-navy hover:bg-ink/5" aria-label="Notifications">
              <Bell className="size-4" />
            </button>
            <div className="hidden h-5 w-px bg-rule sm:block" />
            <div className="grid size-8 place-items-center rounded-full bg-navy text-xs font-bold text-surface">
              JD
            </div>
          </div>
        </header>

        <main id="main-content" className="flex-1 px-4 py-7 sm:px-6 lg:px-10">
          {children}
        </main>
      </div>
    </div>
  );
}

function Overview({
  url,
  issues,
  onIssue,
  onScan,
  scanDone,
  onNavigate,
}: {
  url: string;
  issues: Issue[];
  onIssue: (issue: Issue) => void;
  onScan: () => void;
  scanDone: boolean;
  onNavigate: (view: View) => void;
}) {
  const openIssues = issues.filter((i) => i.status === "open");
  const healthScore = calculateHealthScore(issues);

  return (
    <div className="mx-auto max-w-7xl animate-rise space-y-6">
      <PageHeading
        eyebrow={`Target: ${url} · Sep 20, 2026`}
        title={`Accessibility Audit Overview (${url})`}
        description={`Rendered accessibility evaluation for ${url}.`}
        action={
          <div className="flex items-center gap-2">
            <button
              onClick={() => onNavigate("before-after")}
              className="flex items-center gap-2 rounded-md border border-rule bg-surface px-3.5 py-2 text-xs font-bold text-navy hover:bg-ink/5"
            >
              <Sliders className="size-4 text-action" /> Before/After
            </button>
            <button
              onClick={onScan}
              className="flex items-center gap-2 rounded-md bg-navy px-4 py-2 text-xs font-bold text-surface hover:bg-action focus-visible:ring-2 focus-visible:ring-action"
            >
              <Plus className="size-4" /> Change Target / Scan
            </button>
          </div>
        }
      />

      {scanDone && (
        <div className="flex items-center justify-between rounded-md border border-passed/30 bg-passed/10 px-4 py-3 text-xs text-passed font-semibold shadow-xs">
          <div className="flex items-center gap-3">
            <CheckCircle2 className="size-4 shrink-0" />
            <span>Audit scan loaded with {issues.length} active findings for {url}.</span>
          </div>
          <span className="font-mono text-[10px] uppercase tracking-wider font-bold">Active Engine</span>
        </div>
      )}

      {/* Top 3 Score Cards */}
      <div className="grid gap-5 xl:grid-cols-[1.25fr_1fr_1fr]">
        <ScoreCard score={healthScore} openCount={openIssues.length} url={url} />
        <SeverityCard issues={issues} />
        <RegressionCard score={healthScore} />
      </div>

      {/* Persona Testing Simulator Component */}
      <PersonaSimulator issues={issues} onSelectIssue={onIssue} />

      {/* Issues & Journey Section */}
      <div className="grid gap-5 xl:grid-cols-[1.45fr_1fr]">
        <IssueList issues={openIssues.slice(0, 5)} onIssue={onIssue} onViewAll={() => onNavigate("issues")} />
        <JourneyCard onNavigate={onNavigate} />
      </div>

      {/* Category Breakdown & Timeline */}
      <div className="grid gap-5 md:grid-cols-2">
        <CategoryCard issues={issues} />
        <HistoryCard score={healthScore} />
      </div>

      <Disclaimer />
    </div>
  );
}

function NewScan({
  url,
  setUrl,
  running,
  done,
  onStart,
}: {
  url: string;
  setUrl: (value: string) => void;
  running: boolean;
  done: boolean;
  onStart: (targetUrl?: string) => void;
}) {
  const steps = [
    "Initializing browser automation engine",
    "Loading live website DOM tree",
    "Analyzing DOM element hierarchy",
    "Inspecting accessibility tree & ARIA roles",
    "Checking color contrast thresholds",
    "Checking form labels & error status regions",
    "Checking keyboard focus traps & tab order",
    "Analyzing simulated user journeys",
    "Generating executive report",
  ];

  return (
    <div className="mx-auto max-w-5xl animate-rise space-y-6">
      <PageHeading
        eyebrow="Workspace / New scan"
        title="Start Accessibility Audit Scan"
        description="Analyze rendered website target (e.g. www.amazon.in, github.com, or your custom URL) against deterministic WCAG 2.2 rules."
      />

      {/* Preset Target URL Chips */}
      <div className="rounded-lg border border-rule bg-surface p-4 shadow-xs">
        <p className="font-mono text-[10px] uppercase tracking-wider text-muted font-bold">Quick Target Presets</p>
        <div className="mt-2.5 flex flex-wrap gap-2">
          {presetTargets.map((preset) => (
            <button
              key={preset.id}
              onClick={() => {
                setUrl(preset.domain);
                onStart(preset.domain);
              }}
              className={`flex items-center gap-2 rounded-md border px-3 py-2 text-xs font-bold transition ${
                url === preset.domain
                  ? "border-action bg-action/10 text-action shadow-xs"
                  : "border-rule bg-canvas text-navy hover:bg-ink/5"
              }`}
            >
              <span>{preset.name}</span>
              <span className="font-mono text-[10px] text-muted">({preset.domain})</span>
            </button>
          ))}
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="rounded-lg border border-rule bg-surface p-6 shadow-xs">
          <div className="flex items-center gap-2 border-b border-rule pb-3">
            <Globe2 className="size-4 text-action" />
            <h2 className="font-bold text-navy text-sm">Scan target configuration</h2>
          </div>

          <label className="mt-5 block text-xs font-bold text-navy">
            Website Target URL
            <input
              value={url}
              onChange={(event) => setUrl(event.target.value)}
              className="mt-2 h-11 w-full rounded-md border border-rule bg-canvas px-3 font-mono text-xs font-bold text-navy outline-none transition focus:border-action focus:ring-2 focus:ring-action/20"
              placeholder="e.g. www.amazon.in, github.com, or your website"
            />
          </label>

          <div className="mt-5 grid gap-3 sm:grid-cols-3">
            <Choice title="Single page" text="Fast single URL scan" selected />
            <Choice title="Website crawl" text="Up to 50 pages" />
            <Choice title="User journey" text="Flows & forms" />
          </div>

          <div className="mt-6 border-t border-rule pt-5">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-navy">Standards and conformance</h3>
              <button className="flex items-center gap-1.5 text-xs font-bold text-action hover:underline">
                <Settings className="size-3.5" /> Advanced options
              </button>
            </div>
            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              <select className="h-10 rounded-md border border-rule bg-surface px-3 text-xs font-bold text-navy">
                <option>WCAG 2.2 Standard</option>
                <option>WCAG 2.1 Standard</option>
              </select>
              <select className="h-10 rounded-md border border-rule bg-surface px-3 text-xs font-bold text-navy">
                <option>Level AA (Recommended)</option>
                <option>Level A (Baseline)</option>
                <option>Level AAA (Strict)</option>
              </select>
            </div>
          </div>

          <button
            onClick={() => onStart(url)}
            disabled={running}
            className="mt-7 flex h-11 w-full items-center justify-center gap-2 rounded-md bg-navy text-xs font-bold text-surface transition hover:bg-action disabled:opacity-60 focus-visible:ring-2 focus-visible:ring-action shadow-xs"
          >
            {running ? (
              <>
                <Zap className="size-4 animate-pulse text-passed" /> Auditing {url}...
              </>
            ) : (
              <>
                <Play className="size-4" /> {done ? `Re-scan ${url}` : `Start audit scan for ${url}`}
              </>
            )}
          </button>
        </div>

        <ScanProgress running={running} done={done} steps={steps} />
      </div>
    </div>
  );
}

function ScanProgress({ running, done, steps }: { running: boolean; done: boolean; steps: string[] }) {
  const activeIndex = done ? steps.length : running ? 6 : 0;
  return (
    <div className="rounded-lg border border-rule bg-surface p-6 shadow-xs">
      <div className="flex items-center justify-between border-b border-rule pb-4">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-wider text-muted font-bold">Execution Status</p>
          <h2 className="mt-1 font-bold text-navy text-sm">{done ? "Report Ready" : running ? "Audit Engine Active" : "Idle"}</h2>
        </div>
        <span
          className={`rounded-full px-2.5 py-1 font-mono text-[10px] uppercase tracking-wider font-bold ${
            done ? "bg-passed/10 text-passed" : running ? "bg-action/10 text-action" : "bg-ink/5 text-muted"
          }`}
        >
          {done ? "Complete" : running ? "In Progress" : "Ready"}
        </span>
      </div>
      <div className="mt-5 space-y-3">
        {steps.map((step, index) => (
          <div
            key={step}
            className={`relative flex items-center gap-3 text-xs ${
              index > activeIndex ? "text-muted" : "text-navy font-bold"
            }`}
          >
            <span
              className={`grid size-5 shrink-0 place-items-center rounded-full border ${
                index < activeIndex || done
                  ? "border-passed bg-passed text-surface font-bold"
                  : index === activeIndex && running
                  ? "border-action text-action"
                  : "border-rule text-muted"
              }`}
            >
              {index < activeIndex || done ? (
                <Check className="size-3" />
              ) : (
                <span className="font-mono text-[9px]">{index + 1}</span>
              )}
            </span>
            <span className="flex-1 truncate">{step}</span>
            {(index < activeIndex || done) && <span className="font-mono text-[10px] text-passed font-bold">done</span>}
          </div>
        ))}
      </div>
    </div>
  );
}

function Issues({ issues, onIssue }: { issues: Issue[]; onIssue: (issue: Issue) => void }) {
  const [severity, setSeverity] = useState("All severities");
  const [category, setCategory] = useState("All categories");
  const [statusFilter, setStatusFilter] = useState("All status");
  const [searchQuery, setSearchQuery] = useState("");

  const filtered = issues.filter((issue) => {
    if (severity !== "All severities" && severityMeta[issue.severity].label !== severity) return false;
    if (category !== "All categories" && issue.category !== category) return false;
    if (statusFilter !== "All status" && issue.status !== statusFilter.toLowerCase()) return false;
    if (searchQuery.trim() !== "") {
      const q = searchQuery.toLowerCase();
      return issue.title.toLowerCase().includes(q) || issue.selector.toLowerCase().includes(q) || issue.wcag.toLowerCase().includes(q);
    }
    return true;
  });

  return (
    <div className="mx-auto max-w-7xl animate-rise space-y-6">
      <PageHeading
        eyebrow="Workspace / Findings"
        title="Detected Barriers & Findings"
        description="Review, triage, and inspect detectable accessibility barriers."
      />

      {/* Search & Filter Bar */}
      <div className="flex flex-wrap items-center gap-3 rounded-lg border border-rule bg-surface p-4 shadow-xs">
        <div className="flex flex-1 items-center gap-2 rounded-md border border-rule bg-canvas px-3 py-1.5 min-w-[220px]">
          <Search className="size-4 text-muted shrink-0" />
          <input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by title, WCAG, or selector..."
            className="w-full text-xs outline-none bg-transparent text-navy font-medium"
          />
        </div>

        <select
          value={severity}
          onChange={(event) => setSeverity(event.target.value)}
          className="h-9 rounded-md border border-rule bg-surface px-3 text-xs font-bold text-navy"
        >
          <option>All severities</option>
          <option>Critical</option>
          <option>Serious</option>
          <option>Moderate</option>
        </select>

        <select
          value={category}
          onChange={(event) => setCategory(event.target.value)}
          className="h-9 rounded-md border border-rule bg-surface px-3 text-xs font-bold text-navy"
        >
          <option>All categories</option>
          <option>Keyboard</option>
          <option>Forms</option>
          <option>Color</option>
          <option>ARIA</option>
          <option>Images</option>
          <option>Structure</option>
          <option>Navigation</option>
        </select>

        <select
          value={statusFilter}
          onChange={(event) => setStatusFilter(event.target.value)}
          className="h-9 rounded-md border border-rule bg-surface px-3 text-xs font-bold text-navy"
        >
          <option>All status</option>
          <option>Open</option>
          <option>Fixed</option>
          <option>Ignored</option>
        </select>

        <span className="ml-auto font-mono text-[10px] uppercase tracking-wider text-muted font-bold">
          {filtered.length} findings
        </span>
      </div>

      {/* Issues Table */}
      <div className="overflow-hidden rounded-lg border border-rule bg-surface shadow-xs">
        <div className="hidden grid-cols-[110px_1fr_180px_130px_90px_90px] gap-4 border-b border-rule bg-canvas px-5 py-3 font-mono text-[10px] uppercase tracking-wider text-muted font-bold md:grid">
          <span>Severity</span>
          <span>Finding</span>
          <span>WCAG criterion</span>
          <span>Target Page</span>
          <span>Status</span>
          <span />
        </div>
        {filtered.length === 0 ? (
          <div className="p-8 text-center text-xs font-medium text-muted">No matching findings for the selected filters.</div>
        ) : (
          filtered.map((issue) => (
            <div
              key={issue.id}
              onClick={() => onIssue(issue)}
              className="grid w-full gap-3 border-b border-rule px-5 py-4 text-left transition-colors last:border-0 hover:bg-ink/[0.025] cursor-pointer md:grid-cols-[110px_1fr_180px_130px_90px_90px] md:items-center md:gap-4"
            >
              <span className={`flex w-fit items-center gap-1.5 rounded px-2 py-0.5 font-mono text-[10px] font-bold uppercase tracking-wider border ${severityMeta[issue.severity].className}`}>
                <span className={`size-1.5 rounded-full ${severityMeta[issue.severity].dot}`} />
                {severityMeta[issue.severity].label}
              </span>

              <div className="min-w-0">
                <strong className={`block truncate text-xs font-bold text-navy ${issue.status === "fixed" ? "line-through text-muted" : ""}`}>
                  {issue.title}
                </strong>
                <span className="mt-0.5 block truncate font-mono text-[10px] text-muted font-medium">{issue.selector}</span>
              </div>

              <span className="text-xs text-navy font-mono font-medium">{issue.wcag}</span>
              <span className="font-mono text-xs text-navy font-medium">{issue.page}</span>

              <span className={`font-mono text-[10px] uppercase font-bold ${issue.status === "fixed" ? "text-passed" : issue.status === "ignored" ? "text-muted" : "text-critical"}`}>
                {issue.status}
              </span>

              <span className="flex items-center gap-1 text-xs font-bold text-action">
                Inspect <ArrowRight className="size-3.5" />
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

function IssueDetail({
  issue,
  allIssues,
  targetUrl,
  onBack,
  onUpdateStatus,
  onSelectOtherIssue,
}: {
  issue: Issue;
  allIssues: Issue[];
  targetUrl: string;
  onBack: () => void;
  onUpdateStatus: (id: number, status: "open" | "fixed" | "ignored") => void;
  onSelectOtherIssue: (issue: Issue) => void;
}) {
  const [copied, setCopied] = useState(false);
  const meta = severityMeta[issue.severity];

  const copyFix = () => {
    void navigator.clipboard?.writeText(issue.fix);
    setCopied(true);
    setTimeout(() => setCopied(false), 1600);
  };

  return (
    <div className="mx-auto max-w-7xl animate-rise space-y-6">
      <button onClick={onBack} className="flex items-center gap-2 text-xs font-bold text-navy hover:underline">
        <ArrowLeft className="size-4" /> Back to findings matrix
      </button>

      <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <div className="space-y-5">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className={`rounded border px-2 py-0.5 font-mono text-[10px] font-bold uppercase tracking-wider ${meta.className}`}>
                {meta.label}
              </span>
              <span className="font-mono text-[10px] uppercase tracking-wider text-muted font-bold">Issue AL-{String(issue.id).padStart(3, "0")}</span>
              <span className={`ml-auto rounded px-2 py-0.5 font-mono text-[10px] uppercase font-bold ${issue.status === "fixed" ? "bg-passed/10 text-passed" : "bg-critical/10 text-critical"}`}>
                Status: {issue.status}
              </span>
            </div>
            <h1 className="mt-3 text-2xl font-bold tracking-tight text-navy">{issue.title}</h1>
            <p className="mt-1 text-xs text-navy font-medium">
              Target Site <span className="font-mono font-bold text-action">{targetUrl}</span> · Target Page <span className="font-mono text-navy font-bold">{issue.page}</span> · WCAG {issue.wcag}
            </p>
          </div>

          <HeatmapPreview issue={issue} allIssues={allIssues} targetUrl={targetUrl} onSelectIssue={onSelectOtherIssue} />

          <div className="rounded-lg border border-rule bg-surface p-5 shadow-xs">
            <div className="flex items-center justify-between border-b border-rule pb-3">
              <div>
                <p className="font-mono text-[10px] uppercase tracking-wider text-muted font-bold">Detected DOM Excerpt</p>
                <p className="text-xs font-bold text-navy">Target Element Selector</p>
              </div>
              <button
                onClick={() => void navigator.clipboard?.writeText(issue.selector)}
                className="rounded-md p-1.5 text-navy hover:bg-ink/5"
                aria-label="Copy selector text"
              >
                <Copy className="size-4" />
              </button>
            </div>
            <pre className="mt-3 overflow-x-auto rounded-md bg-navy p-4 font-mono text-xs leading-relaxed text-surface font-medium">
              {issue.codeSnippet}
            </pre>
          </div>
        </div>

        <div className="space-y-5">
          <div className="rounded-lg border border-rule bg-surface p-5 shadow-xs">
            <p className="font-mono text-[10px] uppercase tracking-wider text-action font-bold">User Impact Assessment</p>
            <h2 className="mt-1 text-base font-bold text-navy">Understand the barrier</h2>
            <p className="mt-2 text-xs leading-relaxed text-navy font-medium">{issue.explanation}</p>
            <div className="mt-4 flex items-start gap-3 rounded-md bg-canvas p-3">
              <UserRound className="mt-0.5 size-4 shrink-0 text-action" />
              <div>
                <p className="text-xs font-bold text-navy">Who is affected?</p>
                <p className="mt-0.5 text-xs text-navy font-medium">{issue.users}</p>
              </div>
            </div>
          </div>

          <div className="rounded-lg border border-rule bg-surface p-5 shadow-xs">
            <div className="flex items-center justify-between border-b border-rule pb-3">
              <div>
                <p className="font-mono text-[10px] uppercase tracking-wider text-passed font-bold">Suggested Remediation Patch</p>
                <h2 className="text-base font-bold text-navy">Developer Code Fix</h2>
              </div>
              <Code2 className="size-5 text-action" />
            </div>
            <pre className="mt-3 overflow-x-auto rounded-md bg-navy p-4 font-mono text-xs leading-relaxed text-surface font-medium">
              {issue.fix}
            </pre>
            <div className="mt-4 flex flex-wrap gap-2">
              <button
                onClick={copyFix}
                className="flex items-center gap-2 rounded-md bg-navy px-3.5 py-2 text-xs font-bold text-surface hover:bg-action"
              >
                {copied ? <Check className="size-3.5" /> : <Copy className="size-3.5" />}
                {copied ? "Copied" : "Copy fix snippet"}
              </button>

              <button
                onClick={() => onUpdateStatus(issue.id, issue.status === "fixed" ? "open" : "fixed")}
                className={`flex items-center gap-2 rounded-md border px-3 py-2 text-xs font-bold ${
                  issue.status === "fixed" ? "border-passed/30 bg-passed/10 text-passed" : "border-rule text-navy hover:bg-ink/5"
                }`}
              >
                <CheckCircle2 className="size-3.5" />
                {issue.status === "fixed" ? "Marked as Fixed" : "Mark as Fixed"}
              </button>

              <button
                onClick={() => onUpdateStatus(issue.id, issue.status === "ignored" ? "open" : "ignored")}
                className="rounded-md border border-rule px-3 py-2 text-xs font-bold text-navy hover:bg-ink/5"
              >
                {issue.status === "ignored" ? "Re-open" : "Ignore"}
              </button>
            </div>
          </div>

          <CopilotPanel issue={issue} />
        </div>
      </div>
    </div>
  );
}

function Journeys({ issues, onIssue }: { issues: Issue[]; onIssue: (issue: Issue) => void }) {
  const [selectedJourney, setSelectedJourney] = useState(userJourneys[0]);

  return (
    <div className="mx-auto max-w-7xl animate-rise space-y-6">
      <PageHeading
        eyebrow="Workspace / User journeys"
        title="Accessibility Journey Testing"
        description="Evaluate multi-step workflows (checkout, login, registration) using persona testing profiles."
      />

      <div className="grid gap-6 lg:grid-cols-[1fr_0.85fr]">
        <div className="rounded-lg border border-rule bg-surface p-5 shadow-xs">
          <div className="flex items-center justify-between border-b border-rule pb-4">
            <div>
              <p className="font-mono text-[10px] uppercase tracking-wider text-muted font-bold">Workflow simulation</p>
              <h2 className="mt-1 text-lg font-bold text-navy">{selectedJourney.title}</h2>
            </div>
            <span className="rounded-full bg-serious/10 px-2.5 py-1 font-mono text-[10px] uppercase tracking-wider text-serious font-bold">
              {selectedJourney.status}
            </span>
          </div>

          <div className="mt-5 space-y-4">
            {selectedJourney.steps.map((step) => (
              <div key={step.id} className="flex items-start gap-3 rounded-lg border border-rule p-3 bg-canvas/40">
                <div
                  className={`grid size-7 place-items-center rounded-full mt-0.5 shrink-0 ${
                    step.status === "passed"
                      ? "bg-passed/10 text-passed"
                      : step.status === "warning"
                      ? "bg-serious/10 text-serious"
                      : "bg-critical/10 text-critical"
                  }`}
                >
                  {step.status === "passed" ? (
                    <Check className="size-4" />
                  ) : step.status === "warning" ? (
                    <AlertCircle className="size-4" />
                  ) : (
                    <X className="size-4" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-bold text-navy">{step.label}</p>
                    <span className="font-mono text-[10px] text-muted font-medium">{step.page}</span>
                  </div>
                  <p className="mt-1 text-xs text-navy font-medium leading-relaxed">{step.details}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-5">
          <div className="rounded-lg border border-critical/20 bg-critical/5 p-5 shadow-xs">
            <div className="flex items-center gap-2 text-critical font-bold">
              <AlertCircle className="size-5" />
              <h2>Journey Blocked Alert</h2>
            </div>
            <p className="mt-2 text-xs leading-relaxed text-navy font-medium">
              Keyboard focus was lost when payment gateway modal opened in Step 7. Users navigating via Tab key cannot confirm payment.
            </p>
          </div>

          <div className="rounded-lg border border-rule bg-surface p-5 shadow-xs">
            <p className="font-mono text-[10px] uppercase tracking-wider text-muted font-bold">Workflow Health Metric</p>
            <div className="mt-2 flex items-end justify-between">
              <span className="font-mono text-4xl font-bold text-navy">{selectedJourney.health}%</span>
              <span className="font-mono text-xs text-serious font-bold">Needs attention</span>
            </div>
            <div className="mt-3 h-2 overflow-hidden rounded-full bg-ink/10">
              <div className="h-full rounded-full bg-serious" style={{ width: `${selectedJourney.health}%` }} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Reports({ issues, url }: { issues: Issue[]; url: string }) {
  return (
    <div className="mx-auto max-w-6xl animate-rise space-y-6">
      <PageHeading
        eyebrow="Workspace / Reports"
        title="Audit Report Generation & Export"
        description="Share a clear record of automated findings, developer fixes, and agency branding."
      />
      <ReportExporter issues={issues} url={url} />
    </div>
  );
}

function Integrations({ issues }: { issues: Issue[] }) {
  const [ciRunning, setCiRunning] = useState(false);
  const [ciSuccess, setCiSuccess] = useState<boolean | null>(null);

  const runCiCheck = () => {
    setCiRunning(true);
    setCiSuccess(null);
    setTimeout(() => {
      setCiRunning(false);
      setCiSuccess(false);
    }, 1500);
  };

  return (
    <div className="mx-auto max-w-6xl animate-rise space-y-6">
      <PageHeading
        eyebrow="Workspace / Integrations"
        title="CI/CD & Platform Integrations"
        description="Integrate automated accessibility barriers detection into GitHub Actions, Vercel, and WordPress."
      />

      <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {[
          { title: "GitHub Actions", text: "Fail CI builds when new critical or serious findings appear.", icon: Zap, status: "Available" },
          { title: "GitHub Pull Requests", text: "Annotate changed files directly inside pull request reviews.", icon: GitBranch, status: "Available" },
          { title: "Vercel Deployments", text: "Compare accessibility health score trends across production deploys.", icon: Globe2, status: "Coming soon" },
          { title: "WordPress Plugin", text: "Scan WordPress pages automatically on publish.", icon: Link2, status: "Available" },
        ].map(({ title, text, icon: Icon, status }) => (
          <div key={title} className="rounded-lg border border-rule bg-surface p-5 shadow-xs">
            <div className="flex items-center justify-between">
              <div className="grid size-10 place-items-center rounded-md bg-navy text-surface">
                <Icon className="size-5" />
              </div>
              <span className="rounded-full bg-passed/10 px-2.5 py-0.5 font-mono text-[9px] uppercase tracking-wider text-passed font-bold">
                {status}
              </span>
            </div>
            <h2 className="mt-4 font-bold text-navy text-sm">{title}</h2>
            <p className="mt-1 text-xs text-navy font-medium leading-relaxed min-h-10">{text}</p>
            <button className="mt-4 flex items-center gap-1.5 text-xs font-bold text-action hover:underline">
              Configure <ArrowRight className="size-3.5" />
            </button>
          </div>
        ))}
      </div>

      <div className="rounded-lg border border-rule bg-surface p-6 shadow-xs">
        <div className="flex items-center justify-between border-b border-rule pb-4">
          <div className="flex items-center gap-2">
            <GitBranch className="size-4 text-action" />
            <h2 className="font-bold text-navy text-sm">GitHub Pull Request #42 Accessibility Audit Action</h2>
          </div>
          <button
            onClick={runCiCheck}
            disabled={ciRunning}
            className="flex items-center gap-2 rounded-md bg-navy px-3.5 py-1.5 text-xs font-bold text-surface hover:bg-action disabled:opacity-60"
          >
            <RefreshCw className={`size-3.5 ${ciRunning ? "animate-spin" : ""}`} /> Run CI Check
          </button>
        </div>

        <div className="mt-4 rounded-md bg-navy p-4 font-mono text-xs text-surface">
          {ciRunning ? (
            <p className="text-action">⏳ Running automated accessibility check on PR #42...</p>
          ) : ciSuccess === false ? (
            <div>
              <p className="text-critical font-bold">❌ Accessibility Check Failed on PR #42</p>
              <p className="mt-2 text-surface/80">3 critical barriers detected in modified files.</p>
            </div>
          ) : (
            <p className="text-passed font-bold">✓ PR #42 ready for execution check.</p>
          )}
        </div>
      </div>
    </div>
  );
}

function SettingsView() {
  return (
    <div className="mx-auto max-w-4xl animate-rise space-y-6">
      <PageHeading eyebrow="Workspace / Settings" title="Workspace Preferences" description="Manage your AccessLens auditor account and defaults." />
      <div className="rounded-lg border border-rule bg-surface p-6 shadow-xs">
        <div className="flex items-center gap-3 border-b border-rule pb-5">
          <div className="grid size-10 place-items-center rounded-full bg-navy text-sm font-bold text-surface">JD</div>
          <div>
            <h2 className="font-bold text-navy text-sm">Jordan Davis</h2>
            <p className="text-xs text-muted font-medium">jordan@demo-company.com</p>
          </div>
        </div>
        <div className="grid gap-5 pt-5 sm:grid-cols-2">
          <label className="text-xs font-bold text-navy">
            Workspace Name
            <input className="mt-1.5 h-10 w-full rounded-md border border-rule bg-canvas px-3 text-xs font-bold text-navy" value="Demo Auditor Workspace" readOnly />
          </label>
          <label className="text-xs font-bold text-navy">
            Default WCAG Conformance Target
            <select className="mt-1.5 h-10 w-full rounded-md border border-rule bg-canvas px-3 text-xs font-bold text-navy">
              <option>WCAG 2.2 · Level AA</option>
              <option>WCAG 2.1 · Level AA</option>
            </select>
          </label>
        </div>
      </div>
    </div>
  );
}

function ScoreCard({ score, openCount, url }: { score: number; openCount: number; url: string }) {
  return (
    <div className="rounded-lg border border-rule bg-surface p-5 shadow-xs">
      <div className="flex items-center justify-between">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-wider text-muted font-bold">Internal Health Metric</p>
          <h2 className="mt-0.5 text-base font-bold text-navy">Accessibility Health Score</h2>
        </div>
        <span className={`rounded-full px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-wider font-bold ${score >= 90 ? "bg-passed/15 text-passed" : "bg-serious/15 text-serious"}`}>
          {score >= 90 ? "Passed" : "Needs Attention"}
        </span>
      </div>
      <div className="mt-4 flex items-center gap-5">
        <div className="score-ring grid size-28 shrink-0 place-items-center">
          <div className="grid size-[5.4rem] place-items-center rounded-full bg-surface">
            <div className="text-center">
              <div className="font-mono text-3xl font-bold text-navy">{score}</div>
              <div className="font-mono text-[9px] uppercase tracking-wider text-muted font-bold">/ 100</div>
            </div>
          </div>
        </div>
        <div className="space-y-1">
          <p className="text-xs text-navy font-bold">{url}</p>
          <p className="text-xs text-muted leading-relaxed font-medium">Health rating calculated from open findings.</p>
          <p className="font-mono text-[10px] text-muted font-bold">{openCount} active finding{openCount === 1 ? "" : "s"} open.</p>
        </div>
      </div>
    </div>
  );
}

function SeverityCard({ issues }: { issues: Issue[] }) {
  const stats = getSeverityStats(issues);
  return (
    <div className="rounded-lg border border-rule bg-surface p-5 shadow-xs">
      <div className="flex items-center justify-between border-b border-rule pb-3">
        <h2 className="font-bold text-navy text-sm">Findings by Severity</h2>
        <BarChart3 className="size-4 text-muted" />
      </div>
      <div className="mt-4 space-y-3.5">
        {[
          { key: "critical", value: stats.critical, color: "bg-critical text-critical" },
          { key: "serious", value: stats.serious, color: "bg-serious text-serious" },
          { key: "moderate", value: stats.moderate, color: "bg-moderate text-navy" },
          { key: "passed", value: stats.passed, color: "bg-passed text-passed" },
        ].map(({ key, value, color }) => (
          <div key={key}>
            <div className="flex justify-between font-mono text-[10px] uppercase tracking-wider">
              <span className="font-bold capitalize text-navy">{key}</span>
              <span className="font-bold text-navy">{value}</span>
            </div>
            <div className="mt-1 h-1.5 rounded-full bg-ink/10">
              <div className={`h-full rounded-full ${color.split(" ")[0]}`} style={{ width: `${Math.min(100, (value / 10) * 100)}%` }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function RegressionCard({ score }: { score: number }) {
  return (
    <div className="rounded-lg border border-critical/20 bg-critical/5 p-5 shadow-xs">
      <div className="flex items-center gap-2 text-critical font-bold text-sm">
        <History className="size-4" />
        <h2>Regression Monitoring</h2>
      </div>
      <div className="mt-4 flex items-end gap-4">
        <div>
          <span className="font-mono text-2xl text-muted font-bold">92</span>
          <p className="font-mono text-[9px] uppercase tracking-wider text-muted font-bold">Previous</p>
        </div>
        <ArrowRight className="mb-4 size-4 text-muted" />
        <div>
          <span className="font-mono text-2xl font-bold text-critical">{score}</span>
          <p className="font-mono text-[9px] uppercase tracking-wider text-muted font-bold">Current</p>
        </div>
      </div>
      <p className="mt-3 text-xs font-bold text-critical">Automated Regression Warning</p>
      <p className="mt-0.5 text-[11px] text-muted font-medium">Score reflects active findings triage status.</p>
    </div>
  );
}

function IssueList({ issues: list, onIssue, onViewAll }: { issues: Issue[]; onIssue: (issue: Issue) => void; onViewAll: () => void }) {
  return (
    <div className="rounded-lg border border-rule bg-surface shadow-xs">
      <div className="flex items-center justify-between border-b border-rule px-5 py-4">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-wider text-muted font-bold">Priority findings</p>
          <h2 className="mt-0.5 font-bold text-navy text-sm">Open Audit Findings</h2>
        </div>
        <button onClick={onViewAll} className="text-xs font-bold text-action hover:underline">
          View all
        </button>
      </div>
      <div className="divide-y divide-rule">
        {list.map((issue) => (
          <button
            key={issue.id}
            onClick={() => onIssue(issue)}
            className="flex w-full items-center gap-3 px-5 py-3.5 text-left transition hover:bg-ink/[0.025]"
          >
            <span className={`size-2 shrink-0 rounded-full ${severityMeta[issue.severity].dot}`} />
            <div className="min-w-0 flex-1">
              <p className="truncate text-xs font-bold text-navy">{issue.title}</p>
              <p className="mt-0.5 truncate font-mono text-[10px] text-muted font-medium">{issue.wcag} · {issue.page}</p>
            </div>
            <ArrowRight className="size-4 shrink-0 text-muted" />
          </button>
        ))}
      </div>
    </div>
  );
}

function JourneyCard({ onNavigate }: { onNavigate: (v: View) => void }) {
  return (
    <div className="rounded-lg border border-rule bg-surface p-5 shadow-xs">
      <div className="flex items-center justify-between">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-wider text-muted font-bold">User Journey</p>
          <h2 className="mt-0.5 font-bold text-navy text-sm">Purchase Journey</h2>
        </div>
        <span className="rounded-full bg-serious/10 px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider text-serious font-bold">
          Blocked
        </span>
      </div>
      <div className="mt-4 space-y-2.5">
        {["Open homepage", "Search product", "Add to cart", "Open checkout", "Enter payment modal"].map((step, idx) => (
          <div key={step} className="flex items-center gap-2.5 text-xs">
            <span className={`grid size-4 place-items-center rounded-full text-[9px] font-mono ${idx < 4 ? "bg-passed/15 text-passed font-bold" : "bg-serious/15 text-serious font-bold"}`}>
              {idx < 4 ? "✓" : "!"}
            </span>
            <span className={idx === 4 ? "font-bold text-navy" : "text-muted font-medium"}>{step}</span>
            {idx === 4 && <span className="ml-auto font-mono text-[9px] text-serious font-bold">focus lost</span>}
          </div>
        ))}
      </div>
      <button onClick={() => onNavigate("journeys")} className="mt-5 flex items-center gap-1.5 text-xs font-bold text-action hover:underline">
        Inspect journeys <ArrowRight className="size-3.5" />
      </button>
    </div>
  );
}

function CategoryCard({ issues }: { issues: Issue[] }) {
  const scores = getCategoryScores(issues);
  return (
    <div className="rounded-lg border border-rule bg-surface p-5 shadow-xs">
      <div className="flex items-center justify-between border-b border-rule pb-3">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-wider text-muted font-bold">Category map</p>
          <h2 className="font-bold text-navy text-sm">WCAG Conformance Categories</h2>
        </div>
        <ShieldCheck className="size-4 text-action" />
      </div>
      <div className="mt-4 grid grid-cols-2 gap-3">
        {Object.entries(scores).map(([label, value]) => (
          <div key={label} className="rounded-md bg-canvas p-3">
            <div className="flex items-center justify-between text-xs font-bold">
              <span className="text-navy">{label}</span>
              <span className="font-mono text-action">{value}%</span>
            </div>
            <div className="mt-2 h-1.5 rounded-full bg-ink/10">
              <div className="h-full rounded-full bg-action" style={{ width: `${value}%` }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function HistoryCard({ score }: { score: number }) {
  return (
    <div className="rounded-lg border border-rule bg-surface p-5 shadow-xs">
      <div className="flex items-center justify-between border-b border-rule pb-3">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-wider text-muted font-bold">Scan History</p>
          <h2 className="font-bold text-navy text-sm">Health Score Over Time</h2>
        </div>
        <span className="font-mono text-[10px] text-passed font-bold">▲ +6 pts 30d</span>
      </div>
      <div className="mt-6 flex h-28 items-end gap-3">
        {[
          { date: "Sep 05", value: 94 },
          { date: "Sep 12", value: 89 },
          { date: "Sep 17", value: 83 },
          { date: "Sep 20", value: score },
        ].map((item, idx) => (
          <div key={item.date} className="flex flex-1 flex-col items-center gap-1.5">
            <div className={`w-full rounded-t ${idx === 3 ? "bg-action" : "bg-navy/30"}`} style={{ height: `${item.value}%` }} />
            <span className="font-mono text-[9px] text-muted font-medium">{item.date}</span>
            <span className="font-mono text-[10px] font-bold text-navy">{item.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function ReportMockup({ onIssue }: { onIssue: () => void }) {
  return (
    <div className="rounded-xl border border-rule bg-surface p-5 shadow-md">
      <div className="flex items-center justify-between border-b border-rule pb-4">
        <div className="flex items-center gap-3">
          <span className="size-2 rounded-full bg-serious animate-pulse" />
          <div>
            <div className="text-xs font-bold text-navy">www.amazon.in</div>
            <div className="font-mono text-[10px] text-muted font-medium">Scan Sep 20, 2026 · Needs attention</div>
          </div>
        </div>
        <span className="rounded bg-passed/10 px-2.5 py-0.5 font-mono text-[10px] text-passed font-bold">
          Active Scan
        </span>
      </div>

      <div className="mt-5 grid grid-cols-3 gap-4">
        <div className="flex flex-col items-center justify-center rounded-lg bg-canvas p-4">
          <div className="score-ring grid size-20 place-items-center">
            <div className="grid size-[3.8rem] place-items-center rounded-full bg-surface">
              <div className="text-center">
                <div className="font-mono text-xl font-bold text-navy">74</div>
                <div className="text-[8px] uppercase tracking-wider text-muted font-bold">of 100</div>
              </div>
            </div>
          </div>
          <div className="mt-2 text-[10px] font-bold uppercase text-muted">Health Score</div>
        </div>

        <div className="col-span-2 grid grid-cols-2 gap-2 text-xs">
          <div className="rounded-md border border-rule p-2.5">
            <div className="text-[10px] font-bold uppercase text-critical">Critical</div>
            <div className="font-mono text-base font-bold text-critical">2</div>
          </div>
          <div className="rounded-md border border-rule p-2.5">
            <div className="text-[10px] font-bold uppercase text-serious">Serious</div>
            <div className="font-mono text-base font-bold text-serious">2</div>
          </div>
          <div className="rounded-md border border-rule p-2.5">
            <div className="text-[10px] font-bold uppercase text-navy">Moderate</div>
            <div className="font-mono text-base font-bold text-navy">1</div>
          </div>
          <div className="rounded-md border border-rule p-2.5">
            <div className="text-[10px] font-bold uppercase text-passed">Passed</div>
            <div className="font-mono text-base font-bold text-passed">84</div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Disclaimer() {
  return (
    <div className="mt-6 flex items-start gap-3 rounded-lg border border-rule bg-surface px-4 py-3 text-xs leading-relaxed text-muted shadow-xs font-medium">
      <CircleHelp className="mt-0.5 size-4 shrink-0 text-action" />
      <span>
        Automated accessibility testing cannot detect every barrier. Results are potential WCAG issues, not a certification or legal compliance determination. Human evaluation may still be required.
      </span>
    </div>
  );
}

function Brand() {
  return (
    <div className="flex items-center gap-2.5">
      <span className="grid size-7 place-items-center rounded-md bg-navy font-mono text-[11px] font-bold text-surface">
        AL
      </span>
      <span className="text-[15px] font-bold tracking-tight text-navy">AccessLens</span>
      <span className="ml-1 hidden rounded-full border border-rule px-2 py-0.5 font-mono text-[9px] uppercase tracking-wider text-muted font-bold sm:inline">
        WCAG 2.2 Auditor
      </span>
    </div>
  );
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div>
      <div className="font-mono text-lg font-bold text-navy">{value}</div>
      <div className="text-[10px] uppercase tracking-wider text-muted font-bold">{label}</div>
    </div>
  );
}

function Feature({ number, title, text }: { number: string; title: string; text: string }) {
  return (
    <div className="bg-surface p-6">
      <div className="font-mono text-[11px] text-action font-bold">{number}</div>
      <h3 className="mt-3 text-sm font-bold text-navy">{title}</h3>
      <p className="mt-2 text-xs leading-relaxed text-muted font-medium">{text}</p>
    </div>
  );
}

function PageHeading({ eyebrow, title, description, action }: { eyebrow: string; title: string; description: string; action?: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between border-b border-rule pb-5">
      <div>
        <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-action font-bold">{eyebrow}</p>
        <h1 className="mt-1 text-2xl font-bold tracking-tight text-navy">{title}</h1>
        <p className="mt-1 text-xs text-muted max-w-2xl leading-relaxed font-medium">{description}</p>
      </div>
      {action}
    </div>
  );
}

function Choice({ title, text, selected }: { title: string; text: string; selected?: boolean }) {
  return (
    <button
      className={`rounded-md border p-3 text-left transition-all ${
        selected ? "border-action bg-action/5 ring-1 ring-action/20" : "border-rule hover:bg-ink/5"
      }`}
    >
      <span className="flex items-center gap-2 text-xs font-bold text-navy">
        <span
          className={`grid size-4 place-items-center rounded-full border ${
            selected ? "border-action bg-action text-surface" : "border-rule"
          }`}
        >
          {selected && <Check className="size-2.5" />}
        </span>
        {title}
      </span>
      <span className="mt-1 block pl-6 font-mono text-[10px] text-muted font-medium">{text}</span>
    </button>
  );
}