function shortHash(hash) {
  if (!hash) return 'Hash unavailable on this device';
  return `${hash.slice(0, 16)}…${hash.slice(-12)}`;
}

function revokeEvidenceUrls() {
  document.querySelectorAll('[data-object-url]').forEach(element => {
    const url = element.dataset.objectUrl;
    if (url) URL.revokeObjectURL(url);
  });
}

renderEvidenceQueue = async function () {
  revokeEvidenceUrls();
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
      <p class="evidence-meta"><strong>Attachment:</strong> ${escapeHtml(fileText)}</p>
      ${item.fileName ? `<p class="evidence-meta"><strong>SHA-256:</strong> <span class="hash-value">${escapeHtml(shortHash(item.fileHash))}</span></p>` : ''}
      <p class="evidence-meta">Not verified • ${escapeHtml(item.id)}</p>
    `;

    if (item.fileBlob && item.fileName) {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'back-btn attachment-open-btn';
      button.textContent = 'Open saved attachment';
      const objectUrl = URL.createObjectURL(item.fileBlob);
      button.dataset.objectUrl = objectUrl;
      button.addEventListener('click', () => {
        const link = document.createElement('a');
        link.href = objectUrl;
        link.target = '_blank';
        link.rel = 'noopener';
        link.click();
      });
      card.appendChild(button);

      const confirmation = document.createElement('p');
      confirmation.className = 'attachment-confirmation';
      confirmation.textContent = 'Attachment available from local device storage.';
      card.appendChild(confirmation);
    } else if (item.fileName) {
      const warning = document.createElement('p');
      warning.className = 'attachment-warning';
      warning.textContent = 'Attachment metadata exists, but the local file could not be opened.';
      card.appendChild(warning);
    }

    evidenceQueue.appendChild(card);
  });
};

if (document.getElementById('evidenceView')?.classList.contains('active')) {
  renderEvidenceQueue();
}
