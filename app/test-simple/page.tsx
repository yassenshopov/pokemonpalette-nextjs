import { PokemonSpriteV2 } from '@/components/pokemon-sprite-v2';

export default function TestPage() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">Pokemon Sprite V2 Test</h1>
          <p className="text-muted-foreground">
            Testing the new simplified Pokemon sprite component with local-first image loading
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Test different Pokemon */}
          <PokemonSpriteV2 />
          <PokemonSpriteV2 />
          <PokemonSpriteV2 />
        </div>

        <div className="mt-8 text-center">
          <h2 className="text-xl font-semibold mb-4">Test Instructions</h2>
          <div className="text-left max-w-2xl mx-auto space-y-2 text-sm text-muted-foreground">
            <p>• Try entering Pokemon names (e.g., "pikachu", "charizard", "mew")</p>
            <p>• Try entering Pokemon numbers (e.g., "25", "150", "151")</p>
            <p>• Click the sparkle button to toggle shiny variants</p>
            <p>• Use the quick action buttons to test popular Pokemon</p>
            <p>
              • Check the browser console to see which images are loaded locally vs from PokeAPI
            </p>
            <p>
              • The component will first try to load from local files, then fallback to PokeAPI if
              needed
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

