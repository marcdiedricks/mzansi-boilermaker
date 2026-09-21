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

- ACTIVE vetted supplementary resources: 25
- NO SUITABLE VETTED RESOURCE (safety-controlled): 31
- VETTING REQUIRED: 18
- Total controlled KM lesson rows: 74

High-risk lessons are intentionally allowed to close with NO SUITABLE VETTED RESOURCE where an external visual could drift into operational or safety-critical instruction. The complete offline lesson remains the controlling learning resource.

## REMAINING PRE-FREEZE GATES

1. Complete the remaining 18 visual-resource vetting rows; 25 are ACTIVE and 31 are safety-controlled as NO SUITABLE VETTED RESOURCE.
2. Check learner-facing source/provenance wording across all KM/PM/WM pages.
3. Verify any specific standards references against the Standard Register before publication.
4. Run full mobile online/offline acceptance test on the deployed PWA.
5. Verify fresh install, offline relaunch, module navigation, quiz/progress storage, evidence storage and restore paths.
6. Confirm no stale Netlify build is being mistaken for the current GitHub baseline.
7. Only after these gates pass, calculate final readiness score and freeze the Boilermaker baseline.

## FREEZE STATUS

NOT FROZEN.

The content architecture is substantially complete, but visual vetting and final field/offline acceptance remain open.
