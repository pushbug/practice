export default {
    id: 'sent_type',
    rule: 'Rule: Type the English and Thai sentences exactly as shown.',
    next: (sentences, helpers, askedIndices) => {
        const { item, index } = helpers.getRandomItem(sentences, askedIndices);
        if (!item) return { current: null, index: -1 };

        // This mode's logic is heavily dependent on the UI, so we just pass the data.
        // The actual setup will be handled in app.js/ui.js
        
        return { 
            current: { 
                type: 'sent_type', 
                english: item.english,
                thai: item.thai[0], // Assuming one translation for simplicity
                correctAnswer: item.english // Initial correct answer for history
            }, 
            index 
        };
    },
    // checkAnswer is not used in the traditional sense for this mode,
    // as validation is real-time in the UI.
    checkAnswer: () => ({ isCorrect: true, correctAnswer: '' })
};