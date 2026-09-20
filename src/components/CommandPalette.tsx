import { useState, useEffect } from "react";
import { Search, Globe2, AlertCircle, FileText, Sparkles, Sliders, X, ArrowRight, ShieldCheck } from "lucide-react";
import { Issue, presetTargets } from "../lib/scanEngine";

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  issues: Issue[];
  onSelectIssue: (issue: Issue) => void;
  onSelectTarget: (url: string) => void;
  onNavigateView: (view: string) => void;
}

export function CommandPalette({
  isOpen,
  onClose,
  issues,
  onSelectIssue,
  onSelectTarget,
  onNavigateView,
}: CommandPaletteProps) {
  const [query, setQuery] = useState("");

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        if (isOpen) onClose();
        else {
          setQuery("");
        }
      }
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const filteredIssues = issues.filter(
    (i) =>
      i.title.toLowerCase().includes(query.toLowerCase()) ||
      i.wcag.toLowerCase().includes(query.toLowerCase()) ||
      i.category.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-navy/70 p-4 pt-20 backdrop-blur-xs animate-rise">
      <div className="w-full max-w-2xl overflow-hidden rounded-xl border border-rule bg-surface shadow-2xl">
        {/* Input Bar */}
        <div className="flex items-center gap-3 border-b border-rule bg-surface px-4 py-3.5">
          <Search className="size-5 text-action shrink-0" />
          <input
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Type a command, WCAG rule, target website, or view..."
            className="w-full text-sm font-bold text-navy outline-none bg-transparent"
          />
          <button onClick={onClose} className="rounded-md p-1 text-muted hover:bg-ink/5" aria-label="Close command palette">
            <X className="size-5" />
          </button>
        </div>

        <div className="max-h-96 overflow-y-auto p-3 space-y-4 text-xs">
          {/* Preset Target Actions */}
          {query === "" && (
            <div>
              <p className="px-2 pb-1.5 font-mono text-[10px] uppercase tracking-wider text-muted font-bold">Quick Target Audits</p>
              <div className="space-y-1">
                {presetTargets.map((target) => (
                  <button
                    key={target.id}
                    onClick={() => {
                      onSelectTarget(target.domain);
                      onClose();
                    }}
                    className="flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-left text-navy hover:bg-action/10 transition font-bold"
                  >
                    <div className="flex items-center gap-2.5">
                      <Globe2 className="size-4 text-action" />
                      <span>Audit {target.name}</span>
                    </div>
                    <span className="font-mono text-[10px] text-muted font-semibold">{target.domain}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Views Shortcuts */}
          {query === "" && (
            <div>
              <p className="px-2 pb-1.5 font-mono text-[10px] uppercase tracking-wider text-muted font-bold">Navigation Views</p>
              <div className="grid grid-cols-2 gap-1.5">
                {[
                  { label: "Overview Dashboard", view: "overview", icon: ShieldCheck },
                  { label: "Before / After Comparison", view: "before-after", icon: Sliders },
                  { label: "AccessLens Copilot AI", view: "copilot", icon: Sparkles },
                  { label: "Export PDF & Reports", view: "reports", icon: FileText },
                ].map(({ label, view, icon: Icon }) => (
                  <button
                    key={view}
                    onClick={() => {
                      onNavigateView(view);
                      onClose();
                    }}
                    className="flex items-center gap-2 rounded-lg border border-rule p-2.5 text-left font-bold text-navy hover:bg-ink/5 transition"
                  >
                    <Icon className="size-4 text-action" />
                    <span>{label}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Filtered Findings */}
          {filteredIssues.length > 0 && (
            <div>
              <p className="px-2 pb-1.5 font-mono text-[10px] uppercase tracking-wider text-muted font-bold">
                Matching Findings ({filteredIssues.length})
              </p>
              <div className="space-y-1">
                {filteredIssues.map((issue) => (
                  <button
                    key={issue.id}
                    onClick={() => {
                      onSelectIssue(issue);
                      onClose();
                    }}
                    className="flex w-full items-center justify-between rounded-lg px-3 py-2 text-left hover:bg-ink/5 transition"
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <AlertCircle className="size-4 text-critical shrink-0" />
                      <span className="truncate font-bold text-navy">{issue.title}</span>
                    </div>
                    <span className="font-mono text-[10px] text-muted font-semibold shrink-0 ml-2">{issue.wcag}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer Hint */}
        <div className="border-t border-rule bg-canvas px-4 py-2 text-[10px] text-muted flex justify-between font-mono font-medium">
          <span>Use ARROW keys to navigate, ENTER to select</span>
          <span>ESC to close</span>
        </div>
      </div>
    </div>
  );
}
