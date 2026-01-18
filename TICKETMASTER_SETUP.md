# Ticketmaster API Key Setup

## How to Get Your Ticketmaster API Key

1. **Visit the Ticketmaster Developer Portal**
   - Go to: https://developer.ticketmaster.com/
   - Click "Login" or "Sign Up" in the top right

2. **Create an Account**
   - Sign up for a free developer account
   - Verify your email address

3. **Get Your API Key**
   - Once logged in, navigate to "My Apps" or "API Keys"
   - Click "Create New App" or "Get API Key"
   - Fill in the application details:
     - **App Name**: "Inner City"
     - **Description**: "Event discovery app"
     - **Website URL**: `https://copy-of-inner-city.vercel.app`
     - **Redirect URL 1** (if required): `https://copy-of-inner-city.vercel.app`
     - **Redirect URL 2** (if required): `http://localhost:3000` (for local development)
   - Accept the terms and conditions
   - Your API key will be displayed
   
   **Note**: The Discovery API doesn't actually use OAuth redirect URLs, but the portal may still ask for them. Use your production URL if required.

4. **API Key Details**
   - **Rate Limits**: 5,000 API calls per day, 5 requests per second
   - **Free Tier**: Yes, the Discovery API is free to use
   - **Documentation**: https://developer.ticketmaster.com/products-and-docs/apis/discovery-api/v2/

## Setting Up the API Key

### Important: Which Key to Use

- **Consumer Key** = Your API Key (use this for Discovery API)
- **Consumer Secret** = Used for OAuth flows (not needed for Discovery API)

### Local Development

1. Create a `.env.local` file in the root directory:
   ```
   VITE_TICKETMASTER_API_KEY=KQn9TlNEODUds0G80guxp9SAHnYF9jYg
   ```

2. Restart your dev server after adding the key

### Vercel Deployment

1. Go to your Vercel project settings
2. Navigate to "Environment Variables"
3. Add a new variable:
   - **Name**: `VITE_TICKETMASTER_API_KEY`
   - **Value**: Your API key
   - **Environment**: Production, Preview, Development (select all)
4. Redeploy your application

## Testing the Integration

1. Start the app: `npm run dev`
2. Go to Settings screen
3. Click "Ticketmaster Relay" to connect
4. Events should appear in your feed

## Troubleshooting

- **401 Error**: Invalid API key - check that your key is correct
- **No events**: Check that your city is supported and has events
- **Rate limit**: You've exceeded 5,000 requests/day - wait 24 hours or upgrade
