
import { City, Event, User, Tier, Ticket, CityPulse } from './types';

export const MOCK_CITIES: City[] = [
  { 
    id: 'berlin', 
    name: 'Berlin', 
    country: 'Germany', 
    timezone: 'CET', 
    lore: 'The world capital of techno. From abandoned power plants to canal-side bars, the pulse here never stops.',
    coordinates: { lat: 52.5200, lng: 13.4050 }
  },
  { 
    id: 'london', 
    name: 'London', 
    country: 'UK', 
    timezone: 'GMT', 
    lore: 'A melting pot of garage, grime, and jungle. The night moves from basement clubs to towering industrial warehouses.',
    coordinates: { lat: 51.5074, lng: -0.1278 }
  },
  { 
    id: 'ny', 
    name: 'New York', 
    country: 'USA', 
    timezone: 'EST', 
    lore: 'The city that never sleeps. From Brooklyn loft parties to underground jazz dens, every borough has a secret.',
    coordinates: { lat: 40.7128, lng: -74.0060 }
  },
  { 
    id: 'tokyo', 
    name: 'Tokyo', 
    country: 'Japan', 
    timezone: 'JST', 
    lore: 'Neon-lit nights in Shibuya and hidden audiophile bars in Ginza. Precision meets chaotic nocturnal energy.',
    coordinates: { lat: 35.6762, lng: 139.6503 }
  },
  { 
    id: 'vancouver', 
    name: 'Vancouver', 
    country: 'Canada', 
    timezone: 'PST', 
    lore: 'Where mountains meet the ocean. Underground electronic scenes pulse through Gastown warehouses and East Van lofts.',
    coordinates: { lat: 49.2827, lng: -123.1207 }
  },
  { 
    id: 'calgary', 
    name: 'Calgary', 
    country: 'Canada', 
    timezone: 'MST', 
    lore: 'Prairie energy meets urban grit. From Stampede afterparties to Beltline warehouse raves, the scene runs deep.',
    coordinates: { lat: 51.0447, lng: -114.0719 }
  },
];

export const MOCK_CITY_PULSES: CityPulse[] = [
  {
    id: 'p1',
    cityId: 'berlin',
    type: 'neighborhood',
    title: 'Friedrichshain',
    description: 'Industrial grit meets relentless rhythm. The power plants are waking up.',
    imageUrl: 'https://picsum.photos/seed/friedrichshain/400/400',
    metric: 'PEAKING NOW'
  },
  {
    id: 'p2',
    cityId: 'berlin',
    type: 'trend',
    title: 'Vinyl Revival',
    description: 'Analog is the new gold. Hidden record stores are hosting secret listening sessions.',
    imageUrl: 'https://picsum.photos/seed/vinyl/400/400',
    metric: 'TRENDING'
  },
  {
    id: 'p3',
    cityId: 'london',
    type: 'history',
    title: 'Hackney Wick',
    description: 'From canal-side artists to the epicentre of the new rave movement.',
    imageUrl: 'https://picsum.photos/seed/hackney/400/400',
    metric: 'LOCAL LORE'
  }
];

export const MOCK_USER: User = {
  id: 'user1',
  username: 'rave_lord',
  displayName: 'Alex Rivers',
  avatarUrl: 'https://picsum.photos/seed/rave/200/200',
  bio: 'Searching for the perfect kick drum. 🔊 Berlin based.',
  socials: { twitter: '@alex_rivers', instagram: 'alex_rave' },
  interests: ['Techno', 'Hardcore', 'Berlin', 'Vinyl'],
  homeCity: 'berlin',
  travelCities: ['london'],
  profileMode: 'full',
  organizerTier: 'none',
  verified: true,
  createdAt: '2023-01-01',
};

export const MOCK_EVENTS: Event[] = [
  {
    id: 'e1',
    cityId: 'berlin',
    organizerId: 'org1',
    tier: 'official',
    title: 'HYPERSPACE BERLIN',
    shortDesc: 'A 48-hour non-stop industrial experience.',
    longDesc: 'Join us at the abandoned power plant for a journey through the hardest techno sounds in Europe.',
    startAt: new Date(Date.now() + 3600000).toISOString(),
    endAt: new Date(Date.now() + 86400000).toISOString(),
    venueName: 'Kraftwerk',
    address: 'Köpenicker Str. 70, 10179 Berlin',
    lat: 52.5108,
    lng: 13.4183,
    categories: ['Music', 'Nightlife'],
    subcategories: ['Techno', 'Industrial'],
    mediaUrls: ['https://picsum.photos/seed/event1/800/600'],
    ticketUrl: 'https://ra.co',
    status: 'active',
    counts: { likes: 1240, saves: 450, comments: 89, rsvpGoing: 320, rsvpInterested: 800 }
  },
  {
    id: 'e2',
    cityId: 'berlin',
    organizerId: 'org2',
    tier: 'community',
    title: 'Canal Session #12',
    shortDesc: 'Chill house and drinks by the water.',
    longDesc: 'Community organized sunset session at Landwehr Canal.',
    startAt: new Date(Date.now() + 172800000).toISOString(),
    endAt: new Date(Date.now() + 180000000).toISOString(),
    venueName: 'Landwehr Canal',
    address: 'Paul-Lincke-Ufer, Berlin',
    lat: 52.4939,
    lng: 13.4284,
    categories: ['Music', 'Community'],
    subcategories: ['House', 'Sunset'],
    mediaUrls: ['https://picsum.photos/seed/event2/800/600'],
    status: 'active',
    counts: { likes: 120, saves: 45, comments: 12, rsvpGoing: 30, rsvpInterested: 150 }
  },
  {
    id: 'e3',
    cityId: 'london',
    organizerId: 'org3',
    tier: 'official',
    title: 'NEON JUNCTION',
    shortDesc: 'London high-speed dnb marathon.',
    longDesc: 'Massive warehouse event featuring the best in UK Bass.',
    startAt: new Date(Date.now() + 3600000 * 2).toISOString(),
    endAt: new Date(Date.now() + 3600000 * 10).toISOString(),
    venueName: 'Printworks',
    address: 'Surrey Quays Rd, London SE16 7PJ',
    lat: 51.4975,
    lng: -0.0435,
    categories: ['Music', 'Nightlife'],
    subcategories: ['DnB', 'Jungle'],
    mediaUrls: ['https://picsum.photos/seed/event3/800/600'],
    ticketUrl: 'https://dice.fm',
    status: 'active',
    counts: { likes: 3200, saves: 1100, comments: 245, rsvpGoing: 1200, rsvpInterested: 4500 }
  }
];

export const MOCK_TICKETS: Ticket[] = [
  {
    id: 't1',
    eventId: 'e1',
    userId: 'user1',
    qrCode: 'IC-882-991-0023',
    status: 'active',
    type: 'General Admission',
    gate: 'North-04',
    section: 'Floor',
    purchaseDate: new Date().toISOString(),
    // Fix: Added missing source property
    source: 'native'
  },
  {
    id: 't2',
    eventId: 'e3',
    userId: 'user1',
    qrCode: 'IC-122-441-9981',
    status: 'expired',
    type: 'Early Bird',
    gate: 'Main',
    section: 'A',
    purchaseDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
    // Fix: Added missing source property
    source: 'native'
  }
];
