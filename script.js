document.getElementById('convertFrom').addEventListener('change', function(){
    const selectElement = document.getElementById('convertFrom');
    chrome.storage.local.set({ sourceCurrency: selectElement.value });
});

document.getElementById('convertTo').addEventListener('change', function(){
    const selectElement = document.getElementById('convertTo');
    chrome.storage.local.set({ targetCurrency: selectElement.value });
});

window.addEventListener('load', function () {
    chrome.storage.local.get(['sourceCurrency', 'targetCurrency'], function (items) {
        const sourceSelectElement = document.getElementById('convertFrom');
        const targetSelectElement = document.getElementById('convertTo');

        sourceSelectElement.value = items.sourceCurrency || 'USD';
        targetSelectElement = items.targetCurrency || 'INR';
    });
});