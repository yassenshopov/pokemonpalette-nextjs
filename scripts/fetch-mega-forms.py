#!/usr/bin/env python3
"""
Fetch Mega Evolution and Gigantamax Pokemon forms (IDs 10000+)
and link them to their base Pokemon forms.
"""

import json
import requests
import time
from pathlib import Path
from typing import Dict, Any, List

# Configuration
DATA_FILE = Path("data/pokemon-data.json")
POKEAPI_BASE_URL = "https://pokeapi.co/api/v2"
DELAY_BETWEEN_REQUESTS = 0.5  # Be respectful to the API
MAX_RETRIES = 3

# Mega/Gigantamax Pokemon ID ranges
MEGA_START_ID = 10001  # First Mega form
MEGA_END_ID = 10150    # Last Mega form
GIGANTAMAX_START_ID = 10151  # First Gigantamax form
GIGANTAMAX_END_ID = 10250    # Last Gigantamax form

def load_pokemon_data() -> Dict[str, Any]:
    """Load existing Pokemon data."""
    try:
        with open(DATA_FILE, 'r', encoding='utf-8') as f:
            return json.load(f)
    except FileNotFoundError:
        print(f"Error: {DATA_FILE} not found!")
        return {}
    except json.JSONDecodeError as e:
        print(f"Error parsing JSON: {e}")
        return {}

def save_pokemon_data(data: Dict[str, Any]) -> None:
    """Save Pokemon data to file."""
    try:
        with open(DATA_FILE, 'w', encoding='utf-8') as f:
            json.dump(data, f, indent=2, ensure_ascii=False)
        print(f"Data saved to {DATA_FILE}")
    except Exception as e:
        print(f"Error saving data: {e}")

def fetch_pokemon_with_retry(pokemon_id: int) -> Dict[str, Any] | None:
    """Fetch Pokemon data with retry logic."""
    for attempt in range(MAX_RETRIES):
        try:
            response = requests.get(f"{POKEAPI_BASE_URL}/pokemon/{pokemon_id}", timeout=10)
            response.raise_for_status()
            data = response.json()
            
            # Validate response
            if not isinstance(data, dict) or 'id' not in data:
                print(f"Invalid response for Pokemon {pokemon_id}")
                return None
                
            return data
        except requests.exceptions.RequestException as e:
            print(f"Attempt {attempt + 1} failed for Pokemon {pokemon_id}: {e}")
            if attempt < MAX_RETRIES - 1:
                time.sleep(1 * (attempt + 1))  # Exponential backoff
            else:
                print(f"Failed to fetch Pokemon {pokemon_id} after {MAX_RETRIES} attempts")
                return None
        except Exception as e:
            print(f"Unexpected error for Pokemon {pokemon_id}: {e}")
            return None
    
    return None

def get_base_pokemon_id(mega_name: str) -> int | None:
    """Extract base Pokemon ID from Mega/Gigantamax name."""
    # Remove mega/gigantamax suffixes
    base_name = mega_name.replace('-mega-x', '').replace('-mega-y', '').replace('-mega', '')
    base_name = base_name.replace('-gigantamax', '')
    
    # Handle special cases
    special_cases = {
        'charizard': 6,
        'blastoise': 9,
        'venusaur': 3,
        'mewtwo': 150,
        'alakazam': 65,
        'gengar': 94,
        'kangaskhan': 115,
        'pinsir': 127,
        'gyarados': 130,
        'aerodactyl': 142,
        'ampharos': 181,
        'scizor': 212,
        'heracross': 214,
        'houndoom': 229,
        'tyranitar': 248,
        'blaziken': 257,
        'gardevoir': 282,
        'mawile': 303,
        'aggron': 306,
        'medicham': 308,
        'manectric': 310,
        'banette': 354,
        'absol': 359,
        'garchomp': 445,
        'lucario': 448,
        'abomasnow': 460,
        'gallade': 475,
        'audino': 531,
        'diancie': 719,
        'metagross': 376,
        'kyogre': 382,
        'groudon': 383,
        'rayquaza': 384,
        'lopunny': 428,
        'garchomp': 445,
        'lucario': 448,
        'abomasnow': 460,
        'gallade': 475,
        'audino': 531,
        'diancie': 719,
        'steelix': 208,
        'pidgeot': 18,
        'slowbro': 80,
        'sceptile': 254,
        'swampert': 260,
        'sableye': 302,
        'sharpedo': 319,
        'camerupt': 323,
        'altaria': 334,
        'glalie': 362,
        'salamence': 373,
        'latias': 380,
        'latios': 381,
        'kyogre': 382,
        'groudon': 383,
        'rayquaza': 384,
        'lopunny': 428,
        'gallade': 475,
        'audino': 531,
        'diancie': 719,
        'hoopa': 720,
        'beedrill': 15,
        'pidgeot': 18,
        'slowbro': 80,
        'steelix': 208,
        'sceptile': 254,
        'blaziken': 257,
        'swampert': 260,
        'gardevoir': 282,
        'sableye': 302,
        'mawile': 303,
        'aggron': 306,
        'medicham': 308,
        'manectric': 310,
        'banette': 354,
        'absol': 359,
        'glalie': 362,
        'salamence': 373,
        'metagross': 376,
        'latias': 380,
        'latios': 381,
        'kyogre': 382,
        'groudon': 383,
        'rayquaza': 384,
        'lopunny': 428,
        'gallade': 475,
        'audino': 531,
        'diancie': 719,
        'hoopa': 720,
        'camerupt': 323,
        'altaria': 334,
        'sharpedo': 319,
        'glalie': 362,
        'salamence': 373,
        'metagross': 376,
        'latias': 380,
        'latios': 381,
        'kyogre': 382,
        'groudon': 383,
        'rayquaza': 384,
        'lopunny': 428,
        'gallade': 475,
        'audino': 531,
        'diancie': 719,
        'hoopa': 720,
        'beedrill': 15,
        'pidgeot': 18,
        'slowbro': 80,
        'steelix': 208,
        'sceptile': 254,
        'blaziken': 257,
        'swampert': 260,
        'gardevoir': 282,
        'sableye': 302,
        'mawile': 303,
        'aggron': 306,
        'medicham': 308,
        'manectric': 310,
        'banette': 354,
        'absol': 359,
        'glalie': 362,
        'salamence': 373,
        'metagross': 376,
        'latias': 380,
        'latios': 381,
        'kyogre': 382,
        'groudon': 383,
        'rayquaza': 384,
        'lopunny': 428,
        'gallade': 475,
        'audino': 531,
        'diancie': 719,
        'hoopa': 720,
        'camerupt': 323,
        'altaria': 334,
        'sharpedo': 319,
        'glalie': 362,
        'salamence': 373,
        'metagross': 376,
        'latias': 380,
        'latios': 381,
        'kyogre': 382,
        'groudon': 383,
        'rayquaza': 384,
        'lopunny': 428,
        'gallade': 475,
        'audino': 531,
        'diancie': 719,
        'hoopa': 720
    }
    
    return special_cases.get(base_name)

def fetch_mega_forms() -> Dict[str, Any]:
    """Fetch Mega Evolution and Gigantamax forms."""
    print("Fetching Mega Evolution and Gigantamax forms...")
    print("=" * 60)
    
    # Load existing data
    data = load_pokemon_data()
    if not data:
        print("No existing data found!")
        return {}
    
    pokemon_dict = data.get("pokemon", {})
    mega_forms = {}
    
    # Track progress
    total_forms = (MEGA_END_ID - MEGA_START_ID + 1) + (GIGANTAMAX_END_ID - GIGANTAMAX_START_ID + 1)
    processed = 0
    successful = 0
    failed = 0
    
    print(f"Fetching {total_forms} Mega/Gigantamax forms...")
    
    # Fetch Mega forms (10001-10150)
    for pokemon_id in range(MEGA_START_ID, MEGA_END_ID + 1):
        processed += 1
        print(f"[{processed}/{total_forms}] Fetching Mega form {pokemon_id}...", end=" ")
        
        pokemon_data = fetch_pokemon_with_retry(pokemon_id)
        if pokemon_data:
            # Extract base Pokemon ID
            base_id = get_base_pokemon_id(pokemon_data["name"])
            if base_id:
                # Store the mega form data
                mega_forms[str(pokemon_id)] = {
                    "id": pokemon_data["id"],
                    "name": pokemon_data["name"],
                    "base_pokemon_id": base_id,
                    "form_type": "mega",
                    "types": [t["type"]["name"] for t in pokemon_data.get("types", [])],
                    "height": pokemon_data.get("height", 0) / 10,  # Convert to meters
                    "weight": pokemon_data.get("weight", 0) / 10,  # Convert to kg
                    "base_stats": {
                        "hp": pokemon_data["stats"][0]["base_stat"],
                        "attack": pokemon_data["stats"][1]["base_stat"],
                        "defense": pokemon_data["stats"][2]["base_stat"],
                        "special_attack": pokemon_data["stats"][3]["base_stat"],
                        "special_defense": pokemon_data["stats"][4]["base_stat"],
                        "speed": pokemon_data["stats"][5]["base_stat"],
                    },
                    "abilities": [a["ability"]["name"] for a in pokemon_data.get("abilities", [])],
                    "sprites": {
                        "front_default": pokemon_data["sprites"].get("front_default"),
                        "front_shiny": pokemon_data["sprites"].get("front_shiny"),
                    }
                }
                successful += 1
                print(f"✓ Linked to base Pokemon {base_id}")
            else:
                failed += 1
                print(f"✗ Could not determine base Pokemon")
        else:
            failed += 1
            print(f"✗ Failed to fetch")
        
        # Be respectful to the API
        time.sleep(DELAY_BETWEEN_REQUESTS)
        
        # Save progress every 25 forms
        if processed % 25 == 0:
            data["mega_forms"] = mega_forms
            data["last_mega_fetch"] = time.strftime("%Y-%m-%d %H:%M:%S")
            save_pokemon_data(data)
            print(f"Progress saved: {processed}/{total_forms}")
    
    # Fetch Gigantamax forms (10151-10250)
    for pokemon_id in range(GIGANTAMAX_START_ID, GIGANTAMAX_END_ID + 1):
        processed += 1
        print(f"[{processed}/{total_forms}] Fetching Gigantamax form {pokemon_id}...", end=" ")
        
        pokemon_data = fetch_pokemon_with_retry(pokemon_id)
        if pokemon_data:
            # Extract base Pokemon ID
            base_id = get_base_pokemon_id(pokemon_data["name"])
            if base_id:
                # Store the gigantamax form data
                mega_forms[str(pokemon_id)] = {
                    "id": pokemon_data["id"],
                    "name": pokemon_data["name"],
                    "base_pokemon_id": base_id,
                    "form_type": "gigantamax",
                    "types": [t["type"]["name"] for t in pokemon_data.get("types", [])],
                    "height": pokemon_data.get("height", 0) / 10,  # Convert to meters
                    "weight": pokemon_data.get("weight", 0) / 10,  # Convert to kg
                    "base_stats": {
                        "hp": pokemon_data["stats"][0]["base_stat"],
                        "attack": pokemon_data["stats"][1]["base_stat"],
                        "defense": pokemon_data["stats"][2]["base_stat"],
                        "special_attack": pokemon_data["stats"][3]["base_stat"],
                        "special_defense": pokemon_data["stats"][4]["base_stat"],
                        "speed": pokemon_data["stats"][5]["base_stat"],
                    },
                    "abilities": [a["ability"]["name"] for a in pokemon_data.get("abilities", [])],
                    "sprites": {
                        "front_default": pokemon_data["sprites"].get("front_default"),
                        "front_shiny": pokemon_data["sprites"].get("front_shiny"),
                    }
                }
                successful += 1
                print(f"✓ Linked to base Pokemon {base_id}")
            else:
                failed += 1
                print(f"✗ Could not determine base Pokemon")
        else:
            failed += 1
            print(f"✗ Failed to fetch")
        
        # Be respectful to the API
        time.sleep(DELAY_BETWEEN_REQUESTS)
        
        # Save progress every 25 forms
        if processed % 25 == 0:
            data["mega_forms"] = mega_forms
            data["last_mega_fetch"] = time.strftime("%Y-%m-%d %H:%M:%S")
            save_pokemon_data(data)
            print(f"Progress saved: {processed}/{total_forms}")
    
    # Final save
    data["mega_forms"] = mega_forms
    data["last_mega_fetch"] = time.strftime("%Y-%m-%d %H:%M:%S")
    save_pokemon_data(data)
    
    print("\n" + "=" * 60)
    print("Mega/Gigantamax Forms Fetch Complete!")
    print(f"Successfully fetched: {successful} forms")
    print(f"Failed to fetch: {failed} forms")
    print(f"Total processed: {processed} forms")
    
    return data

def main():
    """Main function to fetch Mega/Gigantamax forms."""
    print("Pokemon Mega/Gigantamax Forms Fetcher")
    print("=" * 60)
    
    # Fetch the forms
    data = fetch_mega_forms()
    
    if data and "mega_forms" in data:
        print(f"\nMega/Gigantamax forms saved to: {DATA_FILE.absolute()}")
        print(f"Total Mega/Gigantamax forms: {len(data['mega_forms'])}")
    else:
        print("No Mega/Gigantamax forms were fetched.")

if __name__ == "__main__":
    main()


