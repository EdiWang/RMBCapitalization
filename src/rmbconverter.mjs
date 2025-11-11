const MAXIMUM_NUMBER = 99999999999.99;

const digits = ["零", "壹", "贰", "叁", "肆", "伍", "陆", "柒", "捌", "玖"];
const radices = ["", "拾", "佰", "仟"];
const bigRadices = ["", "万", "亿"];
const decimals = ["角", "分"];
const CN_SYMBOL = "人民币";
const CN_DOLLAR = "元";
const CN_INTEGER = "整";

export function rmbToCap(input) {
    const amount = Number(input);
    if (!Number.isNaN(amount) && amount > MAXIMUM_NUMBER) {
        throw new RangeError("金额必须小于一百亿元");
    }

    const parts = input.split(".");
    const integral = (parts[0] ?? "0") || "0";
    const rawDecimalPart = parts.length > 1 ? parts[1] : "";
    const decimalPart = rawDecimalPart ? rawDecimalPart.padEnd(2, "0").slice(0, 2) : "";

    let outputCharacters = convertIntegralPart(integral) + convertDecimalPart(decimalPart);

    if (!outputCharacters) {
        outputCharacters = digits[0] + CN_DOLLAR;
    }
    if (!decimalPart) {
        outputCharacters += CN_INTEGER;
    }

    return outputCharacters;
}

function convertIntegralPart(integral) {
    if (Number(integral) === 0) return "";

    let outputCharacters = "";
    let zeroCount = 0;

    for (let i = 0; i < integral.length; i += 1) {
        const p = integral.length - i - 1;
        const d = integral[i];
        const quotient = Math.floor(p / 4);
        const modulus = p % 4;

        if (d === "0") {
            zeroCount += 1;
        } else {
            if (zeroCount > 0) {
                outputCharacters += digits[0];
            }
            zeroCount = 0;
            outputCharacters += digits[Number(d)] + radices[modulus];
        }

        if (modulus === 0 && zeroCount < 4) {
            outputCharacters += bigRadices[quotient];
            zeroCount = 0;
        }
    }

    return outputCharacters + CN_DOLLAR;
}

function convertDecimalPart(decimalPart) {
    if (!decimalPart) return "";

    let outputCharacters = "";

    for (let i = 0; i < decimalPart.length && i < decimals.length; i += 1) {
        const d = decimalPart[i];
        if (d !== "0") {
            outputCharacters += digits[Number(d)] + decimals[i];
        }
    }

    return outputCharacters;
}