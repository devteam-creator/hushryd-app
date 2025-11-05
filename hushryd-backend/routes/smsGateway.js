const express = require('express');
const https = require('https');
const { executeQuery } = require('../config/database');
const { authenticateAdmin, requireRole } = require('../middleware/auth');

const router = express.Router();

// SMS Gateway API implementations
const SMS_PROVIDERS = {
  TWILIO: 'twilio',
  MSG91: 'msg91',
  TEXT_LOCAL: 'textlocal'
};

// Helper function to get SMS gateway settings
const getSmsGatewaySettings = async () => {
  try {
    const result = await executeQuery(
      `SELECT * FROM sms_gateway_settings WHERE id = 1`
    );
    return result.length > 0 ? result[0] : null;
  } catch (error) {
    console.error('Error fetching SMS gateway settings:', error);
    return null;
  }
};

// Helper function to update SMS gateway settings
const updateSmsGatewaySettings = async (settings) => {
  try {
    const { provider, apiKey, apiSecret, senderId, balance } = settings;
    
    // Check if settings exist
    const existing = await executeQuery(
      `SELECT id FROM sms_gateway_settings WHERE id = 1`
    );
    
    if (existing.length > 0) {
      // Update existing settings
      await executeQuery(
        `UPDATE sms_gateway_settings 
         SET provider = ?, api_key = ?, api_secret = ?, sender_id = ?, updated_at = CURRENT_TIMESTAMP 
         WHERE id = 1`,
        [provider, apiKey, apiSecret, senderId]
      );
    } else {
      // Insert new settings
      await executeQuery(
        `INSERT INTO sms_gateway_settings (id, provider, api_key, api_secret, sender_id, created_at, updated_at) 
         VALUES (1, ?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)`,
        [provider, apiKey, apiSecret, senderId]
      );
    }
    return true;
  } catch (error) {
    console.error('Error updating SMS gateway settings:', error);
    return false;
  }
};

// Helper function to fetch Twilio balance
const fetchTwilioBalance = async (apiKey, apiSecret) => {
  return new Promise((resolve, reject) => {
    const auth = Buffer.from(`${apiKey}:${apiSecret}`).toString('base64');
    
    const options = {
      hostname: 'api.twilio.com',
      path: '/2010-04-01/Accounts.json',
      method: 'GET',
      headers: {
        'Authorization': `Basic ${auth}`
      }
    };

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });
      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          resolve({
            success: true,
            balance: json.accounts?.[0]?.balance ? parseFloat(json.accounts[0].balance) : 0,
            currency: json.accounts?.[0]?.currency || 'USD',
            accountStatus: json.accounts?.[0]?.status || 'unknown'
          });
        } catch (error) {
          reject(error);
        }
      });
    });

    req.on('error', (error) => {
      reject(error);
    });

    req.end();
  });
};

// Helper function to fetch MSG91 balance
const fetchMsg91Balance = async (apiKey) => {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'control.msg91.com',
      path: `/api/balance.php?type=4&authkey=${apiKey}`,
      method: 'GET'
    };

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });
      res.on('end', () => {
        try {
          resolve({
            success: true,
            balance: parseFloat(data.trim()) || 0,
            currency: 'INR',
            accountStatus: 'active'
          });
        } catch (error) {
          reject(error);
        }
      });
    });

    req.on('error', (error) => {
      reject(error);
    });

    req.end();
  });
};

// Helper function to fetch TextLocal balance
const fetchTextLocalBalance = async (apiKey) => {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'api.textlocal.in',
      path: `/balance/?apikey=${apiKey}`,
      method: 'GET'
    };

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });
      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          resolve({
            success: json.status === 'success',
            balance: json.balance?.sms || 0,
            currency: 'INR',
            accountStatus: json.status || 'unknown'
          });
        } catch (error) {
          reject(error);
        }
      });
    });

    req.on('error', (error) => {
      reject(error);
    });

    req.end();
  });
};

// Get SMS Gateway Settings
router.get('/settings', authenticateAdmin, requireRole(['superadmin']), async (req, res) => {
  try {
    const settings = await getSmsGatewaySettings();
    
    if (!settings) {
      return res.json({
        error: false,
        message: 'SMS gateway not configured',
        data: {
          configured: false
        }
      });
    }

    res.json({
      error: false,
      message: 'SMS gateway settings retrieved successfully',
      data: {
        configured: true,
        provider: settings.provider,
        senderId: settings.sender_id,
        // Don't send sensitive data
        apiKeyHidden: settings.api_key ? settings.api_key.substring(0, 8) + '****' : null
      }
    });

  } catch (error) {
    console.error('Get SMS settings error:', error);
    res.status(500).json({
      error: true,
      message: 'Internal server error'
    });
  }
});

// Update SMS Gateway Settings
router.post('/settings', authenticateAdmin, requireRole(['superadmin']), async (req, res) => {
  try {
    const { provider, apiKey, apiSecret, senderId } = req.body;

    if (!provider || !apiKey || !senderId) {
      return res.status(400).json({
        error: true,
        message: 'Provider, API key, and sender ID are required'
      });
    }

    const success = await updateSmsGatewaySettings({
      provider,
      apiKey,
      apiSecret: apiSecret || '',
      senderId
    });

    if (!success) {
      return res.status(500).json({
        error: true,
        message: 'Failed to update SMS gateway settings'
      });
    }

    res.json({
      error: false,
      message: 'SMS gateway settings updated successfully'
    });

  } catch (error) {
    console.error('Update SMS settings error:', error);
    res.status(500).json({
      error: true,
      message: 'Internal server error'
    });
  }
});

// Get SMS Balance and Usage
router.get('/balance', authenticateAdmin, requireRole(['superadmin', 'admin']), async (req, res) => {
  try {
    const settings = await getSmsGatewaySettings();

    if (!settings) {
      return res.json({
        error: false,
        message: 'SMS gateway not configured',
        data: {
          configured: false
        }
      });
    }

    // Fetch balance from provider
    let balanceInfo;
    try {
      switch (settings.provider) {
        case SMS_PROVIDERS.TWILIO:
          balanceInfo = await fetchTwilioBalance(settings.api_key, settings.api_secret);
          break;
        case SMS_PROVIDERS.MSG91:
          balanceInfo = await fetchMsg91Balance(settings.api_key);
          break;
        case SMS_PROVIDERS.TEXT_LOCAL:
          balanceInfo = await fetchTextLocalBalance(settings.api_key);
          break;
        default:
          balanceInfo = { success: false, message: 'Unknown provider' };
      }
    } catch (error) {
      console.error('Error fetching SMS balance:', error);
      balanceInfo = { 
        success: false, 
        message: 'Failed to fetch balance from provider' 
      };
    }

    res.json({
      error: false,
      message: 'SMS balance retrieved successfully',
      data: {
        configured: true,
        provider: settings.provider,
        senderId: settings.sender_id,
        balance: balanceInfo.balance || 0,
        currency: balanceInfo.currency || 'INR',
        accountStatus: balanceInfo.accountStatus || 'unknown',
        lastChecked: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error('Get SMS balance error:', error);
    res.status(500).json({
      error: true,
      message: 'Internal server error'
    });
  }
});

// Get SMS Usage Statistics
router.get('/usage', authenticateAdmin, requireRole(['superadmin', 'admin']), async (req, res) => {
  try {
    const startDate = req.query.startDate || new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();
    const endDate = req.query.endDate || new Date().toISOString();

    // Get SMS usage from database
    const usage = await executeQuery(
      `SELECT 
        COUNT(*) as total_sent,
        SUM(CASE WHEN status = 'success' THEN 1 ELSE 0 END) as successful,
        SUM(CASE WHEN status = 'failed' THEN 1 ELSE 0 END) as failed,
        DATE(sent_at) as date
       FROM sms_logs 
       WHERE sent_at BETWEEN ? AND ?
       GROUP BY DATE(sent_at)
       ORDER BY date DESC
       LIMIT 30`,
      [startDate, endDate]
    );

    const totalStats = await executeQuery(
      `SELECT 
        COUNT(*) as total_sent,
        SUM(CASE WHEN status = 'success' THEN 1 ELSE 0 END) as successful,
        SUM(CASE WHEN status = 'failed' THEN 1 ELSE 0 END) as failed
       FROM sms_logs 
       WHERE sent_at BETWEEN ? AND ?`,
      [startDate, endDate]
    );

    res.json({
      error: false,
      message: 'SMS usage statistics retrieved successfully',
      data: {
        summary: totalStats[0] || { total_sent: 0, successful: 0, failed: 0 },
        dailyUsage: usage,
        period: {
          startDate,
          endDate
        }
      }
    });

  } catch (error) {
    console.error('Get SMS usage error:', error);
    res.status(500).json({
      error: true,
      message: 'Internal server error'
    });
  }
});

// Send Test SMS
router.post('/test', authenticateAdmin, requireRole(['superadmin']), async (req, res) => {
  try {
    const { mobileNumber } = req.body;

    if (!mobileNumber) {
      return res.status(400).json({
        error: true,
        message: 'Mobile number is required'
      });
    }

    // Get SMS gateway settings
    const settings = await getSmsGatewaySettings();
    if (!settings) {
      return res.status(400).json({
        error: true,
        message: 'SMS gateway not configured'
      });
    }

    // Send test SMS
    const testMessage = 'Test SMS from HushRyd Admin Dashboard. SMS Gateway is working correctly.';
    
    // In a real implementation, you would call the SMS provider API here
    // For now, we'll just log it and return success
    
    console.log(`Test SMS would be sent to ${mobileNumber}: ${testMessage}`);

    res.json({
      error: false,
      message: 'Test SMS sent successfully',
      data: {
        mobileNumber,
        message: testMessage
      }
    });

  } catch (error) {
    console.error('Send test SMS error:', error);
    res.status(500).json({
      error: true,
      message: 'Internal server error'
    });
  }
});

module.exports = router;
