globalThis.MzansiLearningRecord = (() => {
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

  async function exportLatest() {
    const events = await list();
    if (!events.length) throw new Error('No UMLA learning event found');
    const latest = events[events.length - 1];
    const payload = {
      handoffVersion: 'UMLA-HANDOFF-0.1',
      exportedAt: new Date().toISOString(),
      source: 'mzansi-boilermaker',
      events: [latest]
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `mzansi-boilermaker-umla-${latest.moduleId || 'record'}-${latest.activityId || 'activity'}.json`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
    return payload;
  }

  return { record, list, exportLatest, getLearnerId, schemaVersion: SCHEMA_VERSION };
})();
