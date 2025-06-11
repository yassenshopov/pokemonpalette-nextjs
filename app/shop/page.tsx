import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Shop | Pokemon Palette',
  description: 'Download premium color palette packs and design assets.',
};

const products = [
  {
    title: 'Starter Palette Pack',
    description: '10 curated palette bundles inspired by Kanto Pokémon.',
    price: '€5',
    link: 'https://gumroad.com',
  },
  {
    title: 'Advanced Palette Pack',
    description: '30 advanced palettes and gradient sets.',
    price: '€15',
    link: 'https://gumroad.com',
  },
];

export default function ShopPage() {
  return (
    <div className="max-w-3xl mx-auto p-6 space-y-8">
      <h1 className="text-3xl font-bold">Shop</h1>
      <p className="text-muted-foreground">
        Explore premium palette packs crafted for designers. Purchases open in a new tab.
      </p>
      <div className="space-y-6">
        {products.map(product => (
          <div key={product.title} className="border rounded-lg p-4 space-y-2">
            <h2 className="text-xl font-semibold">{product.title}</h2>
            <p className="text-sm text-muted-foreground">{product.description}</p>
            <a
              href={product.link}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-md transition-colors bg-primary text-primary-foreground hover:bg-primary/90"
            >
              Buy for {product.price}
            </a>
          </div>
        ))}
      </div>
      <p className="text-xs text-muted-foreground">
        Pokemon Palette is not affiliated with "The Pokémon Company" or Nintendo.
      </p>
    </div>
  );
}
