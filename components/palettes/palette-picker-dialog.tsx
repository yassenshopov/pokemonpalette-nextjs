import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from '@/components/ui/button';
import { SavedPalettes } from './saved-palettes';
import { SavedPalette } from '@/lib/utils';
import { Palette, PanelTop } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface PalettePickerDialogProps {
  onSelectPalette: (palette: SavedPalette) => void;
  trigger?: React.ReactNode;
  menuMode?: boolean;
}

export function PalettePickerDialog({ onSelectPalette, trigger, menuMode = false }: PalettePickerDialogProps) {
  const [open, setOpen] = useState(false);
  
  const handleSelect = (palette: SavedPalette) => {
    onSelectPalette(palette);
    setOpen(false);
  };
  
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="outline" size="sm" className="gap-2">
            <Palette className="h-4 w-4" />
            Load Palette
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className={`${menuMode ? 'sm:max-w-[850px]' : 'sm:max-w-[700px]'} max-h-[85vh] overflow-hidden flex flex-col`}>
        <DialogHeader className={menuMode ? 'text-center' : ''}>
          <DialogTitle className="flex items-center gap-2 justify-center">
            {menuMode && <PanelTop className="h-5 w-5" />}
            My Saved Palettes
          </DialogTitle>
          <DialogDescription>
            {menuMode 
              ? "Choose a palette to apply to the current Pokémon or click a palette to view that Pokémon"
              : "Choose a palette to apply to the current Pokémon"
            }
          </DialogDescription>
        </DialogHeader>
        
        <AnimatePresence>
          <motion.div 
            className="flex-1 overflow-hidden mt-4"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            <SavedPalettes onSelectPalette={handleSelect} isDialog />
          </motion.div>
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  );
} 