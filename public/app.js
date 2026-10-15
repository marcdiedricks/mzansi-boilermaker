const fallbackSafetyPolicy = {
  policyVersion: '0.1A-02',
  rules: [
    { id: 'study-theory', label: 'Study or revise theory', tier: 1, decision: 'ALLOW', heading: 'Learning mode', message: 'You can continue with approved theory, drawings, glossary work and revision.' },
    { id: 'controlled-practice', label: 'Low-risk practice in an approved training area', tier: 2, decision: 'ALLOW_WITH_CONTROLS', heading: 'Practise safely', message: 'Use the approved training task, required controls and local supervision rules. The app does not authorise workplace activity.' },
    { id: 'hot-work', label: 'Hot work, cutting or grinding', tier: 3, decision: 'HUMAN_REQUIRED', heading: 'Supervision required', message: 'This is a higher-risk practical activity. Continue only through an approved workplace or training process with the required competent human supervision.' },
    { id: 'lifting-height-machinery', label: 'Lifting, work at height or powered machinery', tier: 3, decision: 'HUMAN_REQUIRED', heading: 'Supervision required', message: 'This activity needs a new safety check and competent human supervision. The app can support theory and preparation only.' },
    { id: 'critical-hazard', label: 'Pressure, confined space, electrical exposure or other critical hazard', tier: 4, decision: 'DENY', heading: 'Restricted activity', message: 'The learning companion will not authorise or guide this activity. Use the applicable authorised workplace process and competent human control.' }
  ]
};

let safetyPolicy = fallbackSafetyPolicy;

const views = [...document.querySelectorAll('.view')];
const networkStatus = document.getElementById('networkStatus');
const learnerName = document.getElementById('learnerName');
const learnerSaved = document.getElementById('learnerSaved');
const safetyScenario = document.getElementById('safetyScenario');
const safetyDecision = document.getElementById('safetyDecision');
const policyVersion = document.getElementById('policyVersion');
const evidenceTitleInput = document.getElementById('evidenceTitleInput');
const evidenceType = document.getElementById('evidenceType');
const evidenceModule = document.getElementById('evidenceModule');
const evidenceNotes = document.getElementById('evidenceNotes');
const evidenceFile = document.getElementById('evidenceFile');
const evidenceMessage = document.getElementById('evidenceMessage');
const evidenceQueue = document.getElementById('evidenceQueue');

function openView(id) {
  views.forEach(view => view.classList.toggle('active', view.id === id));
  window.scrollTo({ top: 0, behavior: 'smooth' });
  if (id === 'evidenceView') renderEvidenceQueue();
}

document.querySelectorAll('[data-open]').forEach(button => {
  button.addEventListener('click', () => openView(button.dataset.open));
});

const safetyBtn = document.getElementById('safetyBtn');
if (safetyBtn) safetyBtn.addEventListener('click', () => openView('safetyView'));

function updateNetwork() {
  const online = navigator.onLine;
  if (!networkStatus) return;
  networkStatus.textContent = online ? 'ONLINE' : 'OFFLINE';
  networkStatus.style.background = online ? '#dcfce7' : '#fee2e2';
}
window.addEventListener('online', updateNetwork);
window.addEventListener('offline', updateNetwork);
updateNetwork();

async function loadSavedState() {
  try {
    const savedLearner = await MzansiStore.get('learner');
    const savedSafety = await MzansiStore.get('latest-safety-decision');
    if (savedLearner?.name && learnerName) learnerName.value = savedLearner.name;
    if (savedSafety?.ruleId) renderSafetyDecision(savedSafety, true);
  } catch (error) {
    console.error('Local storage unavailable', error);
  }
}

const saveLearnerBtn = document.getElementById('saveLearnerBtn');
if (saveLearnerBtn) saveLearnerBtn.addEventListener('click', async () => {
  const name = learnerName?.value.trim() || '';
  if (!name) {
    if (learnerSaved) learnerSaved.textContent = 'Please enter a learner name first.';
    return;
  }
  await MzansiStore.set('learner', { name, updatedAt: new Date().toISOString() });
  if (learnerSaved) learnerSaved.textContent = `Saved locally for ${name}.`;
});

function populateSafetyOptions() {
  if (!safetyScenario) return;
  safetyScenario.innerHTML = '<option value="">Choose an activity</option>';
  safetyPolicy.rules.forEach(rule => {
    const option = document.createElement('option');
    option.value = rule.id;
    option.textContent = rule.label;
    safetyScenario.appendChild(option);
  });
  if (policyVersion) policyVersion.textContent = `Local safety policy ${safetyPolicy.policyVersion}`;
}

function renderSafetyDecision(record, restored = false) {
  if (!safetyDecision) return;
  const rule = safetyPolicy.rules.find(item => item.id === record.ruleId) || record;
  if (!rule?.decision) return;
  const classMap = { ALLOW: 'allow', ALLOW_WITH_CONTROLS: 'controlled', HUMAN_REQUIRED: 'human-required', DENY: 'deny' };
  const labelMap = { ALLOW: 'LEARN', ALLOW_WITH_CONTROLS: 'PRACTISE SAFELY', HUMAN_REQUIRED: 'SUPERVISION REQUIRED', DENY: 'RESTRICTED ACTIVITY' };
  safetyDecision.className = `safety-decision show ${classMap[rule.decision] || ''}`;
  safetyDecision.innerHTML = `<p class="decision-label">${labelMap[rule.decision] || rule.decision}</p><h3>${rule.heading}</h3><p>${rule.message}</p><p class="decision-meta">Tier ${rule.tier} • ${restored ? 'Last local decision' : 'Saved locally'} • Policy ${safetyPolicy.policyVersion}</p>`;
}

async function loadSafetyPolicy() {
  try {
    const response = await fetch('./safety-rules.json', { cache: 'no-cache' });
    if (response.ok) safetyPolicy = await response.json();
  } catch (error) {
    console.info('Using bundled offline safety policy', error);
  }
  populateSafetyOptions();
}

const checkSafetyBtn = document.getElementById('checkSafetyBtn');
if (checkSafetyBtn) checkSafetyBtn.addEventListener('click', async () => {
  const rule = safetyPolicy.rules.find(item => item.id === safetyScenario?.value);
  if (!rule) {
    if (safetyDecision) {
      safetyDecision.className = 'safety-decision show controlled';
      safetyDecision.innerHTML = '<h3>Choose an activity first</h3><p>Select the closest activity so the local policy gate can classify it.</p>';
    }
    return;
  }
  const record = { ruleId: rule.id, tier: rule.tier, decision: rule.decision, heading: rule.heading, message: rule.message, policyVersion: safetyPolicy.policyVersion, updatedAt: new Date().toISOString() };
  await MzansiStore.set('latest-safety-decision', record);
  renderSafetyDecision(record);
});

function makeEvidenceId() {
  return `EVD-${Date.now()}-${Math.random().toString(36).slice(2, 7).toUpperCase()}`;
}

async function sha256File(file) {
  if (!file) return null;
  const bytes = await file.arrayBuffer();
  const digest = await crypto.subtle.digest('SHA-256', bytes);
  return [...new Uint8Array(digest)].map(byte => byte.toString(16).padStart(2, '0')).join('');
}

function formatBytes(bytes) {
  if (!bytes) return 'No attachment';
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

async function getEvidenceItems() {
  return (await MzansiStore.get('evidence-items')) || [];
}

async function renderEvidenceQueue() {
  if (!evidenceQueue) return;
  const items = await getEvidenceItems();
  evidenceQueue.innerHTML = '';
  if (!items.length) {
    evidenceQueue.innerHTML = '<div class="empty-state">No evidence saved yet.</div>';
    return;
  }
  [...items].reverse().forEach(item => {
    const card = document.createElement('article');
    card.className = 'evidence-item';
    const fileText = item.fileName ? `${item.fileName} • ${formatBytes(item.fileSize)}` : 'No attachment';
    card.innerHTML = `
      <div class="evidence-status-row"><span class="evidence-status">CAPTURED</span><span class="sync-status">LOCAL ONLY</span></div>
      <h3>${escapeHtml(item.title)}</h3>
      <p><strong>Type:</strong> ${escapeHtml(item.type)}</p>
      <p><strong>Curriculum:</strong> ${escapeHtml(item.module)}</p>
      ${item.notes ? `<p>${escapeHtml(item.notes)}</p>` : ''}
      <p class="evidence-meta">${escapeHtml(fileText)}</p>
      <p class="evidence-meta">Not verified • ${escapeHtml(item.id)}</p>
    `;
    evidenceQueue.appendChild(card);
  });
}

function escapeHtml(value) {
  return String(value || '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

const saveEvidenceBtn = document.getElementById('saveEvidenceBtn');
if (saveEvidenceBtn) saveEvidenceBtn.addEventListener('click', async () => {
  const title = evidenceTitleInput?.value.trim() || '';
  const type = evidenceType?.value || '';
  const module = evidenceModule?.value || '';
  const notes = evidenceNotes?.value.trim() || '';
  const file = evidenceFile?.files?.[0] || null;

  if (!title || !type) {
    if (evidenceMessage) evidenceMessage.textContent = 'Add an evidence title and choose an evidence type first.';
    return;
  }
  if (file && file.size > 8 * 1024 * 1024) {
    if (evidenceMessage) evidenceMessage.textContent = 'This file is larger than the 8 MB pilot limit. Choose a smaller file.';
    return;
  }

  const learner = await MzansiStore.get('learner');
  if (evidenceMessage) evidenceMessage.textContent = file ? 'Saving attachment locally…' : 'Saving evidence locally…';

  let hash = null;
  try {
    hash = await sha256File(file);
  } catch (error) {
    console.warn('Could not hash attachment', error);
  }

  const item = {
    id: makeEvidenceId(),
    learnerName: learner?.name || 'Unassigned learner',
    title,
    type,
    module,
    notes,
    status: 'CAPTURED',
    verificationStatus: 'NOT_VERIFIED',
    syncStatus: 'LOCAL_ONLY',
    fileName: file?.name || null,
    fileType: file?.type || null,
    fileSize: file?.size || 0,
    fileHash: hash,
    fileBlob: file || null,
    createdAt: new Date().toISOString()
  };

  const items = await getEvidenceItems();
  items.push(item);
  await MzansiStore.set('evidence-items', items);

  if (evidenceTitleInput) evidenceTitleInput.value = '';
  if (evidenceType) evidenceType.value = '';
  if (evidenceNotes) evidenceNotes.value = '';
  if (evidenceFile) evidenceFile.value = '';
  if (evidenceMessage) evidenceMessage.textContent = 'Evidence captured locally. It is not verified and has not been uploaded.';
  await renderEvidenceQueue();
});

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./service-worker.js').catch(error => console.error('Service worker registration failed', error));
  });
}

loadSafetyPolicy().then(loadSavedState);
