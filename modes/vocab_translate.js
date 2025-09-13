export default {
    id: 'vocab_translate',
    rule: 'Rule: Type the English translation of the Thai word shown.',
    next: (vocabulary, helpers, askedIndices) => {
        const { item, index } = helpers.getRandomItem(vocabulary, askedIndices);
        if (!item) return { current: null, index: -1 };
        const thai = item.thai[helpers.rand(item.thai.length)];
        helpers.displayEl.textContent = thai;
        helpers.speak(item.english);
        helpers.showHint(item.english);
        return { current: { type: 'vocab_translate', source: item.english, displayed: thai }, index };
    },
    checkAnswer: (answer, current, helpers) => {
        return {
            isCorrect: helpers.normalize(answer) === helpers.normalize(current.source),
            correctAnswer: current.source
        };
    }
};