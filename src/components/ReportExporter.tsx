import { useState } from "react";
import { FileText, Download, Globe2, Terminal, Code2, Check, Printer, Building2, Eye, X, ShieldCheck } from "lucide-react";
import { Issue, calculateHealthScore, getSeverityStats } from "../lib/scanEngine";

interface ReportExporterProps {
  issues: Issue[];
  url?: string;
}

export function ReportExporter({ issues, url = "https://demo-store.com" }: ReportExporterProps) {
  const [agencyName, setAgencyName] = useState("AccessLens Client Audit Services");
  const [reportTitle, setReportTitle] = useState("Executive Website Accessibility Audit Report");
  const [downloadMsg, setDownloadMsg] = useState<string | null>(null);
  const [showPdfModal, setShowPdfModal] = useState(false);

  const healthScore = calculateHealthScore(issues);
  const stats = getSeverityStats(issues);

  const downloadCSV = () => {
    const headers = ["ID", "Severity", "Title", "WCAG", "Category", "Page", "Selector", "Status", "Users Affected"];
    const rows = issues.map((i) => [
      i.id,
      i.severity,
      `"${i.title.replace(/"/g, '""')}"`,
      `"${i.wcag}"`,
      i.category,
      i.page,
      `"${i.selector.replace(/"/g, '""')}"`,
      i.status,
      `"${i.users.replace(/"/g, '""')}"`,
    ]);

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `AccessLens-Audit-Report-${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    triggerToast("CSV issue log exported successfully!");
  };

  const downloadJSON = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify({ auditTarget: url, healthScore, date: new Date().toISOString(), agency: agencyName, title: reportTitle, findings: issues }, null, 2));
    const link = document.createElement("a");
    link.setAttribute("href", dataStr);
    link.setAttribute("download", `AccessLens-Audit-${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    triggerToast("JSON machine dataset exported successfully!");
  };

  const handlePrintPDF = () => {
    window.print();
  };

  const triggerToast = (msg: string) => {
    setDownloadMsg(msg);
    setTimeout(() => setDownloadMsg(null), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Toast Notification Banner */}
      {downloadMsg && (
        <div role="status" aria-live="polite" className="flex items-center gap-3 rounded-md border border-passed/30 bg-navy p-4 text-xs font-semibold text-surface shadow-md">
          <Check className="size-4 text-passed shrink-0" />
          <span>{downloadMsg}</span>
        </div>
      )}

      {/* Printable PDF Preview Modal */}
      {showPdfModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-navy/80 p-4 backdrop-blur-xs no-print">
          <div className="flex max-h-[90vh] w-full max-w-4xl flex-col rounded-xl border border-rule bg-surface shadow-2xl overflow-hidden">
            {/* Modal Bar */}
            <div className="flex items-center justify-between border-b border-rule bg-navy px-6 py-4 text-surface">
              <div className="flex items-center gap-3">
                <Printer className="size-5 text-action" />
                <div>
                  <h3 className="font-bold text-sm">Printable PDF Report Preview</h3>
                  <p className="font-mono text-[10px] text-surface/70">Click "Print / Save as PDF" to generate clean document</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={handlePrintPDF}
                  className="flex items-center gap-2 rounded-md bg-action px-4 py-2 text-xs font-bold text-surface hover:bg-navy transition"
                >
                  <Printer className="size-4" /> Print / Save as PDF
                </button>
                <button
                  onClick={() => setShowPdfModal(false)}
                  className="rounded-md p-1.5 text-surface/80 hover:bg-surface/10"
                  aria-label="Close PDF modal preview"
                >
                  <X className="size-5" />
                </button>
              </div>
            </div>

            {/* Printable Document Container */}
            <div className="flex-1 overflow-y-auto p-8 bg-white text-black font-sans print-document">
              {/* Document Header */}
              <div className="flex items-start justify-between border-b-2 border-navy pb-6">
                <div>
                  <div className="flex items-center gap-2 font-mono text-xs font-bold uppercase text-navy">
                    <ShieldCheck className="size-4 text-action" />
                    <span>{agencyName}</span>
                  </div>
                  <h1 className="mt-2 text-2xl font-black tracking-tight text-navy">{reportTitle}</h1>
                  <p className="mt-1 text-xs text-gray-600 font-mono">Target URL: {url} · Standard: WCAG 2.2 Level AA</p>
                </div>
                <div className="text-right font-mono text-xs text-gray-500">
                  <p>Date: {new Date().toLocaleDateString()}</p>
                  <p>Status: Active Audit</p>
                </div>
              </div>

              {/* Executive Summary Cards */}
              <div className="mt-6 grid grid-cols-3 gap-4">
                <div className="rounded-lg border border-gray-300 bg-gray-50 p-4 text-center">
                  <div className="font-mono text-3xl font-black text-navy">{healthScore} / 100</div>
                  <div className="mt-1 font-mono text-[10px] uppercase font-bold text-gray-600">AccessLens Health Score</div>
                </div>

                <div className="col-span-2 grid grid-cols-3 gap-2 text-center text-xs">
                  <div className="rounded-lg border border-red-200 bg-red-50 p-3">
                    <div className="font-mono text-xl font-bold text-red-700">{stats.critical}</div>
                    <div className="font-mono text-[10px] uppercase text-red-800 font-semibold">Critical</div>
                  </div>
                  <div className="rounded-lg border border-orange-200 bg-orange-50 p-3">
                    <div className="font-mono text-xl font-bold text-orange-700">{stats.serious}</div>
                    <div className="font-mono text-[10px] uppercase text-orange-800 font-semibold">Serious</div>
                  </div>
                  <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-3">
                    <div className="font-mono text-xl font-bold text-yellow-800">{stats.moderate}</div>
                    <div className="font-mono text-[10px] uppercase text-yellow-900 font-semibold">Moderate</div>
                  </div>
                </div>
              </div>

              {/* Findings List Table */}
              <div className="mt-8">
                <h2 className="text-sm font-bold text-navy uppercase tracking-wider border-b pb-2">Detected WCAG Findings</h2>
                <div className="mt-3 space-y-3">
                  {issues.map((item) => (
                    <div key={item.id} className="rounded-md border border-gray-200 p-3 text-xs bg-gray-50">
                      <div className="flex items-center justify-between font-bold">
                        <span className="text-navy">#{item.id} {item.title}</span>
                        <span className="font-mono text-[10px] uppercase text-red-700 bg-red-100 px-2 py-0.5 rounded">
                          {item.severity}
                        </span>
                      </div>
                      <p className="mt-1 text-gray-700 leading-relaxed">{item.explanation}</p>
                      <div className="mt-2 font-mono text-[11px] text-gray-600 bg-gray-200 p-2 rounded">
                        Selector: {item.selector}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Footer Disclaimer */}
              <div className="mt-8 border-t pt-4 text-[10px] text-gray-500 leading-relaxed">
                Automated accessibility testing identifies detectable barriers but does not constitute legal WCAG compliance certification. Human evaluation is recommended.
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Export Options Matrix */}
      <div className="grid gap-5 md:grid-cols-2">
        <div className="flex flex-col justify-between rounded-lg border border-rule bg-surface p-5 shadow-xs">
          <div className="flex items-start gap-4">
            <div className="grid size-11 shrink-0 place-items-center rounded-md bg-navy text-surface">
              <Printer className="size-5" />
            </div>
            <div>
              <h3 className="font-bold text-navy text-base">Printable PDF Executive Report</h3>
              <p className="mt-1 text-xs text-muted leading-relaxed">
                Presentation-ready executive audit report formatted with health score, findings matrix, and patch code.
              </p>
            </div>
          </div>
          <div className="mt-5 flex gap-2">
            <button
              onClick={() => setShowPdfModal(true)}
              className="flex-1 flex items-center justify-center gap-2 rounded-md border border-rule bg-canvas py-2 px-3 text-xs font-semibold hover:bg-ink/5"
            >
              <Eye className="size-3.5 text-action" /> Preview PDF Layout
            </button>
            <button
              onClick={handlePrintPDF}
              className="flex-1 flex items-center justify-center gap-2 rounded-md bg-navy py-2 px-3 text-xs font-semibold text-surface transition hover:bg-action"
            >
              <Printer className="size-3.5" /> Print / Save PDF
            </button>
          </div>
        </div>

        <div className="flex flex-col justify-between rounded-lg border border-rule bg-surface p-5 shadow-xs">
          <div className="flex items-start gap-4">
            <div className="grid size-11 shrink-0 place-items-center rounded-md bg-action/10 text-action">
              <Terminal className="size-5" />
            </div>
            <div>
              <h3 className="font-bold text-navy text-base">CSV Issue Matrix</h3>
              <p className="mt-1 text-xs text-muted leading-relaxed">
                Structured CSV spreadsheet containing selectors, WCAG criteria, severity ratings, and patch code.
              </p>
            </div>
          </div>
          <button
            onClick={downloadCSV}
            className="mt-5 flex items-center justify-center gap-2 rounded-md border border-rule bg-canvas py-2 px-4 text-xs font-semibold hover:bg-ink/5"
          >
            <Download className="size-3.5 text-action" /> Download CSV Spreadsheet
          </button>
        </div>

        <div className="flex flex-col justify-between rounded-lg border border-rule bg-surface p-5 shadow-xs">
          <div className="flex items-start gap-4">
            <div className="grid size-11 shrink-0 place-items-center rounded-md bg-action/10 text-action">
              <Code2 className="size-5" />
            </div>
            <div>
              <h3 className="font-bold text-navy text-base">JSON Machine Dataset</h3>
              <p className="mt-1 text-xs text-muted leading-relaxed">
                Normalized JSON machine-readable output ready for CI pipelines and automated tracking database records.
              </p>
            </div>
          </div>
          <button
            onClick={downloadJSON}
            className="mt-5 flex items-center justify-center gap-2 rounded-md border border-rule bg-canvas py-2 px-4 text-xs font-semibold hover:bg-ink/5"
          >
            <Download className="size-3.5 text-action" /> Download JSON File
          </button>
        </div>

        <div className="flex flex-col justify-between rounded-lg border border-rule bg-surface p-5 shadow-xs">
          <div className="flex items-start gap-4">
            <div className="grid size-11 shrink-0 place-items-center rounded-md bg-passed/10 text-passed">
              <Globe2 className="size-5" />
            </div>
            <div>
              <h3 className="font-bold text-navy text-base">Interactive HTML Audit Package</h3>
              <p className="mt-1 text-xs text-muted leading-relaxed">
                Single-page HTML audit document package with interactive issue filters and code snippets.
              </p>
            </div>
          </div>
          <button
            onClick={downloadJSON}
            className="mt-5 flex items-center justify-center gap-2 rounded-md border border-rule bg-canvas py-2 px-4 text-xs font-semibold hover:bg-ink/5"
          >
            <Globe2 className="size-3.5 text-passed" /> Download HTML Audit
          </button>
        </div>
      </div>

      {/* Agency White-Label Branding Form */}
      <div className="rounded-lg border border-rule bg-surface p-6 shadow-xs">
        <div className="flex items-center gap-3 border-b border-rule pb-4">
          <Building2 className="size-5 text-action" />
          <div>
            <h3 className="font-bold text-navy text-base">Agency White-Label Customization</h3>
            <p className="text-xs text-muted">Customize client report headers and organization branding.</p>
          </div>
        </div>

        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          <label className="text-xs font-semibold text-navy block">
            Company / Agency Name
            <input
              value={agencyName}
              onChange={(e) => setAgencyName(e.target.value)}
              className="mt-1.5 h-10 w-full rounded-md border border-rule bg-canvas px-3 text-xs outline-none focus:border-action font-medium"
            />
          </label>
          <label className="text-xs font-semibold text-navy block">
            Report Subtitle / Campaign Title
            <input
              value={reportTitle}
              onChange={(e) => setReportTitle(e.target.value)}
              className="mt-1.5 h-10 w-full rounded-md border border-rule bg-canvas px-3 text-xs outline-none focus:border-action font-medium"
            />
          </label>
        </div>
      </div>
    </div>
  );
}
