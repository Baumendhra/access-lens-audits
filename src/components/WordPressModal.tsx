import { useState } from "react";
import { Link2, Check, X, ShieldCheck, RefreshCw } from "lucide-react";

interface WordPressModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConnected: (siteUrl: string) => void;
}

export function WordPressModal({ isOpen, onClose, onConnected }: WordPressModalProps) {
  const [wpUrl, setWpUrl] = useState("https://my-wordpress-blog.org");
  const [apiKey, setApiKey] = useState("al_wp_live_9876543210abcdef");
  const [connecting, setConnecting] = useState(false);
  const [success, setSuccess] = useState(false);

  if (!isOpen) return null;

  const handleConnect = () => {
    setConnecting(true);
    setTimeout(() => {
      setConnecting(false);
      setSuccess(true);
      setTimeout(() => {
        onConnected(wpUrl);
        onClose();
      }, 1000);
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-navy/70 p-4 backdrop-blur-xs animate-rise">
      <div className="w-full max-w-md rounded-xl border border-rule bg-surface p-6 shadow-2xl space-y-5">
        <div className="flex items-center justify-between border-b border-rule pb-3">
          <div className="flex items-center gap-2">
            <Link2 className="size-5 text-action" />
            <h3 className="font-bold text-navy text-sm">Connect AccessLens WordPress Plugin</h3>
          </div>
          <button onClick={onClose} className="rounded-md p-1 text-muted hover:bg-ink/5" aria-label="Close modal">
            <X className="size-5" />
          </button>
        </div>

        {success ? (
          <div className="py-6 text-center space-y-3">
            <Check className="size-10 text-passed mx-auto" />
            <h4 className="font-bold text-navy text-base">WordPress Site Connected!</h4>
            <p className="text-xs text-muted">Automated accessibility scans scheduled for {wpUrl}.</p>
          </div>
        ) : (
          <div className="space-y-4 text-xs">
            <label className="block font-bold text-navy">
              WordPress Site Endpoint URL
              <input
                value={wpUrl}
                onChange={(e) => setWpUrl(e.target.value)}
                className="mt-1.5 h-10 w-full rounded-md border border-rule bg-canvas px-3 font-mono font-bold text-navy outline-none focus:border-action"
              />
            </label>

            <label className="block font-bold text-navy">
              AccessLens WP API Secret Key
              <input
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                type="password"
                className="mt-1.5 h-10 w-full rounded-md border border-rule bg-canvas px-3 font-mono font-bold text-navy outline-none focus:border-action"
              />
            </label>

            <div className="rounded-md bg-canvas p-3 border border-rule text-muted leading-relaxed font-medium">
              <span className="font-bold text-navy block mb-1">Automated Triggers Enabled:</span>
              • Run accessibility scan on Post Publish<br />
              • Check contrast &amp; ARIA on Theme Update
            </div>

            <button
              onClick={handleConnect}
              disabled={connecting}
              className="mt-2 flex h-11 w-full items-center justify-center gap-2 rounded-md bg-navy text-xs font-bold text-surface hover:bg-action transition disabled:opacity-60"
            >
              {connecting ? (
                <>
                  <RefreshCw className="size-4 animate-spin text-passed" /> Authenticating WordPress Key...
                </>
              ) : (
                "Authorize WordPress Connection"
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
