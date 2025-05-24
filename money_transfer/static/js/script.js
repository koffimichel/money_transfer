document.addEventListener('DOMContentLoaded', function() {
    const calculateBtn = document.getElementById('calculate-btn');
    const proceedBtn = document.getElementById('proceed-btn');
    const cancelBtn = document.getElementById('cancel-btn');
    const amountInput = document.getElementById('amount');
    const resultsContainer = document.getElementById('results');
    const messageBox = document.getElementById('message');
    
    // Calculate transfer
    calculateBtn.addEventListener('click', function() {
        const amount = amountInput.value.trim();
        
        if (!amount || isNaN(amount) || parseFloat(amount) <= 0) {
            showMessage('Please enter a valid amount', 'error');
            return;
        }
        
        fetch('/calculate', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: `amount=${amount}`
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                document.getElementById('total-amount').textContent = data.amount_plus_fees;
                document.getElementById('receiving-amount').textContent = data.receiving_amount;
                resultsContainer.classList.remove('hidden');
                messageBox.classList.add('hidden');
            } else {
                showMessage(data.message, 'error');
            }
        })
        .catch(error => {
            showMessage('An error occurred. Please try again.', 'error');
            console.error('Error:', error);
        });
    });
    
    // Proceed with payment
    proceedBtn.addEventListener('click', function() {
        processAction('yes');
    });
    
    // Cancel payment
    cancelBtn.addEventListener('click', function() {
        processAction('no');
    });
    
    function processAction(action) {
        fetch('/proceed', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: `action=${action}`
        })
        .then(response => response.json())
        .then(data => {
            showMessage(data.message, action === 'yes' ? 'success' : 'error');
            resultsContainer.classList.add('hidden');
            
            if (action === 'yes') {
                amountInput.value = '';
            }
        })
        .catch(error => {
            showMessage('An error occurred. Please try again.', 'error');
            console.error('Error:', error);
        });
    }
    
    function showMessage(message, type) {
        messageBox.textContent = message;
        messageBox.className = 'message-box';
        messageBox.classList.add(type);
        messageBox.classList.remove('hidden');
    }
});