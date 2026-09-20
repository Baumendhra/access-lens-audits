import { useState } from "react";
import { Keyboard, Volume2, Eye, Palette, Hand, Check, AlertCircle, Info, Play, Sparkles } from "lucide-react";
import { PersonaProfile, personaProfiles, Issue } from "../lib/scanEngine";

interface PersonaSimulatorProps {
  issues: Issue[];
  onSelectIssue?: (issue: Issue) => void;
}

export function PersonaSimulator({ issues, onSelectIssue }: PersonaSimulatorProps) {
  const [selectedId, setSelectedId] = useState<string>("keyboard");
  const [simulatingSpeech, setSimulatingSpeech] = useState(false);

  const currentPersona = personaProfiles.find((p) => p.id === selectedId) || personaProfiles[0];
  const affected = issues.filter(
    (i) => currentPersona.affectedIssueIds.includes(i.id) || i.category.toLowerCase().includes(selectedId.replace("-only", ""))
  );

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case "Keyboard":
        return Keyboard;
      case "Volume2":
        return Volume2;
      case "Eye":
        return Eye;
      case "Palette":
        return Palette;
      default:
        return Hand;
    }
  };

  const runScreenReaderSpeech = () => {
    setSimulatingSpeech(true);
    setTimeout(() => setSimulatingSpeech(false), 3000);
  };

  return (
    <div className="rounded-lg border border-rule bg-surface p-6 shadow-xs space-y-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between border-b border-rule pb-4">
        <div>
          <span className="font-mono text-[10px] uppercase tracking-wider text-action font-bold">Interactive Evaluation Profile</span>
          <h2 className="text-xl font-bold text-navy">User Persona Accessibility Simulator</h2>
        </div>
        <div className="flex items-center gap-2 rounded-md bg-canvas px-3 py-1.5 text-xs text-navy font-semibold">
          <Info className="size-3.5 text-action" />
          <span>Simulation testing profile (not a claim to replace lived experience)</span>
        </div>
      </div>

      {/* Persona Chips Selection */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
        {personaProfiles.map((persona) => {
          const Icon = getIcon(persona.icon);
          const active = persona.id === selectedId;
          return (
            <button
              key={persona.id}
              onClick={() => setSelectedId(persona.id)}
              className={`flex flex-col items-center gap-2 rounded-lg border p-3.5 text-center transition-all ${
                active
                  ? "border-action bg-action/10 text-action shadow-xs font-bold ring-2 ring-action/20"
                  : "border-rule bg-canvas text-navy hover:bg-ink/5"
              }`}
            >
              <Icon className="size-5 shrink-0" />
              <span className="text-xs">{persona.name}</span>
            </button>
          );
        })}
      </div>

      {/* Live Visual Simulation Canvas Frame */}
      <div className="rounded-lg border border-rule bg-canvas p-5 space-y-4">
        <div className="flex items-center justify-between border-b border-rule pb-3">
          <div className="flex items-center gap-2">
            <Sparkles className="size-4 text-action" />
            <h3 className="font-bold text-navy text-sm">{currentPersona.name} — Live Simulation Canvas</h3>
          </div>
          {selectedId === "screen-reader" && (
            <button
              onClick={runScreenReaderSpeech}
              className="flex items-center gap-1.5 rounded-md bg-navy px-3 py-1 text-xs font-bold text-surface hover:bg-action transition"
            >
              <Play className="size-3" /> Simulate VoiceOver Output
            </button>
          )}
        </div>

        {/* Dynamic Simulation Filter Container */}
        <div
          style={{ filter: currentPersona.filterCss || "none" }}
          className="relative min-h-[160px] rounded-md border border-rule bg-surface p-4 text-xs transition-all shadow-xs"
        >
          {selectedId === "keyboard" && (
            <div className="space-y-3">
              <p className="font-mono text-[10px] uppercase text-action font-bold">Tab Key Navigation Trajectory Trace</p>
              <div className="flex flex-wrap items-center gap-2 text-navy font-bold">
                <span className="rounded border-2 border-action bg-action/20 px-2 py-1 font-mono text-[10px]">1: Skip to Content</span>
                <span>→</span>
                <span className="rounded border-2 border-action bg-action/20 px-2 py-1 font-mono text-[10px]">2: Search Input</span>
                <span>→</span>
                <span className="rounded border-2 border-critical bg-critical/20 px-2 py-1 font-mono text-[10px] text-critical">3: Focus Lost (Modal Trap) ❌</span>
              </div>
            </div>
          )}

          {selectedId === "screen-reader" && (
            <div className="space-y-2">
              <p className="font-mono text-[10px] uppercase text-action font-bold">Screen Reader Audio Transcript Stream</p>
              <div className="font-mono text-[11px] text-navy font-bold space-y-1 bg-navy/5 p-3 rounded">
                <p>🔊 "Heading level 1: AccessLens Accessibility Audit"</p>
                <p>🔊 "Search bar input, type text, Search Amazon.in"</p>
                <p className="text-critical">⚠️ "Button, unlabelled graphic (Missing aria-label)"</p>
                {simulatingSpeech && <p className="text-passed animate-pulse">🔊 Speech synthesis running: Reading DOM tree structure...</p>}
              </div>
            </div>
          )}

          {selectedId !== "keyboard" && selectedId !== "screen-reader" && (
            <div className="space-y-2">
              <p className="font-mono text-[10px] uppercase text-action font-bold">Visual Filter &amp; Contrast Profile Applied</p>
              <p className="text-xs text-navy font-bold leading-relaxed">{currentPersona.description}</p>
            </div>
          )}
        </div>
      </div>

      {/* Affected Issues Breakdown */}
      <div className="space-y-3">
        <p className="font-mono text-[10px] uppercase tracking-wider text-muted font-bold">Impacted Findings for {currentPersona.name}</p>
        {affected.length === 0 ? (
          <div className="flex items-center gap-2 rounded-md border border-passed/20 bg-passed/10 p-3 text-xs text-passed font-bold">
            <Check className="size-4 shrink-0" />
            <span>No critical barriers detected for this specific user persona profile.</span>
          </div>
        ) : (
          affected.slice(0, 4).map((issue) => (
            <div
              key={issue.id}
              onClick={() => onSelectIssue && onSelectIssue(issue)}
              className="flex items-center justify-between rounded-md border border-rule bg-surface p-3 text-xs transition-colors hover:bg-ink/5 cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <AlertCircle className="size-4 text-serious shrink-0" />
                <div>
                  <strong className="font-bold text-navy">{issue.title}</strong>
                  <span className="ml-2 font-mono text-[10px] text-muted font-semibold">({issue.wcag})</span>
                </div>
              </div>
              <span className="font-mono text-[10px] text-action font-bold">Inspect fix →</span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
