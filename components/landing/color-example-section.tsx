import { useState, useEffect, memo } from 'react';
import { HeroSection } from './hero-section';
import { ColorPalette } from './color-palette';
import { ExampleComponents } from './example-components';
import { PokemonInfo } from './pokemon-info';
import { Footer } from '@/components/ui/Footer';
import { BuyMeCoffee } from '@/components/support/buy-me-coffee';

interface ColorExampleSectionProps {
  colors: string[];
  pokemonName: string;
  officialArt: string;
  getContrastColor: (color: string) => { text: string; overlay: string };
  pokemonNumber: number;
  pokemonDescription: string;
  pokemonTypes: string[];
  selectedVersion: string;
  availableVersions: string[];
  onVersionChange: (version: string) => void;
  pokemonCry?: string;
  stats: Array<{ name: string; base_stat: number }>;
  descriptions: Array<{ flavor_text: string; version: { name: string } }>;
  currentDescriptionIndex: number;
  onDescriptionChange: (index: number) => void;
}

const MemoizedHeroSection = memo(HeroSection);
const MemoizedColorPalette = memo(ColorPalette);
const MemoizedBuyMeCoffee = memo(BuyMeCoffee);
const MemoizedPokemonInfo = memo(PokemonInfo);
const MemoizedExampleComponents = memo(ExampleComponents);
const MemoizedFooter = memo(Footer);

export const ColorExampleSection = memo(function ColorExampleSection({
  colors,
  pokemonName,
  officialArt,
  getContrastColor,
  pokemonNumber,
  pokemonDescription,
  pokemonTypes,
  selectedVersion,
  availableVersions,
  onVersionChange,
  pokemonCry,
  stats,
  descriptions,
  currentDescriptionIndex,
  onDescriptionChange,
}: ColorExampleSectionProps) {
  const [selectedColorProgress, setSelectedColorProgress] = useState(colors[0]);
  const [selectedColorNotification, setSelectedColorNotification] = useState(colors[1]);
  const [selectedColorCard, setSelectedColorCard] = useState(colors[2]);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress(oldProgress => {
        if (oldProgress === 100) {
          return 0;
        }
        return Math.min(oldProgress + 10, 100);
      });
    }, 500);

    return () => {
      clearInterval(timer);
    };
  }, []);

  // Batch color updates
  useEffect(() => {
    if (colors.length >= 3) {
      setSelectedColorProgress(colors[0]);
      setSelectedColorNotification(colors[1]);
      setSelectedColorCard(colors[2]);
    }
  }, [colors]);

  return (
    <div className="max-w-6xl mx-auto p-4 pt-1 md:pt-24 space-y-8 md:space-y-12">
      <MemoizedHeroSection
        pokemonName={pokemonName}
        officialArt={officialArt}
        colors={colors}
        pokemonNumber={pokemonNumber}
      />

      <div className="space-y-8">
        <div>
          <MemoizedColorPalette colors={colors} />
        </div>

        <div>
          <MemoizedBuyMeCoffee
            mainColor={colors[0]}
            secondaryColor={colors[1]}
            tertiaryColor={colors[2]}
            getContrastColor={getContrastColor}
          />
        </div>

        <div>
          <MemoizedPokemonInfo
            pokemonName={pokemonName}
            pokemonNumber={pokemonNumber}
            pokemonDescription={pokemonDescription}
            pokemonTypes={pokemonTypes}
            selectedVersion={selectedVersion}
            availableVersions={availableVersions}
            onVersionChange={onVersionChange}
            getContrastColor={getContrastColor}
            colors={colors}
            officialArt={officialArt}
            pokemonCry={pokemonCry}
            stats={stats}
            descriptions={descriptions}
            currentDescriptionIndex={currentDescriptionIndex}
            onDescriptionChange={onDescriptionChange}
          />
        </div>

        <div>
          <MemoizedExampleComponents
            selectedColorProgress={selectedColorProgress}
            selectedColorNotification={selectedColorNotification}
            selectedColorCard={selectedColorCard}
            progress={progress}
            getContrastColor={getContrastColor}
            colors={colors}
          />
        </div>
      </div>

      <MemoizedFooter />
    </div>
  );
});
