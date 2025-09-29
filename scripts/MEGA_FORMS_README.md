# Fetch Mega/Gigantamax Forms Script

This script fetches Mega Evolution and Gigantamax Pokemon forms (IDs 10000+) from the PokeAPI and links them to their base Pokemon forms.

## What it does

- Fetches Pokemon with IDs 10001-10150 (Mega forms)
- Fetches Pokemon with IDs 10151-10250 (Gigantamax forms)
- Links each form to its base Pokemon (e.g., Mega Charizard X → Charizard)
- Stores the data in `data/pokemon-data.json` under the `mega_forms` key

## Usage

```bash
python scripts/fetch-mega-forms.py
```

## Output

The script will:

1. Fetch each Mega/Gigantamax form from PokeAPI
2. Extract the base Pokemon ID from the form name
3. Store comprehensive data including types, stats, abilities, and sprites
4. Save progress every 25 forms
5. Display a summary of successful/failed fetches

## Data Structure

Each Mega/Gigantamax form is stored with:

- `id`: The form's Pokemon ID (10000+)
- `name`: The form's name (e.g., "charizard-mega-x")
- `base_pokemon_id`: The base Pokemon's ID (e.g., 6 for Charizard)
- `form_type`: Either "mega" or "gigantamax"
- `types`: Array of type names
- `height`: Height in meters
- `weight`: Weight in kg
- `base_stats`: Complete stat block
- `abilities`: Array of ability names
- `sprites`: Front default and shiny sprites

## Rate Limiting

The script includes a 0.5-second delay between requests to be respectful to the PokeAPI.

## Error Handling

- Retries failed requests up to 3 times with exponential backoff
- Continues processing even if individual forms fail
- Provides detailed error reporting


