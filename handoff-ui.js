const handoffStyle = document.createElement('style');
handoffStyle.textContent = `
.handoff-box { margin-top: 14px; padding: 14px; border: 1px solid #9aa6b2; border-radius: 12px; background: #f8fafc; }
.handoff-box h4 { margin: 0 0 8px; }
.handoff-box p { margin: 6px 0; }
.handoff-label { font-weight: 800; letter-spacing: .04em; font-size: .78rem; }
.handoff-actions { display: grid; gap: 8px; margin-top: 10px; }
.handoff-btn { width: 100%; min-height: 48px; border: 0; border-radius: 12px; padding: 12px 16px; font-weight: 700; background: #334155; color: white; }
.handoff-btn.secondary { background: #64748b; }
`;
document.head.appendChild(handoffStyle);

function handoffText(item, learner) {
  const lines = [
    'MZANSI BOILERMAKER - HUMAN REVIEW HANDOFF PACKAGE',
    'FOR HUMAN REVIEW ONLY',
    '',
    `Learner: ${learner?.name || item.learnerName || 'Unassigned learner'}`,
    'Qualification: SAQA 123381',
    `Curriculum area: ${item.module || 'Unmapped'}`,
    `Evidence ID: ${item.id}`,
    `Evidence title: ${item.title}`,
    `Evidence type: ${item.type}`,
    `Review status: ${item.reviewStatus || 'CAPTURED'}`,
    `Verification status: ${item.verificationStatus || 'NOT_VERIFIED'}`,
    `Sync status: ${item.syncStatus || 'LOCAL_ONLY'}`,
    `Short note: ${item.notes || 'None supplied'}`,
    `Attachment: ${item.fileName || 'No attachment'}`,
    `Attachment size: ${item.fileSize ? formatBytes(item.fileSize) : 'N/A'}`,
    `SHA-256: ${item.fileHash || 'N/A'}`,
    `Captured at: ${item.createdAt || 'Unknown'}`,
    `Review prepared at: ${new Date().toISOString()}`,
    '',
    'This package organises evidence for a competent human reviewer.',
    'It is not an assessor decision, competence result, trade-test result or certification.',
    'The attachment remains on the learner device unless it is separately shared through an authorised process.'
  ];
  return lines.join('\n');
}

async function saveHandoffPackage(item) {
  const learner = await MzansiStore.get('learner');
  const text = handoffText(item, learner);
  const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  const safeId = String(item.id || 'evidence').replace(/[^a-zA-Z0-9_-]/g, '-');
  link.href = url;
  link.download = `boilermaker-human-review-${safeId}.txt`;
  link.click();
  setTimeout(() => URL.revokeObjectURL(url), 2000);
}

const reviewRendererForHandoff = renderEvidenceQueue;
renderEvidenceQueue = async function () {
  await reviewRendererForHandoff();
  const items = await getEvidenceItems();
  const cards = [...evidenceQueue.querySelectorAll('.evidence-item')];
  const reversed = [...items].reverse();

  cards.forEach((card, index) => {
    const item = reversed[index];
    if (!item || item.reviewStatus !== 'PENDING_REVIEW') return;

    const box = document.createElement('div');
    box.className = 'handoff-box';
    box.innerHTML = `
      <p class="handoff-label">FOR HUMAN REVIEW ONLY</p>
      <h4>Local handoff package ready</h4>
      <p class="evidence-meta">Includes learner, curriculum mapping, evidence metadata, attachment reference, SHA-256 hash and review status.</p>
      <p class="evidence-meta">The attachment itself remains local and is not uploaded by this build.</p>
    `;

    const actions = document.createElement('div');
    actions.className = 'handoff-actions';

    const save = document.createElement('button');
    save.type = 'button';
    save.className = 'handoff-btn';
    save.textContent = 'Save human review package';
    save.addEventListener('click', () => saveHandoffPackage(item));
    actions.appendChild(save);

    if (item.fileBlob && item.fileName) {
      const open = document.createElement('button');
      open.type = 'button';
      open.className = 'handoff-btn secondary';
      open.textContent = 'Open linked attachment';
      open.addEventListener('click', () => {
        const url = URL.createObjectURL(item.fileBlob);
        const link = document.createElement('a');
        link.href = url;
        link.target = '_blank';
        link.rel = 'noopener';
        link.click();
        setTimeout(() => URL.revokeObjectURL(url), 2000);
      });
      actions.appendChild(open);
    }

    box.appendChild(actions);
    card.appendChild(box);
  });
};

const handoffBuildLabel = document.querySelector('.hero-card .eyebrow');
if (handoffBuildLabel) handoffBuildLabel.textContent = 'BUILD 0.1A-06';

if (document.getElementById('evidenceView')?.classList.contains('active')) renderEvidenceQueue();
