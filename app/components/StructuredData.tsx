import { useEffect } from 'react';

interface StructuredDataProps {
  pokemonName: string;
  url: string;
  imageUrl: string;
}

export default function StructuredData({ pokemonName, url, imageUrl }: StructuredDataProps) {
  useEffect(() => {
    const formattedName = pokemonName
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');

    const jsonLd = {
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      name: `${formattedName} Color Palette | Pokemon Palette Generator`,
      description: `Explore ${formattedName}'s color palette and create stunning designs. Get exact HEX, RGB, and HSL values for ${formattedName}'s colors.`,
      url: url,
      image: imageUrl,
      mainEntity: {
        '@type': 'SoftwareApplication',
        name: 'Pokemon Palette Generator',
        applicationCategory: 'DesignApplication',
        operatingSystem: 'Web',
        offers: {
          '@type': 'Offer',
          price: '0',
          priceCurrency: 'USD',
        },
        featureList: [
          'Color palette generation',
          'HEX color codes',
          'RGB color values',
          'HSL color values',
          'Color inspiration',
          'Design tools',
        ],
      },
      breadcrumb: {
        '@type': 'BreadcrumbList',
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            name: 'Home',
            item: 'https://pokemonpalette.com',
          },
          {
            '@type': 'ListItem',
            position: 2,
            name: formattedName,
            item: url,
          },
        ],
      },
      publisher: {
        '@type': 'Organization',
        name: 'Pokemon Palette',
        logo: {
          '@type': 'ImageObject',
          url: 'https://pokemonpalette.com/logo.png', // Add your logo URL
        },
      },
      potentialAction: {
        '@type': 'SearchAction',
        target: {
          '@type': 'EntryPoint',
          urlTemplate: 'https://pokemonpalette.com/search?q={search_term_string}',
        },
        'query-input': 'required name=search_term_string',
      },
    };

    // Remove any existing structured data
    const existingScript = document.querySelector('script[type="application/ld+json"]');
    if (existingScript) {
      existingScript.remove();
    }

    // Add new structured data
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.text = JSON.stringify(jsonLd);
    document.head.appendChild(script);

    return () => {
      script.remove();
    };
  }, [pokemonName, url, imageUrl]);

  return null;
}
