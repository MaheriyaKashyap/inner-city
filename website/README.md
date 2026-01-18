# Inner City - Website Version

Desktop-optimized web version of Inner City event discovery platform.

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Set environment variables in `.env.local`:
   ```bash
   VITE_TICKETMASTER_API_KEY=your_api_key_here
   ```

3. Run the development server:
   ```bash
   npm run dev
   ```

The app will run on `http://localhost:3001` (different port from mobile app).

## Project Structure

```
website/
  src/
    components/     # Reusable UI components
    screens/        # Page components
    services/       # API integrations (Ticketmaster, etc.)
    types/          # TypeScript type definitions
    utils/          # Utility functions
  public/           # Static assets
```
