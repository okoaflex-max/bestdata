const express = require("express");
const axios = require("axios");
const cors = require("cors");
const app = express();

// Middleware
app.use(cors({
    origin: ['http://localhost:8000', 'https://your-app-name.onrender.com'],
    credentials: true
}));
app.use(express.json());
app.use(express.static('public'));

// Payhero API Configuration
const PAYHERO_CONFIG = {
    baseURL: "https://backend.payhero.co.ke/api/v2/payments",
    channel_id: process.env.PAYHERO_CHANNEL_ID || "YOUR_CHANNEL_ID",
    credentials: process.env.PAYHERO_CREDENTIALS || "YOUR_BASE64_ENCODED_CREDENTIALS"
};

// STK Push Endpoint
app.post("/stk-push", async (req, res) => {
    console.log("=== STK Push Request Received ===");
    console.log("Request body:", req.body);
    console.log("Request headers:", req.headers);
    
    const { phone, amount } = req.body;

    console.log("Raw phone:", phone);
    console.log("Amount:", amount);

    // Validate input
    if (!phone || !amount) {
        return res.status(400).json({ 
            success: false,
            message: "Phone number and amount are required" 
        });
    }

    // Validate phone number format (Kenyan) - Accept multiple formats
    const phoneRegex = /^(\+254\s?)?07[0-9]{8}$|^(\+254\s?)?7[0-9]{8}$/;
    if (!phoneRegex.test(phone)) {
        console.log("Phone validation failed for:", phone);
        return res.status(400).json({ 
            success: false,
            message: "Invalid phone number format. Use format: 07XXXXXXXX, +254 7XXXXXXXX, or +254 07XXXXXXXX" 
        });
    }

    // Convert to Payhero expected format (07XXXXXXXX)
    let formattedPhone;
    if (phone.startsWith('+254')) {
        formattedPhone = phone.replace(/\s/g, '').replace('+254', '0');
    } else if (phone.startsWith('254')) {
        formattedPhone = phone.replace('254', '0');
    } else {
        formattedPhone = phone;
    }
    console.log("Formatted phone for Payhero:", formattedPhone);

    // Validate amount
    if (amount <= 0) {
        return res.status(400).json({ 
            success: false,
            message: "Amount must be greater than 0" 
        });
    }

    try {
        console.log("Making Payhero API call...");
        console.log("Channel ID:", PAYHERO_CONFIG.channel_id);
        console.log("Request body:", {
            amount: amount,
            phone_number: formattedPhone,
            channel_id: parseInt(PAYHERO_CONFIG.channel_id),
            external_reference: `DH${Date.now()}`,
            provider: "m-pesa"
        });

        const response = await axios.post(
            PAYHERO_CONFIG.baseURL,
            {
                amount: amount,
                phone_number: formattedPhone,
                channel_id: parseInt(PAYHERO_CONFIG.channel_id),
                external_reference: `DH${Date.now()}`, // Dynamic order reference
                provider: "m-pesa"
            },
            {
                headers: {
                    Authorization: `Basic ${PAYHERO_CONFIG.credentials}`,
                    "Content-Type": "application/json"
                },
                timeout: 30000 // 30 seconds timeout
            }
        );

        console.log("Payhero Response:", response.data);

        res.json({ 
            success: true,
            message: "STK Push sent successfully. Check your phone.",
            data: response.data
        });

    } catch (error) {
        console.error("Payhero API Error:", error.response?.data || error.message);
        
        // Handle different error types
        if (error.response) {
            // Payhero API returned an error
            res.status(error.response.status).json({
                success: false,
                message: error.response.data.message || "Payment processing failed",
                error: error.response.data
            });
        } else if (error.request) {
            // Network error
            res.status(500).json({
                success: false,
                message: "Network error. Please try again.",
                error: "Unable to reach payment provider"
            });
        } else {
            // Other error
            res.status(500).json({
                success: false,
                message: "Internal server error",
                error: error.message
            });
        }
    }
});

// Health check endpoint
app.get("/health", (req, res) => {
    res.json({ 
        status: "OK", 
        timestamp: new Date().toISOString(),
        service: "DataHub Payment Service"
    });
});

// Serve frontend at root
app.get("/", (req, res) => {
    res.sendFile('index.html', { root: 'public' });
});

// Order status endpoint (for checking payment status)
app.get("/order-status/:reference", async (req, res) => {
    const { reference } = req.params;
    
    try {
        // This would typically query Payhero for payment status
        // For now, return a mock response
        res.json({
            success: true,
            reference: reference,
            status: "completed", // pending, completed, failed
            message: "Payment processed successfully"
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Unable to check order status"
        });
    }
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error("=== UNHANDLED ERROR ===");
    console.error("Error:", err);
    console.error("Stack:", err.stack);
    res.status(500).json({
        success: false,
        message: "Internal server error",
        error: err.message
    });
});

// 404 handler - serve frontend for SPA routing
app.use((req, res) => {
    console.log("=== 404 - Route not found ===");
    console.log("Method:", req.method);
    console.log("URL:", req.url);
    res.sendFile('index.html', { root: 'public' });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`🚀 Airtel Payment Server running on port ${PORT}`);
    console.log(`📱 Payhero integration ready`);
    console.log(`🔗 Health check: http://localhost:${PORT}/health`);
    console.log(`💳 STK Push endpoint: http://localhost:${PORT}/stk-push`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
    console.log('SIGTERM received, shutting down gracefully');
    process.exit(0);
});

process.on('SIGINT', () => {
    console.log('SIGINT received, shutting down gracefully');
    process.exit(0);
});
