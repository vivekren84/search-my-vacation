# EBC-007 — Passport and Journey Director pre-change audit

Audit date: 2 August 2026

## Journey Passport baseline

- The welcome screen was followed by seven guest-facing input/review moments: name, companions, dream journey, travel style, timing, destination and final review.
- Progress was represented by a horizontally scrolling row of chapter pills. It did not show a completion percentage and the visual language did not clearly resemble a Passport journey.
- Completion immediately copied the Passport into React context, cleared the draft and started an automatic transition to Journey Director.
- The completion screen did not issue or display a stable Passport ID and did not capture a mobile number.
- The Director later generated a separate `JY-XXXX-XXXX` reference, so the Passport and Director did not share one identifier.
- The Passport draft preserved typed values and back navigation within a browser session. Multi-select was correctly limited to three.

## Journey Director baseline

- Primary-intent capability existed in the type system but was not applied as a hard contradiction gate.
- Explicit travel styles could override the guest's selected dream journey, allowing a secondary preference to steer the lead recommendation.
- Only five runtime candidates were presentation-ready, which made mountain and wildlife requests prone to empty or weak result sets despite catalogue coverage.
- A recognised destination could be labelled unserved when it was served but not a strong fit for the primary intent.
- Kerala aliases and destination-level versus region-level recognition were incomplete.
- The selection pipeline could return no useful recommendation when confidence thresholds were missed.

## Asset and instrumentation findings

- The repository does not contain the approved circular stamp artwork with the phrase “Stories Stamped. Memories Guaranteed.” The existing CSS-generated seal is not treated as the approved asset; replacement remains paused until the exact source asset is supplied.
- No shared analytics abstraction is present in the inspected Passport/Director runtime, so EBC-007 will not introduce a new analytics library or event transport.

## Data-carry limitation to verify after implementation

- The current application preserves completed Director sessions in browser `sessionStorage`; it does not persist Passport identity/contact details to a backend. The final release report must describe that limitation explicitly.
