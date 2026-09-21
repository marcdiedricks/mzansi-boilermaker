# BOILERMAKER_BUILD_INTEGRITY_AUDIT.md

Status: ACTIVE PRE-FREEZE AUDIT  
Audit date: 2026-09-21  
Trade: Boilermaker  
Qualification: SAQA 123381  
Curriculum: 651302-000-01-00

## COMPLETED BUILD LAYERS

- KM-01 to KM-14: built.
- PM-01 to PM-09: built as preparation/evidence support, with high-risk practical boundaries.
- WM-01 to WM-05: built as workplace-evidence support; app completion never equals workplace competence.
- Visual-learning controlled inventory: 74 current KM lessons mapped.
- Legacy KM-04A to KM-04J: retired from live learner UI and offline precache; preserved for traceability.
- Embedded legacy KM-07 pilot lesson/quiz views: retired from the live learner UI.
- Learner tools app logic: hardened after legacy KM-07 retirement.
- Evidence selector: PM-01 to PM-09 and WM-01 to WM-05 included.

## OFFLINE / PATH INTEGRITY CHECK

Repository tree checked against the service-worker precache and learner-home links.

Result at audit:
- repository files detected: 220
- service-worker application-shell paths checked: no missing cached file paths detected
- learner-home links checked: no missing target files detected

Note: the service worker intentionally keeps current controlled content only. Retired KM-04 pilot pages are not precached.

## CURRENT SOURCE RECONCILIATION

Verified against the current official CHIETA curriculum summary:
- KM-11: 651302-000-01-KM-11
- KM-12: 653201-000-01-KM-12
- KM-13: 653202-000-01-KM-13
- KM-14: 651302-001-00-KM-14
- WM-02: NQF Level 3, 30 credits

Official-document anomalies are not silently corrected in source provenance. They remain audit notes where detailed sections conflict with summary tables or contain copied cross-trade wording.

## VISUAL LEARNING VETTING PROGRESS — 2026-09-21

- ACTIVE vetted supplementary resources: 36
- NO SUITABLE VETTED RESOURCE (safety/relevance controlled): 38
- VETTING REQUIRED: 0
- Total controlled KM lesson rows: 74
- Learner-facing `visual-learning.html`: built and linked from Learner Tools
- External resources: internet-only and not cached as dependencies

The visual-learning inventory gate is complete. High-risk rows are intentionally closed without external learner-facing links where available material could drift into operational or safety-critical instruction.

## STANDARDS / LEGISLATION INVESTIGATION — 2026-09-21

- Occupational Health and Safety Act 85 of 1993: official government source rechecked.
- General Safety Regulations: current government source located and placed under module-specific control.
- Driven Machinery Regulations: official 2015 regulations and 2017 guidelines rechecked; 2024 lifting-machine-operator training-provider code incorporation noted.
- Pressure Equipment Regulations, 2009: official government source and guidance rechecked.
- SANS 347 regulatory relevance confirmed through government pressure-equipment guidance. Edition-specific SABS status remains controlled as UNDER REVIEW before any edition-specific learner claim.
- `BOILERMAKER_STANDARDS_REGISTER.md`: created.

## REMAINING PRE-FREEZE GATES

1. Check learner-facing source/provenance wording across all KM/PM/WM pages.
2. Verify any edition-specific technical-standard references against BOILERMAKER_STANDARDS_REGISTER.md before publication.
3. Run full mobile online/offline acceptance test on the deployed PWA.
4. Verify fresh install, offline relaunch, module navigation, quiz/progress storage, evidence storage and restore paths.
5. Confirm no stale Netlify build is being mistaken for the current GitHub baseline.
6. Only after these gates pass, calculate final readiness score and freeze the Boilermaker baseline.

## FREEZE STATUS

NOT FROZEN.

The content architecture and visual-learning vetting are complete. Source/provenance consistency and final field/offline acceptance remain open.
