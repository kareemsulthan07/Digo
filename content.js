function stringIsNullOrEmpty(str) {
    return str === null || str === '';
}

function getDecimalPlaces(currency) {
    // Currencies that typically use 0 decimal places
    const zeroDecimal = ['JPY', 'KRW', 'VND', 'IDR', 'TWD', 'HUF', 'CLP', 'PYG', 'ISK', 'BIF', 'DJF', 'GNF', 'KMF', 'KRW', 'MGA', 'RWF', 'UGX', 'VUV', 'XAF', 'XOF', 'XPF'];
    // Currencies that typically use 3 decimal places
    const threeDecimal = ['BHD', 'IQD', 'JOD', 'KWD', 'LYD', 'OMR', 'TND'];
    // Currencies with variable decimal places but typically using less than 2
    const specialCases = {
        'MRU': 1, // Mauritanian ouguiya
        'CVE': 0, // Cape Verdean escudo
        'MZN': 0, // Mozambican metical
        'STN': 0  // São Tomé and Príncipe dobra
    };
    
    if (zeroDecimal.includes(currency)) return 0;
    if (threeDecimal.includes(currency)) return 3;
    if (currency in specialCases) return specialCases[currency];
    return 2; // Default is 2 decimal places for most currencies
}

function formatCurrency(amount, currency) {
    const decimalPlaces = getDecimalPlaces(currency);
    
    // Format with the appropriate number of decimal places
    return amount.toLocaleString(undefined, {
        minimumFractionDigits: decimalPlaces,
        maximumFractionDigits: decimalPlaces
    });
}

function getCurrencySymbol(currency) {
    const symbols = {
        // Major world currencies
        'USD': '$', 'EUR': '€', 'GBP': '£', 'JPY': '¥', 'CNY': '¥', 'INR': '₹',
        'RUB': '₽', 'KRW': '₩', 'TRY': '₺', 'BRL': 'R$', 'CHF': 'Fr',
        'CAD': 'C$', 'AUD': 'A$', 'HKD': 'HK$', 'SGD': 'S$', 'NZD': 'NZ$',
        'MXN': 'Mex$', 'ZAR': 'R', 'SEK': 'kr', 'NOK': 'kr', 'DKK': 'kr',
        
        // Middle Eastern currencies
        'AED': 'د.إ', 'SAR': '﷼', 'QAR': '﷼', 'IQD': 'ع.د', 'BHD': '.د.ب',
        'KWD': 'د.ك', 'OMR': 'ر.ع.', 'JOD': 'د.ا', 'ILS': '₪',
        
        // Asian currencies
        'THB': '฿', 'VND': '₫', 'IDR': 'Rp', 'PHP': '₱', 'MYR': 'RM',
        'TWD': 'NT$', 'PKR': '₨', 'NPR': '₨', 'LKR': '₨', 'BDT': '৳',
        
        // African currencies
        'NGN': '₦', 'GHS': '₵', 'EGP': 'E£', 'MAD': 'د.م.', 'TND': 'د.ت',
        
        // South American currencies
        'CLP': 'CLP$', 'COP': 'COL$', 'ARS': 'AR$', 'PEN': 'S/', 'UYU': '$U',
        
        // Eastern European currencies
        'PLN': 'zł', 'CZK': 'Kč', 'HUF': 'Ft', 'BGN': 'лв', 'RON': 'lei',
        'HRK': 'kn', 'RSD': 'дин.',
        
        // Regional currencies
        'XAF': 'FCFA', 'XOF': 'CFA', 'XCD': 'EC$', 'XPF': 'CFP'
    };
    
    return symbols[currency] || currency;
}

function showPopup(selection, originalValue, convertedAmount, fromCurrency, toCurrency) {
    // Remove existing popup
    const existingPopup = document.getElementById('myPopup');
    if (existingPopup) {
        existingPopup.remove();
    }
    
    const formattedAmount = formatCurrency(convertedAmount, toCurrency);
    const toSymbol = getCurrencySymbol(toCurrency);
    const fromSymbol = getCurrencySymbol(fromCurrency);
    
    // Create popup element
    const popup = document.createElement('div');
    popup.id = 'myPopup';
    
    // Style the popup
    Object.assign(popup.style, {
        position: 'absolute',
        background: 'white',
        color: '#333',
        border: '1px solid #ccc',
        borderRadius: '6px',
        fontSize: '13px',
        padding: '8px 12px',
        zIndex: '2147483647', // Max z-index
        boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, sans-serif',
        transition: 'opacity 0.2s, transform 0.2s',
        opacity: '0',
        transform: 'translateY(8px)',
        pointerEvents: 'none' // Prevent the popup from interfering with mouse events
    });
    
    // Determine display format based on currency
    let displaySymbol, displayAmount;
    
    // Handle special display cases where the symbol comes after the amount
    const symbolAfter = ['SEK', 'NOK', 'DKK', 'PLN', 'CZK', 'HUF'];
    if (symbolAfter.includes(toCurrency)) {
        displaySymbol = toSymbol;
        displayAmount = `${formattedAmount} ${displaySymbol}`;
    } else {
        displaySymbol = toSymbol;
        displayAmount = toSymbol === toCurrency ? 
            `${toCurrency} ${formattedAmount}` : 
            `${displaySymbol} ${formattedAmount}`;
    }
    
    // Create the content structure
    popup.innerHTML = `
        <div style="margin-bottom: 4px; font-weight: bold;">${displayAmount}</div>
        <div style="font-size: 11px; color: #666;">Approx. value of ${fromSymbol === fromCurrency ? fromCurrency + ' ' : fromSymbol}${originalValue}</div>
    `;
    
    // Position the popup
    const range = selection.getRangeAt(0);
    const rect = range.getBoundingClientRect();
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const scrollLeft = window.pageXOffset || document.documentElement.scrollLeft;
    
    // Ensure popup stays in viewport
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    const popupWidth = 140; // Estimate popup width
    const popupHeight = 50; // Estimate popup height
    
    let popupLeft = rect.left + scrollLeft;
    let popupTop = rect.top + scrollTop - popupHeight - 10;
    
    // Adjust if popup would be off screen
    if (popupLeft + popupWidth > viewportWidth + scrollLeft) {
        popupLeft = viewportWidth + scrollLeft - popupWidth - 10;
    }
    
    if (popupTop < scrollTop) {
        // If not enough room above, position below
        popupTop = rect.bottom + scrollTop + 10;
    }
    
    popup.style.left = `${popupLeft}px`;
    popup.style.top = `${popupTop}px`;
    
    // Add to page
    document.body.appendChild(popup);
    
    // Trigger animation
    setTimeout(() => {
        popup.style.opacity = '1';
        popup.style.transform = 'translateY(0)';
    }, 10);
    
    // Auto-dismiss after 3 seconds
    setTimeout(() => {
        if (popup.parentNode) {
            popup.style.opacity = '0';
            popup.style.transform = 'translateY(8px)';
            
            // Remove after fade out
            setTimeout(() => {
                if (popup.parentNode) {
                    popup.remove();
                }
            }, 200);
        }
    }, 3000);
}

// Check if the selection contains a valid number potentially with currency symbols
function isNumeric(str) {
    // First, check for simple numeric format (more permissive)
    // Allows for formats like 1,234.56 or 1 234,56 (different locales)
    if (/^[0-9\s,.]+$/.test(str)) {
        return true;
    }
    
    // If not a simple number, check for possible currency format
    // Remove common currency symbols and then check if it's numeric
    const withoutCurrencySymbols = str.replace(/[$€£¥₹₽₩₺฿₫₱₴₦₵Rp₨₸₼₾₼лв؋ƒ₲₭៛₥₮₦₱₲₴₸₺₼₾]/g, '')
                                     .replace(/^[A-Z]{3}\s*/i, '') // Remove potential currency code at start
                                     .trim();
                                     
    // After removing currency symbols, at least check if there's a number in there
    return /[0-9]/.test(withoutCurrencySymbols) && 
           // And make sure what's left is just numbers, spaces, and separators
           /^[0-9\s,.]+$/.test(withoutCurrencySymbols);
}

// Extract the numeric value from a string that might contain currency symbols
// and process according to the source currency format
function extractNumericValue(str, currency) {
    // Remove all non-numeric characters except for decimal point and comma
    const cleanedStr = str.replace(/[^0-9.,]/g, '');
    
    // Get decimal places expected for this currency
    const decimalPlaces = getDecimalPlaces(currency);
    
    // Handle different number formats based on common conventions for the currency
    let value;
    
    // Special case for currencies that traditionally use comma as decimal separator
    // (most European currencies except UK)
    const commaDecimalCurrencies = ['EUR', 'DKK', 'NOK', 'SEK', 'PLN', 'CZK', 'HUF', 'RON', 'BGN'];
    
    if (cleanedStr.includes('.') && cleanedStr.includes(',')) {
        // If both are present, decide based on currency or position
        const lastDot = cleanedStr.lastIndexOf('.');
        const lastComma = cleanedStr.lastIndexOf(',');
        
        if (commaDecimalCurrencies.includes(currency) || lastComma > lastDot) {
            // Comma is the decimal separator (European format)
            value = parseFloat(cleanedStr.replace(/\./g, '').replace(',', '.'));
        } else {
            // Period is the decimal separator (US/UK format)
            value = parseFloat(cleanedStr.replace(/,/g, ''));
        }
    } else if (cleanedStr.includes(',')) {
        if (commaDecimalCurrencies.includes(currency) || 
            // If the number of digits after comma matches the expected decimal places
            // for the currency, it's likely a decimal separator
            (cleanedStr.split(',')[1]?.length <= decimalPlaces)) {
            // Comma is the decimal separator
            value = parseFloat(cleanedStr.replace(',', '.'));
        } else {
            // Comma is a thousands separator
            value = parseFloat(cleanedStr.replace(/,/g, ''));
        }
    } else {
        // Standard format or just period as decimal separator
        value = parseFloat(cleanedStr);
    }
    
    return isNaN(value) ? 0 : value;
}

document.addEventListener('mouseup', () => {
    var selection = window.getSelection();
    var selectedText = selection.toString().trim();
    
    if (!stringIsNullOrEmpty(selectedText) && isNumeric(selectedText)) {
        chrome.storage.local.get(['sourceCurrency', 'targetCurrency'], function(items) {
            const convertFrom = items.sourceCurrency || 'USD';
            const convertTo = items.targetCurrency || 'INR';
            
            // Process the selected text based on the source currency format
            const numericValue = extractNumericValue(selectedText, convertFrom);
            
            const api_url = `https://api.exchangerate-api.com/v4/latest/${convertFrom}`;
            
            fetch(api_url)
                .then(response => response.json())
                .then(data => {
                    const calculatedAmount = data.rates[convertTo] * numericValue;
                    showPopup(selection, numericValue, calculatedAmount, convertFrom, convertTo);
                })
                .catch(error => {
                    console.error('Currency conversion error:', error);
                    // Show fallback popup with error message
                    const errorPopup = document.createElement('div');
                    errorPopup.id = 'myPopup';
                    errorPopup.style.position = 'absolute';
                    errorPopup.style.background = '#fff0f0';
                    errorPopup.style.color = '#d32f2f';
                    errorPopup.style.border = '1px solid #ffcdd2';
                    errorPopup.style.fontSize = '13px';
                    errorPopup.style.padding = '8px 12px';
                    errorPopup.style.zIndex = 10000;
                    errorPopup.style.boxShadow = '0 2px 4px rgba(0,0,0,0.2)';
                    errorPopup.style.borderRadius = '4px';
                    
                    errorPopup.innerText = 'Unable to convert currency. Please try again later.';
                    
                    const range = selection.getRangeAt(0);
                    const rect = range.getBoundingClientRect();
                    
                    errorPopup.style.left = `${rect.left}px`;
                    errorPopup.style.top = `${rect.top - 40}px`;
                    
                    document.body.appendChild(errorPopup);
                    
                    setTimeout(() => {
                        if (errorPopup.parentNode) {
                            errorPopup.remove();
                        }
                    }, 3000);
                });
        });
    }
});

// Handle dark mode detection for the popup
document.addEventListener('mouseup', function() {
    const popup = document.getElementById('myPopup');
    if (popup) {
        // Check if page is in dark mode using computed background color of body
        const bodyBgColor = window.getComputedStyle(document.body).backgroundColor;
        const rgb = bodyBgColor.match(/\d+/g);
        
        if (rgb) {
            const brightness = (parseInt(rgb[0]) * 299 + parseInt(rgb[1]) * 587 + parseInt(rgb[2]) * 114) / 1000;
            
            if (brightness < 128) { // Dark background
                popup.style.background = '#333';
                popup.style.color = '#fff';
                popup.style.border = '1px solid #555';
                // Update any other elements inside popup that might need color adjustment
                const subtext = popup.querySelector('div:nth-child(2)');
                if (subtext) {
                    subtext.style.color = '#aaa';
                }
            }
        }
    }
});

// Listen for dark mode changes
window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
    const popup = document.getElementById('myPopup');
    if (popup) {
        if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
            popup.style.background = '#333';
            popup.style.color = '#fff';
            popup.style.border = '1px solid #555';
            const subtext = popup.querySelector('div:nth-child(2)');
            if (subtext) {
                subtext.style.color = '#aaa';
            }
        } else {
            popup.style.background = 'white';
            popup.style.color = '#333';
            popup.style.border = '1px solid #ccc';
            const subtext = popup.querySelector('div:nth-child(2)');
            if (subtext) {
                subtext.style.color = '#666';
            }
        }
    }
});