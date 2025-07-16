'use client';

import { useState, useEffect } from 'react';
import { useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { useToast } from '@/components/ui/use-toast';
import { logColorExtraction } from '@/lib/logger';
import speciesData from '@/data/species.json';
import { TypeBadge } from '@/components/type-badge';
import ColorThief from 'colorthief';
import { motion, AnimatePresence } from 'framer-motion';
import { PokemonTypeNames } from '@/types/pokemon';
import { Upload, Check, X, Hash, Plus } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { PokemonCommand } from '@/components/ui/pokemon-command';

const DEFAULT_COLORS = ['#000000', '#000000', '#000000', '#000000', '#000000'];
const POKEMON_NAMES = Object.keys(speciesData).sort();

// Common tags for suggestions
const COMMON_TAGS = [
  'branding',
  'logo',
  'web-design',
  'mobile-app',
  'ui-design',
  'ux-design',
  'illustration',
  'poster',
  'card-design',
  'packaging',
  'typography',
  'minimalist',
  'modern',
  'retro',
  'gradient',
  'flat-design',
  'fire-type',
  'water-type',
  'grass-type',
  'electric-type',
  'psychic-type',
  'dark-type',
  'fighting-type',
  'poison-type',
  'ground-type',
  'flying-type',
  'bug-type',
  'rock-type',
  'ghost-type',
  'dragon-type',
  'steel-type',
  'fairy-type',
  'ice-type',
  'normal-type',
];

// Helper functions remain the same...
async function fetchPokemonData(pokemon: string) {
  try {
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemon}`);
    const data = await response.json();
    const officialArt = data.sprites.other['official-artwork'].front_default;
    const types = data.types.map((t: { type: { name: string } }) => t.type.name);
    const number = data.id;
    return { officialArt, types, number };
  } catch {
    return { officialArt: '', types: [], number: 0 };
  }
}

async function extractColorsFromImage(imageUrl: string): Promise<string[]> {
  return new Promise(resolve => {
    const img = new window.Image();
    img.crossOrigin = 'Anonymous';

    img.onload = () => {
      try {
        const colorThief = new ColorThief();
        const palette = colorThief.getPalette(img, 5);
        const hexColors = palette.map((rgb: number[]) => {
          const [r, g, b] = rgb;
          return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b
            .toString(16)
            .padStart(2, '0')}`;
        });
        resolve(hexColors);
      } catch (error) {
        logColorExtraction(imageUrl, false, undefined, error as Error);
        resolve(DEFAULT_COLORS);
      }
    };

    img.onerror = () => {
      resolve(DEFAULT_COLORS);
    };

    img.src = imageUrl;
  });
}

const getContrastColor = (bgColor: string): { text: string; overlay: string } => {
  if (!bgColor) return { text: 'text-foreground', overlay: '' };

  const hex = bgColor.replace('#', '');
  const r = parseInt(hex.substr(0, 2), 16);
  const g = parseInt(hex.substr(2, 2), 16);
  const b = parseInt(hex.substr(4, 2), 16);

  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;

  return {
    text: luminance > 0.5 ? 'text-black' : 'text-white',
    overlay: luminance > 0.7 || luminance < 0.3 ? '' : 'bg-black/10 dark:bg-white/10',
  };
};

interface SubmitDesignDialogProps {
  children: React.ReactNode;
  className?: string;
  prefilledPokemon?: string;
}

export function SubmitDesignDialog({
  children,
  className,
  prefilledPokemon,
}: SubmitDesignDialogProps) {
  const { user, isSignedIn } = useUser();
  const router = useRouter();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    pokemon: '',
    colors: DEFAULT_COLORS,
    tags: [] as string[],
    imageUrl: '',
  });
  const [tagInput, setTagInput] = useState('');
  const [showTagSuggestions, setShowTagSuggestions] = useState(false);
  const [pokemonInfo, setPokemonInfo] = useState<{
    officialArt: string;
    types: string[];
    number: number;
  }>({ officialArt: '', types: [], number: 0 });
  const [extractingColors, setExtractingColors] = useState(false);

  useEffect(() => {
    if (prefilledPokemon && !formData.pokemon) {
      setFormData(prev => ({ ...prev, pokemon: prefilledPokemon.toLowerCase() }));
    }
  }, [prefilledPokemon, formData.pokemon]);

  const mainColor = formData.colors[0] || '#000000';

  useEffect(() => {
    if (!formData.pokemon) {
      setPokemonInfo({ officialArt: '', types: [], number: 0 });
      setFormData(f => ({ ...f, colors: DEFAULT_COLORS }));
      return;
    }

    const loadPokemonData = async () => {
      setExtractingColors(true);
      try {
        const data = await fetchPokemonData(formData.pokemon);
        setPokemonInfo(data);

        if (data.officialArt) {
          const extractedColors = await extractColorsFromImage(data.officialArt);
          setFormData(f => ({ ...f, colors: extractedColors }));
        } else {
          setFormData(f => ({ ...f, colors: DEFAULT_COLORS }));
        }
      } catch (error) {
        logColorExtraction('', false, undefined, error as Error);
        setFormData(f => ({ ...f, colors: DEFAULT_COLORS }));
      } finally {
        setExtractingColors(false);
      }
    };

    loadPokemonData();
  }, [formData.pokemon]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isSignedIn) {
      toast({
        title: 'Sign in required',
        description: 'Please sign in to submit your design.',
        variant: 'destructive',
      });
      return;
    }
    setLoading(true);
    try {
      const response = await fetch('/api/designs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          tags: formData.tags.join(', '), // Convert array back to string for API
          creator: user?.fullName || user?.username || 'Anonymous',
          userId: user?.id,
        }),
      });
      if (response.ok) {
        toast({
          title: 'Design submitted!',
          description: 'Your design has been submitted for review.',
        });
        router.refresh();
      } else {
        const error = await response.json();
        toast({
          title: 'Submission failed',
          description: error.error || 'Something went wrong. Please try again.',
          variant: 'destructive',
        });
      }
    } catch (error) {
      toast({
        title: 'Submission failed',
        description: 'Something went wrong. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleColorChange = (index: number, color: string) => {
    const newColors = [...formData.colors];
    newColors[index] = color;
    setFormData({ ...formData, colors: newColors });
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value });
  };

  const handlePokemonSelect = async (name: string) => {
    handleInputChange('pokemon', name.toLowerCase());
  };

  // Tag management functions
  const addTag = (tag: string) => {
    const cleanTag = tag.trim().toLowerCase().replace(/\s+/g, '-');
    if (cleanTag && !formData.tags.includes(cleanTag) && formData.tags.length < 8) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, cleanTag],
      }));
      setTagInput('');
      setShowTagSuggestions(false);
    }
  };

  const removeTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove),
    }));
  };

  const handleTagInputKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && tagInput.trim()) {
      e.preventDefault();
      addTag(tagInput.trim());
    } else if (e.key === 'Backspace' && !tagInput && formData.tags.length > 0) {
      removeTag(formData.tags[formData.tags.length - 1]);
    }
  };

  const getFilteredSuggestions = () => {
    if (!tagInput) return COMMON_TAGS.slice(0, 8);
    return COMMON_TAGS.filter(
      tag => tag.toLowerCase().includes(tagInput.toLowerCase()) && !formData.tags.includes(tag)
    ).slice(0, 8);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle style={{ color: mainColor }}>
            {formData.pokemon
              ? `Submit Your ${
                  formData.pokemon.charAt(0).toUpperCase() + formData.pokemon.slice(1)
                }-Inspired Design`
              : 'Submit Your Design'}
          </DialogTitle>
          <DialogDescription>
            {formData.pokemon
              ? `Create and share your unique ${
                  formData.pokemon.charAt(0).toUpperCase() + formData.pokemon.slice(1)
                }-inspired design with the community!`
              : 'Share your Pokemon-inspired designs with the community'}
          </DialogDescription>
        </DialogHeader>

        {!isSignedIn ? (
          <div className="text-center py-8">
            <div className="mb-6">
              <div
                className="w-16 h-16 mx-auto rounded-lg flex items-center justify-center mb-4"
                style={{ backgroundColor: `${mainColor}10` }}
              >
                🎨
              </div>
              <h3 className="text-lg font-semibold mb-2" style={{ color: mainColor }}>
                Sign in to Submit
              </h3>
              <p className="text-muted-foreground">
                Join our community to share your Pokemon-inspired designs
              </p>
            </div>
            <Button
              className="font-medium"
              style={{
                backgroundColor: mainColor,
                color: getContrastColor(mainColor).text,
              }}
              onClick={() => {
                // Trigger Clerk sign-in
                const signInButton = document.querySelector('[data-clerk-sign-in]');
                if (signInButton instanceof HTMLElement) {
                  signInButton.click();
                }
              }}
            >
              Sign In to Submit
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Pokemon Selection */}
            <div className="space-y-2">
              <label className="block text-sm font-medium" style={{ color: mainColor }}>
                Pokemon Inspiration *
              </label>
              <PokemonCommand
                value={formData.pokemon}
                onSelect={handlePokemonSelect}
                placeholder="Select a Pokemon..."
                buttonClassName="bg-background/50"
              />
            </div>

            {/* Enhanced Pokemon Preview with Integrated Color Palette */}
            <AnimatePresence mode="wait">
              {formData.pokemon && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="space-y-3"
                >
                  {/* Pokemon Info Card */}
                  <div
                    className="relative overflow-hidden rounded-xl border-2"
                    style={{
                      backgroundColor: `${mainColor}05`,
                      borderColor: `${mainColor}20`,
                    }}
                  >
                    <div className="flex items-center gap-4 p-4">
                      <div className="relative">
                        {pokemonInfo.officialArt ? (
                          <motion.img
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            src={pokemonInfo.officialArt}
                            alt={formData.pokemon}
                            className="w-24 h-24 object-contain"
                          />
                        ) : (
                          <div
                            className="w-24 h-24 rounded-lg flex items-center justify-center"
                            style={{ backgroundColor: `${mainColor}10` }}
                          >
                            ?
                          </div>
                        )}
                        {extractingColors && (
                          <div className="absolute inset-0 flex items-center justify-center rounded-lg bg-black/10">
                            <div className="w-8 h-8 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          </div>
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-baseline gap-2">
                            <span className="text-sm font-medium text-muted-foreground">
                              #{pokemonInfo.number?.toString().padStart(3, '0') || '???'}
                            </span>
                            <h3
                              className="text-xl font-bold capitalize"
                              style={{ color: mainColor }}
                            >
                              {formData.pokemon}
                            </h3>
                          </div>
                          {extractingColors && (
                            <span className="text-xs text-muted-foreground flex items-center gap-1">
                              <div className="w-3 h-3 border border-muted-foreground/30 border-t-current rounded-full animate-spin" />
                              Extracting...
                            </span>
                          )}
                        </div>
                        <div className="flex gap-2">
                          {pokemonInfo.types.map(type => (
                            <TypeBadge key={type} type={type as PokemonTypeNames} />
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Integrated Color Palette */}
                    <div className="relative">
                      <div className="flex h-16">
                        {formData.colors.map((color, index) => (
                          <motion.div
                            key={index}
                            className="relative flex-1 group"
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                          >
                            <input
                              type="color"
                              value={color}
                              onChange={e => handleColorChange(index, e.target.value)}
                              className="w-full h-full cursor-pointer border-0 outline-none"
                              style={{ backgroundColor: color }}
                              disabled={extractingColors}
                              title={`Color ${index + 1}: ${color.toUpperCase()}`}
                            />

                            {/* Color Value Overlay */}
                            <div className="absolute inset-x-0 bottom-0 bg-black/70 text-white text-xs text-center py-1 opacity-0 group-hover:opacity-100 transition-opacity">
                              {color.toUpperCase()}
                            </div>

                            {/* Vertical separator */}
                            {index < formData.colors.length - 1 && (
                              <div className="absolute right-0 top-1 bottom-1 w-px bg-white/20" />
                            )}
                          </motion.div>
                        ))}
                      </div>

                      {/* Extraction Overlay */}
                      {extractingColors && (
                        <div className="absolute inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center">
                          <div className="text-center">
                            <div
                              className="w-6 h-6 border-2 border-muted-foreground/30 border-t-current rounded-full animate-spin mx-auto mb-1"
                              style={{ borderTopColor: mainColor }}
                            />
                            <p className="text-xs text-muted-foreground">Extracting colors...</p>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Helper Text */}
                    <div className="px-4 py-2 bg-black/5 dark:bg-white/5 text-xs text-muted-foreground flex items-center justify-between">
                      <span>
                        🎨 Colors extracted from{' '}
                        {formData.pokemon.charAt(0).toUpperCase() + formData.pokemon.slice(1)}
                      </span>
                      <span>Click any color to customize</span>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Design Title */}
            <div className="space-y-2">
              <label className="block text-sm font-medium" style={{ color: mainColor }}>
                Design Title *
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={e => handleInputChange('title', e.target.value)}
                required
                className="w-full px-4 py-3 rounded-lg bg-background/50 border transition-all"
                style={{
                  borderColor: `${mainColor}20`,
                }}
                placeholder="e.g., Charizard Brand Identity"
              />
            </div>

            {/* Description */}
            <div className="space-y-2">
              <label className="block text-sm font-medium" style={{ color: mainColor }}>
                Description *
              </label>
              <textarea
                value={formData.description}
                onChange={e => handleInputChange('description', e.target.value)}
                required
                rows={3}
                className="w-full px-4 py-3 rounded-lg bg-background/50 border transition-all"
                style={{
                  borderColor: `${mainColor}20`,
                }}
                placeholder="Describe your design and how you used Pokemon colors..."
              />
            </div>

            {/* Category */}
            <div className="space-y-2">
              <label className="block text-sm font-medium" style={{ color: mainColor }}>
                Category *
              </label>
              <select
                value={formData.category}
                onChange={e => handleInputChange('category', e.target.value)}
                required
                className="w-full px-4 py-3 rounded-lg bg-background/50 border transition-all"
                style={{
                  borderColor: `${mainColor}20`,
                }}
              >
                <option value="">Select a category</option>
                <option value="web-design">Web Design</option>
                <option value="branding">Branding</option>
                <option value="art">Art</option>
                <option value="product-design">Product Design</option>
                <option value="mobile-app">Mobile App</option>
                <option value="print-design">Print Design</option>
              </select>
            </div>

            {/* Design Image URL */}
            <div className="space-y-2">
              <label className="block text-sm font-medium" style={{ color: mainColor }}>
                Design Image URL *
              </label>
              <div className="relative">
                <input
                  type="url"
                  value={formData.imageUrl}
                  onChange={e => handleInputChange('imageUrl', e.target.value)}
                  required
                  className="w-full pl-4 pr-12 py-3 rounded-lg bg-background/50 border transition-all"
                  style={{
                    borderColor: `${mainColor}20`,
                  }}
                  placeholder="https://your-image-url.com/design.jpg"
                />
                <Upload className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              </div>
              <p className="text-xs text-muted-foreground">
                For now, please provide a URL to your design image. Direct upload coming soon!
              </p>
            </div>

            {/* Enhanced Tags Section */}
            <div className="space-y-3">
              <label
                className="block text-sm font-medium flex items-center gap-2"
                style={{ color: mainColor }}
              >
                <Hash className="w-4 h-4" />
                Tags
                <span className="text-xs text-muted-foreground font-normal">
                  ({formData.tags.length}/8)
                </span>
              </label>

              {/* Selected Tags Display */}
              {formData.tags.length > 0 && (
                <div
                  className="flex flex-wrap gap-2 p-3 rounded-lg border"
                  style={{ borderColor: `${mainColor}10`, backgroundColor: `${mainColor}05` }}
                >
                  <AnimatePresence>
                    {formData.tags.map((tag, index) => (
                      <motion.div
                        key={tag}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        className="inline-flex items-center gap-1 px-3 py-1 text-sm rounded-full border"
                        style={{
                          backgroundColor: `${mainColor}15`,
                          borderColor: `${mainColor}30`,
                          color: mainColor,
                        }}
                      >
                        <Hash className="w-3 h-3" />
                        {tag}
                        <button
                          type="button"
                          onClick={() => removeTag(tag)}
                          className="ml-1 hover:bg-black/10 rounded-full p-0.5 transition-colors"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              )}

              {/* Tag Input */}
              <div className="relative">
                <div
                  className="flex items-center gap-2 px-4 py-3 rounded-lg bg-background/50 border transition-all"
                  style={{ borderColor: `${mainColor}20` }}
                >
                  <Hash className="w-4 h-4 text-muted-foreground" />
                  <input
                    type="text"
                    value={tagInput}
                    onChange={e => {
                      setTagInput(e.target.value);
                      setShowTagSuggestions(e.target.value.length > 0 || e.target.value === '');
                    }}
                    onKeyDown={handleTagInputKeyDown}
                    onFocus={() => setShowTagSuggestions(true)}
                    onBlur={() => setTimeout(() => setShowTagSuggestions(false), 200)}
                    className="flex-1 bg-transparent outline-none placeholder-muted-foreground"
                    placeholder={
                      formData.tags.length === 0
                        ? 'Add tags (e.g., branding, logo, fire-type)'
                        : 'Add another tag...'
                    }
                    disabled={formData.tags.length >= 8}
                  />
                  {tagInput && (
                    <button
                      type="button"
                      onClick={() => addTag(tagInput)}
                      className="flex items-center justify-center w-6 h-6 rounded-full transition-colors hover:bg-black/10"
                      style={{ color: mainColor }}
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  )}
                </div>

                {/* Tag Suggestions */}
                <AnimatePresence>
                  {showTagSuggestions && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="absolute top-full left-0 right-0 mt-1 bg-background border rounded-lg shadow-lg z-10"
                      style={{ borderColor: `${mainColor}20` }}
                    >
                      <div className="p-2">
                        <div className="text-xs text-muted-foreground mb-2 px-2">
                          {tagInput ? 'Matching suggestions:' : 'Popular tags:'}
                        </div>
                        <div className="flex flex-wrap gap-1 max-h-32 overflow-y-auto">
                          {getFilteredSuggestions().map(suggestion => (
                            <button
                              key={suggestion}
                              type="button"
                              onClick={() => addTag(suggestion)}
                              className="inline-flex items-center gap-1 px-2 py-1 text-xs rounded-md transition-colors hover:bg-accent"
                              style={{
                                backgroundColor: `${mainColor}05`,
                                color: mainColor,
                              }}
                            >
                              <Hash className="w-3 h-3" />
                              {suggestion}
                            </button>
                          ))}
                        </div>
                        {getFilteredSuggestions().length === 0 && tagInput && (
                          <div className="text-xs text-muted-foreground px-2 py-4 text-center">
                            No matching suggestions. Press Enter to add "{tagInput}"
                          </div>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <div className="flex items-start justify-between text-xs text-muted-foreground">
                <div>
                  <p>• Press Enter or click + to add tags</p>
                  <p>• Click X to remove tags</p>
                  <p>• Use backspace to remove the last tag</p>
                </div>
                <div className="text-right">
                  <p>Maximum 8 tags</p>
                </div>
              </div>
            </div>

            {/* Enhanced Terms Checkbox */}
            <label className="flex items-start gap-3 py-3 cursor-pointer group">
              <div className="relative flex items-start mt-0.5">
                <input
                  type="checkbox"
                  required
                  className="sr-only peer"
                  onChange={e => {
                    // Force re-render to ensure visual update
                    const checkboxContainer = e.target.nextElementSibling;
                    if (checkboxContainer) {
                      const isChecked = e.target.checked.toString();
                      checkboxContainer.setAttribute('data-checked', isChecked);
                      // Update all child elements
                      const children = checkboxContainer.querySelectorAll('[data-checked]');
                      children.forEach(child => child.setAttribute('data-checked', isChecked));
                    }
                  }}
                />
                <div
                  className="w-5 h-5 border-2 rounded-md transition-all duration-200 flex items-center justify-center group-hover:border-current/80 relative overflow-hidden data-[checked=true]:scale-105"
                  style={{
                    borderColor: `${mainColor}80`,
                    backgroundColor: 'transparent',
                  }}
                  data-checked="false"
                >
                  {/* Background fill when checked */}
                  <div
                    className="absolute inset-0 rounded-sm transition-all duration-200 data-[checked=true]:scale-100 scale-0"
                    style={{ backgroundColor: mainColor }}
                    data-checked="false"
                  />
                  {/* Checkmark */}
                  <Check
                    className="w-3 h-3 text-white relative z-10 transition-opacity duration-200 data-[checked=true]:opacity-100 opacity-0"
                    strokeWidth={3}
                    data-checked="false"
                  />
                </div>
              </div>
              <div className="flex-1">
                <span className="text-sm text-foreground leading-relaxed">
                  I agree to the submission guidelines and confirm this is my original work
                </span>
                <p className="text-xs text-muted-foreground mt-1">
                  By submitting, you agree that your design follows our community guidelines and
                  respects intellectual property rights.
                </p>
              </div>
            </label>

            {/* Submit Button */}
            <div className="pt-4">
              <Button
                type="submit"
                disabled={loading || extractingColors}
                className="w-full py-6 font-medium"
                style={{
                  backgroundColor: mainColor,
                  color: getContrastColor(mainColor).text,
                }}
              >
                {loading
                  ? 'Submitting...'
                  : extractingColors
                  ? 'Extracting Colors...'
                  : 'Submit Design'}
              </Button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
