const quizQuestions = [
  { q: 'What is the main purpose of a technical drawing?', options: ['Decoration', 'Technical communication', 'Advertising', 'Entertainment'], answer: 1 },
  { q: 'Which view represents an object from above?', options: ['Side view', 'Front view', 'Top view', 'Bottom note'], answer: 2 },
  { q: 'What does a dimension communicate?', options: ['A measurement', 'The learner name', 'Internet speed', 'The app colour'], answer: 0 },
  { q: 'If you do not understand a drawing symbol, what should you do?', options: ['Guess', 'Ignore it', 'Verify what it means', 'Replace it'], answer: 2 },
  { q: 'A drawing says a component is 300 mm long. It looks small on your phone. What stated length should you use?', options: ['Whatever looks correct', '300 mm', 'The phone width', '5 cm'], answer: 1 },
  { q: 'Why can several views be shown?', options: ['To make the page fuller', 'To describe the same object from different directions', 'To change the component', 'To confuse the reader'], answer: 1 }
];

const views = [...document.querySelectorAll('.view')];
const networkStatus = document.getElementById('networkStatus');
const learnerName = document.getElementById('learnerName');
const learnerSaved = document.getElementById('learnerSaved');
const quizForm = document.getElementById('quizForm');
const quizResult = document.getElementById('quizResult');
const pathProgress = document.getElementById('pathProgress');
const pathProgressText = document.getElementById('pathProgressText');

function openView(id) {
  views.forEach(view => view.classList.toggle('active', view.id === id));
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

document.querySelectorAll('[data-open]').forEach(button => {
  button.addEventListener('click', () => openView(button.dataset.open));
});

document.getElementById('safetyBtn').addEventListener('click', () => openView('safetyView'));
document.getElementById('startQuizBtn').addEventListener('click', () => openView('quizView'));

function updateNetwork() {
  const online = navigator.onLine;
  networkStatus.textContent = online ? 'ONLINE' : 'OFFLINE';
  networkStatus.style.background = online ? '#dcfce7' : '#fee2e2';
}
window.addEventListener('online', updateNetwork);
window.addEventListener('offline', updateNetwork);
updateNetwork();

async function loadSavedState() {
  try {
    const savedLearner = await MzansiStore.get('learner');
    const savedProgress = await MzansiStore.get('km07-progress');
    if (savedLearner?.name) learnerName.value = savedLearner.name;
    applyProgress(savedProgress || { completed: false, score: null, attempts: 0 });
  } catch (error) {
    console.error('Local storage unavailable', error);
  }
}

document.getElementById('saveLearnerBtn').addEventListener('click', async () => {
  const name = learnerName.value.trim();
  if (!name) {
    learnerSaved.textContent = 'Please enter a learner name first.';
    return;
  }
  await MzansiStore.set('learner', { name, updatedAt: new Date().toISOString() });
  learnerSaved.textContent = `Saved locally for ${name}.`;
});

function renderQuiz() {
  quizForm.innerHTML = '';
  quizQuestions.forEach((item, index) => {
    const section = document.createElement('section');
    section.className = 'quiz-question';
    const fieldset = document.createElement('fieldset');
    const legend = document.createElement('legend');
    legend.textContent = `${index + 1}. ${item.q}`;
    fieldset.appendChild(legend);

    item.options.forEach((option, optionIndex) => {
      const label = document.createElement('label');
      label.className = 'option-row';
      const input = document.createElement('input');
      input.type = 'radio';
      input.name = `q${index}`;
      input.value = String(optionIndex);
      const text = document.createElement('span');
      text.textContent = option;
      label.append(input, text);
      fieldset.appendChild(label);
    });
    section.appendChild(fieldset);
    quizForm.appendChild(section);
  });
}

function applyProgress(progress) {
  const percent = progress.completed ? 100 : progress.attempts > 0 ? 50 : 0;
  pathProgress.style.width = `${percent}%`;
  pathProgressText.textContent = progress.completed ? `100% complete • latest score ${progress.score}/6` : `${percent}% complete`;
}

document.getElementById('submitQuizBtn').addEventListener('click', async () => {
  let score = 0;
  let answered = 0;
  quizQuestions.forEach((item, index) => {
    const selected = quizForm.querySelector(`input[name="q${index}"]:checked`);
    if (selected) {
      answered += 1;
      if (Number(selected.value) === item.answer) score += 1;
    }
  });

  if (answered < quizQuestions.length) {
    quizResult.className = 'result-box show';
    quizResult.textContent = 'Please answer all six questions before checking your answers.';
    return;
  }

  const oldProgress = (await MzansiStore.get('km07-progress')) || { attempts: 0 };
  const completed = score >= 4;
  const progress = {
    completed,
    score,
    attempts: (oldProgress.attempts || 0) + 1,
    updatedAt: new Date().toISOString()
  };
  await MzansiStore.set('km07-progress', progress);
  applyProgress(progress);

  quizResult.className = 'result-box show';
  quizResult.innerHTML = completed
    ? `<strong>${score}/6.</strong> Learning slice completed. This records learning progress only, not official competence.`
    : `<strong>${score}/6.</strong> Let’s review the parts that were difficult, then try again.`;
});

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./service-worker.js').catch(error => {
      console.error('Service worker registration failed', error);
    });
  });
}

renderQuiz();
loadSavedState();
