namespace RMBCap;

public class RMBConverter
{
    private const double MAXIMUM_NUMBER = 99999999999.99;

    private static readonly string[] Digits = ["零", "壹", "贰", "叁", "肆", "伍", "陆", "柒", "捌", "玖"];
    private static readonly string[] Radices = ["", "拾", "佰", "仟"];
    private static readonly string[] BigRadices = ["", "万", "亿"];
    private static readonly string[] Decimals = ["角", "分"];
    private const string CN_SYMBOL = "人民币";
    private const string CN_DOLLAR = "元";
    private const string CN_INTEGER = "整";

    public static string RMBToCap(string input)
    {
        if (double.TryParse(input, out double amount) && amount > MAXIMUM_NUMBER)
        {
            throw new ArgumentOutOfRangeException(nameof(input), "金额必须小于一百亿元");
        }

        var parts = input.Split('.');
        var integral = parts[0];
        var decimalPart = parts.Length > 1 ? parts[1].PadRight(2, '0').Substring(0, 2) : string.Empty;

        var outputCharacters = ConvertIntegralPart(integral) + ConvertDecimalPart(decimalPart);

        if (string.IsNullOrEmpty(outputCharacters))
        {
            outputCharacters = Digits[0] + CN_DOLLAR;
        }
        if (string.IsNullOrEmpty(decimalPart))
        {
            outputCharacters += CN_INTEGER;
        }

        return outputCharacters;
    }

    private static string ConvertIntegralPart(string integral)
    {
        if (long.Parse(integral) == 0) return string.Empty;

        var outputCharacters = string.Empty;
        var zeroCount = 0;

        for (int i = 0; i < integral.Length; i++)
        {
            var p = integral.Length - i - 1;
            var d = integral[i].ToString();
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
                    outputCharacters += Digits[0];
                }
                zeroCount = 0;
                outputCharacters += Digits[int.Parse(d)] + Radices[modulus];
            }

            if (modulus == 0 && zeroCount < 4)
            {
                outputCharacters += BigRadices[quotient];
                zeroCount = 0;
            }
        }

        return outputCharacters + CN_DOLLAR;
    }

    private static string ConvertDecimalPart(string decimalPart)
    {
        if (string.IsNullOrEmpty(decimalPart)) return string.Empty;

        var outputCharacters = string.Empty;

        for (int i = 0; i < decimalPart.Length; i++)
        {
            var d = decimalPart[i].ToString();
            if (d != "0")
            {
                outputCharacters += Digits[int.Parse(d)] + Decimals[i];
            }
        }

        return outputCharacters;
    }
}