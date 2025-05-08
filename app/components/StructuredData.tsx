import React from 'react';

interface StructuredDataProps {
  pokemonName?: string;
  description?: string;
  url: string;
  imageUrl?: string;
}

export default function StructuredData({
  pokemonName,
  description = 'Generate beautiful color palettes from Pokemon. Find the perfect color scheme inspired by your favorite Pokemon for your next design project.',
  url,
  imageUrl,
}: StructuredDataProps) {
  // Format the Pokemon name
  const formattedName = pokemonName
    ? pokemonName
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ')
    : '';

  const pageTitle = pokemonName
    ? `${formattedName} Color Palette | Pokemon Palette`
    : 'Pokemon Palette - Color Palettes Inspired by Pokemon';

  const pageDescription = pokemonName
    ? `Generate beautiful color palettes inspired by ${formattedName}. Get matching colors, HEX, RGB, and HSL values for your next design project.`
    : description;

  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: 'Pokemon Palette',
    applicationCategory: 'DesignApplication',
    operatingSystem: 'Web',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
      availability: 'https://schema.org/InStock',
    },
    description: pageDescription,
    url: url,
    image: imageUrl,
    screenshot: imageUrl,
    creator: {
      '@type': 'Person',
      name: 'Yassen Shopov',
    },
    ...(pokemonName && {
      about: {
        '@type': 'Thing',
        name: formattedName,
      },
    }),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
}
