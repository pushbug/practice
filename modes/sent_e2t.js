// sent_e2t.js
export default {
    id: 'sent_e2t',
    rule: 'Rule: Type the Thai translation of the English sentence shown.',
    next: (sentences, helpers, askedIndices) => {
        const { item, index } = helpers.getRandomItem(sentences, askedIndices);
        if (!item) return { current: null, index: -1 };
        helpers.displayEl.textContent = item.english;
        helpers.speak(item.english);
        helpers.showHint(item.thai);
        return { 
            current: { 
                type: 'sent_e2t', 
                source: item.english, 
                correctAnswer: item.thai
            }, 
            index 
        };
    },
    checkAnswer: (answer, current, helpers) => {
        return {
            isCorrect: helpers.normalize(answer) === helpers.normalize(current.correctAnswer),
            correctAnswer: current.correctAnswer
        };
    }
};
