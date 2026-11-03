/*
 * CyberAries phishing-drill tracker.
 *
 * SAFETY CONTRACT (do not change without security review):
 *   - This script NEVER reads, stores, or transmits the values a person
 *     types into the form. The input fields exist only to make the lure
 *     convincing for the awareness test.
 *   - On submit we record a single anonymous "engagement" event:
 *     a random tracking id, a timestamp, the campaign name, and which
 *     stage the person reached. No names, emails, IDs, or passwords.
 *   - The event is kept in localStorage and (optionally) POSTed to a
 *     metrics endpoint you control. See REPORT_ENDPOINT below.
 */

(function () {
  "use strict";

  // Set this to your own metrics collector to aggregate results, or leave
  // null to keep events only in the browser's localStorage.
  // The endpoint receives ONLY the anonymous event object below.
  var REPORT_ENDPOINT = null; // e.g. "https://drill-metrics.cyberaries.internal/log"

  var CAMPAIGN = "diwali-giftcard-2026";
  var STORAGE_KEY = "ca_drill_events";

  // Per-browser pseudonymous id so repeat visits aren't double counted.
  function trackingId() {
    try {
      var id = localStorage.getItem("ca_drill_tid");
      if (!id) {
        id = "tid_" + Math.random().toString(36).slice(2) + Date.now().toString(36);
        localStorage.setItem("ca_drill_tid", id);
      }
      return id;
    } catch (e) {
      return "tid_ephemeral_" + Date.now().toString(36);
    }
  }

  // Record an anonymous event. NOTE: `fields` are deliberately ignored.
  function record(stage) {
    var evt = {
      campaign: CAMPAIGN,
      trackingId: trackingId(),
      stage: stage, // "page_view" | "form_submit"
      ts: new Date().toISOString(),
      // Non-identifying context only:
      ua: navigator.userAgent,
      lang: navigator.language,
      ref: document.referrer || null
    };

    try {
      var log = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
      log.push(evt);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(log));
    } catch (e) { /* storage unavailable — fine */ }

    if (REPORT_ENDPOINT) {
      try {
        // Fire-and-forget; keepalive lets it complete during navigation.
        fetch(REPORT_ENDPOINT, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(evt),
          keepalive: true,
          mode: "cors"
        }).catch(function () {});
      } catch (e) { /* ignore network errors */ }
    }

    // Visible in the console for anyone inspecting — reinforces it's a drill.
    try { console.info("[CyberAries drill] event:", evt.stage, evt.trackingId); } catch (e) {}
    return evt;
  }

  // Count the view as soon as the page loads.
  record("page_view");

  // Light "urgency" animation on the slot counter — pure theatre for the lure.
  var slots = document.getElementById("slots");
  if (slots) {
    setTimeout(function () { slots.textContent = "2"; }, 9000);
  }

  var form = document.getElementById("claim-form");
  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();

      // IMPORTANT: we do NOT read form field values. Clear them immediately
      // so nothing typed can linger in memory or the DOM.
      try { form.reset(); } catch (err) {}

      record("form_submit");

      var btn = document.getElementById("claim-btn");
      if (btn) {
        btn.disabled = true;
        btn.textContent = "Verifying…";
      }

      // Send them to the educational reveal, tagged so it knows they submitted.
      setTimeout(function () {
        window.location.href = "caught.html?stage=submit&tid=" + encodeURIComponent(trackingId());
      }, 700);
    });
  }
})();
