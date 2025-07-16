// Mock data for development - replace with real API calls in production

export interface MockUser {
  id: string;
  username: string;
  fullName: string;
  avatar: string;
  bio: string;
  location: string;
  website: string;
  joinedAt: string;
  stats: {
    totalDesigns: number;
    totalLikes: number;
    totalViews: number;
    totalFollowers: number;
    totalFollowing: number;
  };
  badges: string[];
  isVerified: boolean;
}

export interface MockDesign {
  id: string;
  title: string;
  creator: string;
  userId: string;
  pokemon: string;
  category: string;
  description: string;
  likes: number;
  views: number;
  comments: number;
  tags: string[];
  date: string;
  colors: string[];
  imageUrl?: string;
  status: 'published' | 'featured' | 'draft';
}

// Mock Users Database
export const mockUsers: MockUser[] = [
  {
    id: 'ash_ketchum',
    username: 'ash_ketchum',
    fullName: 'Ash Ketchum',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=ash',
    bio: "Pokemon Master in training! Creating color palettes inspired by my journey through different regions. Gotta catch 'em all! ⚡️🎨",
    location: 'Pallet Town, Kanto',
    website: 'https://pokemon-league.com/ash',
    joinedAt: '2023-08-15T00:00:00.000Z',
    stats: {
      totalDesigns: 47,
      totalLikes: 892,
      totalViews: 3247,
      totalFollowers: 156,
      totalFollowing: 89,
    },
    badges: ['Pokemon Master', 'Top Designer', 'Community Favorite'],
    isVerified: true,
  },
  {
    id: 'misty_waterflower',
    username: 'misty_waterflower',
    fullName: 'Misty Waterflower',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=misty',
    bio: 'Cerulean City Gym Leader and water-type specialist. My designs flow like the ocean waves! 🌊💙',
    location: 'Cerulean City, Kanto',
    website: 'https://cerulean-gym.com',
    joinedAt: '2023-09-10T00:00:00.000Z',
    stats: {
      totalDesigns: 31,
      totalLikes: 654,
      totalViews: 1876,
      totalFollowers: 98,
      totalFollowing: 45,
    },
    badges: ['Gym Leader', 'Water Expert', 'Early Adopter'],
    isVerified: true,
  },
  {
    id: 'brock_harrison',
    username: 'brock_harrison',
    fullName: 'Brock Harrison',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=brock',
    bio: 'Pokemon Breeder and former Gym Leader. I create earthy, natural palettes inspired by rock and ground types! 🗿🌱',
    location: 'Pewter City, Kanto',
    website: 'https://pokemon-breeding.com/brock',
    joinedAt: '2023-07-22T00:00:00.000Z',
    stats: {
      totalDesigns: 28,
      totalLikes: 445,
      totalViews: 1234,
      totalFollowers: 67,
      totalFollowing: 34,
    },
    badges: ['Pokemon Breeder', 'Rock Specialist'],
    isVerified: false,
  },
  {
    id: 'cynthia_champion',
    username: 'cynthia_champion',
    fullName: 'Cynthia',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=cynthia',
    bio: 'Sinnoh Champion and Pokemon researcher. My designs reflect the legendary beauty of mythical Pokemon! ✨🔮',
    location: 'Celestic Town, Sinnoh',
    website: 'https://sinnoh-champion.com',
    joinedAt: '2023-06-05T00:00:00.000Z',
    stats: {
      totalDesigns: 52,
      totalLikes: 1247,
      totalViews: 4567,
      totalFollowers: 234,
      totalFollowing: 78,
    },
    badges: ['Champion', 'Legendary Designer', 'Top Creator', 'Verified Artist'],
    isVerified: true,
  },
  {
    id: 'professor_oak',
    username: 'professor_oak',
    fullName: 'Professor Samuel Oak',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=oak',
    bio: 'Pokemon Professor dedicated to research. Creating scientific color studies of Pokemon species! 🔬📚',
    location: 'Pallet Town, Kanto',
    website: 'https://oak-lab.edu',
    joinedAt: '2023-05-01T00:00:00.000Z',
    stats: {
      totalDesigns: 73,
      totalLikes: 1567,
      totalViews: 6789,
      totalFollowers: 312,
      totalFollowing: 23,
    },
    badges: ['Professor', 'Research Expert', 'Educator', 'Founding Member'],
    isVerified: true,
  },
];

// Mock Designs Database
export const mockDesigns: MockDesign[] = [
  {
    id: '1',
    title: 'Vibrant Charizard Fire Theme',
    creator: 'Ash Ketchum',
    userId: 'ash_ketchum',
    pokemon: 'charizard',
    category: 'fire',
    description:
      "A fiery color palette inspired by Charizard's majestic flame. Perfect for bold, energetic designs that capture the spirit of this legendary fire-type!",
    likes: 42,
    views: 156,
    comments: 8,
    tags: ['fire', 'orange', 'bold', 'warm', 'energetic'],
    date: '2024-06-15T10:30:00.000Z',
    colors: ['#FF6B35', '#F7931E', '#FFE66D', '#FF9F1C', '#D62828'],
    status: 'featured',
  },
  {
    id: '2',
    title: 'Serene Blastoise Water Flow',
    creator: 'Misty Waterflower',
    userId: 'misty_waterflower',
    pokemon: 'blastoise',
    category: 'water',
    description:
      "Cool and calming blues reminiscent of ocean depths. This palette flows like gentle waves and captures Blastoise's peaceful strength.",
    likes: 38,
    views: 134,
    comments: 5,
    tags: ['water', 'blue', 'calm', 'cool', 'peaceful'],
    date: '2024-06-10T14:20:00.000Z',
    colors: ['#0077BE', '#00A8CC', '#7FDBFF', '#B8E6B8', '#4ECDC4'],
    status: 'featured',
  },
  {
    id: '3',
    title: 'Mystic Alakazam Psychic Energy',
    creator: 'Cynthia',
    userId: 'cynthia_champion',
    pokemon: 'alakazam',
    category: 'psychic',
    description:
      "Purple and gold tones that capture psychic mystique. A sophisticated palette reflecting Alakazam's incredible mental powers.",
    likes: 35,
    views: 98,
    comments: 12,
    tags: ['psychic', 'purple', 'mystical', 'elegant', 'sophisticated'],
    date: '2024-06-05T09:45:00.000Z',
    colors: ['#8E44AD', '#F39C12', '#E8E4E6', '#9B59B6', '#D4AFDF'],
    status: 'published',
  },
  {
    id: '4',
    title: 'Earthy Geodude Rock Formation',
    creator: 'Brock Harrison',
    userId: 'brock_harrison',
    pokemon: 'geodude',
    category: 'rock',
    description:
      'Natural earth tones inspired by rocky terrains. This grounded palette reflects the solid, dependable nature of rock-type Pokemon.',
    likes: 29,
    views: 87,
    comments: 6,
    tags: ['rock', 'earth', 'natural', 'grounded', 'solid'],
    date: '2024-06-02T16:15:00.000Z',
    colors: ['#8B4513', '#A0522D', '#D2B48C', '#F5DEB3', '#CD853F'],
    status: 'published',
  },
  {
    id: '5',
    title: 'Electric Pikachu Lightning',
    creator: 'Ash Ketchum',
    userId: 'ash_ketchum',
    pokemon: 'pikachu',
    category: 'electric',
    description:
      "Bright yellows and electric blues that spark with energy! This palette captures Pikachu's cheerful and electrifying personality.",
    likes: 67,
    views: 203,
    comments: 15,
    tags: ['electric', 'yellow', 'bright', 'energetic', 'cheerful'],
    date: '2024-05-28T11:00:00.000Z',
    colors: ['#FFFF00', '#FFD700', '#FFA500', '#87CEEB', '#1E90FF'],
    status: 'featured',
  },
  {
    id: '6',
    title: 'Graceful Gardevoir Elegance',
    creator: 'Cynthia',
    userId: 'cynthia_champion',
    pokemon: 'gardevoir',
    category: 'psychic',
    description:
      "Soft pastels and elegant whites that embody Gardevoir's graceful nature. A delicate palette perfect for sophisticated designs.",
    likes: 51,
    views: 145,
    comments: 9,
    tags: ['psychic', 'elegant', 'soft', 'graceful', 'delicate'],
    date: '2024-05-25T13:30:00.000Z',
    colors: ['#F8F8FF', '#E6E6FA', '#DDA0DD', '#98FB98', '#F0F8FF'],
    status: 'published',
  },
  {
    id: '7',
    title: 'Tropical Venusaur Garden',
    creator: 'Professor Oak',
    userId: 'professor_oak',
    pokemon: 'venusaur',
    category: 'art',
    description:
      "Lush greens and floral accents inspired by Venusaur's beautiful flower. This palette brings the freshness of nature to any design.",
    likes: 44,
    views: 167,
    comments: 7,
    tags: ['grass', 'green', 'natural', 'fresh', 'floral'],
    date: '2024-05-20T08:45:00.000Z',
    colors: ['#228B22', '#32CD32', '#90EE90', '#FFB6C1', '#FF69B4'],
    status: 'published',
  },
  {
    id: '8',
    title: 'Staryu Cosmic Waters',
    creator: 'Misty Waterflower',
    userId: 'misty_waterflower',
    pokemon: 'staryu',
    category: 'web',
    description:
      "Cosmic blues and stellar purples that reflect Staryu's mysterious connection to the stars. A celestial aquatic palette.",
    likes: 33,
    views: 112,
    comments: 4,
    tags: ['water', 'cosmic', 'mysterious', 'stellar', 'celestial'],
    date: '2024-05-18T19:20:00.000Z',
    colors: ['#191970', '#4169E1', '#6495ED', '#87CEFA', '#E0E6F8'],
    status: 'published',
  },
  {
    id: '9',
    title: 'Vibrava - Spirit of the Desert',
    creator: 'Ash Ketchum',
    userId: 'ash_ketchum',
    pokemon: 'vibrava',
    category: 'branding',
    description:
      "A vibrant palette inspired by Vibrava's spirit. Perfect for bold, dynamic designs that capture the speed and agility of this flying-type Pokemon.",
    likes: 27,
    views: 78,
    comments: 10,
    tags: ['ground', 'desert', 'vibrava', 'spirit'],
    date: '2024-05-15T12:30:00.000Z',
    colors: ['#708090', '#87CEEB', '#4169E1', '#6495ED', '#87CEFA'],
    status: 'published',
  },
];

// Helper function to get user by ID
export const getUserById = (userId: string): MockUser | undefined => {
  return mockUsers.find(user => user.id === userId);
};

// Helper function to get designs by user
export const getDesignsByUser = (userId: string): MockDesign[] => {
  return mockDesigns.filter(design => design.userId === userId);
};

// Helper function to get featured designs
export const getFeaturedDesigns = (): MockDesign[] => {
  return mockDesigns.filter(design => design.status === 'featured');
};

// Helper function to get random user (for generating dynamic data)
export const getRandomUser = (): MockUser => {
  return mockUsers[Math.floor(Math.random() * mockUsers.length)];
};

// Helper function to get random designs
export const getRandomDesigns = (count: number): MockDesign[] => {
  const shuffled = [...mockDesigns];

  // Fisher-Yates shuffle algorithm
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }

  return shuffled.slice(0, count);
};

// Pokemon categories for filtering
export const pokemonCategories = [
  'fire',
  'water',
  'grass',
  'electric',
  'psychic',
  'rock',
  'ground',
  'flying',
  'bug',
  'normal',
  'fighting',
  'poison',
  'ghost',
  'ice',
  'dragon',
  'dark',
  'steel',
  'fairy',
];

// Achievement badges
export const availableBadges = [
  'Top Designer',
  'Community Favorite',
  'Early Adopter',
  'Pokemon Master',
  'Gym Leader',
  'Champion',
  'Professor',
  'Research Expert',
  'Educator',
  'Founding Member',
  'Verified Artist',
  'Top Creator',
  'Legendary Designer',
  'Water Expert',
  'Fire Specialist',
  'Grass Enthusiast',
  'Electric Expert',
  'Psychic Master',
  'Rock Specialist',
  'Pokemon Breeder',
];
