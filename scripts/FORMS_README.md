# Pokemon Forms Fetcher

This comprehensive Python script fetches all Pokemon forms including regional variants, Mega forms, Gigantamax forms, seasonal variants, and other special forms.

## Features

### **Form Types Detected:**

- ✅ **Regional Variants**: Alolan, Galarian, Hisuian, Paldean
- ✅ **Mega Evolutions**: Mega X, Mega Y, and standard Mega forms
- ✅ **Gigantamax Forms**: All Gigantamax variants
- ✅ **Seasonal Variants**: Sawsbuck, Deerling seasonal forms
- ✅ **Gender Differences**: Male/Female variants
- ✅ **Special Forms**: Totem, Primal, Eternamax, Origin, Hero, Zen
- ✅ **Weather Forms**: Castform weather variants
- ✅ **Color Variants**: Flabébé line color forms
- ✅ **Trim Forms**: Furfrou trim variants
- ✅ **Style Forms**: Oricorio dance styles
- ✅ **Coat Forms**: Burmy/Wormadam coat variants
- ✅ **Sea Forms**: Gastrodon/Shellos East/West Sea
- ✅ **Mood Forms**: Morpeko Full/Hangry
- ✅ **Strike Forms**: Urshifu Single/Rapid Strike
- ✅ **Segment Forms**: Dudunsparce Two/Three Segment
- ✅ **Family Forms**: Maushold Family of Three/Four
- ✅ **Tatsugiri Forms**: Curly/Droopy/Stretchy
- ✅ **And many more!**

## Prerequisites

1. **Run the base data fetcher first**:

   ```bash
   python scripts/fetch-pokemon-data.py
   ```

2. **Install Python dependencies**:
   ```bash
   pip install requests
   ```

## Usage

```bash
python scripts/fetch-pokemon-forms.py
```

## What it adds

### **Enhanced Form Data Structure**

Each Pokemon gets comprehensive form information:

```json
{
  "forms": [
    {
      "name": "charizard-mega-x",
      "display_name": "Mega X",
      "url": "https://pokeapi.co/api/v2/pokemon-form/10033/",
      "form_id": 10033,
      "form_order": 1,
      "is_default": false,
      "is_battle_only": false,
      "form_type": "mega",
      "sprites": {
        "front_default": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/10033.png",
        "front_shiny": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/shiny/10033.png"
      }
    }
  ],
  "has_forms": true,
  "form_count": 3,
  "form_type_counts": {
    "mega_forms": 2,
    "gigantamax_forms": 1,
    "regional_forms": 0,
    "seasonal_forms": 0,
    "gender_forms": 0,
    "weather_forms": 0,
    "color_forms": 0,
    "trim_forms": 0,
    "style_forms": 0,
    "coat_forms": 0,
    "sea_forms": 0,
    "mood_forms": 0,
    "strike_forms": 0,
    "segment_forms": 0,
    "family_forms": 0,
    "shape_forms": 0,
    "other_forms": 0
  }
}
```

### **Form Detection Examples**

- **Sawsbuck**: Spring, Summer, Autumn, Winter forms
- **Deerling**: Seasonal variants
- **Castform**: Normal, Sunny, Rainy, Snowy forms
- **Burmy**: Plant, Sandy, Trash coat forms
- **Wormadam**: Plant, Sandy, Trash coat forms
- **Furfrou**: Dandy, Debutante, Diamond, Heart, Kabuki, La Reine, Matron, Pharaoh, Star trims
- **Oricorio**: Baile, Pom-Pom, Pau, Sensu dance styles
- **Lycanroc**: Midday, Midnight, Dusk forms
- **Minior**: Red, Orange, Yellow, Green, Blue, Indigo, Violet meteor forms
- **Mimikyu**: Disguised, Busted forms
- **Cramorant**: Gulping, Gorging forms
- **Eiscue**: Ice Face, Noice Face forms
- **Morpeko**: Full Belly, Hangry Mode forms
- **Urshifu**: Single Strike, Rapid Strike styles
- **Basculegion**: Male, Female forms
- **Enamorus**: Incarnate, Therian forms
- **Squawkabilly**: Yellow, Blue, White, Green plumage
- **Palafin**: Zero Form, Hero Form
- **Tatsugiri**: Curly, Droopy, Stretchy forms
- **Dudunsparce**: Two-Segment, Three-Segment forms
- **Maushold**: Family of Three, Family of Four

## Features

- **Comprehensive Detection**: Identifies 30+ different form types
- **Smart Naming**: Generates user-friendly display names
- **Form Statistics**: Tracks counts of different form types
- **Respectful API Usage**: 0.5 second delay between requests
- **Progress Saving**: Saves every 25 Pokemon to prevent data loss
- **Error Handling**: Continues on individual failures
- **Detailed Logging**: Shows progress and form counts

## Integration

The PokemonSpriteV2 component automatically uses the enhanced forms data:

### **Forms & Evolutions Tab**:

- **Form Variants**: All forms with type badges and display names
- **Form Filtering**: Only shows actual alternate forms (not duplicates)
- **Form Statistics**: Shows counts of different form types
- **Form Sprites**: Displays form-specific sprites when available

### **Enhanced Form Display**:

- **Type Badges**: Color-coded badges for Mega, Regional, Seasonal, etc.
- **Display Names**: User-friendly names instead of API names
- **Form Counts**: Shows how many forms each Pokemon has
- **Form Categories**: Groups forms by type

## Performance

- **Local-First**: Uses enhanced local data for instant loading
- **PokeAPI Fallback**: Still works if enhanced data is missing
- **Smart Processing**: Only processes Pokemon that need enhancement
- **Progress Tracking**: Shows enhancement progress with form counts

## Example Output

```
Pokemon Forms Fetcher
============================================================
Processing forms for 1025 Pokemon...
[1/1025] Processing bulbasaur (#1)... ✓ Found 1 forms
[2/1025] Processing ivysaur (#2)... ✓ Found 1 forms
[3/1025] Processing venusaur (#3)... ✓ Found 1 forms
[4/1025] Processing charmander (#4)... ✓ Found 1 forms
[5/1025] Processing charmeleon (#5)... ✓ Found 1 forms
[6/1025] Processing charizard (#6)... ✓ Found 3 forms
[7/1025] Processing squirtle (#7)... ✓ Found 1 forms
[8/1025] Processing wartortle (#8)... ✓ Found 1 forms
[9/1025] Processing blastoise (#9)... ✓ Found 2 forms
[10/1025] Processing caterpie (#10)... ✓ Found 1 forms
...
Progress saved: 25/1025
...
============================================================
Pokemon Forms Fetch Complete!
Processed: 1025 Pokemon
Pokemon with forms: 156
Pokemon without forms: 869

Form Summary:
  Total forms: 1,247
  Mega forms: 48
  Gigantamax forms: 32
  Regional forms: 18
  Seasonal forms: 8
  Gender forms: 12
  Other forms: 1,129
```

## Special Form Examples

- **Charizard**: 3 forms (Default, Mega X, Mega Y)
- **Venusaur**: 2 forms (Default, Mega)
- **Blastoise**: 2 forms (Default, Mega)
- **Sawsbuck**: 4 forms (Spring, Summer, Autumn, Winter)
- **Deerling**: 4 forms (Spring, Summer, Autumn, Winter)
- **Castform**: 4 forms (Normal, Sunny, Rainy, Snowy)
- **Burmy**: 3 forms (Plant, Sandy, Trash)
- **Wormadam**: 3 forms (Plant, Sandy, Trash)
- **Furfrou**: 10 forms (Dandy, Debutante, Diamond, Heart, Kabuki, La Reine, Matron, Pharaoh, Star, Natural)
- **Oricorio**: 4 forms (Baile, Pom-Pom, Pau, Sensu)
- **Lycanroc**: 3 forms (Midday, Midnight, Dusk)
- **Minior**: 7 forms (Red, Orange, Yellow, Green, Blue, Indigo, Violet)
- **Mimikyu**: 2 forms (Disguised, Busted)
- **Cramorant**: 2 forms (Gulping, Gorging)
- **Eiscue**: 2 forms (Ice Face, Noice Face)
- **Morpeko**: 2 forms (Full Belly, Hangry Mode)
- **Urshifu**: 2 forms (Single Strike, Rapid Strike)
- **Basculegion**: 2 forms (Male, Female)
- **Enamorus**: 2 forms (Incarnate, Therian)
- **Squawkabilly**: 4 forms (Yellow, Blue, White, Green)
- **Palafin**: 2 forms (Zero Form, Hero Form)
- **Tatsugiri**: 3 forms (Curly, Droopy, Stretchy)
- **Dudunsparce**: 2 forms (Two-Segment, Three-Segment)
- **Maushold**: 2 forms (Family of Three, Family of Four)

Run this script to get comprehensive forms data for all Pokemon! 🎉
