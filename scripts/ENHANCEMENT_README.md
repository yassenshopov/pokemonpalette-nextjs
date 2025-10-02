# Pokemon Data Enhancer

This Python script enhances the existing `pokemon-data.json` with comprehensive forms and evolution chain data.

## Prerequisites

1. **Run the base data fetcher first**:

   ```bash
   python scripts/fetch-pokemon-data.py
   ```

2. **Install Python dependencies** (if needed):
   ```bash
   pip install requests
   ```

## Usage

```bash
python scripts/enhance-pokemon-data.py
```

## What it adds

### **Evolution Chains**

- Complete evolution family trees
- Evolution requirements (level, items, time of day, etc.)
- Visual evolution chain display in the Forms & Evolutions tab
- Recursive evolution data structure

### **Form Variants**

- All Pokemon forms (Mega, Gigantamax, Regional variants)
- Form type detection (Alolan, Galarian, Hisuian, Paldean)
- Default form identification
- Form switching capabilities

### **Enhanced Species Data**

- Pokemon color and shape
- Gender differences information
- Forms switchable status
- Extended flavor text entries
- Detailed egg group information

## Enhanced Data Structure

The script adds these fields to each Pokemon:

```json
{
  "evolution_chain": {
    "id": 1,
    "chain": {
      "id": 1,
      "name": "bulbasaur",
      "level": 0,
      "evolves_to": [
        {
          "id": 2,
          "name": "ivysaur",
          "level": 1,
          "evolution_details": [
            {
              "trigger": "level-up",
              "min_level": 16
            }
          ],
          "evolves_to": [...]
        }
      ]
    }
  },
  "forms": [
    {
      "name": "bulbasaur",
      "url": "...",
      "is_default": true,
      "is_mega": false,
      "is_gigantamax": false,
      "is_alolan": false,
      "is_galarian": false,
      "is_hisui": false,
      "is_paldean": false
    }
  ],
  "color": "green",
  "shape": "quadruped",
  "has_gender_differences": false,
  "forms_switchable": false,
  "order": 1
}
```

## Features

- **Respectful API Usage**: 0.1 second delay between requests
- **Progress Saving**: Saves every 25 Pokemon to prevent data loss
- **Error Handling**: Continues on individual failures
- **Resume Capability**: Only processes Pokemon that need enhancement
- **Comprehensive Data**: Fetches evolution chains, forms, and species details

## Integration

The PokemonSpriteV2 component automatically uses the enhanced data:

### **Forms & Evolutions Tab**:

- **Evolution Chain**: Visual tree with sprites and requirements
- **Form Variants**: All forms with type badges (Mega, Regional, etc.)
- **Evolution Details**: Level requirements, items, time conditions
- **Current Pokemon Highlighting**: Shows which Pokemon is currently selected

### **Enhanced Information**:

- Pokemon color and shape
- Gender differences
- Forms switchable status
- Extended flavor text

## Performance

- **Local-First**: Uses enhanced local data for instant loading
- **PokeAPI Fallback**: Still works if enhanced data is missing
- **Smart Processing**: Only enhances Pokemon that need it
- **Progress Tracking**: Shows enhancement progress

## Example Evolution Chains

- **Bulbasaur → Ivysaur → Venusaur**: Level-based evolution
- **Eevee**: Multiple evolution paths with different items/stones
- **Pikachu → Raichu**: Thunder Stone evolution
- **Regional Variants**: Alolan/Galarian forms with different evolution paths

Run this script after the base data fetcher to get comprehensive forms and evolution data! 🎉




