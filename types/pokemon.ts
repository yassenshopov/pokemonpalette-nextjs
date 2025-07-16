// Comprehensive TypeScript interfaces for Pokemon Palette app

// Core Pokemon API types
export interface PokemonSprites {
  front_default: string | null;
  front_shiny: string | null;
  other?: {
    'official-artwork'?: {
      front_default: string | null;
      front_shiny: string | null;
    };
    home?: {
      front_default: string | null;
      front_shiny: string | null;
    };
    dream_world?: {
      front_default: string | null;
    };
    showdown?: {
      front_default: string | null;
      front_shiny: string | null;
    };
  };
}

export interface PokemonStat {
  base_stat: number;
  effort: number;
  stat: {
    name: string;
    url: string;
  };
}

export interface PokemonType {
  slot: number;
  type: {
    name: string;
    url: string;
  };
}

export interface PokemonAbility {
  ability: {
    name: string;
    url: string;
  };
  is_hidden: boolean;
  slot: number;
}

export interface HeldItem {
  item: {
    name: string;
    url: string;
  };
  version_details: Array<{
    rarity: number;
    version: {
      name: string;
      url: string;
    };
  }>;
}

export interface Move {
  move: {
    name: string;
    url: string;
  };
  version_group_details: Array<{
    level_learned_at: number;
    version_group: {
      name: string;
      url: string;
    };
    move_learn_method: {
      name: string;
      url: string;
    };
  }>;
}

export interface PalParkEncounter {
  base_score: number;
  rate: number;
  area: {
    name: string;
    url: string;
  };
}

export interface FormDescription {
  description: string;
  language: {
    name: string;
    url: string;
  };
}

export interface Pokemon {
  id: number;
  name: string;
  base_experience: number;
  height: number;
  weight: number;
  is_default: boolean;
  order: number;
  sprites: PokemonSprites;
  abilities: PokemonAbility[];
  forms: Array<{
    name: string;
    url: string;
  }>;
  game_indices: Array<{
    game_index: number;
    version: {
      name: string;
      url: string;
    };
  }>;
  held_items: HeldItem[];
  location_area_encounters: string;
  moves: Move[];
  species: {
    name: string;
    url: string;
  };
  stats: PokemonStat[];
  types: PokemonType[];
  cries?: {
    latest?: string;
    legacy?: string;
  };
}

export interface PokemonSpecies {
  id: number;
  name: string;
  order: number;
  gender_rate: number;
  capture_rate: number;
  base_happiness: number;
  is_baby: boolean;
  is_legendary: boolean;
  is_mythical: boolean;
  hatch_counter: number;
  has_gender_differences: boolean;
  forms_switchable: boolean;
  growth_rate: {
    name: string;
    url: string;
  };
  pokedex_numbers: Array<{
    entry_number: number;
    pokedex: {
      name: string;
      url: string;
    };
  }>;
  egg_groups: Array<{
    name: string;
    url: string;
  }>;
  color: {
    name: string;
    url: string;
  };
  shape: {
    name: string;
    url: string;
  };
  evolves_from_species: {
    name: string;
    url: string;
  } | null;
  evolution_chain: {
    url: string;
  };
  habitat: {
    name: string;
    url: string;
  } | null;
  generation: {
    name: string;
    url: string;
  };
  names: Array<{
    name: string;
    language: {
      name: string;
      url: string;
    };
  }>;
  pal_park_encounters: PalParkEncounter[];
  flavor_text_entries: Array<{
    flavor_text: string;
    language: {
      name: string;
      url: string;
    };
    version: {
      name: string;
      url: string;
    };
  }>;
  form_descriptions: FormDescription[];
  genera: Array<{
    genus: string;
    language: {
      name: string;
      url: string;
    };
  }>;
  varieties: Array<{
    is_default: boolean;
    pokemon: {
      name: string;
      url: string;
    };
  }>;
}

export interface PokemonForm {
  id: number;
  name: string;
  order: number;
  form_order: number;
  is_default: boolean;
  is_battle_only: boolean;
  is_mega: boolean;
  form_name: string;
  pokemon: {
    name: string;
    url: string;
  };
  sprites: PokemonSprites;
  version_group: {
    name: string;
    url: string;
  };
}

export interface EvolutionChain {
  id: number;
  baby_trigger_item: any;
  chain: EvolutionChainLink;
}

export interface EvolutionChainLink {
  is_baby: boolean;
  species: {
    name: string;
    url: string;
  };
  evolution_details: Array<{
    item: any;
    trigger: {
      name: string;
      url: string;
    };
    gender: number | null;
    held_item: any;
    known_move: any;
    known_move_type: any;
    location: any;
    min_level: number | null;
    min_happiness: number | null;
    min_beauty: number | null;
    min_affection: number | null;
    needs_overworld_rain: boolean;
    party_species: any;
    party_type: any;
    relative_physical_stats: number | null;
    time_of_day: string;
    trade_species: any;
    turn_upside_down: boolean;
  }>;
  evolves_to: EvolutionChainLink[];
}

// App-specific types
export interface SavedPalette {
  id: string;
  pokemonName: string;
  pokemonId: number;
  colors: string[];
  userId: string;
  isShiny: boolean;
  form?: string;
  createdAt: string;
  tags?: string[];
  name?: string;
}

export interface ColorPalette {
  id: string;
  colors: string[];
  pokemonId: number;
  pokemonName: string;
  isShiny: boolean;
  form?: string;
  extractedAt: string;
}

export interface PokemonSearchResult {
  id: number;
  name: string;
  sprite: string;
  types: string[];
}

export interface PokemonFormVariant {
  id: string;
  name: string;
  displayName: string;
  sprite: string;
  type: 'form' | 'variety';
}

// UI component types
export interface LoadingState {
  isLoading: boolean;
  message?: string;
  progress?: number;
}

export interface PokemonErrorState {
  hasError: boolean;
  message: string;
  code?: string;
  retryable?: boolean;
}

export interface PokemonMenuState {
  selectedPokemon: Pokemon | null;
  selectedSpecies: PokemonSpecies | null;
  availableForms: PokemonFormVariant[];
  currentForm: string;
  isShiny: boolean;
  isLoading: boolean;
  error: PokemonErrorState;
}

// Color extraction types
export interface ColorExtractionResult {
  colors: string[];
  dominantColor: string;
  palette: {
    primary: string;
    secondary: string;
    accent: string;
  };
  metadata: {
    sourceUrl: string;
    extractedAt: string;
    algorithm: string;
  };
}

// Design system types
export type PokemonTypeNames =
  | 'normal'
  | 'fire'
  | 'water'
  | 'electric'
  | 'grass'
  | 'ice'
  | 'fighting'
  | 'poison'
  | 'ground'
  | 'flying'
  | 'psychic'
  | 'bug'
  | 'rock'
  | 'ghost'
  | 'dragon'
  | 'dark'
  | 'steel'
  | 'fairy';

export type ColorFormat = 'hex' | 'rgb' | 'hsl' | 'oklch';

export type ThemeMode = 'light' | 'dark' | 'system';

export type ComponentSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

export type ComponentVariant =
  | 'default'
  | 'secondary'
  | 'destructive'
  | 'outline'
  | 'ghost'
  | 'link'
  | 'pokemon';

// API response types
export interface APIResponse<T> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: any;
  };
  metadata?: {
    timestamp: string;
    requestId: string;
    cached?: boolean;
  };
}

export interface PaginatedResponse<T> extends APIResponse<T[]> {
  pagination: {
    page: number;
    limit: number;
    total: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

// Utility types
export type RequiredKeys<T, K extends keyof T> = T & Required<Pick<T, K>>;

export type PartialBy<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

export type Prettify<T> = {
  [K in keyof T]: T[K];
} & {};

// Type guards
export const isPokemon = (obj: any): obj is Pokemon => {
  return obj && typeof obj.id === 'number' && typeof obj.name === 'string' && obj.sprites;
};

export const isPokemonSpecies = (obj: any): obj is PokemonSpecies => {
  return (
    obj && typeof obj.id === 'number' && typeof obj.name === 'string' && obj.flavor_text_entries
  );
};

export const isPokemonType = (type: string): type is PokemonTypeNames => {
  const validTypes: PokemonTypeNames[] = [
    'normal',
    'fire',
    'water',
    'electric',
    'grass',
    'ice',
    'fighting',
    'poison',
    'ground',
    'flying',
    'psychic',
    'bug',
    'rock',
    'ghost',
    'dragon',
    'dark',
    'steel',
    'fairy',
  ];
  return validTypes.includes(type as PokemonTypeNames);
};

export const isColorFormat = (format: string): format is ColorFormat => {
  return ['hex', 'rgb', 'hsl', 'oklch'].includes(format);
};

export interface Design {
  id: number;
  title: string;
  creator: string;
  userId: string;
  pokemon: string;
  category: string;
  description: string;
  likes: number;
  tags: string[];
  date: string;
  colors: string[];
  imageUrl?: string;
  status: string;
  savedAt?: string;
}
