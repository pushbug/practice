export const displayEl = document.getElementById('display');
export const inputEl = document.getElementById('answerInput');
export const soundToggleBtn = document.getElementById('soundToggleBtn');
export const modeSelect = document.getElementById('modeSelect');
export const questionCountSelect = document.getElementById('questionCountSelect');
export const scoreEl = document.getElementById('score');
export const messageEl = document.getElementById('message');
export const typingFeedback = document.getElementById('typingFeedback');
export const modeTitleEl = document.getElementById('modeTitle');
export const questionCounterEl = document.getElementById('questionCounter');
export const scrambleArea = document.getElementById('scrambleArea');
export const ruleDisplay = document.getElementById('ruleDisplay');
 
export function showSourceAsChars(displayed) {
    displayEl.innerHTML = '';
    const wrapper = document.createElement('div');
    for (let i = 0; i < displayed.length; i++) {
        const chSpan = document.createElement('span');
        chSpan.className = 'char';
        chSpan.dataset.index = i;
        chSpan.textContent = displayed[i];
        wrapper.appendChild(chSpan);
    }
    displayEl.appendChild(wrapper);
}

export function showHint(target, onHintUsed) {
    typingFeedback.innerHTML = '';
    const hintButton = document.createElement('button');
    hintButton.innerHTML = '💡 hint';
    hintButton.className = 'hint-button';
    hintButton.onclick = () => {
        onHintUsed(true);
        const comps = [...(target)].map(c => `<span class="char">${c}</span>`).join('');
        typingFeedback.innerHTML = comps;
        hintButton.remove();
    };
    typingFeedback.appendChild(hintButton);
}

export function clearScramble() {
    scrambleArea.innerHTML = '';
    const built = document.getElementById('builtSentence');
    if (built) built.remove();
}

function createFirework(container) {
  const x = 20 + Math.random() * 60;
  const y = 40 + Math.random() * 20;
  const particles = 50;
  for (let i = 0; i < particles; i++) {
    const p = document.createElement('div');
    p.className = 'firework-particle';
    p.style.left = x + '%';
    p.style.top = y + '%';
    const angle = Math.random() * 360;
    const speed = 50 + Math.random() * 100;
    const rad = angle * Math.PI / 180;
    const vx = Math.cos(rad) * speed;
    const vy = Math.sin(rad) * speed;
    p.style.setProperty('--vx', vx + 'px');
    p.style.setProperty('--vy', vy + 'px');
    container.appendChild(p);
  }
}

export function showSuccessAnimation() {
  const container = document.createElement('div');
  container.id = 'fireworks-container';
  document.body.appendChild(container);

  const successMsg = document.createElement('div');
  successMsg.id = 'successMessage';
  successMsg.textContent = 'Your Win!';
  container.appendChild(successMsg);

  const fireworksCount = 3;
  for (let i = 0; i < fireworksCount; i++) {
    setTimeout(() => createFirework(container), i * 400);
  }

  setTimeout(() => {
    container.remove();
  }, 3000);
}

export function showBadAnimation() {
    const container = document.createElement('div');
    container.id = 'bad-animation-container';
    document.body.appendChild(container);

    const badMsg = document.createElement('div');
    badMsg.id = 'badMessage';
    badMsg.textContent = 'Bad!';
    container.appendChild(badMsg);

    document.body.classList.add('shake');

    setTimeout(() => {
        container.remove();
        document.body.classList.remove('shake');
    }, 3000);
}

export function showExplosionAnimation() {
    const container = document.createElement('div');
    container.id = 'explosion-container';

    const text = document.createElement('div');
    text.id = 'explosion-text';
    text.textContent = '0';

    container.appendChild(text);
    document.body.appendChild(container);

    setTimeout(() => {
        container.remove();
    }, 800);
}

export function showCorrectAnswerAnimation() {
    const container = document.createElement('div');
    container.id = 'correct-answer-container';
    document.body.appendChild(container);

    const plusOne = document.createElement('div');
    plusOne.id = 'plusOne';
    plusOne.textContent = '+1';
    container.appendChild(plusOne);

    createFirework(container);

    setTimeout(() => {
        container.remove();
    }, 1500);
}

export function showResetButton(onReset) {
    const resetButton = document.createElement('button');
    const container = document.querySelector('.main-area');
    resetButton.id = 'resetButton';
    resetButton.textContent = 'Reset';
    resetButton.onclick = () => {
        resetButton.remove();
        onReset();
    };
    if (container) {
        container.appendChild(resetButton);
    }
}

export function showSummary(score, total) {
    displayEl.innerHTML = `<h2>Quiz Complete! Your Score: ${score} / ${total}</้>`;
    const percentage = (score / total) * 100;
    const message = `You scored ${score}/${total}.`;

    if (percentage >= 80) {
        showSuccessAnimation();
        messageEl.textContent = `Good! ${message}`;
    } else {
        showBadAnimation();
        messageEl.textContent = `Bad! ${message}`;
    }
}