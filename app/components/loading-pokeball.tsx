'use client';

import { cn } from "@/lib/utils";

interface LoadingPokeballProps {
  className?: string;
}

export function LoadingPokeball({ className }: LoadingPokeballProps) {
  return (
    <div className={cn("animate-spin", className)}>
      <svg
        width="100%"
        height="100%"
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle cx="50" cy="50" r="45" stroke="currentColor" strokeWidth="10" />
        <path
          d="M5 50h90M50 5v90"
          stroke="currentColor"
          strokeWidth="10"
        />
        <circle cx="50" cy="50" r="12" fill="currentColor" />
      </svg>
    </div>
  );
} 