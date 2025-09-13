// app.js
import vocabFillMode from './modes/vocab_fill.js';
import vocabTranslateMode from './modes/vocab_translate.js';
import sentE2TMode from './modes/sent_e2t.js';
import sentT2EMode from './modes/sent_t2e.js';
import sentScrambleMode from './modes/sent_scramble.js';
import vocabPairMode from './modes/vocab_pair.js';
import { rand, normalize, getRandomItem, speak } from './helpers.js';
import { 
    displayEl, inputEl, soundToggleBtn, modeSelect, questionCountSelect, scoreEl, messageEl, modeTitleEl, questionCounterEl, 
    typingFeedback, scrambleArea, ruleDisplay, showSourceAsChars, 
    showHint, clearScramble, showSummary, showCorrectAnswerAnimation, showExplosionAnimation, showResetButton
} from './ui.js';
import { addHistoryEntry, clearHistory } from './history.js';

let vocabulary = [];
let sentences = [];
let current = null;
let score = 0;
let activeMode = null;
let isSoundEnabled = false;
let hintUsed = false;
let questionCount = 10;
let currentQuestionIndex = 0;
let askedIndices = [];
let isGameEnded = false;

const modes = {
    'vocab_fill': vocabFillMode,
    'vocab_translate': vocabTranslateMode,
    'vocab_pair': vocabPairMode,
    'sent_e2t': sentE2TMode,
    'sent_t2e': sentT2EMode,
    'sent_scramble': sentScrambleMode
};

const helpers = {
    rand,
    normalize,
    getRandomItem,
    speak: (text, lang = 'en-US') => speak(text, isSoundEnabled, lang),
    showSourceAsChars,
    showHint: (target) => showHint(target, (used) => hintUsed = used),
    displayEl,
    typingFeedback,
    scrambleArea,
    messageEl,
    modeSelect
};

async function loadData() {
    try {
        const [vRes, sRes] = await Promise.all([fetch('data/vocabulary.json'), fetch('data/sentences.json')]);
        if (!vRes.ok || !sRes.ok) throw new Error('Failed fetching JSON files');
        vocabulary = await vRes.json();
        sentences = await sRes.json();
    } catch (err) {
        console.error(err);
        messageEl.textContent = 'Error loading data. Check that data/vocabulary.json and data/sentences.json exist.';
    }
}

function setMode(modeId) {
    activeMode = modes[modeId];
    // Remove the reset button if it exists from a previous game
    const existingResetButton = document.getElementById('resetButton');
    if (existingResetButton) {
        existingResetButton.remove();
    }
    const selectedOption = modeSelect.options[modeSelect.selectedIndex];
    if (selectedOption) {
        modeTitleEl.textContent = selectedOption.text;
    }
    messageEl.textContent = '';
    clearScramble();
    inputEl.value = '';
    inputEl.focus();
    currentQuestionIndex = 0;
    askedIndices = [];
    score = 0;
    scoreEl.textContent = score;
    questionCounterEl.textContent = '';
    isGameEnded = false;
    clearHistory();
    next();
}

function endGame() {
    // Delay showing the summary to let the last answer animation finish
    setTimeout(() => {
        if (isGameEnded) return; // Prevent multiple executions
        isGameEnded = true;
        showSummary(score, questionCount);
        showResetButton(resetQuiz);
    }, 1000); // 1 second delay
}

function resetQuiz() {
    isGameEnded = false;
    currentQuestionIndex = 0;
    askedIndices = [];
    score = 0;
    scoreEl.textContent = score;
    clearHistory();
    next();
}

document.addEventListener('scrambleComplete', () => {
    if (activeMode && activeMode.id === 'sent_scramble') {
        checkAnswer();
    }
});

document.addEventListener('pairComplete', (e) => {
    if (isGameEnded) return; // Don't process clicks after game has ended
    const { answer, question } = e.detail;
    if (activeMode && activeMode.id === 'vocab_pair' && displayEl) {
        // Update display to show "Question = Answer"
        const answerText = answer || '""'; // Show empty quotes if timeout
        displayEl.innerHTML = `<div class="vocab-pair-question">${question}</div> <span class="vocab-pair-separator">=</span> <span class="vocab-pair-question">${answerText}</span>`;
        // If the answer is from a click, wait a bit. If it's a timeout, check immediately.
        setTimeout(() => checkAnswer(answer), answer ? 200 : 0);
    }
});

soundToggleBtn.addEventListener('click', () => {
    isSoundEnabled = !isSoundEnabled;
    soundToggleBtn.textContent = isSoundEnabled ? 'Sound On' : 'Sound Off';
    soundToggleBtn.classList.toggle('sound-on', isSoundEnabled);
});

modeSelect.addEventListener('change', () => { setMode(modeSelect.value); });

questionCountSelect.addEventListener('change', () => {
    questionCount = parseInt(questionCountSelect.value, 10);
    setMode(modeSelect.value);
});

document.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
        e.preventDefault();
        checkAnswer();
    }
    if (e.key === 'n' && (e.ctrlKey || e.metaKey)) { e.preventDefault(); next(); }
});

(async function () {
    await loadData();
    questionCount = parseInt(questionCountSelect.value, 10);
    setMode(modeSelect.value);
})();

function next() {
    if (isGameEnded) return;
    if (currentQuestionIndex >= questionCount) {
        endGame();
        return;
    }

    hintUsed = false;
    inputEl.value = '';
    typingFeedback.innerHTML = '';
    clearScramble();
    messageEl.textContent = '';
    inputEl.style.display = 'block';
    scrambleArea.style.display = 'none';
    inputEl.disabled = false;

    questionCounterEl.textContent = `${currentQuestionIndex + 1}/${questionCount}`;
    if (activeMode) {
        ruleDisplay.textContent = activeMode.rule || '';
        const data = activeMode.id.startsWith('sent') ? sentences : vocabulary;
        const result = activeMode.next(data, helpers, askedIndices);
        
        if (result.index === -1) {
            messageEl.textContent = "You've answered all available questions in this mode!";
            return;
        }

        current = result.current;
        askedIndices.push(result.index);
        currentQuestionIndex++;

        if (activeMode.id === 'sent_scramble' || activeMode.id === 'vocab_pair') {
            inputEl.style.display = 'none';
            scrambleArea.style.display = 'flex';
        } else {
            inputEl.style.display = 'block';
            inputEl.focus();
        }
    }
}

function checkAnswer(forcedAnswer = null) {
    if (isGameEnded) return;
    if (!current) { return; }
    
    let answer;
    if (forcedAnswer !== null) {
        answer = forcedAnswer;
    } else if (activeMode.id === 'sent_scramble') {
        answer = Array.from(displayEl.querySelectorAll('.card')).map(card => card.textContent).join(' ');
    } else {
        answer = inputEl.value.trim();
    }

    if (activeMode.id !== 'sent_scramble' && activeMode.id !== 'vocab_pair' && answer === '') {
        messageEl.textContent = 'Type an answer, or "." to skip.';
        return;
    }
    if (answer === '.') {
        messageEl.textContent = `Skipped. The answer was: ${current.correctAnswer || current.source}`;
        showExplosionAnimation();
        setTimeout(next, 500);
        return;
    }

    const result = activeMode.checkAnswer(answer, current, helpers);
    if (result === null) return; 

    const { isCorrect, correctAnswer } = result;
    const isLastQuestion = currentQuestionIndex >= questionCount;
    
    addHistoryEntry(currentQuestionIndex, correctAnswer, answer, isCorrect, hintUsed);

    if (isCorrect) {
        if (!hintUsed) {
            score++;
            messageEl.textContent = 'Correct!';
            scoreEl.textContent = score;
            showCorrectAnswerAnimation();
        } else {
            messageEl.textContent = 'Correct, but no points for using a hint.';
        }
    } else {
        messageEl.textContent = `Incorrect. The correct answer is: ${correctAnswer}`;
        showExplosionAnimation();
    }

    if (isLastQuestion) {
        inputEl.disabled = true;
        endGame();
    } else {
        setTimeout(next, isCorrect ? 1000 : 1000); // Give a bit more time to see the result
    }
}