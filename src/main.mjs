import { rmbToCap } from "./rmbconverter.mjs";
import { clipboardCopy, readAloud } from "./utils.mjs";

const amountInput = document.querySelector("#amount");
const resultOutput = document.querySelector("#result");
const keypad = document.querySelector(".keypad");
const copyButton = document.querySelector("#copy");
const speakButton = document.querySelector("#speak");
const clearButton = document.querySelector("#clear");

const ERROR_CLASS = "app__result--error";

function sanitizeInput(value) {
    const cleaned = value.replace(/[^\d.]/g, "");
    const parts = cleaned.split(".");
    if (parts.length === 1) return parts[0];
    return `${parts[0]}.${parts.slice(1).join("").replace(/\./g, "")}`;
}

function updateResult() {
    const value = amountInput.value.trim();
    if (!value) {
        setResult("");
        return;
    }

    try {
        const uppercase = rmbToCap(value);
        setResult(uppercase);
    } catch (error) {
        setResult(error.message, true);
    }
}

function setResult(text, isError = false) {
    resultOutput.textContent = text;
    resultOutput.classList.toggle(ERROR_CLASS, Boolean(isError));
}

function appendValue(char) {
    let next = amountInput.value;
    if (char === "." && next.includes(".")) return;
    if (char === "." && next === "") next = "0";
    amountInput.value = sanitizeInput(next + char);
    updateResult();
}

amountInput.addEventListener("input", (event) => {
    const cursor = event.target.selectionStart;
    const sanitized = sanitizeInput(event.target.value);
    event.target.value = sanitized;
    event.target.setSelectionRange(cursor, cursor);
    updateResult();
});

keypad.addEventListener("click", (event) => {
    if (!(event.target instanceof HTMLButtonElement)) return;
    const value = event.target.dataset.value;
    if (!value) return;
    appendValue(value);
    amountInput.focus();
});

copyButton.addEventListener("click", () => {
    if (!resultOutput.textContent) return;
    clipboardCopy(resultOutput.textContent);
});

speakButton.addEventListener("click", () => {
    if (!resultOutput.textContent) return;
    readAloud(resultOutput.textContent);
});

clearButton.addEventListener("click", () => {
    amountInput.value = "";
    setResult("");
    amountInput.focus();
});

updateResult();