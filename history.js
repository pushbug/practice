const historyContainer = document.getElementById('historyContainer');
const historyList = document.getElementById('historyList');

/**
 * Formats the user's scrambled answer, striking through incorrect words.
 * @param {string} userAnswer - The sentence the user built.
 * @param {string} correctAnswer - The correct sentence.
 * @returns {string} HTML string of the formatted answer.
 */
function formatScrambledAnswer(userAnswer, correctAnswer) {
    const userWords = userAnswer.split(' ');
    const correctWords = correctAnswer.split(' ');
    return userWords.map((word, index) => {
        if (index < correctWords.length && word === correctWords[index]) {
            return `<span>${word}</span>`;
        }
        return `<del>${word}</del>`;
    }).join(' ');
}

/**
 * Adds a new entry to the answer history list.
 * The new entry is added to the top.
 * @param {number} questionIndex - The index of the question (e.g., 1, 2, 3...).
 * @param {string} correctAnswer - The correct answer.
 * @param {string} userAnswer - The user's submitted answer.
 * @param {boolean} isCorrect - Whether the user's answer was correct.
 * @param {boolean} wasHintUsed - Whether a hint was used for this question.
 */
export function addHistoryEntry(questionIndex, correctAnswer, userAnswer, isCorrect, wasHintUsed) {
    const entry = document.createElement('li');
    const score = isCorrect && !wasHintUsed ? 1 : 0;
    const scoreClass = score === 1 ? 'score-correct' : 'score-incorrect';
    const scoreText = score === 1 ? '+1' : '0';
    let formattedUserAnswer = userAnswer || '""';

    if (document.getElementById('modeSelect').value === 'sent_scramble' && userAnswer) {
        formattedUserAnswer = formatScrambledAnswer(userAnswer, correctAnswer);
    }

    entry.innerHTML = `
        <span class="history-index">${questionIndex}.</span>
        <span class="history-correct">${correctAnswer}</span>
        <span class="history-separator">&gt;</span>
        <span class="history-user">${formattedUserAnswer}</span>
        <span class="history-equals">=</span>
        <span class="history-score ${scoreClass}">${scoreText}</span>
    `;
    historyList.prepend(entry); // Add the new entry to the top
}

/** Clears all entries from the history list. */
export function clearHistory() {
    historyList.innerHTML = '';
}