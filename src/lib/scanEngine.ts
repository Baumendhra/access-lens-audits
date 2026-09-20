export type Severity = "critical" | "serious" | "moderate";
export type IssueStatus = "open" | "fixed" | "ignored";
export type Category = "Keyboard" | "Forms" | "Color" | "ARIA" | "Images" | "Structure" | "Navigation";

export interface Issue {
  id: number;
  severity: Severity;
  title: string;
  wcag: string;
  wcagLevel: "A" | "AA" | "AAA";
  category: Category;
  page: string;
  selector: string;
  users: string;
  explanation: string;
  fix: string;
  codeSnippet: string;
  status: IssueStatus;
  heatmapX: number; // percentage on mockup canvas
  heatmapY: number; // percentage on mockup canvas
}

export interface UserJourneyStep {
  id: number;
  label: string;
  page: string;
  status: "passed" | "warning" | "blocked";
  details: string;
  affectedPersona: string;
}

export interface UserJourney {
  id: string;
  title: string;
  description: string;
  status: "passed" | "needs-attention" | "blocked";
  steps: UserJourneyStep[];
  health: number;
}

export interface PersonaProfile {
  id: string;
  name: string;
  description: string;
  icon: string;
  affectedIssueIds: number[];
  filterCss?: string;
}

export interface TargetPreset {
  id: string;
  domain: string;
  name: string;
  icon: string;
  health: number;
}

export const presetTargets: TargetPreset[] = [
  { id: "amazon", domain: "www.amazon.in", name: "Amazon India", icon: "ShoppingCart", health: 74 },
  { id: "demostore", domain: "demo-store.com", name: "DemoStore E-Commerce", icon: "Store", health: 78 },
  { id: "github", domain: "github.com", name: "GitHub Developer Portal", icon: "GitBranch", health: 89 },
  { id: "wikipedia", domain: "wikipedia.org", name: "Wikipedia Encyclopedia", icon: "Globe", health: 92 },
  { id: "google", domain: "google.com", name: "Google Search Engine", icon: "Search", health: 95 },
];

export function getIssuesForUrl(targetUrl: string): Issue[] {
  const clean = targetUrl.toLowerCase().trim().replace(/^https?:\/\//, "").replace(/\/.*$/, "");

  if (clean.includes("amazon.in") || clean.includes("amazon")) {
    return [
      {
        id: 1,
        severity: "critical",
        title: "Amazon Search bar missing programmatic accessible name",
        wcag: "4.1.2 Name, Role, Value",
        wcagLevel: "A",
        category: "Forms",
        page: "/",
        selector: '<input id="twotabsearchtextbox" name="field-keywords">',
        users: "Screen-reader & Voice command users",
        explanation: "The main Amazon search input field relies on a visual placeholder without a programmatically associated label or explicit aria-label.",
        fix: `<input id="twotabsearchtextbox" name="field-keywords" aria-label="Search Amazon.in" placeholder="Search Amazon.in" />`,
        codeSnippet: `<input type="text" id="twotabsearchtextbox" value="" name="field-keywords" autocomplete="off" placeholder="Search Amazon.in">`,
        status: "open",
        heatmapX: 52,
        heatmapY: 18,
      },
      {
        id: 2,
        severity: "critical",
        title: "Today's Deals carousel modal does not trap keyboard focus",
        wcag: "2.4.3 Focus Order",
        wcagLevel: "A",
        category: "Keyboard",
        page: "/deals",
        selector: '<div class="a-modal-scroller">',
        users: "Keyboard-only users",
        explanation: "When opening lightning deal quick view dialogs on Amazon India, keyboard focus moves into background header navigation.",
        fix: `<Dialog onOpenAutoFocus={(e) => e.preventDefault()} aria-labelledby="deal-title">\n  <DialogContent>...</DialogContent>\n</Dialog>`,
        codeSnippet: `<div className="a-popover a-popover-modal">\n  <div className="a-popover-wrapper">...</div>\n</div>`,
        status: "open",
        heatmapX: 48,
        heatmapY: 45,
      },
      {
        id: 3,
        severity: "serious",
        title: "Prime deal banner missing alternative text description",
        wcag: "1.1.1 Non-text Content",
        wcagLevel: "A",
        category: "Images",
        page: "/",
        selector: '<img src="prime-fest-hero.jpg">',
        users: "Screen-reader users",
        explanation: "Promotional hero banners contain embedded sale text ('Extra 10% off with SBI cards') but omit descriptive alt text.",
        fix: `<img src="prime-fest-hero.jpg" alt="Great Indian Festival Sale: Extra 10% instant discount with SBI credit cards" />`,
        codeSnippet: `<img src="https://m.media-amazon.com/images/I/71qid7Q75L._SX3000_.jpg" className="gw-banner">`,
        status: "open",
        heatmapX: 30,
        heatmapY: 38,
      },
      {
        id: 4,
        severity: "serious",
        title: "Discounted price text contrast below 4.5:1 threshold",
        wcag: "1.4.3 Contrast (Minimum)",
        wcagLevel: "AA",
        category: "Color",
        page: "/dp/B08N5WRWNW",
        selector: ".a-price-symbol, .a-color-price",
        users: "Low-vision users",
        explanation: "Secondary price text `#565959` against white background renders at 3.4:1 contrast ratio instead of required 4.5:1.",
        fix: `.a-color-price {\n  color: #2D3748; /* Contrast 7.2:1 */\n}`,
        codeSnippet: `<span className="a-color-price font-size-base">₹1,299.00</span>`,
        status: "open",
        heatmapX: 72,
        heatmapY: 62,
      },
      {
        id: 5,
        severity: "moderate",
        title: "Category filter checkbox missing visible focus indicator",
        wcag: "2.4.7 Focus Visible",
        wcagLevel: "AA",
        category: "Keyboard",
        page: "/s?k=electronics",
        selector: '.a-checkbox input[type="checkbox"]:focus',
        users: "Keyboard-only users",
        explanation: "When tabbing through brand filter checkboxes on search result pages, focus ring is hidden via CSS outline:none.",
        fix: `.a-checkbox input:focus-visible {\n  outline: 3px solid #006699;\n  outline-offset: 2px;\n}`,
        codeSnippet: `<input type="checkbox" name="s-ref-checkbox-brand" value="Samsung">`,
        status: "open",
        heatmapX: 18,
        heatmapY: 55,
      },
    ];
  }

  if (clean.includes("github.com") || clean.includes("github")) {
    return [
      {
        id: 1,
        severity: "critical",
        title: "Code repository file tree expander missing aria-expanded state",
        wcag: "4.1.2 Name, Role, Value",
        wcagLevel: "A",
        category: "ARIA",
        page: "/repository",
        selector: ".js-navigation-container button",
        users: "Screen-reader users",
        explanation: "Collapsible directory buttons do not toggle aria-expanded='true/false', so screen reader users do not hear if folder is open.",
        fix: `<button aria-expanded={isOpen} aria-controls="folder-tree-list">...</button>`,
        codeSnippet: `<button className="btn-link font-weight-bold">src/</button>`,
        status: "open",
        heatmapX: 25,
        heatmapY: 42,
      },
      {
        id: 2,
        severity: "serious",
        title: "Commit hash badge missing descriptive screen reader label",
        wcag: "2.4.4 Link Purpose",
        wcagLevel: "A",
        category: "Navigation",
        page: "/commits",
        selector: 'a.text-mono[href*="/commit/"]',
        users: "Screen-reader users",
        explanation: "Links containing hex hashes like 'a1b2c3d' read alphanumeric strings out of context.",
        fix: `<a href="/commit/a1b2c3d" aria-label="View commit a1b2c3d: Update build config">a1b2c3d</a>`,
        codeSnippet: `<a href="/commit/7f83a1" className="text-mono font-[11px]">7f83a1</a>`,
        status: "open",
        heatmapX: 82,
        heatmapY: 28,
      },
    ];
  }

  // Fallback for DemoStore or any general custom URL entered by user
  return initialIssues;
}

export const initialIssues: Issue[] = [
  {
    id: 1,
    severity: "critical",
    title: "Button has no accessible name",
    wcag: "4.1.2 Name, Role, Value",
    wcagLevel: "A",
    category: "ARIA",
    page: "/checkout",
    selector: '<button class="icon-btn">',
    users: "Screen-reader users",
    explanation: "This interactive button does not expose a meaningful accessible name. A screen reader may announce only 'button' without telling someone what action it performs.",
    fix: `<button class="icon-btn" aria-label="Delete item from cart">
  <svg aria-hidden="true" focusable="false">...</svg>
</button>`,
    codeSnippet: `<button class="icon-btn">\n  <svg class="trash-icon">...</svg>\n</button>`,
    status: "open",
    heatmapX: 78,
    heatmapY: 42,
  },
  {
    id: 2,
    severity: "critical",
    title: "Modal does not trap keyboard focus",
    wcag: "2.4.3 Focus Order",
    wcagLevel: "A",
    category: "Keyboard",
    page: "/checkout",
    selector: '<div role="dialog">',
    users: "Keyboard-only users",
    explanation: "When the payment dialog opens, focus remains behind the overlay. Keyboard users can move into the page underneath and lose their focus state.",
    fix: `<Dialog onOpenAutoFocus={(event) => event.preventDefault()}>
  <DialogContent aria-labelledby="payment-title">
    <DialogTitle id="payment-title">Payment Details</DialogTitle>
    ...
  </DialogContent>
</Dialog>`,
    codeSnippet: `<div class="modal-overlay">\n  <div className="modal-body">\n    <h2>Payment Details</h2>\n  </div>\n</div>`,
    status: "open",
    heatmapX: 50,
    heatmapY: 35,
  },
  {
    id: 3,
    severity: "critical",
    title: "Error message is not announced to screen readers",
    wcag: "4.1.3 Status Messages",
    wcagLevel: "AA",
    category: "Forms",
    page: "/login",
    selector: '<div class="form-error">',
    users: "Screen-reader users",
    explanation: "The login error appears visually but is not exposed as a live status message, so someone using a screen reader may not know that submission failed.",
    fix: `<div role="alert" aria-live="assertive" className="form-error">
  Email or password is incorrect.
</div>`,
    codeSnippet: `<div className="form-error">\n  Invalid email or password.\n</div>`,
    status: "open",
    heatmapX: 45,
    heatmapY: 65,
  },
  {
    id: 4,
    severity: "serious",
    title: "Form field is missing a programmatically linked label",
    wcag: "3.3.2 Labels or Instructions",
    wcagLevel: "A",
    category: "Forms",
    page: "/contact",
    selector: '<input type="email">',
    users: "Screen-reader users & Speech input users",
    explanation: "The email input has no programmatically associated label element. Assistive tools cannot state the input prompt accurately.",
    fix: `<label htmlFor="email-input" className="block text-sm font-medium">Email address</label>
<input id="email-input" name="email" type="email" className="input-field" />`,
    codeSnippet: `<span>Email address</span>\n<input type="email" placeholder="you@example.com" />`,
    status: "open",
    heatmapX: 40,
    heatmapY: 55,
  },
  {
    id: 5,
    severity: "serious",
    title: "Text and background contrast is below WCAG AA threshold",
    wcag: "1.4.3 Contrast (Minimum)",
    wcagLevel: "AA",
    category: "Color",
    page: "/products",
    selector: ".muted-link",
    users: "Low-vision users",
    explanation: "The secondary navigation link renders at a 3.1:1 contrast ratio. Normal body text requires at least 4.5:1 for WCAG AA compliance.",
    fix: `.muted-link {
  color: #1E5AA8; /* Contrast ratio 5.2:1 */
  font-weight: 600;
}`,
    codeSnippet: `<a href="/shipping" className="text-gray-400 text-xs">Shipping terms</a>`,
    status: "open",
    heatmapX: 85,
    heatmapY: 15,
  },
];

export const userJourneys: UserJourney[] = [
  {
    id: "purchase",
    title: "Purchase Journey",
    description: "Complete checkout flow from product selection to payment confirmation.",
    status: "blocked",
    health: 71,
    steps: [
      { id: 1, label: "Open website homepage", page: "/", status: "passed", details: "DOM loaded, landmark regions identified cleanly.", affectedPersona: "All users" },
      { id: 2, label: "Search product in searchbar", page: "/", status: "passed", details: "Input has accessible label and active focus indicator.", affectedPersona: "Keyboard-only user" },
      { id: 3, label: "Open product details page", page: "/products/running-shoes", status: "passed", details: "Page heading structure announced correctly.", affectedPersona: "Screen-reader user" },
      { id: 4, label: "Add product item to cart", page: "/products/running-shoes", status: "passed", details: "Add button announced with price breakdown.", affectedPersona: "Screen-reader user" },
      { id: 5, label: "Open cart drawer & proceed to checkout", page: "/cart", status: "passed", details: "Cart summary table headers readable.", affectedPersona: "Low-vision user" },
      { id: 6, label: "Enter payment details modal", page: "/checkout", status: "warning", details: "Modal focus trapped initially, but missing aria-live alert on input error.", affectedPersona: "Screen-reader user" },
      { id: 7, label: "Confirm payment & finalize order", page: "/checkout", status: "blocked", details: "Keyboard focus was lost when payment gateway modal opened. Keyboard users cannot tab to 'Confirm Payment' button.", affectedPersona: "Keyboard-only user" },
    ],
  },
];

export const personaProfiles: PersonaProfile[] = [
  {
    id: "keyboard",
    name: "Keyboard-only user",
    description: "Navigates using Tab, Shift+Tab, Space, Enter, and Arrow keys. Affected by missing focus rings and focus traps.",
    icon: "Keyboard",
    affectedIssueIds: [2, 5],
  },
  {
    id: "screen-reader",
    name: "Screen-reader user",
    description: "Relies on NVDA, VoiceOver, or JAWS for audio announcements of ARIA names, roles, live status, and hierarchy.",
    icon: "Volume2",
    affectedIssueIds: [1, 3, 4],
  },
  {
    id: "low-vision",
    name: "Low-vision user",
    description: "Requires high contrast, clean font sizing, zoom scalability, and clear element boundaries.",
    icon: "Eye",
    affectedIssueIds: [4, 5],
    filterCss: "contrast(1.25) saturate(1.1)",
  },
];

export function calculateHealthScore(issueList: Issue[]): number {
  const open = issueList.filter((i) => i.status === "open");
  if (open.length === 0) return 100;
  
  let deduction = 0;
  for (const issue of open) {
    if (issue.severity === "critical") deduction += 7;
    else if (issue.severity === "serious") deduction += 3;
    else deduction += 1;
  }
  
  return Math.max(35, 100 - deduction);
}

export function getSeverityStats(issueList: Issue[]) {
  const open = issueList.filter((i) => i.status === "open");
  return {
    critical: open.filter((i) => i.severity === "critical").length,
    serious: open.filter((i) => i.severity === "serious").length,
    moderate: open.filter((i) => i.severity === "moderate").length,
    passed: 84 + issueList.filter((i) => i.status === "fixed").length,
  };
}

export function getCategoryScores(issueList: Issue[]): Record<Category, number> {
  const categories: Category[] = ["Keyboard", "Forms", "Color", "ARIA", "Images", "Structure", "Navigation"];
  const result = {} as Record<Category, number>;

  for (const cat of categories) {
    const catIssues = issueList.filter((i) => i.category === cat);
    const openCount = catIssues.filter((i) => i.status === "open").length;
    if (catIssues.length === 0) {
      result[cat] = 95;
    } else {
      const fixedPct = ((catIssues.length - openCount) / catIssues.length) * 100;
      result[cat] = Math.round(65 + fixedPct * 0.35);
    }
  }

  return result;
}
