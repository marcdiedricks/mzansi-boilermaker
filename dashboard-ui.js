(() => {
  const style = document.createElement('style');
  style.textContent = `
    .dashboard-card { border-left: 5px solid #2f6f8f; }
    .dashboard-grid { display: grid; grid-template-columns: 1fr; gap: 12px; }
    .dashboard-stat { background: #fff; border: 1px solid #d8dee4; border-radius: 14px; padding: 16px; }
    .dashboard-stat h3 { margin: 0 0 6px; font-size: .9rem; color: #5f6b76; }
    .dashboard-value { margin: 0; font-size: 1.35rem; font-weight: 800; overflow-wrap: anywhere; }
    .dashboard-detail { margin: 7px 0 0; color: #5f6b76; font-size: .85rem; line-height: 1.4; }
    .dashboard-ok { color: #18573a; }
    .dashboard-warn { color: #8a4b00; }
    .dashboard-alert { color: #8a1c1c; }
    @media (min-width: 620px) { .dashboard-grid { grid-template-columns: 1fr 1fr; } }
  `;
  document.head.appendChild(style);

  const menu = document.querySelector('.menu-grid');
  const main = document.querySelector('.app-main');
  if (!menu || !main) return;

  const menuButton = document.createElement('button');
  menuButton.type = 'button';
  menuButton.className = 'menu-card dashboard-card';
  menuButton.innerHTML = '<span class="menu-title">Pilot Status</span><span class="menu-copy">See local progress, evidence, review, audit and backup status in one place</span>';
  menu.appendChild(menuButton);

  const section = document.createElement('section');
  section.id = 'dashboardView';
  section.className = 'view';
  section.innerHTML = `
    <button id="dashboardHomeBtn" class="back-btn" type="button">← Home</button>
    <p class="eyebrow">PILOT STATUS • BUILD 0.1A-09</p>
    <h2>Local pilot dashboard</h2>
    <div class="safety-note"><strong>Read-only status screen.</strong> This dashboard reports local data already stored on this device. It does not change learner progress, evidence, review decisions or audit history.</div>
    <div class="dashboard-grid">
      <article class="dashboard-stat"><h3>Learner</h3><p id="dashLearner" class="dashboard-value">Checking…</p><p class="dashboard-detail">Current local learner profile.</p></article>
      <article class="dashboard-stat"><h3>KM-07 progress</h3><p id="dashProgress" class="dashboard-value">Checking…</p><p id="dashProgressDetail" class="dashboard-detail"></p></article>
      <article class="dashboard-stat"><h3>Evidence records</h3><p id="dashEvidence" class="dashboard-value">Checking…</p><p class="dashboard-detail">Local evidence records stored on this device.</p></article>
      <article class="dashboard-stat"><h3>Pending human review</h3><p id="dashPending" class="dashboard-value">Checking…</p><p class="dashboard-detail">Evidence marked PENDING REVIEW. This is not an assessor decision.</p></article>
      <article class="dashboard-stat"><h3>Audit integrity</h3><p id="dashAudit" class="dashboard-value">Checking…</p><p id="dashAuditDetail" class="dashboard-detail"></p></article>
      <article class="dashboard-stat"><h3>Latest backup</h3><p id="dashBackup" class="dashboard-value">Checking…</p><p id="dashBackupDetail" class="dashboard-detail"></p></article>
      <article class="dashboard-stat"><h3>Connectivity</h3><p id="dashNetwork" class="dashboard-value">Checking…</p><p class="dashboard-detail">Offline remains a normal supported state.</p></article>
    </div>
  `;
  main.appendChild(section);

  const buildLabel = document.querySelector('.hero-card .eyebrow');
  if (buildLabel) buildLabel.textContent = 'BUILD 0.1A-09';

  function showHome() {
    document.querySelectorAll('.view').forEach(view => view.classList.toggle('active', view.id === 'homeView'));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function formatDate(value) {
    if (!value) return 'Unknown time';
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return 'Unknown time';
    return date.toLocaleString();
  }

  async function refreshDashboard() {
    const learner = await MzansiStore.get('learner');
    const progress = await MzansiStore.get('km07-progress');
    const evidence = (await MzansiStore.get('evidence-items')) || [];
    const auditEvents = (await MzansiStore.get('audit-events')) || [];
    const pending = evidence.filter(item => item.reviewStatus === 'PENDING_REVIEW').length;
    const latestBackup = [...auditEvents].reverse().find(event => event.eventType === 'LOCAL_BACKUP_CREATED');
    const chainOk = globalThis.AuditTrail?.verifyChain ? await AuditTrail.verifyChain() : null;

    document.getElementById('dashLearner').textContent = learner?.name || 'Not set';

    if (progress?.completed) {
      document.getElementById('dashProgress').textContent = '100%';
      document.getElementById('dashProgress').className = 'dashboard-value dashboard-ok';
      document.getElementById('dashProgressDetail').textContent = `Latest KM-07 score ${progress.score}/6 across ${progress.attempts || 0} attempt(s). Learning progress only.`;
    } else {
      const percent = progress?.attempts ? '50%' : '0%';
      document.getElementById('dashProgress').textContent = percent;
      document.getElementById('dashProgressDetail').textContent = progress?.attempts ? `Latest score ${progress.score}/6. Learning slice not yet completed.` : 'No KM-07 attempt recorded yet.';
    }

    document.getElementById('dashEvidence').textContent = String(evidence.length);
    const pendingEl = document.getElementById('dashPending');
    pendingEl.textContent = String(pending);
    pendingEl.className = `dashboard-value ${pending > 0 ? 'dashboard-warn' : 'dashboard-ok'}`;

    const auditEl = document.getElementById('dashAudit');
    if (chainOk === true) {
      auditEl.textContent = 'VALID';
      auditEl.className = 'dashboard-value dashboard-ok';
      document.getElementById('dashAuditDetail').textContent = `${auditEvents.length} local audit event(s). Hash chain validated.`;
    } else if (chainOk === false) {
      auditEl.textContent = 'CHECK REQUIRED';
      auditEl.className = 'dashboard-value dashboard-alert';
      document.getElementById('dashAuditDetail').textContent = `${auditEvents.length} local audit event(s). Integrity chain needs review.`;
    } else {
      auditEl.textContent = 'UNAVAILABLE';
      document.getElementById('dashAuditDetail').textContent = `${auditEvents.length} local audit event(s). Integrity check unavailable on this device.`;
    }

    if (latestBackup) {
      document.getElementById('dashBackup').textContent = 'CREATED';
      document.getElementById('dashBackup').className = 'dashboard-value dashboard-ok';
      document.getElementById('dashBackupDetail').textContent = `${formatDate(latestBackup.createdAt)}. Lightweight backup excludes attachment files.`;
    } else {
      document.getElementById('dashBackup').textContent = 'NONE YET';
      document.getElementById('dashBackup').className = 'dashboard-value dashboard-warn';
      document.getElementById('dashBackupDetail').textContent = 'No LOCAL_BACKUP_CREATED event has been recorded yet.';
    }

    const networkEl = document.getElementById('dashNetwork');
    networkEl.textContent = navigator.onLine ? 'ONLINE' : 'OFFLINE';
    networkEl.className = `dashboard-value ${navigator.onLine ? 'dashboard-ok' : 'dashboard-warn'}`;
  }

  menuButton.addEventListener('click', async () => {
    document.querySelectorAll('.view').forEach(view => view.classList.toggle('active', view.id === 'dashboardView'));
    window.scrollTo({ top: 0, behavior: 'smooth' });
    await refreshDashboard();
  });
  document.getElementById('dashboardHomeBtn').addEventListener('click', showHome);
  window.addEventListener('online', () => {
    if (document.getElementById('dashboardView')?.classList.contains('active')) refreshDashboard();
  });
  window.addEventListener('offline', () => {
    if (document.getElementById('dashboardView')?.classList.contains('active')) refreshDashboard();
  });
})();
