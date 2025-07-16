import { Card } from '@/components/ui/card';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Coffee, Heart, Check, User } from 'lucide-react';
import { fetchSupporters, Supporter } from '@/lib/supporters';

interface BuyMeCoffeeProps {
  mainColor: string;
  secondaryColor: string;
  tertiaryColor: string;
  getContrastColor: (color: string) => { text: string; overlay: string };
}

export function BuyMeCoffee({
  mainColor,
  secondaryColor,
  tertiaryColor,
  getContrastColor,
}: BuyMeCoffeeProps) {
  // States
  const [isExploding, setIsExploding] = useState<boolean>(false);
  const [showThankYou, setShowThankYou] = useState<boolean>(false);
  const [latestSupporters, setLatestSupporters] = useState<Supporter[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [supporterCount, setSupporterCount] = useState<number>(0);
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);

  // Handle support click
  const handleSupportClick = () => {
    setIsExploding(true);
    setTimeout(() => {
      setIsExploding(false);
      setShowThankYou(true);
      setTimeout(() => setShowThankYou(false), 2000);
    }, 800);
  };

  // Load supporters data
  useEffect(() => {
    const loadSupporters = async () => {
      try {
        setIsLoading(true);
        const data = await fetchSupporters();

        if (data.success) {
          setLatestSupporters(data.supporters.slice(0, 3));
          setSupporterCount(data.total || 0);
        }
      } catch (err) {
        // Error loading supporters - using fallback data
      } finally {
        setIsLoading(false);
      }
    };

    loadSupporters();
  }, []);

  // Detect dark mode
  useEffect(() => {
    // Check initial dark mode
    setIsDarkMode(
      window.matchMedia('(prefers-color-scheme: dark)').matches ||
        document.documentElement.classList.contains('dark')
    );

    // Watch for dark mode changes
    const darkModeMediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e: MediaQueryListEvent) => setIsDarkMode(e.matches);

    darkModeMediaQuery.addEventListener('change', handleChange);
    return () => darkModeMediaQuery.removeEventListener('change', handleChange);
  }, []);

  // Calculate remaining supporters (minus the ones we're displaying)
  const remainingSupporters = Math.max(0, supporterCount - latestSupporters.length);

  // Get text color for the button based on contrast
  const buttonTextColor = getContrastColor(tertiaryColor).text === 'text-white' ? 'white' : '#333';

  // Dark mode adjusted colors
  const darkMainColor = isDarkMode ? `${mainColor}` : mainColor;
  const darkSecondaryColor = isDarkMode ? `${secondaryColor}` : secondaryColor;

  // Helper function to convert rgb to rgba with opacity
  const rgbToRgba = (rgbColor: string, opacity: number): string => {
    // Extract the RGB values using regex
    const rgbMatch = rgbColor.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/);
    if (rgbMatch) {
      const [_, r, g, b] = rgbMatch;
      return `rgba(${r}, ${g}, ${b}, ${opacity})`;
    }
    return rgbColor; // Return original if format doesn't match
  };

  // Create diluted version of the primary color for card background
  const cardBgOpacity = isDarkMode ? 0.3 : 0.15; // Less opacity in light mode
  const cardBgStyle = {
    backgroundColor: rgbToRgba(mainColor, cardBgOpacity),
  };

  return (
    <Card className="rounded-xl overflow-hidden shadow-none" style={cardBgStyle}>
      {/* Thank you message */}
      {showThankYou && (
        <motion.div
          className="absolute inset-0 bg-background/90 dark:bg-gray-900/90 backdrop-blur-sm flex items-center justify-center z-30"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="flex flex-col items-center text-center p-6"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', damping: 15 }}
          >
            <motion.div
              className="w-14 h-14 rounded-full mb-4 flex items-center justify-center"
              style={{ backgroundColor: tertiaryColor }}
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ repeat: 2, duration: 0.6 }}
            >
              <Heart className="w-7 h-7" style={{ color: buttonTextColor }} />
            </motion.div>
            <h2 className="text-xl font-bold mb-2 dark:text-gray-100">Thank You!</h2>
            <p className="text-muted-foreground dark:text-gray-400">
              Your support makes Pokémon Palette possible.
            </p>
          </motion.div>
        </motion.div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
        {/* Left side */}
        <div className="space-y-6">
          <div className="flex items-start gap-3">
            <div className="mt-1">
              <Heart className="w-10 h-10" style={{ color: darkMainColor }} />
            </div>
            <div>
              <h3 className="text-xl font-bold dark:text-white">Support Pokémon Palette</h3>
              <p className="text-gray-600 dark:text-gray-300 mt-2">
                This tool is completely free and built with <span className="text-red-500">❤</span>{' '}
                by a solo developer. Your support helps fund new features like custom palettes, more
                Pokémon, and advanced color tools.
              </p>
            </div>
          </div>

          {/* Recent supporters */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <User className="w-4 h-4 text-gray-500 dark:text-gray-400" />
              <span className="text-gray-500 dark:text-gray-400 text-sm font-medium">
                Recent Supporters
              </span>
            </div>

            <div className="space-y-2 rounded-lg overflow-hidden dark:border dark:border-gray-800">
              {latestSupporters.map((supporter, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between p-2.5"
                  style={{
                    backgroundColor:
                      i % 2 === 0
                        ? rgbToRgba(darkMainColor, isDarkMode ? 0.3 : 0.15)
                        : rgbToRgba(darkSecondaryColor, isDarkMode ? 0.3 : 0.15),
                  }}
                >
                  <div className="flex items-center gap-2">
                    <div
                      className="w-8 h-8 rounded-full flex items-center justify-center border border-transparent dark:border-gray-700"
                      style={{
                        backgroundColor: i % 2 === 0 ? darkMainColor : darkSecondaryColor,
                        opacity: isDarkMode ? 1 : 0.8,
                      }}
                    >
                      <Coffee className="w-4 h-4 text-white" />
                    </div>
                    <span className="text-gray-900 dark:text-gray-100 font-medium">
                      {supporter.name}
                    </span>
                  </div>
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    {supporter.timeAgo}
                  </span>
                </div>
              ))}

              {/* Visual indication of more supporters - improved design */}
              {remainingSupporters > 0 && (
                <div className="relative p-2.5 bg-gradient-to-b from-gray-50/50 to-gray-100/50 dark:from-gray-800/50 dark:to-gray-900/50 text-center">
                  <div className="flex items-center justify-center">
                    <div className="flex -space-x-2 mr-2">
                      {/* Generate circles based on remaining supporters, max 3 */}
                      {Array.from({ length: Math.min(remainingSupporters, 3) }).map((_, i) => (
                        <div
                          key={i}
                          className="w-6 h-6 rounded-full border-2 border-background dark:border-gray-900"
                          style={{
                            backgroundColor: i % 2 === 0 ? darkMainColor : darkSecondaryColor,
                            opacity: isDarkMode ? 1 : 0.8,
                          }}
                        />
                      ))}
                    </div>
                    <span className="text-sm text-gray-600 dark:text-gray-300 font-medium">
                      and {remainingSupporters} more{' '}
                      {remainingSupporters === 1 ? 'supporter' : 'supporters'}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Benefits listed on both sides in mobile, only on left in desktop */}
          <div className="space-y-2 md:hidden">
            <div className="flex items-center gap-3">
              <Check className="w-5 h-5" style={{ color: tertiaryColor }} />
              <span className="text-gray-600 dark:text-gray-300">Support ongoing development</span>
            </div>
            <div className="flex items-center gap-3">
              <Check className="w-5 h-5" style={{ color: tertiaryColor }} />
              <span className="text-gray-600 dark:text-gray-300">Fund new features</span>
            </div>
            <div className="flex items-center gap-3">
              <Check className="w-5 h-5" style={{ color: tertiaryColor }} />
              <span className="text-gray-600 dark:text-gray-300">
                Keep the tool free for everyone
              </span>
            </div>
          </div>

          {/* Support button with pulsating effect */}
          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="relative mt-2"
          >
            {/* Pulsating background effect */}
            <motion.div
              className="absolute -inset-[3px] rounded-lg opacity-70 dark:opacity-90"
              style={{ backgroundColor: tertiaryColor }}
              animate={{
                scale: [1, 1.03, 1],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                repeatType: 'mirror',
                ease: 'easeInOut',
              }}
            />
            <a
              href="https://www.buymeacoffee.com/yassenshopov"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 py-3 rounded-lg font-semibold w-full relative z-10"
              style={{ backgroundColor: tertiaryColor, color: buttonTextColor }}
              onClick={e => {
                e.preventDefault();
                handleSupportClick();
                window.open('https://www.buymeacoffee.com/yassenshopov', '_blank');
              }}
            >
              <Coffee className="w-5 h-5" />
              <span>Support with 5 €</span>
            </a>
          </motion.div>
        </div>

        {/* Right side */}
        <div className="hidden md:block md:border-l md:pl-6 md:border-gray-200 dark:md:border-gray-800">
          <div className="space-y-4">
            <h4 className="text-gray-600 dark:text-gray-300 font-medium">Your support enables:</h4>

            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="mt-0.5 rounded-full bg-yellow-100 dark:bg-gray-800 p-0.5">
                  <Check className="w-4 h-4" style={{ color: tertiaryColor }} />
                </div>
                <span className="text-gray-700 dark:text-gray-300">
                  Keeping the service free for everyone
                </span>
              </div>

              <div className="flex items-start gap-3">
                <div className="mt-0.5 rounded-full bg-yellow-100 dark:bg-gray-800 p-0.5">
                  <Check className="w-4 h-4" style={{ color: tertiaryColor }} />
                </div>
                <span className="text-gray-700 dark:text-gray-300">
                  Adding more Pokémon and features
                </span>
              </div>

              <div className="flex items-start gap-3">
                <div className="mt-0.5 rounded-full bg-yellow-100 dark:bg-gray-800 p-0.5">
                  <Check className="w-4 h-4" style={{ color: tertiaryColor }} />
                </div>
                <span className="text-gray-700 dark:text-gray-300">
                  More color tools and custom palettes
                </span>
              </div>

              <div className="flex items-start gap-3">
                <div className="mt-0.5 rounded-full bg-yellow-100 dark:bg-gray-800 p-0.5">
                  <Check className="w-4 h-4" style={{ color: tertiaryColor }} />
                </div>
                <span className="text-gray-700 dark:text-gray-300">
                  Motivating an indie developer
                </span>
              </div>
            </div>

            <p className="text-sm text-gray-500 dark:text-gray-400 mt-6 pt-4 border-t border-gray-200 dark:border-gray-800">
              Every contribution, no matter how small, makes a difference. Thank you for your
              support!
            </p>
          </div>
        </div>
      </div>
    </Card>
  );
}
