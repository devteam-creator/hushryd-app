# Google Maps API Setup Guide

This guide will help you set up Google Maps API for the location autocomplete feature in your HushRyd app.

## Overview

The app uses Google Places Autocomplete API to provide city suggestions when users enter "From" and "To" locations in the search bar. This provides a much better user experience with real city data.

## Features

- **Real-time city autocomplete**: As users type, the app fetches matching cities from Google Places API
- **Fallback support**: If the API key is not configured or there's an error, the app falls back to mock data
- **Responsive UI**: Modal-based dropdown for better mobile experience
- **Debounced requests**: API calls are debounced to reduce unnecessary requests

## Step 1: Get Your Google Maps API Key

### 1.1 Create a Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Sign in with your Google account
3. Click on the project dropdown at the top
4. Click "New Project"
5. Enter a project name (e.g., "HushRyd-App")
6. Click "Create"

### 1.2 Enable Required APIs

1. In the Google Cloud Console, go to "APIs & Services" > "Library"
2. Search for and enable these APIs:
   - **Places API** (for autocomplete)
   - **Geocoding API** (optional, for additional location features)

### 1.3 Create API Credentials

1. Go to "APIs & Services" > "Credentials"
2. Click "Create Credentials" > "API Key"
3. Your API key will be generated
4. **Important**: Click "Restrict Key" to configure restrictions

### 1.4 Configure API Key Restrictions (Recommended)

For security, restrict your API key:

1. **Application restrictions**:
   - For Android: Select "Android apps" and add your package name and SHA-1 fingerprint
   - For iOS: Select "iOS apps" and add your bundle identifier
   - For Web: Select "HTTP referrers" and add your domain

2. **API restrictions**:
   - Select "Restrict key"
   - Check "Places API" and "Geocoding API"

3. Click "Save"

## Step 2: Configure Your API Key in the App

### Option 1: Direct Configuration (Quick Start)

Open `config/maps.ts` and replace the placeholder with your actual API key:

\`\`\`typescript
export const GOOGLE_MAPS_API_KEY = 'YOUR_ACTUAL_API_KEY_HERE';
\`\`\`

### Option 2: Environment Variables (Recommended for Production)

If you plan to commit your code to version control, use environment variables:

1. Install expo-constants if not already installed:
\`\`\`bash
npm install expo-constants
\`\`\`

2. Create `app.config.js` in your project root:
\`\`\`javascript
export default {
  expo: {
    // ... other config
    extra: {
      googleMapsApiKey: process.env.GOOGLE_MAPS_API_KEY || 'YOUR_DEFAULT_KEY'
    }
  }
}
\`\`\`

3. Update `config/maps.ts`:
\`\`\`typescript
import Constants from 'expo-constants';

export const GOOGLE_MAPS_API_KEY = Constants.expoConfig?.extra?.googleMapsApiKey || 'YOUR_GOOGLE_MAPS_API_KEY_HERE';
\`\`\`

4. Set the environment variable before running:
\`\`\`bash
export GOOGLE_MAPS_API_KEY=your_actual_api_key
npm start
\`\`\`

## Step 3: Test the Integration

1. Start your app:
\`\`\`bash
npm start
\`\`\`

2. Navigate to the home screen
3. Click on the "From" or "To" input field
4. Start typing a city name (e.g., "Hyderabad")
5. You should see autocomplete suggestions appear

## Pricing and Quotas

### Google Places API Pricing (as of 2024)

- **Places Autocomplete - Per Session**: $2.83 per 1,000 sessions
- **Places Autocomplete - Per Request**: $0.283 per 1,000 requests

### Free Tier

- Google provides $200 free credit every month
- This covers approximately:
  - 70,000+ autocomplete sessions per month
  - Or 700,000+ individual requests per month

### Cost Optimization

The app implements several cost-saving measures:

1. **Debouncing**: Waits 300ms after user stops typing before making API call
2. **Minimum character requirement**: Only searches after 2+ characters typed
3. **Session-based requests**: Uses session tokens for cost-effective pricing
4. **Fallback to mock data**: Reduces API calls when testing

## Troubleshooting

### Issue: "REQUEST_DENIED" Error

**Solution**: 
- Check that Places API is enabled in Google Cloud Console
- Verify your API key is correct in `config/maps.ts`
- Check API key restrictions aren't too strict

### Issue: No autocomplete suggestions appear

**Solution**:
- Open browser/app console to check for errors
- Verify API key is set correctly
- Check internet connection
- The app will automatically fall back to mock data if there's an issue

### Issue: "Quota exceeded" Error

**Solution**:
- Check your Google Cloud Console quota usage
- Enable billing if you've exceeded free tier
- Implement request caching for frequently searched locations

## Mock Data Fallback

The app includes mock data for major cities in Andhra Pradesh and Telangana:
- Hyderabad
- Vijayawada
- Visakhapatnam
- Warangal
- Guntur
- Nellore
- And more...

This fallback activates automatically if:
- API key is not configured
- API request fails
- Rate limit is exceeded

## Security Best Practices

1. **Never commit API keys to version control**
   - Add `config/maps.ts` to `.gitignore` if it contains your key
   - Use environment variables for production

2. **Restrict your API key**
   - Set application restrictions (package name, bundle ID)
   - Set API restrictions (only enable required APIs)

3. **Monitor usage**
   - Regularly check Google Cloud Console for unusual activity
   - Set up billing alerts

4. **Rotate keys periodically**
   - Create new keys and deprecate old ones every few months

## Additional Resources

- [Google Places API Documentation](https://developers.google.com/maps/documentation/places/web-service)
- [Google Cloud Console](https://console.cloud.google.com/)
- [Places API Pricing](https://developers.google.com/maps/documentation/places/web-service/usage-and-billing)

## Support

If you encounter any issues with the Google Maps integration, please:
1. Check the console logs for error messages
2. Verify your API key setup
3. Ensure all required APIs are enabled
4. Check that you haven't exceeded quota limits

The LocationAutocomplete component is located at `components/LocationAutocomplete.tsx` if you need to customize the behavior.

