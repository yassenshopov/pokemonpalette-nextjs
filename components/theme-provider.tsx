"use client"

import * as React from "react"
import { ThemeProvider as NextThemesProvider } from "next-themes"
import { type ThemeProviderProps } from "next-themes"

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return (
    <NextThemesProvider 
      attribute="class"
      defaultTheme="system"
      enableSystem
      {...props}
    >
      <style jsx global>{`
        :root[class='dark'] {
          --background: 224 71% 4%;
          --foreground: 213 31% 91%;
          --muted: 223 47% 11%;
          --muted-foreground: 215.4 16.3% 56.9%;
          --card: 224 71% 4%;
          --card-foreground: 213 31% 91%;
          --popover: 224 71% 4%;
          --popover-foreground: 215 20.2% 65.1%;
          --border: 216 34% 17%;
          --input: 216 34% 17%;
        }
      `}</style>
      {children}
    </NextThemesProvider>
  )
} 