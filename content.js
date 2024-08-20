function stringIsNullOrEmpty(str) {
    return str === null || str === '';
}

function showPopup(selection, msg) {
    var popup = document.createElement('div');
    popup.id = 'myPopup';
    popup.style.position = 'absolute';
    popup.style.background = 'white';
    popup.style.color = 'black';
    popup.style.border = '1px solid black';
    popup.style.fontSize = '13px';
    popup.style.padding = '5px';
    popup.style.zIndex = 10000;
    popup.style.boxShadow = '0px 0px 10px rgba(0,0,0,0.5)';

    popup.innerText = msg;

    var range = selection.getRangeAt(0);
    var rect = range.getBoundingClientRect();

    popup.style.left = `${rect.left}px`;
    popup.style.top = `${rect.top - 30}px`;

    document.body.appendChild(popup);
}


document.addEventListener('mouseup', () => {
    // remove existing popup    
    const existingPopup = document.getElementById('myPopup');
    if (existingPopup) {
        existingPopup.remove();
    }

    var selection = window.getSelection();
    var selectedText = selection.toString().trim();

    if (!stringIsNullOrEmpty(selectedText)) {
        chrome.storage.local.get(['sourceCurrency', 'targetCurrency'], function(items){
            const convertFrom = items.sourceCurrency || 'USD';
            const convertTo=items.targetCurrency || 'INR';

            const api_url = `https://api.exchangerate-api.com/v4/latest/${convertFrom}`;
    
            fetch(api_url)
                .then(response => response.json())
                .then(data => {
                    const calculatedAmount = data.rates[convertTo] * selectedText;
                    const msg = convertTo + ' ' + Math.round(calculatedAmount);
                    showPopup(selection, msg);
                });
        });
    }
});
