interface LoadingPokeballProps {
  className?: string;
}

export function LoadingPokeball({ className }: LoadingPokeballProps) {
  return (
    <div className={`animate-spin ${className}`}>
      <img src="/pokeball.svg" alt="Loading..." />
    </div>
  );
} 