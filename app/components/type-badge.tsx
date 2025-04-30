import { cn } from "@/lib/utils";

const typeColors = {
  normal: { bg: "bg-[#A8A878]", text: "text-white" },
  fire: { bg: "bg-[#F08030]", text: "text-white" },
  water: { bg: "bg-[#6890F0]", text: "text-white" },
  electric: { bg: "bg-[#F8D030]", text: "text-black" },
  grass: { bg: "bg-[#78C850]", text: "text-white" },
  ice: { bg: "bg-[#98D8D8]", text: "text-black" },
  fighting: { bg: "bg-[#C03028]", text: "text-white" },
  poison: { bg: "bg-[#A040A0]", text: "text-white" },
  ground: { bg: "bg-[#E0C068]", text: "text-black" },
  flying: { bg: "bg-[#A890F0]", text: "text-white" },
  psychic: { bg: "bg-[#F85888]", text: "text-white" },
  bug: { bg: "bg-[#A8B820]", text: "text-white" },
  rock: { bg: "bg-[#B8A038]", text: "text-white" },
  ghost: { bg: "bg-[#705898]", text: "text-white" },
  dragon: { bg: "bg-[#7038F8]", text: "text-white" },
  dark: { bg: "bg-[#705848]", text: "text-white" },
  steel: { bg: "bg-[#B8B8D0]", text: "text-black" },
  fairy: { bg: "bg-[#EE99AC]", text: "text-black" },
};

interface TypeBadgeProps {
  type: keyof typeof typeColors;
  isMatch?: boolean;
  className?: string;
  children?: React.ReactNode;
}

export function TypeBadge({ type, isMatch, className, children }: TypeBadgeProps) {
  return (
    <span
      className={cn(
        "type-badge px-3 py-1 rounded-full text-xs font-medium capitalize inline-flex items-center gap-1 transition-all",
        typeColors[type].bg,
        typeColors[type].text,
        isMatch && "ring-2 ring-offset-2 ring-offset-background ring-green-500",
        className
      )}
    >
      {children || type}
      {isMatch !== undefined && !children && (
        <span className="inline-block w-3 h-3">
          {isMatch ? "✓" : "✕"}
        </span>
      )}
    </span>
  );
} 