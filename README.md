# CyberAries — Phishing Awareness Drill (Landing Page)

An **authorized internal security awareness simulation** for CyberAries Pvt Ltd.
It presents a fake "win 1 of 5 gift cards worth ₹5,000" offer so employees can
practice recognizing a phishing lure — then reveals the drill and teaches the
red flags.

> ⚠️ **Use only against your own consenting employees / participants, with
> management and IT/Security sign-off.** Do not send to anyone outside an
> authorized engagement. This is a training tool, not an attack tool.

## What it does — and deliberately does **not** do

- ✅ Shows a convincing lure page (`index.html`).
- ✅ On submit, records a **single anonymous event** — a random tracking id,
  timestamp, campaign name, and stage (`page_view` / `form_submit`).
- ✅ Immediately redirects to an educational reveal page (`caught.html`).
- ❌ **Never reads, stores, or transmits** anything typed into the form. The
  fields are theatre; `app.js` calls `form.reset()` and ignores the values.
- ❌ No names, emails, employee IDs, or passwords are ever captured.

This "measure engagement, not content" design is the standard, defensible way
to run awareness drills (same principle as KnowBe4 / GoPhish click tracking).

## Files

| File | Purpose |
|------|---------|
| `index.html` | The phishing lure (gift-card offer + fake form). |
| `caught.html` | The "you've been phished — this was a test" reveal + training. |
| `assets/app.js` | Anonymous engagement tracker. Enforces the no-data-capture rule. |
| `assets/style.css` | Shared styling for both pages. |

## Configure

In `assets/app.js`:

- `CAMPAIGN` — name shown in your metrics (default `diwali-giftcard-2026`).
- `REPORT_ENDPOINT` — set to a collector you control to aggregate results
  across browsers. It receives **only** the anonymous event object. Leave
  `null` to keep events in each browser's `localStorage` (view them in the
  console or via `localStorage.getItem('ca_drill_events')`).

## Run locally

```bash
python -m http.server 8080
```

Then open <http://localhost:8080/>.

## Before you deploy — checklist

- [ ] Written authorization from CyberAries management + IT/Security on file.
- [ ] Scope limited to consenting internal participants.
- [ ] Legal/HR aware (local labor & privacy rules, e.g. DPDP, can apply even to drills).
- [ ] Debrief/training plan ready for everyone who clicks.
- [ ] `REPORT_ENDPOINT` points only to infrastructure you control.
- [ ] Hosted on a clearly owned domain; take it down after the drill window.

## Ethics note

The value of this exercise is **education, not embarrassment**. Aggregate the
results, don't name individuals, and follow every drill with supportive training.
