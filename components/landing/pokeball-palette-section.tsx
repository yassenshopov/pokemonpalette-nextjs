import { Card } from '@/components/ui/card';
import Image from 'next/image';
import { motion } from 'framer-motion';

interface PokeballPaletteSectionProps {
  colors: string[];
  pokemonTypes?: string[];
}

type Pokeball = {
  id: number;
  name: string;
  image: string;
  colors: string[];
}

// Helper function to calculate color distance (simple Euclidean distance in RGB space)
const getColorDistance = (color1: string, color2: string): number => {
  // Extract RGB values
  const rgb1 = color1.match(/\d+/g)?.map(Number) || [0, 0, 0];
  const rgb2 = color2.match(/\d+/g)?.map(Number) || [0, 0, 0];
  
  // Calculate Euclidean distance
  return Math.sqrt(
    Math.pow(rgb1[0] - rgb2[0], 2) +
    Math.pow(rgb1[1] - rgb2[1], 2) +
    Math.pow(rgb1[2] - rgb2[2], 2)
  );
};

export function PokeballPaletteSection({ colors, pokemonTypes = [] }: PokeballPaletteSectionProps) {
  // Define the Pokéballs with their colors
  const pokeballs: Pokeball[] = [
    {
      id: 1,
      name: "Heavyball",
      image: "/images/pokeballs/heavy-ball.svg",
      colors: ["#9EABB0", "#BBC0C4", "#4C6C9D"]
    },
    {
      id: 2,
      name: "Masterball",
      image: "/images/pokeballs/master-ball.svg",
      colors: ["#7D3AA2", "#9A49BA", "#E34594"]
    },
    {
      id: 3,
      name: "Luxuryball",
      image: "/images/pokeballs/luxury-ball.svg",
      colors: ["#A5A5A5", "#A8A8A8", "#FF6A41"]
    },
    {
      id: 4,
      name: "Diveball",
      image: "/images/pokeballs/dive-ball.svg",
      colors: ["#3D85C6", "#64B5F6", "#0D47A1"]
    },
    {
      id: 5,
      name: "Nestball",
      image: "/images/pokeballs/luxury-ball.svg", // Placeholder
      colors: ["#A8D25B", "#D6EBA8", "#759A3C"]
    },
    {
      id: 6,
      name: "Netball",
      image: "/images/pokeballs/luxury-ball.svg", // Placeholder
      colors: ["#3D5EC7", "#60ADFF", "#4B86E0"]
    },
  ];

  // Determine which pokeballs to show based on color similarity
  const findMatchingPokeballs = () => {
    // Calculate a similarity score for each pokeball by comparing its colors to the palette
    const pokeballScores = pokeballs.map(pokeball => {
      let totalScore = 0;
      
      // For each color in the palette, find the closest color in the pokeball
      colors.forEach(paletteColor => {
        const bestDistance = Math.min(
          ...pokeball.colors.map(pokeballColor => 
            getColorDistance(paletteColor, pokeballColor)
          )
        );
        totalScore += bestDistance;
      });
      
      return {
        ...pokeball,
        score: totalScore
      };
    });
    
    // Sort by score (lower is better) and take the top 3
    return pokeballScores
      .sort((a, b) => a.score - b.score)
      .slice(0, 3);
  };

  // Get pokeballs based on type
  const getTypeBasedPokeballs = () => {
    const typeToPokeballs: Record<string, { name: string, image: string, type: string }> = {
      "fire": { name: "Repeatball", image: "/images/pokeballs/repeat-ball.svg", type: "Primary type" },
      "ghost": { name: "Duskball", image: "/images/pokeballs/dusk-ball.svg", type: "Secondary type" },
      "water": { name: "Diveball", image: "/images/pokeballs/dive-ball.svg", type: "Primary type" },
      "grass": { name: "Nestball", image: "/images/pokeballs/heavy-ball.svg", type: "Primary type" }, // Placeholder
      "bug": { name: "Netball", image: "/images/pokeballs/luxury-ball.svg", type: "Secondary type" }, // Placeholder
      "electric": { name: "Quickball", image: "/images/pokeballs/repeat-ball.svg", type: "Primary type" }, // Placeholder
      "dark": { name: "Duskball", image: "/images/pokeballs/dusk-ball.svg", type: "Primary type" }
    };

    return pokemonTypes
      .filter(type => typeToPokeballs[type.toLowerCase()])
      .map(type => ({
        ...typeToPokeballs[type.toLowerCase()],
        typeLabel: type.charAt(0).toUpperCase() + type.slice(1)
      }));
  };

  const matchingPokeballs = findMatchingPokeballs();
  const typeBasedPokeballs = getTypeBasedPokeballs();

  return (
    <div className="space-y-6 mb-20">
      <div className="bg-background rounded-lg p-8 pb-12 border">
        <h2 className="text-4xl font-bold tracking-tight mb-2">Pokeballs based on palette:</h2>
        <p className="text-lg text-muted-foreground mb-10">
          The following Pokeballs are chosen algorithmically based on the palette
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {matchingPokeballs.map((ball, index) => (
            <motion.div
              key={ball.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ 
                duration: 0.5, 
                delay: index * 0.2,
                type: "spring",
                stiffness: 100 
              }}
              viewport={{ once: true }}
            >
              <Card className="overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300">
                <div className="p-6 flex flex-col items-center">
                  <h3 className="text-xl font-bold mb-4">#{index + 1}: {ball.name}</h3>
                  <motion.div 
                    className="relative w-32 h-32 mb-8"
                    whileHover={{ scale: 1.05 }}
                    transition={{ type: "spring", stiffness: 300, damping: 10 }}
                  >
                    <div className="absolute inset-0 rounded-full flex items-center justify-center">
                      <Image 
                        src={ball.image} 
                        alt={ball.name}
                        width={120}
                        height={120}
                        style={{ objectFit: "contain" }}
                      />
                    </div>
                  </motion.div>
                </div>
                <div className="grid grid-cols-3 w-full">
                  {ball.colors.map((color, i) => (
                    <motion.div 
                      key={i}
                      className="aspect-square w-full"
                      initial={{ opacity: 0 }}
                      whileInView={{ opacity: 1 }}
                      transition={{ delay: index * 0.2 + (i * 0.1) + 0.3 }}
                      style={{ backgroundColor: color }}
                      viewport={{ once: true }}
                    />
                  ))}
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>

      {typeBasedPokeballs.length > 0 && (
        <div className="bg-background rounded-lg p-8 pb-12 mt-10 border">
          <p className="text-2xl font-bold mb-2">
            The following Pokeballs are chosen based on the type
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
            {typeBasedPokeballs.map((ball, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ 
                  duration: 0.5, 
                  delay: index * 0.2,
                  type: "spring",
                  stiffness: 100 
                }}
                viewport={{ once: true }}
              >
                <Card className="overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300">
                  <div className="p-8 flex flex-col items-center">
                    <h3 className="text-2xl font-bold mb-1">{ball.name}</h3>
                    <p className="text-base text-muted-foreground mb-8">
                      {ball.type === "Primary type" ? "Primary" : "Secondary"} type: <span className="font-medium text-foreground">{ball.typeLabel}</span>
                    </p>
                    <motion.div 
                      className="relative w-40 h-40"
                      whileHover={{ scale: 1.05, rotate: [0, -5, 5, -5, 0] }}
                      transition={{ type: "spring", stiffness: 300, damping: 10 }}
                    >
                      <div className="absolute inset-0 rounded-full flex items-center justify-center">
                        <Image 
                          src={ball.image} 
                          alt={ball.name}
                          width={150}
                          height={150}
                          style={{ objectFit: "contain" }}
                        />
                      </div>
                    </motion.div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
} 