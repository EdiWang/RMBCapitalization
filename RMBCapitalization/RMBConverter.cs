using System;

namespace RMBCap
{
    // from https://blog.csdn.net/explorerwen/article/details/86434
    public class RMBConverter
    {
        public static string GetCapitalizedRmb(string input)
        {
            // Constants: 
            var MAXIMUM_NUMBER = 99999999999.99;

            // Predefine the radix characters and currency symbols for output: 
            var CN_ZERO = "零";
            var CN_ONE = "壹";
            var CN_TWO = "贰";
            var CN_THREE = "叁";
            var CN_FOUR = "肆";
            var CN_FIVE = "伍";
            var CN_SIX = "陆";
            var CN_SEVEN = "柒";
            var CN_EIGHT = "捌";
            var CN_NINE = "玖";
            var CN_TEN = "拾";
            var CN_HUNDRED = "佰";
            var CN_THOUSAND = "仟";
            var CN_TEN_THOUSAND = "万";
            var CN_HUNDRED_MILLION = "亿";
            var CN_SYMBOL = "人民币";
            var CN_DOLLAR = "元";
            var CN_TEN_CENT = "角";
            var CN_CENT = "分";
            var CN_INTEGER = "整";

            if (double.Parse(input) > MAXIMUM_NUMBER)
            {
                throw new ArgumentOutOfRangeException(nameof(input), "金额必须小于一百亿元");
            }

            string integral;
            string decimalPart;

            var parts = input.Split('.');
            if (parts.Length > 1)
            {
                integral = parts[0];
                decimalPart = parts[1];

                if (decimalPart == string.Empty)
                {
                    decimalPart = "00";
                }

                if (decimalPart.Length == 1)
                {
                    decimalPart += "0";
                }

                // Cut down redundant decimal digits that are after the second. 
                decimalPart = decimalPart.Substring(0, 2);
            }
            else
            {
                integral = parts[0];
                decimalPart = string.Empty;
            }

            // Prepare the characters corresponding to the digits: 
            var digits = new[] { CN_ZERO, CN_ONE, CN_TWO, CN_THREE, CN_FOUR, CN_FIVE, CN_SIX, CN_SEVEN, CN_EIGHT, CN_NINE };
            var radices = new[] { "", CN_TEN, CN_HUNDRED, CN_THOUSAND };
            var bigRadices = new[] { "", CN_TEN_THOUSAND, CN_HUNDRED_MILLION };
            var decimals = new[] { CN_TEN_CENT, CN_CENT };

            string outputCharacters = string.Empty;
            if (long.Parse(integral) > 0)
            {
                var zeroCount = 0;
                for (int i = 0; i < integral.Length; i++)
                {
                    var p = integral.Length - i - 1;
                    var d = integral.Substring(i, 1);
                    var quotient = p / 4;
                    var modulus = p % 4;
                    if (d == "0")
                    {
                        zeroCount++;
                    }
                    else
                    {
                        if (zeroCount > 0)
                        {
                            outputCharacters += digits[0];
                        }
                        zeroCount = 0;
                        outputCharacters += digits[int.Parse(d)] + radices[modulus];
                    }
                    if (modulus == 0 && zeroCount < 4)
                    {
                        outputCharacters += bigRadices[quotient];
                        zeroCount = 0;
                    }
                }
                outputCharacters += CN_DOLLAR;
            }

            // Process decimal part if there is: 
            if (decimalPart != string.Empty)
            {
                for (int i = 0; i < decimalPart.Length; i++)
                {
                    var d = decimalPart.Substring(i, 1);
                    if (d != "0")
                    {
                        outputCharacters += digits[int.Parse(d)] + decimals[i];
                    }
                }
            }

            // Confirm and return the final output string: 
            if (outputCharacters == string.Empty)
            {
                outputCharacters = CN_ZERO + CN_DOLLAR;
            }
            if (decimalPart == string.Empty)
            {
                outputCharacters += CN_INTEGER;
            }

            return outputCharacters;
        }
    }
}
