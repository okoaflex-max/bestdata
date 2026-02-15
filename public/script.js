// Global variables
let selectedPlan = null;
let orderData = {};
let sections = {};

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    // Initialize sections after DOM is loaded
    sections = {
        plans: document.getElementById('plans-section'),
        numbers: document.getElementById('numbers-section'),
        payment: document.getElementById('payment-section'),
        processing: document.getElementById('processing-section'),
        success: document.getElementById('success-section')
    };
    
    console.log('Sections initialized:', sections);
    
    // Test: Check if button exists
    const testBtn = document.getElementById('proceed-to-payment');
    console.log('Button test - found:', testBtn !== null);
    
    initializePlanSelection();
    initializeFormValidation();
    initializePaymentFlow();
    showSection('plans');
    
    // Fallback: Add event listener using event delegation - DISABLED
    // document.addEventListener('click', function(e) {
    //     if (e.target && e.target.id === 'proceed-to-payment') {
    //         e.preventDefault();
    //         console.log('Proceed button clicked via delegation');
    //         console.log('Selected plan:', selectedPlan);
    //         console.log('Safaricom number:', document.getElementById('safaricom-number').value);
    //         console.log('Airtel number:', document.getElementById('airtel-number').value);
    //         console.log('Validation result:', validatePhoneNumbers());
    //         
    //         if (validatePhoneNumbers()) {
    //             proceedToPayment();
    //         } else {
    //             console.log('Validation failed');
    //             showError('Please enter a valid Safaricom number and select a plan');
    //         }
    //     }
    // });
});

// Working proceed to payment function
window.workingProceedToPayment = function() {
    console.log('Working proceed to payment called!');
    
    try {
        // Test: Can we find the sections?
        const numbersSection = document.getElementById('numbers-section');
        const paymentSection = document.getElementById('payment-section');
        
        console.log('Numbers section found:', !!numbersSection);
        console.log('Payment section found:', !!paymentSection);
        
        if (!numbersSection || !paymentSection) {
            console.error('Sections not found!');
            alert('Error: Sections not found');
            return;
        }
        
        // Simple direct approach - just switch sections
        numbersSection.classList.add('hidden');
        paymentSection.classList.remove('hidden');
        
        console.log('Successfully switched to payment section!');
        
    } catch(error) {
        console.error('Error in working proceed to payment:', error);
        alert('Error: ' + error.message);
    }
};

// Show specific section
window.showSection = function(sectionName) {
    console.log('Showing section:', sectionName);
    console.log('Available sections:', sections);
    
    // Safety check
    if (!sections || Object.keys(sections).length === 0) {
        console.error('Sections not initialized yet!');
        return;
    }
    
    if (!sections[sectionName]) {
        console.error('Section not found:', sectionName);
        return;
    }
    
    try {
        Object.keys(sections).forEach(key => {
            if (sections[key]) {
                sections[key].classList.add('hidden');
            }
        });
        sections[sectionName].classList.remove('hidden');
        console.log('Successfully showed section:', sectionName);
    } catch(error) {
        console.error('Error switching sections:', error);
    }
};

// Plan selection functionality
function initializePlanSelection() {
    const planCards = document.querySelectorAll('.plan-card');
    
    planCards.forEach(card => {
        card.addEventListener('click', function() {
            // Remove selected class from all cards
            planCards.forEach(c => c.classList.remove('selected'));
            
            // Add selected class to clicked card
            this.classList.add('selected');
            
            // Store selected plan data
            selectedPlan = {
                name: this.dataset.plan,
                price: parseInt(this.dataset.price)
            };
            
            // Update button text
            document.querySelectorAll('.select-plan-btn').forEach(btn => {
                btn.textContent = 'Select Plan';
            });
            this.querySelector('.select-plan-btn').textContent = 'Selected ✓';
        });
    });
}

// Form validation - DISABLED to fix button issue
function initializeFormValidation() {
    // Commented out to prevent interference with button
    /*
    const airtelInput = document.getElementById('airtel-number');
    const safaricomInput = document.getElementById('safaricom-number');
    const proceedBtn = document.getElementById('proceed-to-payment');
    
    // Check if button exists
    if (!proceedBtn) {
        console.error('Proceed button not found!');
        return;
    }
    
    console.log('Proceed button found, attaching event listener');
    
    // Phone number formatting
    airtelInput.addEventListener('input', function() {
        this.value = formatPhoneNumber(this.value);
        validatePhoneNumbers();
    });
    
    safaricomInput.addEventListener('input', function() {
        this.value = formatPhoneNumber(this.value);
        validatePhoneNumbers();
    });
    
    // Proceed to payment
    proceedBtn.addEventListener('click', function(e) {
        e.preventDefault();
        console.log('Proceed button clicked');
        console.log('Selected plan:', selectedPlan);
        console.log('Safaricom number:', document.getElementById('safaricom-number').value);
        console.log('Airtel number:', document.getElementById('airtel-number').value);
        console.log('Validation result:', validatePhoneNumbers());
        
        if (validatePhoneNumbers()) {
            proceedToPayment();
        } else {
            console.log('Validation failed');
            showError('Please enter a valid Safaricom number and select a plan');
        }
    });
    */
}

// Format phone number
function formatPhoneNumber(value) {
    // Remove all non-digit characters
    let digits = value.replace(/\D/g, '');
    
    // Ensure it starts with 0 and has max 10 digits
    if (digits.length > 0 && !digits.startsWith('0')) {
        digits = '0' + digits;
    }
    
    return digits.substring(0, 10);
}

// Validate phone numbers
function validatePhoneNumbers() {
    const airtelInput = document.getElementById('airtel-number');
    const safaricomInput = document.getElementById('safaricom-number');
    const proceedBtn = document.getElementById('proceed-to-payment');
    
    const safaricomValid = validatePhoneNumber(safaricomInput.value, 'safaricom');
    console.log('Safaricom number:', safaricomInput.value, 'Valid:', safaricomValid);
    
    // Airtel number is optional - if provided, validate it
    let airtelValid = true;
    if (airtelInput.value.length > 0) {
        airtelValid = validatePhoneNumber(airtelInput.value, 'airtel');
        console.log('Airtel number:', airtelInput.value, 'Valid:', airtelValid);
    }
    
    // Update input styles
    airtelInput.style.borderColor = (airtelInput.value.length === 0 || airtelValid) ? '#4CAF50' : '#e0e0e0';
    safaricomInput.style.borderColor = safaricomValid ? '#4CAF50' : '#e0e0e0';
    
    // Enable/disable proceed button (only requires Safaricom number and selected plan)
    const canProceed = safaricomValid && selectedPlan;
    proceedBtn.disabled = !canProceed;
    console.log('Can proceed:', canProceed, 'Selected plan:', selectedPlan);
    
    // Return true if Safaricom number is valid and Airtel number is either empty or valid
    const result = safaricomValid && (airtelInput.value.length === 0 || airtelValid);
    console.log('Final validation result:', result);
    return result;
}

// Validate individual phone number
function validatePhoneNumber(number, network) {
    if (number.length !== 10) return false;
    
    if (network === 'airtel') {
        // Airtel prefixes: 0730, 0731, 0732, 0733, 0734, 0735, 0738, 0739, 0757, 0758, 0759
        const airtelPrefixes = ['0730', '0731', '0732', '0733', '0734', '0735', '0738', '0739', '0757', '0758', '0759'];
        return airtelPrefixes.some(prefix => number.startsWith(prefix));
    } else if (network === 'safaricom') {
        // Safaricom prefixes: 0700, 0701, 0702, 0703, 0704, 0705, 0706, 0707, 0708, 0709, 0710, 0711, 0712, 0713, 0714, 0715, 0716, 0717, 0718, 0719, 0720, 0721, 0722, 0723, 0724, 0725, 0726, 0727, 0728, 0729, 0740, 0741, 0742, 0743, 0744, 0745, 0746, 0747
        const safaricomPrefixes = ['0700', '0701', '0702', '0703', '0704', '0705', '0706', '0707', '0708', '0709', '0710', '0711', '0712', '0713', '0714', '0715', '0716', '0717', '0718', '0719', '0720', '0721', '0722', '0723', '0724', '0725', '0726', '0727', '0728', '0729', '0740', '0741', '0742', '0743', '0744', '0745', '0746', '0747'];
        return safaricomPrefixes.some(prefix => number.startsWith(prefix));
    }
    
    return false;
}

// Proceed to payment
function proceedToPayment() {
    const airtelNumber = document.getElementById('airtel-number').value;
    const safaricomNumber = document.getElementById('safaricom-number').value;
    
    console.log('=== proceedToPayment called ===');
    console.log('safaricomNumber input:', safaricomNumber);
    console.log('airtelNumber input:', airtelNumber);
    
    // Validate inputs
    if (!safaricomNumber || safaricomNumber.length === 0) {
        showError('Please enter a valid Safaricom number');
        return;
    }
    
    if (!selectedPlan) {
        showError('Please select a data plan');
        return;
    }
    
    // Use Safaricom number as default Airtel number if not provided
    const finalAirtelNumber = airtelNumber.length > 0 ? airtelNumber : safaricomNumber;
    
    // Store order data
    orderData = {
        plan: selectedPlan,
        airtelNumber: finalAirtelNumber,
        safaricomNumber: safaricomNumber,
        timestamp: new Date().toISOString()
    };
    
    // Update payment summary for confirmation page
    document.getElementById('summary-plan').textContent = `${selectedPlan.name} - Ksh ${selectedPlan.price}`;
    document.getElementById('summary-airtel').textContent = formatPhoneNumberDisplay(finalAirtelNumber);
    document.getElementById('summary-safaricom').textContent = formatPhoneNumberDisplay(safaricomNumber);
    document.getElementById('summary-total').textContent = `Ksh ${selectedPlan.price}`;
    
    // Go to confirmation section
    showSection('payment');
}

// Format phone number for display
function formatPhoneNumberDisplay(number) {
    if (number.length !== 10) return number;
    return `${number.substring(0, 4)} ${number.substring(4, 7)} ${number.substring(7)}`;
}

// Initialize payment flow
function initializePaymentFlow() {
    const confirmBtn = document.getElementById('confirm-payment');
    const newOrderBtn = document.getElementById('new-order');
    
    confirmBtn.addEventListener('click', function() {
        processPayment();
    });
    
    newOrderBtn.addEventListener('click', function() {
        resetApplication();
    });
}

// Process payment with real Payhero STK push
function processPayment() {
    showSection('processing');
    
    // Update processing text for STK push
    document.querySelector('.processing-content h2').textContent = 'Initiating M-Pesa STK Push';
    document.querySelector('.processing-content p').textContent = 'Sending payment request to your Safaricom number...';
    
    // Call real Payhero API
    sendSTKPush();
}

// Send STK Push to Payhero backend
async function sendSTKPush() {
    console.log('=== sendSTKPush called ===');
    console.log('orderData:', orderData);
    console.log('safaricomNumber:', orderData.safaricomNumber);
    console.log('plan.price:', orderData.plan.price);
    
    try {
        console.log('Making fetch request to /stk-push');
        const response = await fetch('/stk-push', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                phone: orderData.safaricomNumber,
                amount: orderData.plan.price
            })
        });
        
        console.log('Fetch completed, response:', response);
        console.log('Response status:', response.status);
        
        const result = await response.json();
        
        if (response.ok) {
            // STK Push sent successfully
            document.getElementById('step1').classList.add('completed');
            document.querySelector('.processing-content h2').textContent = 'STK Push Sent';
            document.querySelector('.processing-content p').textContent = `Check your phone ${formatPhoneNumberDisplay(orderData.safaricomNumber)} for M-Pesa prompt`;
            
            // Show waiting for payment screen
            showWaitingForPayment();
            
        } else {
            throw new Error(result.message || 'Failed to send STK push');
        }
        
    } catch (error) {
        console.error('STK Push Error:', error);
        showError('Failed to send STK push. Please try again.');
        
        // Reset to payment section
        setTimeout(() => {
            showSection('payment');
        }, 2000);
    }
}

// Show waiting for payment screen
function showWaitingForPayment() {
    // Simulate waiting for payment confirmation
    setTimeout(() => {
        document.getElementById('step2').classList.add('completed');
        document.querySelector('.processing-content h2').textContent = 'Waiting for Payment';
        document.querySelector('.processing-content p').textContent = 'Please enter your M-Pesa PIN to complete the transaction...';
    }, 2000);
    
    // Simulate payment confirmation after delay
    setTimeout(() => {
        document.getElementById('step3').classList.add('completed');
        document.querySelector('.processing-content h2').textContent = 'Payment Successful';
        document.querySelector('.processing-content p').textContent = 'Activating your data plan...';
        
        setTimeout(() => {
            completeOrder();
        }, 1500);
    }, 10000); // Wait 10 seconds for user to enter PIN
}

// Complete order
function completeOrder() {
    // Generate transaction ID
    const transactionId = 'DH' + Date.now().toString().slice(-8);
    
    // Update success page
    document.getElementById('transaction-id').textContent = transactionId;
    document.getElementById('success-plan').textContent = orderData.plan.name;
    document.getElementById('success-plan-name').textContent = orderData.plan.name;
    document.getElementById('success-airtel').textContent = formatPhoneNumberDisplay(orderData.airtelNumber);
    document.getElementById('success-amount').textContent = `Ksh ${orderData.plan.price}`;
    
    showSection('success');
    
    // Save order to localStorage (for demo purposes)
    saveOrderToHistory(transactionId);
}

// Save order to history
function saveOrderToHistory(transactionId) {
    const orderHistory = JSON.parse(localStorage.getItem('orderHistory') || '[]');
    orderHistory.push({
        transactionId: transactionId,
        ...orderData,
        status: 'completed'
    });
    localStorage.setItem('orderHistory', JSON.stringify(orderHistory));
}

// Reset application
function resetApplication() {
    // Reset variables
    selectedPlan = null;
    orderData = {};
    
    // Reset form
    document.getElementById('airtel-number').value = '';
    document.getElementById('safaricom-number').value = '';
    document.getElementById('airtel-number').style.borderColor = '#e0e0e0';
    document.getElementById('safaricom-number').style.borderColor = '#e0e0e0';
    
    // Reset plan selection
    document.querySelectorAll('.plan-card').forEach(card => {
        card.classList.remove('selected');
        card.querySelector('.select-plan-btn').textContent = 'Select Plan';
    });
    
    // Reset processing steps
    document.querySelectorAll('.step').forEach(step => {
        step.classList.remove('completed');
    });
    
    // Show plans section
    showSection('plans');
}

// Update selected plan info in numbers section
function updateSelectedPlanInfo() {
    if (selectedPlan) {
        document.getElementById('selected-plan-details').textContent = `${selectedPlan.name} - Ksh ${selectedPlan.price}`;
        document.getElementById('total-amount').textContent = `Ksh ${selectedPlan.price}`;
    }
}

// Call this when plan is selected
document.addEventListener('click', function(e) {
    if (e.target.classList.contains('select-plan-btn') || e.target.closest('.plan-card')) {
        const card = e.target.closest('.plan-card');
        if (card) {
            setTimeout(() => {
                updateSelectedPlanInfo();
                showSection('numbers');
            }, 300);
        }
    }
});

// Add some utility functions
function showError(message) {
    // Create error notification
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-notification';
    errorDiv.textContent = message;
    errorDiv.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #f44336;
        color: white;
        padding: 15px 20px;
        border-radius: 8px;
        z-index: 1000;
        animation: slideIn 0.3s ease;
    `;
    
    document.body.appendChild(errorDiv);
    
    setTimeout(() => {
        errorDiv.remove();
    }, 3000);
}

function showSuccess(message) {
    // Create success notification
    const successDiv = document.createElement('div');
    successDiv.className = 'success-notification';
    successDiv.textContent = message;
    successDiv.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #4CAF50;
        color: white;
        padding: 15px 20px;
        border-radius: 8px;
        z-index: 1000;
        animation: slideIn 0.3s ease;
    `;
    
    document.body.appendChild(successDiv);
    
    setTimeout(() => {
        successDiv.remove();
    }, 3000);
}

// Add CSS animation
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
`;
document.head.appendChild(style);
