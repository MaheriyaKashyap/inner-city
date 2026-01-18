# Inner City - Underground Event Discovery App

<div align="center">
  <h3>Discover warehouse raves, underground parties, and exclusive events in your city</h3>
  <p>Built with React, TypeScript, Vite, and Supabase</p>
</div>

## 🌟 Features

- **Event Discovery**: Find events from Ticketmaster and Eventbrite
- **City-Based**: Switch between cities to discover local events
- **Interest-Based Ranking**: Events are ranked by your interests
- **Map View**: Visualize events on an interactive map with clustering
- **User Profiles**: Create and manage your profile with Supabase Auth
- **Saved Events**: Save your favorite events
- **Real-time Chat**: Chat with attendees before events
- **Neural Keys**: Secure digital tickets with QR codes
- **Dark Theme**: Beautiful dark UI with multiple theme options

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Supabase account (for backend)
- Vercel account (for deployment)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/YOUR_USERNAME/inner-city.git
   cd inner-city
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   
   Create a `.env.local` file in the root directory:
   ```env
   # Supabase (Required)
   VITE_SUPABASE_URL=https://your-project.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-key

   # Optional API Keys
   VITE_TICKETMASTER_API_KEY=your-ticketmaster-key
   VITE_MAPBOX_ACCESS_TOKEN=your-mapbox-token
   VITE_EVENTBRITE_API_TOKEN=your-eventbrite-token
   ```

4. **Set up Supabase**
   
   Follow the detailed guide in [`SUPABASE_SETUP.md`](./SUPABASE_SETUP.md):
   - Create a Supabase project
   - Run the database migration (`supabase/migrations/001_initial_schema.sql`)
   - Deploy Edge Functions (`ticketmaster-proxy` and `eventbrite-proxy`)
   - Set Edge Function secrets (TICKETMASTER_API_KEY, EVENTBRITE_API_TOKEN)

5. **Run the app**
   ```bash
   npm run dev
   ```

   Open [http://localhost:5173](http://localhost:5173) in your browser.

## 📁 Project Structure

```
inner-city/
├── components/          # Reusable UI components
├── screens/            # Screen components (Feed, Profile, etc.)
├── services/           # API services (Ticketmaster, Eventbrite)
├── lib/                # Utilities (Supabase client)
├── supabase/
│   ├── functions/      # Edge Functions (API proxies)
│   └── migrations/     # Database migrations
├── scripts/            # Utility scripts
└── types.ts           # TypeScript type definitions
```

## 🛠️ Tech Stack

- **Frontend**: React 19, TypeScript, Vite
- **Styling**: Tailwind CSS v4
- **Animations**: Framer Motion
- **Maps**: Mapbox GL
- **Backend**: Supabase (PostgreSQL, Auth, Edge Functions)
- **Deployment**: Vercel
- **Routing**: React Router DOM

## 📚 Documentation

- [`SUPABASE_SETUP.md`](./SUPABASE_SETUP.md) - Complete Supabase setup guide
- [`SUPABASE_QUICKSTART.md`](./SUPABASE_QUICKSTART.md) - Quick 3-step setup
- [`TICKETMASTER_SETUP.md`](./TICKETMASTER_SETUP.md) - Ticketmaster API setup
- [`EVENTBRITE_SETUP.md`](./EVENTBRITE_SETUP.md) - Eventbrite API setup
- [`EVENT_CURATION_GUIDE.md`](./EVENT_CURATION_GUIDE.md) - How event curation works
- [`ARCHITECTURE.md`](./ARCHITECTURE.md) - System architecture overview

## 🚢 Deployment

### Vercel (Recommended)

1. **Connect GitHub repository**
   - Push your code to GitHub
   - Import project in Vercel dashboard
   - Vercel will auto-detect Vite settings

2. **Set environment variables in Vercel**
   - Go to Project Settings → Environment Variables
   - Add all variables from `.env.local`
   - Deploy to Production, Preview, and Development

3. **Auto-deployments**
   - Every push to `main` triggers a production deployment
   - Pull requests get preview deployments

### Manual Deployment

```bash
npm run build
vercel --prod
```

## 🔐 Environment Variables

### Required
- `VITE_SUPABASE_URL` - Your Supabase project URL
- `VITE_SUPABASE_ANON_KEY` - Your Supabase anon/public key

### Optional
- `VITE_TICKETMASTER_API_KEY` - Ticketmaster Discovery API key
- `VITE_MAPBOX_ACCESS_TOKEN` - Mapbox access token
- `VITE_EVENTBRITE_API_TOKEN` - Eventbrite API token

### Supabase Edge Function Secrets
Set these in Supabase Dashboard → Edge Functions → Settings:
- `TICKETMASTER_API_KEY` - For ticketmaster-proxy function
- `EVENTBRITE_API_TOKEN` - For eventbrite-proxy function

## 🧪 Development

```bash
# Start dev server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Test Edge Functions
node scripts/test-edge-functions.mjs
```

## 📝 Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run find-orgs` - Find Eventbrite organization IDs for a city

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- [Supabase](https://supabase.com) for backend infrastructure
- [Vercel](https://vercel.com) for hosting
- [Ticketmaster](https://developer.ticketmaster.com/) for event data
- [Eventbrite](https://www.eventbrite.com/platform/api/) for event data
- [Mapbox](https://www.mapbox.com/) for maps

---

Built with ❤️ for the underground community
