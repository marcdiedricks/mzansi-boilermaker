# BUILD 0.1B-R01 — CURRICULUM RECONCILIATION & LESSON ARCHITECTURE GATE

Status: CONTROLLED RECONCILIATION BASELINE  
Scope: KM-01 to KM-04 first-pass reconciliation  
Product: Mzansi Boilermaker Artisan Learning Companion  
Qualification: National Occupational Certificate: Boilermaker  
SAQA ID: 123381  
Curriculum code: 651302-000-01-00  
Country: South Africa

---

## 1. PURPOSE

This file is the first formal reconciliation gate between the learner-facing PWA and the authoritative South African Boilermaker curriculum.

The aim is not to maximise lesson count. The aim is to ensure that every learner-facing lesson:

- has a defensible curriculum purpose;
- maps to an official knowledge topic or internal assessment criterion;
- preserves the distinction between knowledge learning, practical skills and work experience;
- complies with the product safety, assessment and governance boundaries in `00_BOILERMAKER_MASTER_CONTROL.md`;
- remains simple and usable for learners on ordinary or older Android phones;
- is offline-first and low-data by default;
- uses plain language and short learning slices;
- includes visual learning only as supplementary material where a suitable vetted resource exists;
- does not claim competence, workplace authorisation, certification or formal assessment status.

GOLDEN RULE:

> Rigorous underneath. Simple on top.

The learner should not see the complexity of the reconciliation process. The learner should see a clear KM box, a short lesson list, one lesson at a time, a simple learning check and a clear next step.

---

## 2. AUTHORITATIVE SOURCE HIERARCHY

Primary controlling sources:

1. QCTO/CHIETA official Boilermaker curriculum for curriculum structure, Knowledge Topics (KT), topic elements and Internal Assessment Criteria (IAC).
2. QCTO Qualification Assessment Specifications (QAS) for assessment governance.
3. SAQA qualification record for registration and qualification identity.
4. `00_BOILERMAKER_MASTER_CONTROL.md` for the repository's controlled source hierarchy, safety rules, governance boundaries and current-versus-legacy separation.

Supporting legal and technical sources must be mapped only where the relevant learning topic requires them.

Legacy SAQA 93626 content must not be silently mixed with the current SAQA 123381 curriculum.

---

## 3. FROZEN PRODUCT / GOVERNANCE RULES

The PWA may teach, explain, revise, quiz and record local learning progress.

It may not:

- act as an assessor;
- declare occupational competence;
- authorise hazardous practical work;
- replace workplace supervision;
- issue a trade-test result;
- issue formal certification;
- represent a quiz result as EISA or formal competence evidence.

Knowledge, Practical Skill and Work Experience components remain separate.

---

# 4. KM-01 RECONCILIATION

Official module:

- Code: 651302-000-01-KM-01
- Title: Introduction to the Boilermaker Trade
- NQF level: 3
- Credits: 9

Official Knowledge Topics:

1. KM-01-KT01 — Introduction to the Boilermaker Trade
2. KM-01-KT02 — Occupational Health, Safety and Environment
3. KM-01-KT03 — Quality Control and Quality Assurance Awareness for the Boilermaker
4. KM-01-KT04 — Fabrication

Current PWA state:

- One consolidated `km01.html` lesson currently exists.
- It introduces the trade, qualification structure, controlled information, basic safety and the learner pathway.

First-pass verdict:

- KT01: PARTIAL coverage.
- KT02: PARTIAL coverage.
- KT03: MATERIAL GAP — current lesson does not adequately teach the official quality-control / quality-assurance topic.
- KT04: MATERIAL GAP — fabrication is introduced only generally, not as the official topic.

Recommended final learner structure:

- KM-01 Lesson 1 — The Boilermaker Trade, Learning Path, Rights and Responsibilities
- KM-01 Lesson 2 — Occupational Health, Safety and Environment Foundations
- KM-01 Lesson 3 — Quality Control and Quality Assurance Awareness
- KM-01 Lesson 4 — Fabrication Overview and the Role of Controlled Information

Target density: 4 learner lessons.

Reason: Four learner lessons map cleanly to the four official Knowledge Topics. No additional slices should be created unless an official topic cannot be taught clearly and accessibly within one learner lesson.

---

# 5. KM-02 RECONCILIATION

Official module:

- Code: 651302-000-01-KM-02
- Title: Environmental Protection, Health and Safety
- NQF level: 3
- Credits: 6

Official Knowledge Topics:

1. KM-02-KT01 — General health, safety and environmental protection concepts
2. KM-02-KT02 — Boilermaking-specific health, safety and environmental protection concepts

Important official topic elements include general legislation awareness, workshop safety, environmental protection, hazard identification and risk assessment, safety signs and colour coding, PPE, securing worksites, boilermaking-specific hazards, protection of other workers, confined spaces, compressed gases, welding-machine earthing and fire-fighting concepts.

Current PWA state:

- One `km02.html` lesson exists.
- It covers hazard awareness, nearby workers, PPE, environmental protection and escalation of high-risk conditions.

First-pass verdict:

- KT01: PARTIAL coverage.
- KT02: PARTIAL coverage.
- Important gaps include explicit safety-sign / colour-code recognition and several boilermaking-specific knowledge elements such as compressed-gas, earthing and fire-fighting concepts at the knowledge level.

Recommended final learner structure:

- KM-02 Lesson 1 — General Health, Safety and Environmental Protection
- KM-02 Lesson 2 — Boilermaking-Specific Hazards and Safety Controls

Target density: 2 learner lessons.

Reason: The official curriculum itself contains only two Knowledge Topics. Keep the learner architecture simple. Each lesson may contain several short concept cards instead of fragmenting KM-02 into six or eight pages.

Safety control: hazardous activities remain recognition/theory only. No operational instructions for confined-space work, compressed-gas systems, welding-machine electrical setup or fire-fighting procedures are to be used as unsupervised practical guidance.

---

# 6. KM-03 RECONCILIATION

Official module:

- Code: 651302-000-01-KM-03
- Title: Boilermaker Tools, Equipment, Machines and Materials
- NQF level: 3
- Credits: 10

Official Knowledge Topics:

1. KM-03-KT01 — Boilermaker Trade Related Tools and Equipment
2. KM-03-KT02 — Trade Related Machines and Machine Operations
3. KM-03-KT03 — Computer Numerical Control (CNC) Applications
4. KM-03-KT04 — Materials Used in Fabrication

Current PWA state:

- One `km03.html` lesson exists.
- It covers tool groups, condition, broad materials, selection and the stop-and-ask rule.

First-pass verdict:

- KT01: PARTIAL coverage.
- KT02: MATERIAL GAP — current lesson does not adequately cover the official machine and machine-operation knowledge topic.
- KT03: MATERIAL GAP — CNC applications are not adequately taught.
- KT04: PARTIAL coverage — material identity is introduced, but properties, identification systems, defects and safety require stronger curriculum-aligned coverage.

Recommended final learner structure:

- KM-03 Lesson 1 — Trade-Related Tools and Equipment
- KM-03 Lesson 2 — Trade-Related Machines: Purpose, Terminology, Hazards and Maintenance Awareness
- KM-03 Lesson 3 — CNC Applications: Purpose, Limits and Controlled Information
- KM-03 Lesson 4 — Materials Used in Fabrication: Properties, Identification and Defects

Target density: 4 learner lessons.

Safety control: these are knowledge lessons. They may explain purposes, terminology, inspection concepts, hazards and safe-work principles but must not function as unsupervised machine-operation tutorials.

---

# 7. KM-04 RECONCILIATION

Official module:

- Code: 651302-000-01-KM-04
- Title: Fabrication and Pipework
- NQF level: 4
- Credits: 28

Official Knowledge Topics:

1. KM-04-KT01 — Basic Templates
2. KM-04-KT02 — Pipe and Plate Templates
3. KM-04-KT03 — Templates for Complex Components and Structures
4. KM-04-KT04 — Forming and Shaping Simple Components
5. KM-04-KT05 — Fabrication Using Various Structural Steel Shapes
6. KM-04-KT06 — Forming and Shaping Complex Components
7. KM-04-KT07 — Simple Pipe Work Component Fabrication
8. KM-04-KT08 — Pipe Work Characteristics
9. KM-04-KT09 — Marking Off Pipe Work

Current PWA state:

Existing learner slices A-J cover:

- introduction to fabrication and pipework;
- reading job information;
- materials and components;
- checking the job;
- dimensions and measurement information;
- quality requirements;
- templates, marking and layout information;
- material allowances and controlled references;
- controlled fabrication sequence;
- fabrication records and material traceability.

First-pass verdict:

- The existing A-J series contains useful learning content and strong governance/safety patterns.
- However, the A-J structure does NOT map cleanly to the nine official KM-04 Knowledge Topics.
- Several existing slices are cross-cutting preparation or quality concepts rather than direct KM-04 KT equivalents.
- Important official content on pipe/plate templates, complex templates, simple and complex forming/shaping, structural steel shapes and pipework characteristics requires stronger direct alignment.

Decision:

- STOP expansion to KM-04K.
- Do not delete useful A-J content.
- Reconcile and reuse existing content inside a new nine-lesson KM-04 structure that maps one learner lesson to each official Knowledge Topic wherever practical.

Recommended final learner structure:

- KM-04 Lesson 1 — Basic Templates
- KM-04 Lesson 2 — Pipe and Plate Templates
- KM-04 Lesson 3 — Templates for Complex Components and Structures
- KM-04 Lesson 4 — Forming and Shaping Simple Components
- KM-04 Lesson 5 — Fabrication Using Structural Steel Shapes
- KM-04 Lesson 6 — Forming and Shaping Complex Components
- KM-04 Lesson 7 — Simple Pipe Work Component Fabrication
- KM-04 Lesson 8 — Pipe Work Characteristics
- KM-04 Lesson 9 — Marking Off Pipe Work

Target density: 9 learner lessons.

Existing A-J material should be treated as reusable content blocks to be placed under the most relevant official lesson, not preserved merely because a prior lettered page exists.

---

# 8. FIRST-PASS DENSITY RESULT — KM-01 TO KM-04

- KM-01: 4 lessons
- KM-02: 2 lessons
- KM-03: 4 lessons
- KM-04: 9 lessons

Total learner lessons across KM-01 to KM-04 after reconciliation: 19.

This is preferable to using a fixed A-J pattern for every KM.

The number of learner lessons is determined by official curriculum structure and learner usability, not by alphabetic symmetry.

---

# 9. LEARNER NAVIGATION RULE

The main learner page must NOT list all individual lessons vertically.

Target navigation:

HOME
→ one large, simple box per official KM
→ tap KM
→ short list of lessons inside that KM
→ tap lesson
→ written offline lesson
→ optional vetted Visual Learning resource
→ short learning check
→ local completion state
→ clear Next Lesson action

The learner-facing interface should hide build codes, source-provenance detail and governance complexity unless the learner explicitly opens an information/about area.

---

# 10. ACCESSIBILITY / UNDERSERVED-LEARNER GATE

Every final lesson and navigation screen must be reviewed for:

- ordinary/older Android phones;
- small screens;
- low bandwidth and expensive data;
- intermittent or absent connectivity;
- offline-first written learning;
- low cognitive load;
- plain language;
- large tap targets;
- minimal navigation depth;
- no unnecessary downloads;
- supplementary video clearly marked as Internet Required;
- future multilingual support where practical;
- no assumption of high digital literacy.

No governance or verification feature may make the learner journey unnecessarily complicated.

---

# 11. VERIFICATION STANDARD FOR EVERY FUTURE LESSON

Before a learner lesson is frozen, verify:

1. AUTHORITY — official curriculum basis identified.
2. TRACEABILITY — KT / topic element / relevant IAC mapping recorded.
3. AUTHENTICITY — South African Boilermaker relevance checked.
4. ACCURACY — teaching content preserves the authoritative meaning.
5. SAFETY — knowledge versus practical-work boundary is explicit.
6. ACCESS — lesson remains usable offline and on a basic phone.
7. LEARNING VALUE — the lesson has a real instructional purpose.
8. VISUAL LEARNING — resource is specific, relevant and supplementary where a suitable resource exists.
9. ASSESSMENT — learning check tests the intended knowledge only.
10. GOVERNANCE — no competence, certification or authorisation claim is created.

---

# 12. R01 PASS / HOLD DECISION

R01 finding:

- The authoritative curriculum confirms that a fixed number of lessons per KM is inappropriate.
- KM-01, KM-02 and KM-03 require reconciliation and restructuring before they can be called fully curriculum-covered.
- KM-04 A-J should not be expanded further in its current form.
- The final learner navigation should use KM boxes, with the validated lesson list inside each KM.

BUILD HOLD:

- KM-04K: HOLD.
- Large learner-facing navigation rebuild: HOLD until R02 confirms the remaining KM-05 to KM-14 lesson map.

NEXT CONTROLLED STEP:

BUILD 0.1B-R02 — RECONCILE KM-05 TO KM-14 AND ESTABLISH THE COMPLETE, FINITE KNOWLEDGE-MODULE LESSON MAP.

Only after R02 should the KM-box learner navigation be built.
