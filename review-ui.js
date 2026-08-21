const buildLabel = document.querySelector('.hero-card .eyebrow');
if (buildLabel) buildLabel.textContent = 'BUILD 0.1A-05';

const reviewStyle = document.createElement('style');
reviewStyle.textContent = `
.review-box { margin-top: 14px; padding: 12px; border-radius: 10px; background: #f6f8fa; border: 1px solid #d8dee4; }
.review-box p { margin: 6px 0 0; }
.review-action-btn { width: 100%; min-height: 48px; margin-top: 10px; border: 0; border-radius: 12px; padding: 12px 16px; font-weight: 700; background: #315b7d; color: white; }
.secondary-review-btn { background: #5f6b76; }
`;
document.head.appendChild(reviewStyle);

function evidenceReadiness(item) {
  const missing = [];
  if (!item.title) missing.push('title');
  if (!item.type) missing.push('type');
  if (!item.module || item.module === 'UNMAPPED') missing.push('curriculum area');
  if (!item.notes) missing.push('short note');
  if (['PHOTO','DOCUMENT','TRAINING_RECORD','JOB_CARD','SUPERVISOR_STATEMENT'].includes(item.type) && !item.fileBlob) missing.push('attachment');
  return { ready: missing.length === 0, missing };
}

async function setEvidenceReview(id, status, missing = []) {
  const items = await getEvidenceItems();
  const i = items.findIndex(x => x.id === id);
  if (i < 0) return;
  items[i].reviewStatus = status;
  items[i].reviewMissing = missing;
  items[i].reviewUpdatedAt = new Date().toISOString();
  await MzansiStore.set('evidence-items', items);
  await renderEvidenceQueue();
}

const previousEvidenceRenderer = renderEvidenceQueue;
renderEvidenceQueue = async function () {
  await previousEvidenceRenderer();
  const items = await getEvidenceItems();
  const cards = [...evidenceQueue.querySelectorAll('.evidence-item')];
  const reversed = [...items].reverse();

  cards.forEach((card, index) => {
    const item = reversed[index];
    if (!item) return;
    const status = item.reviewStatus || 'CAPTURED';
    const box = document.createElement('div');
    box.className = 'review-box';

    if (status === 'NEEDS_MORE_INFORMATION') {
      box.innerHTML = `<strong>NEEDS MORE INFORMATION</strong><p class="evidence-meta">Missing: ${escapeHtml((item.reviewMissing || []).join(', '))}.</p>`;
    } else if (status === 'READY_FOR_HUMAN_REVIEW') {
      box.innerHTML = '<strong>READY FOR HUMAN REVIEW</strong><p class="evidence-meta">This is evidence preparation only. It is not a competence decision.</p>';
    } else if (status === 'PENDING_REVIEW') {
      box.innerHTML = '<strong>PENDING REVIEW • HUMAN REVIEW REQUIRED</strong><p class="evidence-meta">Local only. No reviewer has received this record yet.</p>';
    } else {
      box.innerHTML = '<strong>CAPTURED</strong><p class="evidence-meta">Not yet checked for review readiness.</p>';
    }
    card.appendChild(box);

    if (status !== 'PENDING_REVIEW') {
      const check = document.createElement('button');
      check.className = 'review-action-btn';
      check.type = 'button';
      check.textContent = 'Check review readiness';
      check.addEventListener('click', async () => {
        const result = evidenceReadiness(item);
        await setEvidenceReview(item.id, result.ready ? 'READY_FOR_HUMAN_REVIEW' : 'NEEDS_MORE_INFORMATION', result.missing);
      });
      card.appendChild(check);
    }

    if (status === 'READY_FOR_HUMAN_REVIEW') {
      const queue = document.createElement('button');
      queue.className = 'review-action-btn secondary-review-btn';
      queue.type = 'button';
      queue.textContent = 'Queue for human review';
      queue.addEventListener('click', async () => setEvidenceReview(item.id, 'PENDING_REVIEW'));
      card.appendChild(queue);
    }
  });
};

if (document.getElementById('evidenceView')?.classList.contains('active')) renderEvidenceQueue();
