// vocab_fill.js
export default {
    id: 'vocab_fill',
    rule: 'Rule: Fill in the missing letters to complete the English word.',
    next: (vocabulary, helpers, askedIndices) => {
        const { item, index } = helpers.getRandomItem(vocabulary, askedIndices);
        if (!item) return { current: null, index: -1 };
        const word = item.english;
        const hideCount = Math.min(2, Math.max(1, Math.floor(word.length / 4)));
        const indices = [];
        while (indices.length < hideCount) {
            const i = 1 + helpers.rand(Math.max(1, word.length - 1));
            if (!indices.includes(i)) indices.push(i);
        }
        const displayed = word.split('').map((c, i) => indices.includes(i) ? '_' : c).join('');
        helpers.showSourceAsChars(displayed);
        helpers.speak(word);
        helpers.typingFeedback.textContent = `คำใบ้: ${item.thai.join(', ')}`
        return { current: { type: 'vocab_fill', source: word, displayed }, index };
    },
    checkAnswer: (answer, current, helpers) => {
        return {
            isCorrect: helpers.normalize(answer) === helpers.normalize(current.source),
            correctAnswer: current.source
        };
    }
};