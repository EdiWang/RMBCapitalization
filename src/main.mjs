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

function removeLastChar() {
    if (!amountInput.value) return;
    amountInput.value = amountInput.value.slice(0, -1);
    updateResult();
}

const isCoarsePointer = window.matchMedia("(pointer: coarse)");
let suppressSystemKeyboard = isCoarsePointer.matches;

const syncKeyboardSuppression = () => {
    if (suppressSystemKeyboard) {
        amountInput.setAttribute("readonly", "true");
        amountInput.setAttribute("inputmode", "none");
    } else {
        amountInput.removeAttribute("readonly");
        amountInput.setAttribute("inputmode", "decimal");
    }
};

syncKeyboardSuppression();
isCoarsePointer.addEventListener("change", (event) => {
    suppressSystemKeyboard = event.matches;
    syncKeyboardSuppression();
});

function focusAmountInput() {
    if (!suppressSystemKeyboard) {
        amountInput.focus();
    }
}

function handlePhysicalKey(event) {
    if (event.defaultPrevented || event.ctrlKey || event.metaKey || event.altKey) return;

    const key = event.key;

    if (/^\d$/.test(key)) {
        event.preventDefault();
        appendValue(key);
        focusAmountInput();
        return;
    }

    if (key === "." || key === "Decimal") {
        event.preventDefault();
        appendValue(".");
        focusAmountInput();
        return;
    }

    if (key === "Backspace") {
        event.preventDefault();
        removeLastChar();
        focusAmountInput();
        return;
    }

    if (key === "Escape") {
        event.preventDefault();
        amountInput.value = "";
        setResult("");
        focusAmountInput();
    }
}

amountInput.addEventListener("input", (event) => {
    const cursor = event.target.selectionStart;
    const sanitized = sanitizeInput(event.target.value);
    event.target.value = sanitized;
    event.target.setSelectionRange(cursor, cursor);
    updateResult();
});

document.addEventListener("keydown", handlePhysicalKey);

keypad.addEventListener("click", (event) => {
    if (!(event.target instanceof HTMLButtonElement)) return;
    const value = event.target.dataset.value;
    if (!value) return;
    appendValue(value);
    focusAmountInput();
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
    focusAmountInput();
});

updateResult();