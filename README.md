# DataHub - Airtel Monthly Data Plans

A modern, responsive web application for purchasing Airtel monthly data plans using M-Pesa payment via Payhero integration.

## Features

- **Plan Selection**: Choose from multiple data plans (1GB, 5GB, 10GB, 25GB)
- **Phone Validation**: Automatic validation of Airtel and Safaricom phone numbers
- **Real M-Pesa Payment**: Integration with Payhero for actual STK push payments
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices
- **Modern UI**: Beautiful gradient design with smooth animations
- **Order Tracking**: Transaction history and order confirmation

## How It Works

1. **Select Plan**: Users browse and select their desired data plan
2. **Enter Details**: Provide Airtel number (data recipient) and Safaricom number (payment)
3. **Confirm Order**: Review order details and confirm payment
4. **STK Push**: Real M-Pesa STK push sent to Safaricom number
5. **Payment Confirmation**: User enters PIN and payment is processed
6. **Data Activation**: Automatic confirmation and transaction ID generation

## File Structure

```
├── index.html          # Main HTML structure
├── styles.css          # Styling and responsive design
├── script.js           # JavaScript functionality
├── server.js           # Backend server with Payhero integration
├── package.json        # Node.js dependencies
├── .env.example        # Environment variables template
└── README.md           # Documentation
```

## Setup Instructions

### Prerequisites
- Node.js 14+ installed
- Payhero account with API credentials
- Git (optional)

### Backend Setup

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Configure Environment**:
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` file with your Payhero credentials:
   ```
   PAYHERO_CHANNEL_ID=your_actual_channel_id
   PAYHERO_CREDENTIALS=your_actual_base64_credentials
   ```

3. **Start Backend Server**:
   ```bash
   # For development
   npm run dev
   
   # For production
   npm start
   ```

### Frontend Setup

1. **Open in Browser**: Open `index.html` in any modern web browser
2. **Or serve with HTTP server**:
   ```bash
   # Using Python
   python -m http.server 8000
   
   # Using Node.js
   npx serve .
   ```

## Payhero Integration

The backend integrates with Payhero for M-Pesa STK push payments:

### Required Payhero Credentials
- **Channel ID**: Your Payhero channel identifier
- **Credentials**: Base64 encoded `username:password` from Payhero

### API Endpoints
- `POST /stk-push` - Initiates M-Pesa STK push
- `GET /health` - Server health check
- `GET /order-status/:reference` - Check payment status

### Example STK Push Request
```json
{
  "phone": "0712345678",
  "amount": 299
}
```

## Technical Implementation

### Frontend Technologies
- **HTML5**: Semantic markup with proper structure
- **CSS3**: Modern styling with gradients, animations, and flexbox/grid
- **Vanilla JavaScript**: No framework dependencies, pure JS implementation

### Backend Technologies
- **Node.js**: Server runtime
- **Express.js**: Web framework
- **Axios**: HTTP client for Payhero API
- **CORS**: Cross-origin resource sharing

### Key Features

#### Phone Number Validation
- Airtel prefixes: 0730, 0731, 0732, 0733, 0734, 0735, 0738, 0739, 0757, 0758, 0759
- Safaricom prefixes: 0700-0709, 0710-0719, 0720-0729, 0740-0747
- Real-time validation with visual feedback

#### Payment Flow
- Real STK push via Payhero API
- Error handling and retry logic
- Payment status tracking
- Transaction ID generation

#### User Experience
- Smooth section transitions
- Loading states and progress indicators
- Error handling and notifications
- Mobile-responsive design

## Security Considerations

- Input validation and sanitization
- Phone number format enforcement
- Environment variable protection
- CORS configuration
- Error handling without information leakage
- Secure API credential management

## Browser Compatibility

- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

## Deployment

### Production Deployment

1. **Environment Setup**:
   ```bash
   export NODE_ENV=production
   export PAYHERO_CHANNEL_ID=your_production_channel_id
   export PAYHERO_CREDENTIALS=your_production_credentials
   ```

2. **Start Server**:
   ```bash
   npm start
   ```

3. **Reverse Proxy**: Use Nginx or similar for production deployments

### Docker Deployment
```dockerfile
FROM node:16-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 3000
CMD ["npm", "start"]
```

## Testing

### Backend Testing
```bash
# Test health endpoint
curl http://localhost:3000/health

# Test STK push
curl -X POST http://localhost:3000/stk-push \
  -H "Content-Type: application/json" \
  -d '{"phone":"0712345678","amount":299}'
```

## Future Enhancements

- Real payment status callbacks from Payhero
- User authentication system
- Order history dashboard
- SMS notifications
- Multiple payment gateways
- Admin panel for order management
- Database integration for order persistence
- Webhook handling for payment confirmations

## Troubleshooting

### Common Issues

1. **STK Push Fails**:
   - Check Payhero credentials
   - Verify phone number format
   - Ensure sufficient funds

2. **CORS Errors**:
   - Backend server must be running
   - Check CORS configuration

3. **Network Issues**:
   - Verify internet connection
   - Check Payhero API status

## License

This project is for demonstration purposes. Please ensure compliance with local regulations and payment provider terms when implementing in production.

## Support

For technical support or questions about the implementation:
1. Check the troubleshooting section
2. Review Payhero documentation
3. Contact the development team
