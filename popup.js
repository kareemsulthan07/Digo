const currencies = [
    "USD", "AED", "AFN", "AMD", "ANG", "AOA", "ARS", "AUD", "AWG",
    "AZN", "BAM", "BBD", "BDT", "BGN", "BHD", "BIF", "BMD", "BND", "BOB",
    "BRL", "BSD", "BTN", "BWP", "BYN", "BZD", "CAD", "CDF", "CHF", "CLP",
    "CNY", "COP", "CRC", "CUP", "CVE", "CZK", "DJF", "DKK", "DOP", "DZD",
    "EGP", "ERN", "ETB", "EUR", "FJD", "FKP", "FOK", "GBP", "GEL", "GGP",
    "GHS", "GIP", "GMD", "GNF", "GTQ", "GYD", "HKD", "HNL", "HRK", "HTG",
    "HUF", "IDR", "ILS", "IMP", "INR", "IQD", "IRR", "ISK", "JEP", "JMD",
    "JOD", "JPY", "KES", "KGS", "KHR", "KID", "KMF", "KRW", "KWD", "KYD",
    "KZT", "LAK", "LBP", "LKR", "LRD", "LSL", "LYD", "MAD", "MDL", "MGA",
    "MKD", "MMK", "MNT", "MOP", "MRU", "MUR", "MVR", "MWK", "MXN", "MYR",
    "MZN", "NAD", "NGN", "NIO", "NOK", "NPR", "NZD", "OMR", "PAB", "PEN",
    "PGK", "PHP", "PKR", "PLN", "PYG", "QAR", "RON", "RSD", "RUB", "RWF",
    "SAR", "SBD", "SCR", "SDG", "SEK", "SGD", "SHP", "SLE", "SLL", "SOS",
    "SRD", "SSP", "STN", "SYP", "SZL", "THB", "TJS", "TMT", "TND", "TOP",
    "TRY", "TTD", "TVD", "TWD", "TZS", "UAH", "UGX", "UYU", "UZS", "VES",
    "VND", "VUV", "WST", "XAF", "XCD", "XDR", "XOF", "XPF", "YER", "ZAR",
    "ZMW", "ZWL"
];

document.addEventListener('DOMContentLoaded', () => {
    const sourceCurrencySelect = document.getElementById('convertFrom');
    const targetCurrencySelect = document.getElementById('convertTo');
    const swapButton = document.getElementById('swapButton');
    
    // Populate currency dropdowns
    currencies.forEach((currency) => {
        const optionFrom = document.createElement('option');
        optionFrom.value = currency;
        optionFrom.text = currency;
        sourceCurrencySelect.appendChild(optionFrom);
        
        const optionTo = document.createElement('option');
        optionTo.value = currency;
        optionTo.text = currency;
        targetCurrencySelect.appendChild(optionTo);
    });
    
    // Set default values from storage or use defaults
    chrome.storage.local.get(['sourceCurrency', 'targetCurrency'], function (items) {
        sourceCurrencySelect.value = items.sourceCurrency || 'USD';
        targetCurrencySelect.value = items.targetCurrency || 'INR';
    });
    
    // Swap currencies button
    swapButton.addEventListener('click', () => {
        const tempCurrency = sourceCurrencySelect.value;
        sourceCurrencySelect.value = targetCurrencySelect.value;
        targetCurrencySelect.value = tempCurrency;
        
        // Save to storage
        chrome.storage.local.set({
            'sourceCurrency': sourceCurrencySelect.value,
            'targetCurrency': targetCurrencySelect.value
        });
    });
    
    // Save selected currencies when changed
    sourceCurrencySelect.addEventListener('change', () => {
        chrome.storage.local.set({
            'sourceCurrency': sourceCurrencySelect.value
        });
    });
    
    targetCurrencySelect.addEventListener('change', () => {
        chrome.storage.local.set({
            'targetCurrency': targetCurrencySelect.value
        });
    });
});