// sent_t2e.js
export default {
  id: "sent_t2e",
  rule: "Rule: Type the English translation of the Thai sentence shown.",
  next: (sentences, helpers, askedIndices) => {
    const { item, index } = helpers.getRandomItem(sentences, askedIndices);
    if (!item) return { current: null, index: -1 };
    helpers.displayEl.textContent = item.thai;
    helpers.speak(item.english);
    helpers.showHint(item.english);
    return {
      current: { type: "sent_t2e", source: item.thai, correctAnswer: item.english },
      index,
    };
  },
  checkAnswer: (answer, current, helpers) => {
    return {
      isCorrect:
        helpers.normalize(answer) === helpers.normalize(current.correctAnswer),
      correctAnswer: current.correctAnswer,
    };
  },
};
