using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Components;
using Microsoft.JSInterop;

namespace RMBCap.Pages
{
    public partial class Index
    {
        [Inject]
        public IJSRuntime JavaScriptRuntime { get; set; }

        private string _inputAmount;

        public string InputAmount
        {
            get => _inputAmount;
            set
            {
                _inputAmount = value;

                if (value.Length <= 11)
                {
                    if (!string.IsNullOrEmpty(value) && value.Contains("."))
                    {
                        var parts = value.Split('.');
                        var decPart = parts[1];
                        if (decPart.Length <= 2)
                        {
                            if (value == ".")
                            {
                                value = "0.";
                                _inputAmount = value;
                            }
                            else
                            {
                                _inputAmount = value;
                            }
                        }
                        else
                        {
                            return;
                        }
                    }

                    // e.g. 01234... format to 1234
                    if (value.StartsWith("0") && !value.Contains("."))
                    {
                        value = int.Parse(value).ToString();
                        _inputAmount = value;
                    }
                    else
                    {
                        _inputAmount = value;
                    }

                    Result = string.IsNullOrWhiteSpace(_inputAmount) ?
                        string.Empty :
                        RMBConverter.RMBToCap(InputAmount);
                }
            }
        }

        public string Result { get; set; }

        private async Task CopyResult()
        {
            if (!string.IsNullOrWhiteSpace(Result))
            {
                await JavaScriptRuntime.InvokeVoidAsync("clipboardCopy.copyText", Result);
            }
        }

        private async Task ReadAloud()
        {
            if (!string.IsNullOrWhiteSpace(Result))
            {
                await JavaScriptRuntime.InvokeVoidAsync("readAloud.readText", Result);
            }
        }

        private void Clear()
        {
            InputAmount = string.Empty;
        }

        private void KeyPadClicked(string value)
        {
            InputAmount += value switch
            {
                "0" when InputAmount != "0" => 0,
                "." when !InputAmount.Contains(".") => ".",
                _ => value
            };
        }
    }
}
