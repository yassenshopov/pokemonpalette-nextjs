import { useEffect } from 'react';

interface StructuredDataProps {
  pokemonName?: string;
  url: string;
  imageUrl: string;
}

export default function StructuredData({ pokemonName, url, imageUrl }: StructuredDataProps) {
  useEffect(() => {
    const formattedName = pokemonName
      ? pokemonName
          .split('-')
          .map(word => word.charAt(0).toUpperCase() + word.slice(1))
          .join(' ')
      : 'Pokemon Palette Generator';

    // Create the main software application entity
    const softwareApplication = {
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
      // AI-specific enhancements
      audience: {
        '@type': 'Audience',
        audienceType: 'Designers, Artists, Developers, Pokemon Fans',
      },
      softwareVersion: '1.0',
      downloadUrl: 'https://pokemonpalette.com',
      installUrl: 'https://pokemonpalette.com',
      screenshot: imageUrl,
      softwareRequirements: 'Modern web browser with JavaScript enabled',
      permissions: 'No special permissions required',
      releaseNotes: 'Free web-based Pokemon color palette generator',
    };

    // Create FAQ schema
    const faqSchema = pokemonName
      ? {
          '@type': 'FAQPage',
          mainEntity: [
            {
              '@type': 'Question',
              name: `What colors does ${formattedName} have?`,
              acceptedAnswer: {
                '@type': 'Answer',
                text: `${formattedName} has a unique color palette that can be extracted and used for design projects. The colors include various shades that represent ${formattedName}'s appearance.`,
              },
            },
            {
              '@type': 'Question',
              name: `How can I use ${formattedName}'s colors in my design?`,
              acceptedAnswer: {
                '@type': 'Answer',
                text: `You can copy the HEX, RGB, or HSL color values from ${formattedName}'s palette and use them in any design software, web development, or art project.`,
              },
            },
            {
              '@type': 'Question',
              name: 'What color formats are supported?',
              acceptedAnswer: {
                '@type': 'Answer',
                text: 'The Pokemon Palette Generator supports HEX, RGB, and HSL color formats, making it compatible with all major design tools and development environments.',
              },
            },
          ],
        }
      : {
          '@type': 'FAQPage',
          mainEntity: [
            {
              '@type': 'Question',
              name: 'What is Pokemon Palette Generator?',
              acceptedAnswer: {
                '@type': 'Answer',
                text: 'Pokemon Palette Generator is a free web tool that extracts color palettes from Pokemon artwork, providing designers and artists with inspiration and exact color values for their projects.',
              },
            },
            {
              '@type': 'Question',
              name: 'How do I use the Pokemon Palette Generator?',
              acceptedAnswer: {
                '@type': 'Answer',
                text: 'Simply select a Pokemon from the menu, and the tool will automatically extract and display the color palette with HEX, RGB, and HSL values that you can copy and use.',
              },
            },
            {
              '@type': 'Question',
              name: 'Is Pokemon Palette Generator free to use?',
              acceptedAnswer: {
                '@type': 'Answer',
                text: 'Yes, Pokemon Palette Generator is completely free to use. No registration or payment required.',
              },
            },
          ],
        };

    // Create HowTo schema for homepage only
    const howToSchema = pokemonName
      ? null
      : {
          '@type': 'HowTo',
          name: 'How to Generate Pokemon Color Palettes',
          description: 'Step-by-step guide to using Pokemon Palette Generator',
          image: imageUrl,
          totalTime: 'PT1M',
          estimatedCost: {
            '@type': 'MonetaryAmount',
            currency: 'USD',
            value: '0',
          },
          step: [
            {
              '@type': 'HowToStep',
              name: 'Select a Pokemon',
              text: 'Choose your favorite Pokemon from the dropdown menu or search for a specific Pokemon.',
              image: 'https://pokemonpalette.com/images/step1.png',
            },
            {
              '@type': 'HowToStep',
              name: 'View the Color Palette',
              text: "The tool will automatically extract and display the Pokemon's color palette with multiple color blocks.",
              image: 'https://pokemonpalette.com/images/step2.png',
            },
            {
              '@type': 'HowToStep',
              name: 'Copy Color Values',
              text: 'Click on any color block or use the format dropdown to copy HEX, RGB, or HSL values.',
              image: 'https://pokemonpalette.com/images/step3.png',
            },
            {
              '@type': 'HowToStep',
              name: 'Use in Your Project',
              text: 'Paste the color values into your design software, code editor, or any creative project.',
              image: 'https://pokemonpalette.com/images/step4.png',
            },
          ],
        };

    const jsonLd = {
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      name: pokemonName
        ? `${formattedName} Color Palette | Pokemon Palette Generator`
        : 'Pokemon Palette Generator',
      description: pokemonName
        ? `Explore ${formattedName}'s color palette and create stunning designs. Get exact HEX, RGB, and HSL values for ${formattedName}'s colors.`
        : 'Generate beautiful color palettes from your favorite Pokemon. Get exact HEX, RGB, and HSL values for your designs.',
      url: url,
      image: imageUrl,
      mainEntity: [softwareApplication, faqSchema, ...(howToSchema ? [howToSchema] : [])],
      breadcrumb: {
        '@type': 'BreadcrumbList',
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            name: 'Home',
            item: 'https://pokemonpalette.com',
          },
          ...(pokemonName
            ? [
                {
                  '@type': 'ListItem',
                  position: 2,
                  name: formattedName,
                  item: url,
                },
              ]
            : []),
        ],
      },
      publisher: {
        '@type': 'Organization',
        name: 'Pokemon Palette',
        logo: {
          '@type': 'ImageObject',
          url: 'https://pokemonpalette.com/logo.png',
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
