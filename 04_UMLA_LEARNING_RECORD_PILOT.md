# UMLA LEARNING RECORD PILOT — BOILERMAKER

## Status
Pilot specification for the first controlled LMS integration.

## Purpose
Prove that an existing offline-first learning PWA can emit a common learning record without changing its learner experience, assessment rule, or curriculum content.

## Pilot activity
- Programme: Mzansi Boilermaker
- Qualification: SAQA 123381
- Module: KM-04
- Activity: KM-04 Lesson 3 knowledge check
- Existing pass rule: 4/4
- Existing local progress record remains unchanged

## Universal Learning Record schema v0.1
Each emitted record contains:

- schemaVersion
- eventId
- learnerId
- programmeId
- qualificationId
- moduleId
- activityId
- activityType
- eventType
- outcome
- score
- sourceBuild
- occurredAt
- createdAt
- syncStatus

## Current pilot behavior
When KM-04 Lesson 3 is passed:
1. The existing `km04r03-progress` record is saved exactly as before.
2. `learning-record.js` creates or reuses a local anonymous learner ID.
3. A new learning event is appended to `learning-events-v0.1` in IndexedDB.
4. The event is marked `LOCAL_ONLY`.
5. No network request, API, server, central learner database, or AI service is used.

## Privacy and safety
- No central upload exists in this phase.
- The learning record uses a generated learner ID rather than learner name.
- This record proves learning progress only. It is not competence, workplace authorisation, trade-test evidence, or certification.

## Freeze gate
Do not roll this connector to other PWAs until the pilot verifies:
- KM-04 Lesson 3 still works online.
- KM-04 Lesson 3 still works offline.
- 4/4 still marks the existing lesson complete.
- A universal learning event is created locally after a pass.
- Reopening the app does not erase the event.
- No visible learner workflow regression is introduced.

## Next controlled phase
After pilot verification, freeze UMLA Learning Record v0.1 and build the read-only Mzansi Learning Hub shell that can consume exported/local test events before introducing cloud sync.
