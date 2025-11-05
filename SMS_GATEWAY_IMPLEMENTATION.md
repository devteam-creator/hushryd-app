# SMS Gateway Implementation

## Overview
Complete SMS Gateway API integration for the HushRyd admin dashboard with support for multiple SMS providers, balance tracking, and usage statistics.

## Backend Implementation

### Database Tables
- **`sms_gateway_settings`**: Stores SMS gateway configuration (provider, API keys, sender ID)
- **`sms_logs`**: Tracks all SMS sent with status, delivery information, and error messages

### API Endpoints

#### 1. Get SMS Gateway Settings
- **Endpoint:** `GET /api/sms-gateway/settings`
- **Access:** Super Admin only
- **Response:**
```json
{
  "error": false,
  "message": "SMS gateway settings retrieved successfully",
  "data": {
    "configured": true,
    "provider": "twilio",
    "senderId": "HUSHRYD",
    "apiKeyHidden": "AC123456****"
  }
}
```

#### 2. Update SMS Gateway Settings
- **Endpoint:** `POST /api/sms-gateway/settings`
- **Access:** Super Admin only
- **Body:**
```json
{
  "provider": "twilio",
  "apiKey": "your-api-key",
  "apiSecret": "your-api-secret",
  "senderId": "HUSHRYD"
}
```

#### 3. Get SMS Balance
- **Endpoint:** `GET /api/sms-gateway/balance`
- **Access:** Super Admin, Admin
- **Response:**
```json
{
  "error": false,
  "message": "SMS balance retrieved successfully",
  "data": {
    "configured": true,
    "provider": "twilio",
    "senderId": "HUSHRYD",
    "balance": 50.75,
    "currency": "USD",
    "accountStatus": "active",
    "lastChecked": "2025-01-26T12:00:00.000Z"
  }
}
```

#### 4. Get SMS Usage Statistics
- **Endpoint:** `GET /api/sms-gateway/usage?startDate=2025-01-01&endDate=2025-01-31`
- **Access:** Super Admin, Admin
- **Response:**
```json
{
  "error": false,
  "message": "SMS usage statistics retrieved successfully",
  "data": {
    "summary": {
      "total_sent": 1250,
      "successful": 1200,
      "failed": 50
    },
    "dailyUsage": [
      {
        "date": "2025-01-26",
        "total_sent": 45,
        "successful": 43,
        "failed": 2
      }
    ],
    "period": {
      "startDate": "2025-01-01",
      "endDate": "2025-01-31"
    }
  }
}
```

#### 5. Send Test SMS
- **Endpoint:** `POST /api/sms-gateway/test`
- **Access:** Super Admin only
- **Body:**
```json
{
  "mobileNumber": "9876543210"
}
```

### Supported SMS Providers

1. **Twilio** (`twilio`)
   - Provides global SMS delivery
   - Balance shown in USD
   - Requires Account SID and Auth Token

2. **MSG91** (`msg91`)
   - Popular in India
   - Balance shown in INR
   - Requires Auth Key

3. **TextLocal** (`textlocal`)
   - India-focused provider
   - Balance shown in INR
   - Requires API Key

### Frontend API Service Methods

Added to `hushryd-frontend/services/apiService.ts`:

```typescript
// Get SMS gateway settings
public async getSmsGatewaySettings(token: string): Promise<ApiResponse>

// Update SMS gateway settings
public async updateSmsGatewaySettings(settings: any, token: string): Promise<ApiResponse>

// Get SMS balance
public async getSmsBalance(token: string): Promise<ApiResponse>

// Get SMS usage statistics
public async getSmsUsage(token: string, startDate?: string, endDate?: string): Promise<ApiResponse>

// Send test SMS
public async sendTestSms(mobileNumber: string, token: string): Promise<ApiResponse>
```

## How to Use

### 1. Run Database Migration
```bash
node hushryd-backend/database/create-sms-gateway-tables.js
```

### 2. Start Backend Server
```bash
cd hushryd-backend
npm start
```

### 3. Configure SMS Gateway (from admin dashboard)
- Login as Super Admin
- Navigate to Settings > SMS Gateway
- Enter:
  - Provider (Twilio, MSG91, or TextLocal)
  - API Key
  - API Secret (for Twilio)
  - Sender ID
- Click "Save Settings"

### 4. Check Balance and Usage
- View SMS balance in real-time
- Monitor usage statistics
- Track successful/failed SMS

## Features

✅ Multiple SMS Provider Support  
✅ Real-time Balance Checking  
✅ Usage Statistics and Analytics  
✅ SMS Logging and Tracking  
✅ Test SMS Functionality  
✅ Secure API Key Management  
✅ Admin Dashboard Integration  

## Next Steps

To integrate the SMS gateway in the admin dashboard frontend:
1. Create the SMS Gateway settings page in `app/admin/sms-gateway.tsx`
2. Display balance and usage widgets
3. Add test SMS functionality
4. Show usage charts and statistics
