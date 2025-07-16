export interface Design {
  id: number;
  title: string;
  creator: string;
  userId: string;
  pokemon: string;
  category: string;
  description: string;
  likes: number;
  likedBy?: string[];
  tags: string[];
  date: string;
  colors: string[];
  imageUrl: string;
  status: string;
}

// Mock database - in production, this would be a real database
export const designs: Design[] = [
  {
    id: 1,
    title: 'Charizard Brand Identity',
    creator: 'DesignerAlex',
    userId: 'user_1',
    pokemon: 'charizard',
    category: 'branding',
    description: "Complete brand identity using Charizard's fiery color palette",
    likes: 127,
    likedBy: ['user_2', 'user_3'],
    tags: ['branding', 'logo', 'fire-type'],
    date: '2024-12-15',
    colors: ['#FF6B35', '#F7931E', '#FFD23F', '#2E2E2E', '#FFFFFF'],
    imageUrl: '/images/explore/charizard-brand.jpg',
    status: 'approved',
  },
  {
    id: 2,
    title: 'Pikachu Mobile App UI',
    creator: 'DevSarah',
    userId: 'user_2',
    pokemon: 'pikachu',
    category: 'mobile-app',
    description: "Mobile app interface inspired by Pikachu's bright yellow theme",
    likes: 89,
    likedBy: ['user_1'],
    tags: ['mobile', 'ui', 'electric-type'],
    date: '2024-12-14',
    colors: ['#FFD23F', '#FFE066', '#FFF2CC', '#2E2E2E', '#FFFFFF'],
    imageUrl: '/images/explore/pikachu-app.jpg',
    status: 'approved',
  },
];

// Helper functions
export function getDesigns(): Design[] {
  return designs;
}

export function getDesignById(id: number): Design | undefined {
  return designs.find(d => d.id === id);
}

export function updateDesign(id: number, updates: Partial<Design>): Design | null {
  const designIndex = designs.findIndex(d => d.id === id);
  if (designIndex === -1) return null;

  designs[designIndex] = { ...designs[designIndex], ...updates };
  return designs[designIndex];
}

export function addDesign(design: Omit<Design, 'id'>): Design {
  const newDesign: Design = {
    ...design,
    id: Math.max(...designs.map(d => d.id), 0) + 1,
  };
  designs.push(newDesign);
  return newDesign;
}

export function getApprovedDesigns(): Design[] {
  return designs.filter(design => design.status === 'approved');
}
