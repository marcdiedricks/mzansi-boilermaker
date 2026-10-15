const AuditTrail = (() => {
  const KEY = 'audit-events';

  async function sha256Text(text) {
    if (!globalThis.crypto?.subtle) return null;
    const bytes = new TextEncoder().encode(text);
    const digest = await crypto.subtle.digest('SHA-256', bytes);
    return [...new Uint8Array(digest)].map(byte => byte.toString(16).padStart(2, '0')).join('');
  }

  async function getAll() {
    return (await MzansiStore.get(KEY)) || [];
  }

  async function append(eventType, evidenceId, details = {}) {
    const events = await getAll();
    const previous = events.at(-1) || null;
    const createdAt = new Date().toISOString();
    const event = {
      auditId: `AUD-${Date.now()}-${Math.random().toString(36).slice(2, 7).toUpperCase()}`,
      eventType,
      evidenceId: evidenceId || null,
      createdAt,
      details,
      previousHash: previous?.entryHash || null
    };
    const canonical = JSON.stringify({
      auditId: event.auditId,
      eventType: event.eventType,
      evidenceId: event.evidenceId,
      createdAt: event.createdAt,
      details: event.details,
      previousHash: event.previousHash
    });
    event.entryHash = await sha256Text(canonical);
    events.push(event);
    await MzansiStore.set(KEY, events);
    return event;
  }

  async function forEvidence(evidenceId) {
    const events = await getAll();
    return events.filter(event => event.evidenceId === evidenceId);
  }

  async function verifyChain() {
    const events = await getAll();
    for (let i = 0; i < events.length; i += 1) {
      const event = events[i];
      const expectedPrevious = i === 0 ? null : events[i - 1].entryHash || null;
      if ((event.previousHash || null) !== expectedPrevious) return false;
      if (event.entryHash && globalThis.crypto?.subtle) {
        const canonical = JSON.stringify({
          auditId: event.auditId,
          eventType: event.eventType,
          evidenceId: event.evidenceId,
          createdAt: event.createdAt,
          details: event.details,
          previousHash: event.previousHash
        });
        const hash = await sha256Text(canonical);
        if (hash !== event.entryHash) return false;
      }
    }
    return true;
  }

  return { append, getAll, forEvidence, verifyChain };
})();
