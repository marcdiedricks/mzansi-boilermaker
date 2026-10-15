(() => {
  const BACKUP_VERSION = '0.1A-08';
  const BACKUP_TYPE = 'MZANSI_BOILERMAKER_LOCAL_BACKUP';
  let pendingBackup = null;

  const style = document.createElement('style');
  style.textContent = `
    .backup-card { border-left: 5px solid #6b4f8a; }
    .backup-actions { display: grid; gap: 10px; }
    .backup-note { background: #f8f5fb; border: 1px solid #d9cde5; border-radius: 12px; padding: 14px; margin-bottom: 14px; }
    .backup-note p { margin: 6px 0; }
    .backup-status { margin-top: 12px; padding: 12px; border-radius: 10px; background: #f6f8fa; border: 1px solid #d8dee4; }
    .backup-danger { color: #8a1c1c; font-weight: 700; }
    .backup-hidden { display: none !important; }
  `;
  document.head.appendChild(style);

  const menu = document.querySelector('.menu-grid');
  const main = document.querySelector('.app-main');
  if (!menu || !main) return;

  const menuButton = document.createElement('button');
  menuButton.type = 'button';
  menuButton.className = 'menu-card backup-card';
  menuButton.innerHTML = '<span class="menu-title">Backup & Restore</span><span class="menu-copy">Save a lightweight local recovery file before cloud sync is added</span>';
  menu.appendChild(menuButton);

  const section = document.createElement('section');
  section.id = 'backupView';
  section.className = 'view';
  section.innerHTML = `
    <button id="backupHomeBtn" class="back-btn" type="button">← Home</button>
    <p class="eyebrow">LOCAL RECOVERY • BUILD 0.1A-08</p>
    <h2>Backup & Restore</h2>
    <div class="backup-note">
      <strong>Keep your learner data recoverable.</strong>
      <p>This backup contains learner profile, KM-07 progress, the latest local safety decision, evidence metadata, review status and audit history.</p>
      <p><strong>Attachments are not copied into this lightweight backup.</strong> Existing attachments remain on this device. Keep important original files separately.</p>
      <p>This file may contain personal learner information. Store and share it carefully.</p>
    </div>
    <div class="panel">
      <h3>Create local backup</h3>
      <p>Creates one small JSON recovery file. Nothing is uploaded.</p>
      <button id="createBackupBtn" class="primary-btn" type="button">Save local backup file</button>
      <div id="backupCreateStatus" class="backup-status" aria-live="polite">No backup created in this session yet.</div>
    </div>
    <div class="panel">
      <h3>Restore from backup</h3>
      <p>Select a Mzansi Boilermaker backup file. The app validates it before allowing restore.</p>
      <input id="restoreBackupFile" type="file" accept="application/json,.json">
      <div id="restorePreview" class="backup-status">No backup selected.</div>
      <button id="restoreBackupBtn" class="primary-btn backup-hidden" type="button">Restore validated backup</button>
      <p id="restoreWarning" class="backup-danger backup-hidden">Restore replaces the local learner profile, progress, safety decision, evidence metadata and audit history with the selected backup. Existing local attachment blobs are preserved when the evidence ID matches.</p>
    </div>
  `;
  main.appendChild(section);

  const buildLabel = document.querySelector('.hero-card .eyebrow');
  if (buildLabel) buildLabel.textContent = 'BUILD 0.1A-08';

  function showBackup() {
    document.querySelectorAll('.view').forEach(view => view.classList.toggle('active', view.id === 'backupView'));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function showHome() {
    document.querySelectorAll('.view').forEach(view => view.classList.toggle('active', view.id === 'homeView'));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  menuButton.addEventListener('click', showBackup);
  document.getElementById('backupHomeBtn').addEventListener('click', showHome);

  function cleanEvidenceItem(item) {
    const copy = { ...item };
    delete copy.fileBlob;
    copy.backupAttachmentIncluded = false;
    return copy;
  }

  async function collectBackup() {
    const learner = await MzansiStore.get('learner');
    const progress = await MzansiStore.get('km07-progress');
    const safety = await MzansiStore.get('latest-safety-decision');
    const evidence = (await MzansiStore.get('evidence-items')) || [];
    const audit = (await MzansiStore.get('audit-events')) || [];

    return {
      backupType: BACKUP_TYPE,
      backupVersion: BACKUP_VERSION,
      createdAt: new Date().toISOString(),
      qualification: { saqaId: '123381', trade: 'Boilermaker' },
      attachmentsIncluded: false,
      data: {
        learner: learner || null,
        km07Progress: progress || null,
        latestSafetyDecision: safety || null,
        evidenceItems: evidence.map(cleanEvidenceItem),
        auditEvents: audit
      }
    };
  }

  function safeFilePart(value) {
    return String(value || 'learner').trim().replace(/[^a-zA-Z0-9_-]+/g, '-').replace(/^-+|-+$/g, '') || 'learner';
  }

  document.getElementById('createBackupBtn').addEventListener('click', async () => {
    const status = document.getElementById('backupCreateStatus');
    try {
      const backup = await collectBackup();
      const json = JSON.stringify(backup, null, 2);
      const blob = new Blob([json], { type: 'application/json;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      const learnerName = backup.data.learner?.name || 'learner';
      const date = new Date().toISOString().slice(0, 10);
      link.href = url;
      link.download = `mzansi-boilermaker-backup-${safeFilePart(learnerName)}-${date}.json`;
      link.click();
      setTimeout(() => URL.revokeObjectURL(url), 2000);
      status.textContent = `Backup saved locally. ${backup.data.evidenceItems.length} evidence record(s) and ${backup.data.auditEvents.length} audit event(s) included. Attachments excluded.`;
      if (globalThis.AuditTrail?.append) await AuditTrail.append('LOCAL_BACKUP_CREATED', null, { evidenceCount: backup.data.evidenceItems.length, auditCountBeforeBackup: backup.data.auditEvents.length, attachmentsIncluded: false });
    } catch (error) {
      console.error('Backup failed', error);
      status.textContent = 'Backup could not be created on this device.';
    }
  });

  function validateBackup(value) {
    const errors = [];
    if (!value || typeof value !== 'object') errors.push('File is not a valid JSON object');
    if (value?.backupType !== BACKUP_TYPE) errors.push('Wrong backup type');
    if (value?.qualification?.saqaId !== '123381') errors.push('Qualification does not match SAQA 123381');
    if (!value?.data || typeof value.data !== 'object') errors.push('Backup data section is missing');
    if (value?.data?.evidenceItems && !Array.isArray(value.data.evidenceItems)) errors.push('Evidence list is invalid');
    if (value?.data?.auditEvents && !Array.isArray(value.data.auditEvents)) errors.push('Audit history is invalid');
    return { valid: errors.length === 0, errors };
  }

  document.getElementById('restoreBackupFile').addEventListener('change', async event => {
    const file = event.target.files?.[0] || null;
    const preview = document.getElementById('restorePreview');
    const restoreButton = document.getElementById('restoreBackupBtn');
    const warning = document.getElementById('restoreWarning');
    pendingBackup = null;
    restoreButton.classList.add('backup-hidden');
    warning.classList.add('backup-hidden');

    if (!file) {
      preview.textContent = 'No backup selected.';
      return;
    }

    try {
      const text = await file.text();
      const parsed = JSON.parse(text);
      const result = validateBackup(parsed);
      if (!result.valid) {
        preview.textContent = `Backup rejected: ${result.errors.join('; ')}.`;
        return;
      }
      pendingBackup = parsed;
      const evidenceCount = parsed.data.evidenceItems?.length || 0;
      const auditCount = parsed.data.auditEvents?.length || 0;
      const learner = parsed.data.learner?.name || 'Unassigned learner';
      preview.textContent = `Validated backup for ${learner}. Created ${parsed.createdAt || 'unknown date'}. ${evidenceCount} evidence record(s), ${auditCount} audit event(s). Attachments are not included.`;
      restoreButton.classList.remove('backup-hidden');
      warning.classList.remove('backup-hidden');
    } catch (error) {
      preview.textContent = 'Backup rejected: the selected file is not valid JSON.';
    }
  });

  document.getElementById('restoreBackupBtn').addEventListener('click', async () => {
    const preview = document.getElementById('restorePreview');
    if (!pendingBackup) return;

    const existingEvidence = (await MzansiStore.get('evidence-items')) || [];
    const existingById = new Map(existingEvidence.map(item => [item.id, item]));
    const restoredEvidence = (pendingBackup.data.evidenceItems || []).map(item => {
      const existing = existingById.get(item.id);
      return {
        ...item,
        fileBlob: existing?.fileBlob || null,
        attachmentRestoreStatus: existing?.fileBlob ? 'LOCAL_ATTACHMENT_PRESERVED' : (item.fileName ? 'ATTACHMENT_NOT_IN_BACKUP' : 'NO_ATTACHMENT')
      };
    });

    try {
      await MzansiStore.set('learner', pendingBackup.data.learner || null);
      await MzansiStore.set('km07-progress', pendingBackup.data.km07Progress || null);
      await MzansiStore.set('latest-safety-decision', pendingBackup.data.latestSafetyDecision || null);
      await MzansiStore.set('evidence-items', restoredEvidence);
      await MzansiStore.set('audit-events', pendingBackup.data.auditEvents || []);

      const chainOk = globalThis.AuditTrail?.verifyChain ? await AuditTrail.verifyChain() : true;
      if (globalThis.AuditTrail?.append) await AuditTrail.append('LOCAL_BACKUP_RESTORED', null, { evidenceCount: restoredEvidence.length, importedAuditCount: pendingBackup.data.auditEvents?.length || 0, importedChainValid: chainOk });

      preview.textContent = `Restore complete. ${restoredEvidence.length} evidence record(s) restored. Audit chain ${chainOk ? 'validated' : 'needs review'}. Reload the app to refresh all screens.`;
      pendingBackup = null;
      document.getElementById('restoreBackupBtn').classList.add('backup-hidden');
      document.getElementById('restoreWarning').classList.add('backup-hidden');
    } catch (error) {
      console.error('Restore failed', error);
      preview.textContent = 'Restore failed. Existing local data may need to be checked before retrying.';
    }
  });
})();
