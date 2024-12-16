import React from 'react';

interface ColorSelectorProps {
  colors: string[]; // Array of color strings
  selectedColor: string; // Currently selected color
  onColorSelect: (color: string) => void; // Function to call when a color is selected
  className?: string; // Optional className prop for additional styling
}

const ColorSelector: React.FC<ColorSelectorProps> = ({ colors, selectedColor, onColorSelect, className }) => {
  return (
    <div className={`flex space-x-2 ${className} absolute top-0 right-2`}>
      {colors.slice(0, 3).map((color, index) => (
        <div
          key={index}
          className={`w-4 h-4 rounded-full cursor-pointer transition-all duration-300 ${
            selectedColor === color
              ? 'border-2 border-gray-800 dark:border-gray-200'
              : 'border-2 border-gray-200 dark:border-gray-800'
          }`}
          style={{ backgroundColor: color }}
          onClick={() => onColorSelect(color)}
        />
      ))}
    </div>
  );
};

export default ColorSelector; 