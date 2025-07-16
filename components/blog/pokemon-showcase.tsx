import Image from 'next/image';
import { TrendingUp } from 'lucide-react';

export function PokemonShowcase() {
  return (
    <div className="relative">
      {/* Clean, organized Pokemon showcase */}
      <div className="space-y-6">
        {/* Evolution timeline header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 rounded-full text-sm font-medium mb-4">
            <TrendingUp className="w-4 h-4" />
            Design Evolution Timeline
          </div>
        </div>

        {/* Three Pokemon representing eras */}
        <div className="grid grid-cols-3 gap-4">
          {/* Gen I - Pixel Era */}
          <div className="text-center space-y-3">
            <div className="w-20 h-20 mx-auto rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center backdrop-blur-sm hover:scale-105 transition-transform">
              <Image
                src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/25.png"
                alt="Pikachu"
                width={60}
                height={60}
                className="filter brightness-110"
              />
            </div>
            <div>
              <div className="text-sm font-bold">Pikachu</div>
              <div className="text-xs opacity-70">Gen I • 1996</div>
              <div className="text-xs mt-1 px-2 py-1 bg-green-500/20 rounded text-green-200">
                Pixel Era
              </div>
            </div>
          </div>

          {/* Gen VI - 3D Transition */}
          <div className="text-center space-y-3">
            <div className="w-20 h-20 mx-auto rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center backdrop-blur-sm hover:scale-105 transition-transform">
              <Image
                src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/658.png"
                alt="Greninja"
                width={60}
                height={60}
                className="filter brightness-110"
              />
            </div>
            <div>
              <div className="text-sm font-bold">Greninja</div>
              <div className="text-xs opacity-70">Gen VI • 2013</div>
              <div className="text-xs mt-1 px-2 py-1 bg-blue-500/20 rounded text-blue-200">
                3D Revolution
              </div>
            </div>
          </div>

          {/* Gen IX - Modern Era */}
          <div className="text-center space-y-3">
            <div className="w-20 h-20 mx-auto rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center backdrop-blur-sm hover:scale-105 transition-transform">
              <Image
                src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/1007.png"
                alt="Koraidon"
                width={60}
                height={60}
                className="filter brightness-110"
              />
            </div>
            <div>
              <div className="text-sm font-bold">Koraidon</div>
              <div className="text-xs opacity-70">Gen IX • 2022</div>
              <div className="text-xs mt-1 px-2 py-1 bg-purple-500/20 rounded text-purple-200">
                Open World
              </div>
            </div>
          </div>
        </div>

        {/* Evolution progress bar */}
        <div className="relative mt-8">
          <div className="h-2 bg-white/10 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-green-400 via-blue-400 to-purple-400 rounded-full animate-pulse"></div>
          </div>
          <div className="flex justify-between text-xs mt-2 opacity-70">
            <span>1996</span>
            <span>2013</span>
            <span>2024</span>
          </div>
        </div>
      </div>
    </div>
  );
}
