(() => {
  const style = document.createElement('style');
  style.textContent = `
    .readiness-card { border-left: 5px solid #355d7a; }
    .km01-card { border-left: 5px solid #1f6f4a; }
    .km02-card { border-left: 5px solid #b7791f; }
    .km03-card { border-left: 5px solid #6b46c1; }
    .km04a-card { border-left: 5px solid #355d7a; }
    .readiness-summary { padding: 14px; border-radius: 12px; margin: 12px 0 18px; background: #f6f8fa; border: 1px solid #d8dee4; }
    .readiness-list { display: grid; gap: 10px; }
    .readiness-row { display: grid; grid-template-columns: 96px 1fr; gap: 10px; align-items: start; padding: 12px; border: 1px solid #d8dee4; border-radius: 12px; background: #fff; }
    .readiness-status { font-weight: 800; }
    .readiness-pass { color: #176b3a; }
    .readiness-attention { color: #8a5a00; }
    .readiness-note { margin: 4px 0 0; color: #4b5563; }
  `;
  document.head.appendChild(style);

  const menu = document.querySelector('.menu-grid');
  const main = document.querySelector('.app-main');
  if (!menu || !main) return;

  const km04aButton = document.createElement('button');
  km04aButton.type = 'button';
  km04aButton.className = 'menu-card km04a-card';
  km04aButton.innerHTML = '<span class="menu-title">Next: KM-04A</span><span class="menu-copy">Introduction to Fabrication and Pipework</span>';
  km04aButton.addEventListener('click', () => { window.location.href = './km04a.html'; });
  menu.prepend(km04aButton);

  const km03Button = document.createElement('button');
  km03Button.type = 'button';
  km03Button.className = 'menu-card km03-card';
  km03Button.innerHTML = '<span class="menu-title">KM-03</span><span class="menu-copy">Boilermaker Tools, Equipment, Machines and Materials</span>';
  km03Button.addEventListener('click', () => { window.location.href = './km03.html'; });
  menu.prepend(km03Button);

  const km02Button = document.createElement('button');
  km02Button.type = 'button';
  km02Button.className = 'menu-card km02-card';
  km02Button.innerHTML = '<span class="menu-title">KM-02</span><span class="menu-copy">Environmental Protection, Health and Safety</span>';
  km02Button.addEventListener('click', () => { window.location.href = './km02.html'; });
  menu.prepend(km02Button);

  const km01Button = document.createElement('button');
  km01Button.type = 'button';
  km01Button.className = 'menu-card km01-card';
  km01Button.innerHTML = '<span class="menu-title">Start Here: KM-01</span><span class="menu-copy">Introduction to the Boilermaker Trade</span>';
  km01Button.addEventListener('click', () => { window.location.href = './km01.html'; });
  menu.prepend(km01Button);

  const menuButton = document.createElement('button');
  menuButton.type = 'button';
  menuButton.className = 'menu-card readiness-card';
  menuButton.innerHTML = '<span class="menu-title">Pilot Readiness Check</span><span class="menu-copy">Check the local pilot components before the next deployment batch</span>';
  menu.appendChild(menuButton);

  const section = document.createElement('section');
  section.id = 'readinessView';
  section.className = 'view';
  section.innerHTML = `
    <button id="readinessHomeBtn" class="back-btn" type="button">← Home</button>
    <p class="eyebrow">PILOT CHECKPOINT • BUILD 0.1B-04A</p>
    <h2>Pilot Readiness Check</h2>
    <div class="safety-note"><strong>This is a technical pilot check only.</strong> It does not assess trade competence, authorise practical work, verify evidence or replace a human assessor or supervisor.</div>
    <div id="readinessSummary" class="readiness-summary" aria-live="polite">Checking local pilot components…</div>
    <div id="readinessList" class="readiness-list"></div>
    <button id="rerunReadinessBtn" class="primary-btn" type="button">Run check again</button>
  `;
  main.appendChild(section);

  const buildLabel = document.querySelector('.hero-card .eyebrow');
  if (buildLabel) buildLabel.textContent = 'BUILD 0.1B-04A';

  function showView(id) {
    document.querySelectorAll('.view').forEach(view => view.classList.toggle('active', view.id === id));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  menuButton.addEventListener('click', async () => { showView('readinessView'); await runCheck(); });
  document.getElementById('readinessHomeBtn').addEventListener('click', () => showView('homeView'));
  document.getElementById('rerunReadinessBtn').addEventListener('click', runCheck);

  function row(label, pass, detail) {
    const status = pass ? 'PASS' : 'ATTENTION';
    const klass = pass ? 'readiness-pass' : 'readiness-attention';
    return `<div class="readiness-row"><div class="readiness-status ${klass}">${status}</div><div><strong>${label}</strong><p class="readiness-note">${detail}</p></div></div>`;
  }

  async function runCheck() {
    const summary = document.getElementById('readinessSummary');
    const list = document.getElementById('readinessList');
    summary.textContent = 'Checking local pilot components…';
    list.innerHTML = '';

    try {
      const learner = await MzansiStore.get('learner');
      const km01Progress = await MzansiStore.get('km01-progress');
      const km02Progress = await MzansiStore.get('km02-progress');
      const km03Progress = await MzansiStore.get('km03-progress');
      const km04aProgress = await MzansiStore.get('km04a-progress');
      const km07Progress = await MzansiStore.get('km07-progress');
      const evidence = (await MzansiStore.get('evidence-items')) || [];
      const audit = (await MzansiStore.get('audit-events')) || [];
      const latestBackup = [...audit].reverse().find(event => event.eventType === 'LOCAL_BACKUP_CREATED' || event.eventType === 'LOCAL_BACKUP_RESTORED');
      const auditOk = globalThis.AuditTrail?.verifyChain ? await AuditTrail.verifyChain() : false;
      const storageOk = !!globalThis.MzansiStore && typeof MzansiStore.get === 'function' && typeof MzansiStore.set === 'function';
      const serviceWorkerSupported = 'serviceWorker' in navigator;
      const serviceWorkerActive = serviceWorkerSupported && !!navigator.serviceWorker.controller;
      const cacheSupported = 'caches' in globalThis;

      const checks = [
        ['Local data store', storageOk, storageOk ? 'IndexedDB storage layer is available.' : 'Local storage layer is not available.'],
        ['Learner profile', !!learner?.name, learner?.name ? `Learner profile found for ${learner.name}.` : 'No learner name is currently saved on this device.'],
        ['KM-01 progress', !!km01Progress, km01Progress ? 'KM-01 progress record is present.' : 'No KM-01 progress record is currently saved on this device.'],
        ['KM-02 progress', !!km02Progress, km02Progress ? 'KM-02 progress record is present.' : 'No KM-02 progress record is currently saved on this device.'],
        ['KM-03 progress', !!km03Progress, km03Progress ? 'KM-03 progress record is present.' : 'No KM-03 progress record is currently saved on this device.'],
        ['KM-04A progress', !!km04aProgress, km04aProgress ? 'KM-04A progress record is present.' : 'No KM-04A progress record is currently saved on this device.'],
        ['KM-07 progress', !!km07Progress, km07Progress ? 'KM-07 progress record is present.' : 'No KM-07 progress record is currently saved on this device.'],
        ['Evidence queue', Array.isArray(evidence), `${evidence.length} local evidence record(s) found.`],
        ['Audit integrity', auditOk, auditOk ? `${audit.length} audit event(s), integrity chain valid.` : 'Audit chain could not be validated.'],
        ['Backup history', !!latestBackup, latestBackup ? `Latest backup event: ${latestBackup.eventType} at ${latestBackup.createdAt}.` : 'No local backup event recorded yet. Create a backup before relying on device-only data.'],
        ['Offline support', serviceWorkerSupported && cacheSupported, serviceWorkerSupported && cacheSupported ? (serviceWorkerActive ? 'Service worker is active and Cache Storage is supported.' : 'Offline technology is supported. Service worker will become active after deployment/load.') : 'Required offline browser features are not fully available.']
      ];

      list.innerHTML = checks.map(([label, pass, detail]) => row(label, pass, detail)).join('');
      const infrastructurePass = storageOk && auditOk && serviceWorkerSupported && cacheSupported;
      const attentionCount = checks.filter(([, pass]) => !pass).length;
      summary.innerHTML = infrastructurePass
        ? `<strong>CORE PILOT INFRASTRUCTURE: PASS</strong><br>${attentionCount} item(s) need attention or user activity. This does not affect trade competence status.`
        : `<strong>CORE PILOT INFRASTRUCTURE: ATTENTION</strong><br>One or more technical components need checking before the next production deployment.`;
    } catch (error) {
      console.error('Readiness check failed', error);
      summary.innerHTML = '<strong>CHECK COULD NOT COMPLETE.</strong><br>Local pilot data should be inspected before deployment.';
      list.innerHTML = '';
    }
  }
})();
