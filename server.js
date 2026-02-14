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
    const { phone, amount } = req.body;

    // Validate input
    if (!phone || !amount) {
        return res.status(400).json({ 
            success: false,
            message: "Phone number and amount are required" 
        });
    }

    // Validate phone number format (Kenyan)
    if (!/^07[0-9]{8}$/.test(phone)) {
        return res.status(400).json({ 
            success: false,
            message: "Invalid phone number format. Use format: 07XXXXXXXX" 
        });
    }

    // Validate amount
    if (amount <= 0) {
        return res.status(400).json({ 
            success: false,
            message: "Amount must be greater than 0" 
        });
    }

    try {
        const response = await axios.post(
            PAYHERO_CONFIG.baseURL,
            {
                amount: amount,
                phone_number: phone,
                channel_id: PAYHERO_CONFIG.channel_id,
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
    console.error("Unhandled error:", err);
    res.status(500).json({
        success: false,
        message: "Internal server error"
    });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: "Endpoint not found"
    });
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
