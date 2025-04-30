import './globals.css';
import { Providers } from './providers';

export const metadata = {
  title: 'Pokemon Palette',
  description: 'Generate color palettes from Pokemon sprites',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
