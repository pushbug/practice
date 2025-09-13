// sent_scramble.js

function getBuiltSentence(displayEl) {
    const words = Array.from(displayEl.querySelectorAll('.card')).map(card => card.textContent);
    return words.join(' ');
}

function setupScramble(item, helpers) {
    const { displayEl, scrambleArea, typingFeedback, onComplete, speak } = helpers;

    displayEl.innerHTML = '';
    scrambleArea.innerHTML = '';
    typingFeedback.textContent = `Hint: ${item.thai}`;

    const words = item.english.split(/\s+/).filter(Boolean);
    const shuffledWords = words.slice().sort(() => Math.random() - 0.5);

    shuffledWords.forEach(wordText => {
        const card = document.createElement('button');
        card.className = 'card';
        card.textContent = wordText;
        card.onclick = () => moveCard(card, onComplete, speak);
        scrambleArea.appendChild(card);
    });
}

function moveCard(card, onComplete, speak) {
    const isChosen = card.parentElement.id === 'display';
    const targetAreaIsDisplay = !isChosen;
    const targetArea = isChosen ? document.getElementById('scrambleArea') : document.getElementById('display');

    card.classList.add('moving');

    setTimeout(() => {
        targetArea.appendChild(card);
        card.classList.remove('moving');

        if (targetAreaIsDisplay && speak) {
            speak(card.textContent);
        }

        const scrambleArea = document.getElementById('scrambleArea');
        if (scrambleArea.children.length === 0) {
            onComplete();
        }
    }, 300);
}

export default {
    id: 'sent_scramble',
    rule: 'Rule: Click the words to form the correct sentence. Click a chosen word to move it back.',
    next: (sentences, helpers, askedIndices) => {
        const { item, index } = helpers.getRandomItem(sentences, askedIndices);
        if (!item) return { current: null, index: -1 };
        
        const extendedHelpers = {
            ...helpers,
            onComplete: () => {
                document.dispatchEvent(new CustomEvent('scrambleComplete'));
            }
        };
        
        setupScramble(item, extendedHelpers);
        helpers.speak(item.english);
        
        return { current: { type: 'sent_scramble', source: item.english, displayed: item.thai }, index };
    },
    checkAnswer: (answer, current, helpers) => {
        const builtSentence = getBuiltSentence(helpers.displayEl);
        return {
            isCorrect: helpers.normalize(builtSentence) === helpers.normalize(current.source),
            correctAnswer: current.source
        };
    }
};