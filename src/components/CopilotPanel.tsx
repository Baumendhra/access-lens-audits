import { useState } from "react";
import { Sparkles, Send, Copy, Check, MessageSquareText, HelpCircle, Code2, AlertCircle } from "lucide-react";
import { Issue } from "../lib/scanEngine";

interface CopilotPanelProps {
  issue?: Issue | null;
}

export function CopilotPanel({ issue }: CopilotPanelProps) {
  const [query, setQuery] = useState("");
  const [messages, setMessages] = useState<Array<{ sender: "user" | "copilot"; text: string; code?: string }>>([
    {
      sender: "copilot",
      text: issue
        ? `Hello! I am AccessLens Copilot. I'm looking at your finding "${issue.title}". Ask me to explain the WCAG rationale, suggest a React component patch, or explain who is affected.`
        : "Hello! I am AccessLens Copilot. Ask me any web accessibility or WCAG 2.2 implementation question!",
    },
  ]);
  const [copied, setCopied] = useState(false);

  const handleSend = (textToSend?: string) => {
    const promptText = textToSend || query;
    if (!promptText.trim()) return;

    const newMsgs = [...messages, { sender: "user" as const, text: promptText }];
    setMessages(newMsgs);
    if (!textToSend) setQuery("");

    // Generate intelligent response based on issue context or query
    setTimeout(() => {
      let replyText = "";
      let codeSnippet = undefined;

      const lower = promptText.toLowerCase();
      if (lower.includes("react") || lower.includes("code")) {
        replyText = `Here is the clean React component implementation addressing "${issue?.title || "accessibility barrier"}" with proper ARIA bindings and focus management:`;
        codeSnippet = issue?.fix || `<button className="icon-btn" aria-label="Action name">\n  <Icon aria-hidden="true" />\n</button>`;
      } else if (lower.includes("screen reader") || lower.includes("why")) {
        replyText = `Screen readers convert visual UI trees into linear speech/braille outputs. When elements lack proper accessible names, explicit ARIA roles, or live status regions, screen reader users hear generic 'button' or remain unaware of updates.`;
      } else if (lower.includes("explain") || lower.includes("wcag")) {
        replyText = issue
          ? `${issue.explanation} This directly maps to WCAG ${issue.wcag} (${issue.wcagLevel}).`
          : "WCAG 2.2 focuses on Perceivable, Operable, Understandable, and Robust accessibility principles.";
      } else {
        replyText = `To remediate this barrier, ensure interactive elements are keyboard focusable, expose programmatic names via aria-label or visible text, and satisfy 4.5:1 color contrast rules.`;
      }

      setMessages((prev) => [...prev, { sender: "copilot", text: replyText, code: codeSnippet }]);
    }, 400);
  };

  return (
    <div className="flex flex-col h-[460px] rounded-lg border border-action/30 bg-surface shadow-xs overflow-hidden">
      {/* Copilot Header */}
      <div className="flex items-center justify-between border-b border-rule bg-navy px-4 py-3 text-surface">
        <div className="flex items-center gap-2">
          <Sparkles className="size-4 text-action" />
          <h2 className="font-bold text-sm">AccessLens Copilot</h2>
          <span className="rounded-full bg-action/20 px-2 py-0.5 font-mono text-[9px] uppercase tracking-wider text-surface">
            AI Assistant
          </span>
        </div>
        <span className="font-mono text-[10px] text-surface/70">WCAG 2.2 Expert</span>
      </div>

      {/* Chat History Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-canvas/30">
        {messages.map((m, idx) => (
          <div
            key={idx}
            className={`flex flex-col ${m.sender === "user" ? "items-end" : "items-start"}`}
          >
            <div
              className={`max-w-[85%] rounded-lg p-3 text-xs leading-relaxed ${
                m.sender === "user"
                  ? "bg-navy text-surface rounded-br-none font-medium"
                  : "bg-surface border border-rule text-ink rounded-bl-none shadow-xs"
              }`}
            >
              <p>{m.text}</p>
              {m.code && (
                <div className="mt-2.5 overflow-hidden rounded border border-rule bg-navy p-2.5 font-mono text-[11px] text-surface">
                  <pre className="overflow-x-auto">{m.code}</pre>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Quick Action Prompt Chips */}
      <div className="border-t border-rule bg-surface p-2 flex flex-wrap gap-1.5 text-[11px]">
        <button
          onClick={() => handleSend("Explain this issue")}
          className="rounded-full border border-action/30 bg-action/5 px-2.5 py-1 text-action font-medium hover:bg-action/10"
        >
          Explain issue
        </button>
        <button
          onClick={() => handleSend("Show React version")}
          className="rounded-full border border-action/30 bg-action/5 px-2.5 py-1 text-action font-medium hover:bg-action/10"
        >
          React component fix
        </button>
        <button
          onClick={() => handleSend("Why screen readers?")}
          className="rounded-full border border-action/30 bg-action/5 px-2.5 py-1 text-action font-medium hover:bg-action/10"
        >
          Screen reader impact
        </button>
      </div>

      {/* Input Box */}
      <div className="border-t border-rule bg-surface p-2.5 flex items-center gap-2">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
          placeholder="Ask Copilot an accessibility fix question..."
          className="flex-1 h-9 rounded-md border border-rule bg-canvas px-3 text-xs outline-none focus:border-action focus:ring-1 focus:ring-action"
        />
        <button
          onClick={() => handleSend()}
          className="grid size-9 place-items-center rounded-md bg-navy text-surface hover:bg-action transition"
          aria-label="Send query to Copilot"
        >
          <Send className="size-4" />
        </button>
      </div>
    </div>
  );
}
