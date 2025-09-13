export default {
    id: 'vocab_translate',
    rule: 'Rule: Type the English translation of the Thai word shown.',
    next: (vocabulary, helpers, askedIndices) => {
        const { item, index } = helpers.getRandomItem(vocabulary, askedIndices);
        if (!item) return { current: null, index: -1 };
        const allThaiTranslations = item.thai.join(', ');
        helpers.displayEl.textContent = allThaiTranslations;
        helpers.speak(item.english);
        helpers.showHint(item.english);
        return { current: { type: 'vocab_translate', source: item.english, displayed: allThaiTranslations }, index };
    },
    checkAnswer: (answer, current, helpers) => {
        return {
            isCorrect: helpers.normalize(answer) === helpers.normalize(current.source),
            correctAnswer: current.source
        };
    }
};