const auditStyle = document.createElement('style');
auditStyle.textContent = `
.audit-box { margin-top: 14px; padding: 12px; border-radius: 10px; background: #f7f7f8; border: 1px solid #d8dee4; }
.audit-box strong { display: block; margin-bottom: 6px; }
.audit-btn { width: 100%; min-height: 44px; margin-top: 10px; border: 0; border-radius: 10px; padding: 10px 14px; font-weight: 700; background: #475569; color: white; }
.audit-list { display: none; margin-top: 10px; }
.audit-list.show { display: block; }
.audit-event { padding: 9px 0; border-top: 1px solid #e2e8f0; }
.audit-event:first-child { border-top: 0; }
.audit-event p { margin: 3px 0; }
.audit-good { color: #18573a; }
.audit-warn { color: #9a3412; }
`;
document.head.appendChild(auditStyle);

let knownEvidenceIds = new Set();

async function refreshKnownEvidenceIds() {
  const items = await getEvidenceItems();
  knownEvidenceIds = new Set(items.map(item => item.id));
}

async function watchForNewEvidence() {
  for (let attempt = 0; attempt < 30; attempt += 1) {
    await new Promise(resolve => setTimeout(resolve, 200));
    const items = await getEvidenceItems();
    const fresh = items.filter(item => !knownEvidenceIds.has(item.id));
    if (fresh.length) {
      for (const item of fresh) {
        await AuditTrail.append('EVIDENCE_CAPTURED', item.id, {
          title: item.title,
          type: item.type,
          module: item.module,
          learnerName: item.learnerName,
          syncStatus: item.syncStatus || 'LOCAL_ONLY'
        });
        if (item.fileName) {
          await AuditTrail.append('ATTACHMENT_ADDED', item.id, {
            fileName: item.fileName,
            fileSize: item.fileSize || 0,
            fileHash: item.fileHash || null
          });
        }
        knownEvidenceIds.add(item.id);
      }
      return;
    }
  }
}

document.getElementById('saveEvidenceBtn')?.addEventListener('click', () => {
  watchForNewEvidence().catch(error => console.warn('Audit watcher could not record evidence save', error));
});

function auditEventLabel(type) {
  const labels = {
    EVIDENCE_CAPTURED: 'Evidence captured',
    ATTACHMENT_ADDED: 'Attachment added',
    REVIEW_NEEDS_MORE_INFORMATION: 'Needs more information',
    REVIEW_READY_FOR_HUMAN: 'Ready for human review',
    QUEUED_FOR_HUMAN_REVIEW: 'Queued for human review',
    HANDOFF_PACKAGE_CREATED: 'Human review package created'
  };
  return labels[type] || type.replaceAll('_', ' ');
}

const handoffRendererForAudit = renderEvidenceQueue;
renderEvidenceQueue = async function () {
  await handoffRendererForAudit();
  const items = await getEvidenceItems();
  const cards = [...evidenceQueue.querySelectorAll('.evidence-item')];
  const reversed = [...items].reverse();
  const chainOk = await AuditTrail.verifyChain();

  for (let index = 0; index < cards.length; index += 1) {
    const card = cards[index];
    const item = reversed[index];
    if (!item) continue;

    const events = await AuditTrail.forEvidence(item.id);
    const box = document.createElement('div');
    box.className = 'audit-box';
    box.innerHTML = `<strong>LOCAL AUDIT HISTORY</strong><p class="evidence-meta">${events.length} event${events.length === 1 ? '' : 's'} recorded for this evidence.</p><p class="evidence-meta ${chainOk ? 'audit-good' : 'audit-warn'}">Integrity chain: ${chainOk ? 'OK' : 'CHECK REQUIRED'}</p>`;

    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'audit-btn';
    button.textContent = events.length ? 'View evidence history' : 'No history recorded yet';
    button.disabled = events.length === 0;
    box.appendChild(button);

    const list = document.createElement('div');
    list.className = 'audit-list';
    events.slice().reverse().forEach(event => {
      const row = document.createElement('div');
      row.className = 'audit-event';
      row.innerHTML = `<p><strong>${escapeHtml(auditEventLabel(event.eventType))}</strong></p><p class="evidence-meta">${escapeHtml(event.createdAt)}</p><p class="evidence-meta">Audit ID: ${escapeHtml(event.auditId)}</p>`;
      list.appendChild(row);
    });
    box.appendChild(list);

    button.addEventListener('click', () => {
      list.classList.toggle('show');
      button.textContent = list.classList.contains('show') ? 'Hide evidence history' : 'View evidence history';
    });

    card.appendChild(box);
  }
};

const auditBuildLabel = document.querySelector('.hero-card .eyebrow');
if (auditBuildLabel) auditBuildLabel.textContent = 'BUILD 0.1A-07';

refreshKnownEvidenceIds().then(() => {
  if (document.getElementById('evidenceView')?.classList.contains('active')) renderEvidenceQueue();
});
