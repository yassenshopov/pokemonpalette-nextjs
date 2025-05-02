import Image from 'next/image';

interface LoadingPokeballProps {
  className?: string;
}

export function LoadingPokeball({ className }: LoadingPokeballProps) {
  return (
    <div className={`animate-spin ${className}`}>
      <Image src="/pokeball.svg" alt="Loading..." width={24} height={24} />
    </div>
  );
} 