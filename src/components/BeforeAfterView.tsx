import { useState } from "react";
import { ArrowRight, CheckCircle2, AlertCircle, ShieldCheck, Sparkles } from "lucide-react";
import { Issue, calculateHealthScore, getSeverityStats } from "../lib/scanEngine";

interface BeforeAfterViewProps {
  issues: Issue[];
  onReScan?: () => void;
}

export function BeforeAfterView({ issues, onReScan }: BeforeAfterViewProps) {
  const openIssues = issues.filter((i) => i.status === "open");
  const fixedIssues = issues.filter((i) => i.status === "fixed");

  const currentScore = calculateHealthScore(issues);
  const baselineScore = 71;
  const scoreDelta = currentScore - baselineScore;

  return (
    <div className="rounded-lg border border-rule bg-surface p-6 shadow-xs">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between border-b border-rule pb-5">
        <div>
          <span className="font-mono text-[10px] uppercase tracking-wider text-action">Remediation Analytics</span>
          <h2 className="text-xl font-bold text-navy">Before vs. After Accessibility Comparison</h2>
        </div>
        {onReScan && (
          <button
            onClick={onReScan}
            className="flex items-center gap-2 rounded-md bg-navy px-3.5 py-2 text-xs font-semibold text-surface transition hover:bg-action"
          >
            <Sparkles className="size-3.5" /> Re-scan &amp; Recalculate
          </button>
        )}
      </div>

      {/* Comparison Score Boards */}
      <div className="mt-6 grid gap-6 md:grid-cols-2">
        {/* BEFORE BOX */}
        <div className="rounded-lg border border-rule bg-canvas p-5">
          <div className="flex items-center justify-between border-b border-rule pb-3">
            <span className="font-mono text-xs font-bold uppercase tracking-wider text-muted">Baseline Audit (Sep 17)</span>
            <span className="rounded bg-critical/10 px-2 py-0.5 font-mono text-[10px] uppercase text-critical font-medium">Unfixed State</span>
          </div>

          <div className="mt-4 flex items-center gap-5">
            <div className="score-ring grid size-24 place-items-center shrink-0">
              <div className="grid size-[4.5rem] place-items-center rounded-full bg-surface">
                <div className="text-center">
                  <div className="font-mono text-3xl font-medium text-navy">71</div>
                  <div className="font-mono text-[9px] uppercase tracking-wider text-muted">/ 100</div>
                </div>
              </div>
            </div>

            <div className="space-y-1.5 text-xs">
              <div className="flex items-center justify-between gap-4 font-mono">
                <span className="text-critical font-medium">Critical:</span>
                <span>4 open</span>
              </div>
              <div className="flex items-center justify-between gap-4 font-mono">
                <span className="text-serious font-medium">Serious:</span>
                <span>8 open</span>
              </div>
              <div className="flex items-center justify-between gap-4 font-mono">
                <span className="text-moderate font-medium">Moderate:</span>
                <span>12 open</span>
              </div>
            </div>
          </div>
        </div>

        {/* AFTER BOX */}
        <div className="rounded-lg border border-passed/30 bg-passed/5 p-5">
          <div className="flex items-center justify-between border-b border-passed/20 pb-3">
            <span className="font-mono text-xs font-bold uppercase tracking-wider text-passed">Current Audit State (Post-Fix)</span>
            <span className="rounded bg-passed/15 px-2 py-0.5 font-mono text-[10px] uppercase text-passed font-medium">Updated</span>
          </div>

          <div className="mt-4 flex items-center gap-5">
            <div className="score-ring grid size-24 place-items-center shrink-0">
              <div className="grid size-[4.5rem] place-items-center rounded-full bg-surface">
                <div className="text-center">
                  <div className="font-mono text-3xl font-medium text-passed">{currentScore}</div>
                  <div className="font-mono text-[9px] uppercase tracking-wider text-muted">/ 100</div>
                </div>
              </div>
            </div>

            <div className="space-y-1 text-xs">
              <div className="flex items-center gap-2 text-passed font-semibold">
                <CheckCircle2 className="size-4" />
                <span>{fixedIssues.length} Findings Resolved</span>
              </div>
              <div className="font-mono text-[11px] text-muted">
                {openIssues.length} remaining open issue{openIssues.length === 1 ? "" : "s"}
              </div>
              <div className="mt-2 inline-block rounded bg-passed/10 px-2 py-1 font-mono text-[10px] uppercase tracking-wider text-passed font-bold">
                {scoreDelta >= 0 ? `▲ +${scoreDelta}` : `▼ ${scoreDelta}`} Points Health Progression
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Resolved vs Remaining Table */}
      <div className="mt-6 rounded-lg border border-rule bg-surface">
        <div className="border-b border-rule bg-canvas px-4 py-3 font-mono text-xs font-semibold text-navy uppercase tracking-wider flex items-center justify-between">
          <span>Remediation Progress Detail</span>
          <span>{fixedIssues.length} / {issues.length} Resolved</span>
        </div>

        <div className="divide-y divide-rule max-h-60 overflow-y-auto">
          {issues.map((issue) => (
            <div key={issue.id} className="flex items-center justify-between px-4 py-3 text-xs">
              <div className="flex items-center gap-3 min-w-0">
                <span
                  className={`size-2 shrink-0 rounded-full ${
                    issue.status === "fixed" ? "bg-passed" : "bg-critical"
                  }`}
                />
                <span className={`truncate font-medium ${issue.status === "fixed" ? "line-through text-muted" : "text-navy"}`}>
                  {issue.title}
                </span>
              </div>
              <span
                className={`ml-4 shrink-0 rounded px-2 py-0.5 font-mono text-[10px] uppercase font-semibold ${
                  issue.status === "fixed" ? "bg-passed/10 text-passed" : "bg-critical/10 text-critical"
                }`}
              >
                {issue.status === "fixed" ? "Resolved" : "Open"}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
