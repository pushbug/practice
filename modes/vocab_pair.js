let timerId = null;

/**
 * Creates a set of 5 choices for the pairing game.
 * One is the correct answer, and the others are random incorrect answers.
 * @param {object} correctItem - The correct vocabulary item.
 * @param {array} vocabulary - The full list of vocabulary.
 * @param {function} rand - The random function from helpers.
 * @returns {array} An array of 5 Thai translation strings, shuffled.
 */
function createChoices(correctItem, vocabulary, rand) {
    const choices = new Set();
    // Add one of the correct translations
    choices.add(correctItem.thai[rand(correctItem.thai.length)]);

    // Add 4 random incorrect translations
    while (choices.size < 5 && choices.size < vocabulary.length) {
        const randomItem = vocabulary[rand(vocabulary.length)];
        if (randomItem.english !== correctItem.english) {
            choices.add(randomItem.thai[rand(randomItem.thai.length)]);
        }
    }

    // Convert Set to array and shuffle
    return Array.from(choices).sort(() => Math.random() - 0.5);
}

/**
 * Sets up the UI for the vocab pairing game.
 * @param {object} item - The vocabulary item for the current question.
 * @param {array} choices - The array of 5 Thai choices.
 * @param {object} helpers - The helper functions and UI elements.
 */
function setupPairingGame(item, choices, helpers) {
    const { displayEl, scrambleArea, onComplete, speak } = helpers;

    displayEl.innerHTML = `<div class="vocab-pair-question">${item.english}</div>`;
    scrambleArea.innerHTML = '';
    scrambleArea.style.display = 'flex'; // Make sure card area is visible

    choices.forEach(choiceText => {
        const card = document.createElement('button');
        card.className = 'card';
        card.textContent = choiceText;
        card.onclick = () => {
            // When a card is clicked, disable all cards and trigger answer check
            scrambleArea.querySelectorAll('.card').forEach(c => c.disabled = true);
            speak(item.english); // Speak the word on selection
            onComplete(choiceText);
        };
        scrambleArea.appendChild(card);
    });
}

export default {
    id: 'vocab_pair',
    rule: 'Rule: Choose the correct Thai translation for the English word.',
    next: (vocabulary, helpers, askedIndices) => {
        const { item, index } = helpers.getRandomItem(vocabulary, askedIndices);
        if (!item) return { current: null, index: -1 };

        const choices = createChoices(item, vocabulary, helpers.rand);
        const extendedHelpers = {
            ...helpers,
            onComplete: (selectedAnswer) => {
                clearTimeout(timerId); // Stop the timer
                document.dispatchEvent(new CustomEvent('pairComplete', { detail: { answer: selectedAnswer, question: item.english } }));
            }
        };

        setupPairingGame(item, choices, extendedHelpers);

        // Countdown Timer
        let timeLeft = 5;
        helpers.typingFeedback.textContent = `Time: ${timeLeft}`;
        timerId = setInterval(() => {
            timeLeft--;
            helpers.typingFeedback.textContent = `Time: ${timeLeft}`;
            if (timeLeft <= 0) {
                extendedHelpers.onComplete(''); // Timeout, send empty answer
            }
        }, 1000);

        return { current: { type: 'vocab_pair', source: item.english, displayed: item.thai, correctAnswer: item.thai[0] }, index };
    },
    checkAnswer: (answer, current, helpers) => {
        const isCorrect = current.displayed.includes(helpers.normalize(answer));
        return { isCorrect, correctAnswer: current.displayed[0] };
    }
};
