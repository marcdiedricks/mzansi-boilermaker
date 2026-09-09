const MzansiLearningRecord = (() => {
  const SCHEMA_VERSION = 'UMLA-LR-0.1';
  const EVENTS_KEY = 'learning-events-v0.1';
  const LEARNER_ID_KEY = 'lms-learner-id';

  function makeId(prefix) {
    if (globalThis.crypto?.randomUUID) return `${prefix}-${crypto.randomUUID()}`;
    return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
  }

  async function getLearnerId() {
    let learnerId = await MzansiStore.get(LEARNER_ID_KEY);
    if (!learnerId) {
      learnerId = makeId('LRN');
      await MzansiStore.set(LEARNER_ID_KEY, learnerId);
    }
    return learnerId;
  }

  async function record(input) {
    if (!globalThis.MzansiStore) throw new Error('MzansiStore unavailable');

    const learnerId = await getLearnerId();
    const occurredAt = input.occurredAt || new Date().toISOString();
    const event = {
      schemaVersion: SCHEMA_VERSION,
      eventId: makeId('EVT'),
      learnerId,
      programmeId: input.programmeId || 'mzansi-boilermaker',
      qualificationId: input.qualificationId || 'SAQA-123381',
      moduleId: input.moduleId,
      activityId: input.activityId,
      activityType: input.activityType || 'knowledge-check',
      eventType: input.eventType || 'assessment.completed',
      outcome: input.outcome || null,
      score: input.score || null,
      sourceBuild: input.sourceBuild || null,
      occurredAt,
      createdAt: new Date().toISOString(),
      syncStatus: 'LOCAL_ONLY'
    };

    const events = (await MzansiStore.get(EVENTS_KEY)) || [];
    events.push(event);
    await MzansiStore.set(EVENTS_KEY, events);
    return event;
  }

  async function list() {
    return (await MzansiStore.get(EVENTS_KEY)) || [];
  }

  return { record, list, getLearnerId, schemaVersion: SCHEMA_VERSION };
})();
