import { useState } from "react";
import { Globe2, Info, Search, ShoppingCart, Lock } from "lucide-react";
import { Issue } from "../lib/scanEngine";

interface HeatmapPreviewProps {
  issue: Issue;
  allIssues?: Issue[];
  targetUrl?: string;
  onSelectIssue?: (issue: Issue) => void;
}

export function HeatmapPreview({ issue, allIssues = [], targetUrl = "https://demo-store.com", onSelectIssue }: HeatmapPreviewProps) {
  const [hoveredPin, setHoveredPin] = useState<Issue | null>(null);

  const displayIssues = allIssues.length > 0 ? allIssues : [issue];
  const isAmazon = targetUrl.toLowerCase().includes("amazon");
  const isGithub = targetUrl.toLowerCase().includes("github");

  const getPinColor = (severity: string) => {
    switch (severity) {
      case "critical":
        return "bg-critical text-surface ring-critical/40";
      case "serious":
        return "bg-serious text-surface ring-serious/40";
      default:
        return "bg-moderate text-navy ring-moderate/40";
    }
  };

  return (
    <div className="overflow-hidden rounded-lg border border-rule bg-surface shadow-xs">
      {/* Browser Bar Header */}
      <div className="flex items-center justify-between border-b border-rule bg-navy px-4 py-2.5 text-surface">
        <div className="flex items-center gap-2 text-xs font-semibold">
          <Lock className="size-3.5 text-passed" />
          <span className="font-mono">{targetUrl.startsWith("http") ? targetUrl : `https://${targetUrl}`}{issue.page}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="font-mono text-[10px] text-surface/80">Visual Heatmap Frame</span>
          <span className="rounded bg-surface/20 px-2 py-0.5 font-mono text-[9px] uppercase text-surface font-bold">
            {displayIssues.length} Pins
          </span>
        </div>
      </div>

      {/* Rendered Target Frame Canvas */}
      <div className="relative min-h-[400px] select-none bg-canvas p-5">
        {/* Dynamic Website Frame Mockup */}
        {isAmazon ? (
          <div className="rounded-md border border-rule bg-surface shadow-xs overflow-hidden">
            {/* Amazon India Dark Top Nav */}
            <div className="bg-[#131921] px-4 py-2.5 flex items-center justify-between text-white text-xs">
              <div className="flex items-center gap-3">
                <span className="font-bold text-amber-400 text-sm tracking-tight">amazon.in</span>
                <span className="text-[10px] text-gray-300">Deliver to India</span>
              </div>
              <div className="flex-1 mx-4 relative max-w-md">
                <input
                  id="twotabsearchtextbox"
                  readOnly
                  value="Search Amazon.in"
                  className="w-full h-8 rounded bg-white text-gray-800 px-3 text-xs outline-none"
                />
                <button className="absolute right-0 top-0 bottom-0 bg-amber-400 px-3 rounded-r text-gray-900 font-bold">
                  <Search className="size-3.5" />
                </button>
              </div>
              <div className="flex items-center gap-4 text-[11px]">
                <span>EN</span>
                <span>Account &amp; Lists</span>
                <span className="flex items-center gap-1 font-bold text-amber-400">
                  <ShoppingCart className="size-4" /> Cart (3)
                </span>
              </div>
            </div>

            {/* Amazon Deal Cards Frame */}
            <div className="p-4 bg-gray-100">
              <div className="bg-amber-50 border border-amber-200 p-2.5 rounded mb-3 text-xs text-amber-900 font-semibold flex items-center justify-between">
                <span>Great Indian Festival Deals Live Now!</span>
                <span className="font-mono text-[10px] uppercase">Shop Deals</span>
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div className="bg-white p-3 rounded border border-gray-200">
                  <div className="h-20 bg-gray-200 rounded flex items-center justify-center text-[10px] text-gray-500 font-mono">
                    [ Product Image ]
                  </div>
                  <p className="mt-2 text-[11px] font-bold text-gray-800 truncate">Electronics &amp; Accessories</p>
                  <p className="text-[10px] text-red-600 font-bold mt-0.5">Up to 60% off</p>
                </div>
                <div className="bg-white p-3 rounded border border-gray-200">
                  <div className="h-20 bg-gray-200 rounded flex items-center justify-center text-[10px] text-gray-500 font-mono">
                    [ Product Image ]
                  </div>
                  <p className="mt-2 text-[11px] font-bold text-gray-800 truncate">Home &amp; Kitchen Essentials</p>
                  <p className="text-[10px] text-red-600 font-bold mt-0.5">Up to 45% off</p>
                </div>
                <div className="bg-white p-3 rounded border border-gray-200">
                  <div className="h-20 bg-gray-200 rounded flex items-center justify-center text-[10px] text-gray-500 font-mono">
                    [ Product Image ]
                  </div>
                  <p className="mt-2 text-[11px] font-bold text-gray-800 truncate">Fashion &amp; Footwear</p>
                  <p className="text-[10px] text-red-600 font-bold mt-0.5">Min 50% off</p>
                </div>
              </div>
            </div>
          </div>
        ) : isGithub ? (
          <div className="rounded-md border border-rule bg-surface shadow-xs overflow-hidden">
            <div className="bg-[#24292e] px-4 py-2.5 flex items-center justify-between text-white text-xs">
              <span className="font-bold">GitHub / repository</span>
              <span className="font-mono text-[10px] text-gray-300">main branch</span>
            </div>
            <div className="p-4 bg-gray-50 text-xs">
              <div className="bg-white p-3 rounded border border-gray-200 space-y-2">
                <div className="flex items-center justify-between border-b pb-2">
                  <span className="font-mono text-xs font-semibold text-blue-600">src/components/</span>
                  <span className="text-gray-500 font-mono text-[10px]">Updated 2h ago</span>
                </div>
                <div className="font-mono text-[11px] text-gray-700 space-y-1">
                  <div>📁 assets/</div>
                  <div>📄 index.tsx</div>
                  <div>📄 scanEngine.ts</div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="rounded-md border border-rule bg-surface p-4 shadow-xs">
            <div className="flex items-center justify-between border-b border-rule pb-3">
              <div className="flex items-center gap-2 font-bold text-navy">
                <span className="grid size-7 place-items-center rounded bg-navy text-[10px] text-surface">DS</span>
                <span>{targetUrl.replace(/^https?:\/\//, "")}</span>
              </div>
              <div className="flex gap-4 font-mono text-xs text-muted">
                <span>Products</span>
                <span>Cart (2)</span>
                <span>Login</span>
              </div>
            </div>
            <div className="mx-auto mt-6 max-w-md text-center">
              <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-action">Target Page Frame</p>
              <h3 className="mt-1 text-xl font-bold text-navy">Rendered Website Preview</h3>
              <div className="mt-4 grid grid-cols-2 gap-3">
                <div className="rounded border border-rule bg-canvas p-3 text-left">
                  <div className="h-16 rounded bg-navy/10 flex items-center justify-center text-xs font-mono text-muted">
                    [ Element Frame ]
                  </div>
                  <p className="mt-2 text-xs font-semibold text-navy">Featured Content</p>
                </div>
                <div className="rounded border border-rule bg-canvas p-3 text-left">
                  <div className="h-16 rounded bg-action/15 flex items-center justify-center text-xs font-mono text-action">
                    [ Element Frame ]
                  </div>
                  <p className="mt-2 text-xs font-semibold text-navy">Checkout Grid</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Dynamic Pins Overlay */}
        {displayIssues.map((item) => {
          const isCurrent = item.id === issue.id;
          const isHovered = hoveredPin?.id === item.id;
          const colorClass = getPinColor(item.severity);

          return (
            <div
              key={item.id}
              style={{ left: `${item.heatmapX}%`, top: `${item.heatmapY}%` }}
              className="absolute -translate-x-1/2 -translate-y-1/2 z-20 group"
              onMouseEnter={() => setHoveredPin(item)}
              onMouseLeave={() => setHoveredPin(null)}
            >
              <button
                onClick={() => onSelectIssue && onSelectIssue(item)}
                className={`relative grid size-7 place-items-center rounded-full font-mono text-xs font-bold shadow-md transition-all ring-4 ${colorClass} ${
                  isCurrent ? "scale-125 ring-action" : "hover:scale-110"
                }`}
                aria-label={`Issue #${item.id}: ${item.title} (${item.severity})`}
              >
                <span>{item.id}</span>
                <span className={`absolute inset-0 rounded-full animate-ping opacity-30 ${colorClass}`} />
              </button>

              {/* Hover Tooltip Popup */}
              {(isHovered || isCurrent) && (
                <div className="absolute left-1/2 top-full mt-2 w-60 -translate-x-1/2 rounded-lg border border-rule bg-navy p-3 text-surface shadow-xl z-30 pointer-events-none">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[10px] uppercase text-surface/80">Finding #{item.id}</span>
                    <span className="rounded bg-surface/20 px-1.5 py-0.5 font-mono text-[9px] uppercase font-bold">
                      {item.severity}
                    </span>
                  </div>
                  <p className="mt-1 font-bold text-xs leading-snug">{item.title}</p>
                  <p className="mt-1 font-mono text-[9px] text-surface/70 truncate">{item.selector}</p>
                </div>
              )}
            </div>
          );
        })}

        {/* Bottom Status Bar */}
        <div className="mt-4 flex items-center justify-between rounded-md border border-rule bg-surface px-4 py-2 text-xs shadow-xs">
          <div className="flex items-center gap-2 text-muted">
            <Info className="size-4 text-action shrink-0" />
            <span>Click any numbered marker on the rendered website canvas to inspect the finding.</span>
          </div>
          <span className="font-mono text-[10px] uppercase tracking-wider text-action font-bold hidden sm:inline">
            Heatmap Inspector
          </span>
        </div>
      </div>
    </div>
  );
}
