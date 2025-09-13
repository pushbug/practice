export const rand = (n) => Math.floor(Math.random() * n);
export const normalize = (s) => (s || '').trim().toLowerCase();

export const getRandomItem = (arr, exclude = []) => {
    const availableIndices = arr.map((_, i) => i).filter(i => !exclude.includes(i));
    if (availableIndices.length === 0) {
        return { item: null, index: -1 };
    }
    const randomIndex = availableIndices[rand(availableIndices.length)];
    return { item: arr[randomIndex], index: randomIndex };
};

export function speak(text, isSoundEnabled, lang = 'en-US') {
    if (!window.speechSynthesis || !isSoundEnabled) return;

    const ut = new SpeechSynthesisUtterance(text);
    ut.lang = lang;

    // พยายามหาเสียงที่ตรงกับภาษาที่ต้องการ
    const voices = window.speechSynthesis.getVoices();
    const targetVoice = voices.find(voice => voice.lang === lang);
    if (targetVoice) {
        ut.voice = targetVoice;
    }

    speechSynthesis.cancel();
    speechSynthesis.speak(ut);
}