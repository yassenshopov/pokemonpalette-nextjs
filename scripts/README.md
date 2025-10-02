# Pokemon Data Fetcher

This Python script fetches comprehensive Pokemon data from PokeAPI and stores it locally for faster access in the PokemonSpriteV2 component.

## Usage

1. **Install Python dependencies** (if needed):

   ```bash
   pip install requests
   ```

2. **Run the script**:
   ```bash
   python scripts/fetch-pokemon-data.py
   ```

## What it does

- Fetches Pokemon data for all Pokemon (1-1025 by default)
- Stores data in `data/pokemon-data.json`
- Includes comprehensive information:
  - Basic stats (height, weight, types)
  - Base stats (HP, Attack, Defense, etc.)
  - Abilities, generation, habitat
  - Legendary/Mythical status
  - Flavor text entries
  - And more!

## Features

- **Respectful API usage**: 0.1 second delay between requests
- **Progress saving**: Saves every 50 Pokemon to prevent data loss
- **Error handling**: Continues on individual failures
- **Resume capability**: Skips already fetched Pokemon
- **Comprehensive data**: Fetches both Pokemon and Species data

## Output

The script creates `data/pokemon-data.json` with this structure:

```json
{
  "pokemon": {
    "1": {
      "id": 1,
      "name": "bulbasaur",
      "height": 0.7,
      "weight": 6.9,
      "types": ["grass", "poison"],
      "base_stats": { ... },
      "abilities": [ ... ],
      ...
    }
  },
  "last_updated": "2024-01-01 12:00:00"
}
```

## Integration

The PokemonSpriteV2 component automatically:

1. Tries to load data from `data/pokemon-data.json`
2. Falls back to PokeAPI if local data is missing
3. Displays comprehensive Pokemon information in the Information tab

Run this script once to populate your local Pokemon database for optimal performance!




