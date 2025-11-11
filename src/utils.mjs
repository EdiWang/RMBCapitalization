export function clipboardCopy(text) {
    navigator.clipboard.writeText(text).then(function () {
        console.log(text);
    }).catch(function (error) {
        alert(error);
    });
};

export function readAloud(text) {
    let utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'zh-CN';
    speechSynthesis.speak(utterance);
}