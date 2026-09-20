import { useState } from "react";
import { Bell, CheckCircle2, AlertCircle, X, Info } from "lucide-react";

interface NotificationsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  activeTarget: string;
}

export function NotificationsDrawer({ isOpen, onClose, activeTarget }: NotificationsDrawerProps) {
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      title: `Audit Scan Complete for ${activeTarget}`,
      time: "Just now",
      type: "success",
      text: "Evaluated 214 WCAG 2.2 rules. Recalculated Health Score & category breakdown.",
    },
    {
      id: 2,
      title: "Critical Barrier Alert: Checkout Focus Trap",
      time: "10 mins ago",
      type: "alert",
      text: "Payment modal does not trap keyboard focus. Keyboard-only persona blocked at Step 7.",
    },
    {
      id: 3,
      title: "Copilot AI Patch Generated",
      time: "25 mins ago",
      type: "info",
      text: "Developer fix snippet generated for missing accessible button name.",
    },
  ]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-y-0 right-0 z-50 w-80 border-l border-rule bg-surface p-5 shadow-2xl animate-rise flex flex-col">
      <div className="flex items-center justify-between border-b border-rule pb-4">
        <div className="flex items-center gap-2">
          <Bell className="size-4 text-action" />
          <h3 className="font-bold text-navy text-sm">Audit Notifications</h3>
        </div>
        <button onClick={onClose} className="rounded-md p-1 text-muted hover:bg-ink/5" aria-label="Close notifications">
          <X className="size-4" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto py-4 space-y-3">
        {notifications.map((item) => (
          <div key={item.id} className="rounded-lg border border-rule p-3 bg-canvas/40 space-y-1">
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1.5 font-bold text-navy text-xs">
                {item.type === "success" ? (
                  <CheckCircle2 className="size-3.5 text-passed shrink-0" />
                ) : item.type === "alert" ? (
                  <AlertCircle className="size-3.5 text-critical shrink-0" />
                ) : (
                  <Info className="size-3.5 text-action shrink-0" />
                )}
                {item.title}
              </span>
            </div>
            <p className="text-[11px] text-navy font-medium leading-relaxed">{item.text}</p>
            <p className="font-mono text-[9px] text-muted">{item.time}</p>
          </div>
        ))}
      </div>

      <button
        onClick={() => setNotifications([])}
        className="w-full rounded-md border border-rule py-2 text-xs font-bold text-navy hover:bg-ink/5"
      >
        Clear All Notifications
      </button>
    </div>
  );
}
