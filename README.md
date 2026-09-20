# Access Lens Audits

Build a production-quality SaaS web application called AccessLens — Website Accessibility Auditor.

1. Product concept

AccessLens analyzes a website's rendered/live state for accessibility barriers using automated accessibility rules and presents the findings in a clear developer-friendly audit dashboard.

The product should NOT claim that automated scanning proves legal compliance or replaces human accessibility testing.

Core positioning:

"Audit the experience, not just the code."

AccessLens should help developers, QA teams, agencies, freelancers, site owners, and compliance teams identify accessibility problems before or after deployment.

Primary workflow:

Enter URL → Scan website → Analyze → Accessibility report → Inspect issue → Understand impact → Suggested fix → Re-scan

2. Design direction

Create a premium modern developer/SaaS interface.

Visual style:

Clean

Professional

Trustworthy

Technical

Accessible

Minimal but visually impressive

Strong information hierarchy

Excellent responsive behavior

Use:

React + TypeScript

Tailwind CSS

shadcn/ui

Lucide icons

Recharts where charts are useful

Smooth but subtle animations

Cards with moderate rounded corners

Good whitespace

Accessible color contrast

Suggested color system:

Primary:

Deep navy: #12355B

Blue: #1E5AA8

Status:

Critical: red

Serious: orange

Moderate: yellow

Passed: green

Background:

#F5F7FA

Surface:

#FFFFFF

Text:

#17202A

Avoid excessive gradients, excessive glassmorphism, or flashy AI-style visuals.

3. Main navigation

Create a sidebar/dashboard navigation:

Overview

New Scan

Scan History

Issues

User Journeys

Reports

Integrations

Settings

Top navigation:

AccessLens logo

Search

Notifications

User profile

4. Landing page

Create a professional landing page before the dashboard.

Hero:

Audit the Experience, Not Just the Code.

Subtitle:

"AccessLens analyzes real, rendered websites for accessibility barriers, explains their impact, and gives developers actionable fixes."

Primary CTA:

Start Free Scan

Secondary CTA:

View Demo Report

Include a visual mockup of the accessibility dashboard.

Feature cards:

Automated Accessibility Analysis

Analyze rendered HTML, CSS, ARIA, forms, headings, contrast, focus and other accessibility signals.

User Journey Testing

Test important workflows such as login, checkout and form submission.

Developer-Friendly Fixes

Explain problems and provide suggested code fixes.

Continuous Monitoring

Track accessibility regressions between scans.

Compliance Reports

Generate professional audit reports and maintain an audit history.

Important disclaimer:

"Automated testing identifies detectable accessibility barriers but does not constitute certification or guarantee full WCAG compliance. Human evaluation may still be required."

5. New Scan page

Create a prominent URL scanner.

Title:

Start Accessibility Scan

URL input:

https://example.com

Options:

Single page

Website crawl

Important user journey

Advanced options:

WCAG 2.1

WCAG 2.2

Level A

Level AA

Level AAA

Default:
WCAG 2.2 / AA

Buttons:

Start Scan

Advanced Settings

Show a scan progress interface:

Initializing browser                    ✓
Loading website                         ✓
Analyzing DOM                           ✓
Inspecting accessibility tree           ✓
Checking contrast                       ✓
Checking forms                          ✓
Checking keyboard/focus behavior        ✓
Analyzing user journeys                 ...
Generating report                       ...


6. Dashboard / Scan result

Create a visually impressive accessibility report.

Header:

Accessibility Audit

Example:

Website:
demo-store.com

Scan:
September 20, 2026

Status:

Needs Attention

Main score card:

78 / 100
Accessibility Health


Do NOT present this score as an official WCAG compliance score.

Under it:

Critical       3
Serious        7
Moderate      12
Passed        84


Create a circular/radial visualization for the overall internal AccessLens health score.

Add category cards:

Perceivable

Operable

Understandable

Robust

Keyboard

Forms

Color & Contrast

Structure

Use charts to show issue distribution and trends.

7. Issues page

Create filters:

Severity:

Critical

Serious

Moderate

Minor

Category:

Keyboard

Forms

Color

ARIA

Images

Structure

Navigation

Status:

Open

Fixed

Ignored

Each issue should show:

CRITICAL

Button has no accessible name

Element:
<button class="icon-btn">

WCAG:
4.1.2 Name, Role, Value

Affected users:
Screen-reader users

Detected on:
Checkout page


Add:
View Details

8. Issue detail page

This is one of the most important screens.

Layout:

LEFT:
Website preview / affected element

RIGHT:
Issue explanation

Example:

Button has no accessible name

What happened?

This interactive button does not expose a meaningful accessible name.

Who may be affected?

Screen-reader users may hear only "button" without knowing its purpose.

Detected element

<button class="icon-btn">
  <svg>...</svg>
</button>


Suggested fix

<button
  class="icon-btn"
  aria-label="Delete account">
  <svg>...</svg>
</button>


Buttons:

Copy Fix

Mark as Fixed

Ignore

Open Element

Add an expandable section:

Why this matters

WCAG reference

Technical detection

Suggested remediation

9. Accessibility heatmap

Create a page preview showing the scanned website.

Overlay issue markers:

🔴 Critical
🟠 Serious
🟡 Moderate

Example:

┌───────────────────────────────────┐
│ Logo    Products    Login         │
│                                   │
│        Product                    │
│                                   │
│       [Add to Cart] 🔴            │
│                                   │
│ Email: __________ 🟠              │
│                                   │
└───────────────────────────────────┘


Clicking an issue marker should open its details.

10. User Journey testing

This is an important differentiating feature.

Create a section:

Accessibility Journeys

Predefined journeys:

Login

Product purchase

Checkout

Contact form

Registration

Example:

Purchase Journey

Open website             ✓
Search product            ✓
Open product              ✓
Add to cart               ✓
Open checkout             ✓
Enter payment             ⚠
Confirm payment           ✕


Show:

Journey blocked

Reason:

"Keyboard focus was lost when the payment modal opened."

Show affected persona:

Keyboard-only user

Screen-reader user

Create a journey health indicator.

11. Persona testing

Allow users to select:

Keyboard-only user

Screen-reader user

Low-vision user

Color-vision deficiency

Motor impairment

When selected, show the relevant detected barriers.

Important wording:

Use "simulation/testing profile" rather than claiming that the system perfectly reproduces the lived experience of a person with a disability.

12. Before / After

Create an impressive comparison screen.

Example:

BEFORE

Accessibility Health
71 / 100

Critical: 4
Serious: 9
Moderate: 13

             ↓

Apply suggested fixes

             ↓

AFTER

Accessibility Health
94 / 100

Critical: 1
Serious: 3
Moderate: 6


Show resolved and remaining issues.

13. AI Accessibility Assistant

Add an AI assistant panel called:

AccessLens Copilot

Users can ask:

"Explain this issue"

"Why does this affect screen-reader users?"

"How do I fix this?"

"Show me the React version of the fix"

"Explain this WCAG criterion"

"Prioritize the most important issues"

Example:

User:
"Why is this button inaccessible?"

Assistant:
"The button contains only an icon and does not expose an accessible name. A screen reader may announce it only as 'button'. Add a meaningful accessible name using visible text or aria-label."

Important:
AI should explain and suggest fixes, but deterministic scan results remain the source of truth for automated findings.

14. Scan history

Create a historical timeline:

Sep 20       78
Sep 17       83
Sep 12       89
Sep 05       94


Show an accessibility trend chart.

Allow comparison:

Compare scans

Version A vs Version B.

Show:

New issues       +3
Fixed issues     -8
Unchanged        14


15. Accessibility regression

Create a dashboard card:

Accessibility Regression

Example:

Previous scan      92
Current scan       84

⚠ 8-point decline

5 new issues detected


Show affected pages and components.

16. Reports

Create a professional report generation page.

Options:

PDF Report

HTML Report

CSV Export

JSON Export

Report should contain:

Website

Scan date

Scope

AccessLens health score

Issue summary

Severity

WCAG references

Affected URLs

Recommendations

Before/after changes

Limitations/disclaimer

For agencies, include:

White-label report

Allow company logo/name fields.

17. CI/CD integration mockup

Create an Integrations page.

Cards:

GitHub

GitLab

GitHub Actions

Vercel

Netlify

Show a sample result:

GitHub Pull Request #42

Accessibility Check

❌ FAILED

5 new accessibility issues

Critical: 2
Serious: 3

Affected:
Login.tsx
CheckoutModal.tsx
Navbar.tsx


This can initially be a frontend demonstration with mock data.

18. WordPress integration mockup

Create a WordPress integration card:

AccessLens WordPress Plugin

Status:
Not connected

Description:

"Scan WordPress pages and monitor accessibility changes."

Button:
Connect WordPress

For the hackathon prototype, this can be a UI demonstration rather than a complete WordPress plugin implementation.

19. Demo mode

This is VERY important for the hackathon.

Create a:

Try Demo

button.

It should load a realistic demo website called:

DemoStore

Populate it with intentional accessibility issues.

Example issues:

Missing image alt text

Poor contrast

Missing form labels

Icon-only buttons

Incorrect heading hierarchy

Keyboard focus problem

Modal focus problem

Missing accessible error message

The demo should feel like a real scanned website.

The judges should be able to click:

Try Demo → Scan → Report → Issue → Fix → Re-scan

without needing an external website.

20. Mock scan engine

For the initial Lovable prototype, implement the frontend using realistic mock scan results.

Create a clean service abstraction such as:

scanWebsite(url)


Return structured data:

{
  url,
  score,
  summary,
  issues,
  journeys,
  categories,
  scanDate
}


Keep the architecture ready for a real backend later.

Do NOT pretend that the mock results are actually being obtained from the submitted URL.

Clearly distinguish:

Demo Scan

from

Live Scan

21. Future backend architecture

Prepare the UI/API structure for:

Frontend:
React + TypeScript + Tailwind

Backend:
FastAPI

Browser automation:
Playwright

Accessibility engine:
axe-core

Database:
Supabase/PostgreSQL

Future AI:
LLM-based explanation/remediation layer

Future worker:
Background scanning queue

Architecture:

User
 ↓
React Dashboard
 ↓
FastAPI
 ↓
Scan Worker
 ↓
Playwright
 ↓
Rendered Website
 ↓
axe-core + custom checks
 ↓
Normalized findings
 ↓
PostgreSQL/Supabase
 ↓
AccessLens Dashboard


AI should sit on top of the findings for explanation/remediation, not replace deterministic accessibility checks.

22. Important technical principles

Do NOT claim:

"Website is legally compliant."

Instead say:

"Detected accessibility barriers"

or:

"Automated accessibility health"

or:

"Potential WCAG issues detected."

Include a disclaimer:

"Automated accessibility testing cannot detect every accessibility barrier. Human evaluation may be required for complete accessibility assessment and legal compliance."

Also distinguish:

WCAG technical criteria

legal/regulatory frameworks

automated findings

human evaluation

Do not claim that a score automatically equals ADA/EAA/RPWD compliance.

23. Responsive design

The entire application must work on:

Desktop

Tablet

Mobile

On mobile, convert the sidebar into a bottom navigation or hamburger menu.

Charts must remain readable.

Tables should become cards on mobile.

24. Seed demo data

Create realistic demo data for:

Website:
DemoStore

Pages:

/

/products

/product/running-shoes

/cart

/checkout

/login

/contact

Issues:
At least 15 realistic issues.

Example:

3 Critical
5 Serious
7 Moderate


Create multiple scan versions so the history/trend pages look realistic.

25. Final hackathon experience

The most important flow should be:

LANDING PAGE
↓
TRY DEMO
↓
SCAN
↓
ACCESSIBILITY DASHBOARD
↓
USER JOURNEY
↓
IDENTIFY BLOCKER
↓
ISSUE DETAILS
↓
AI EXPLANATION
↓
SUGGESTED CODE FIX
↓
BEFORE / AFTER
↓
GENERATE REPORT

Make this flow extremely polished.

The application should feel like a real SaaS product that could eventually be used by agencies, developers, QA teams, organizations, and accessibility auditors.

Prioritize functionality and polish of the demo flow over implementing every backend integration.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/e9e9be77-5c3d-4d4e-8957-ee81e6df9bbb).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
