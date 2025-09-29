#!/usr/bin/env python3
"""
Pokemon Data Fetcher
Fetches Pokemon data from PokeAPI and stores it locally for faster access.
"""

import json
import requests
import time
from pathlib import Path
from typing import Dict, List, Any

# Configuration
POKEAPI_BASE_URL = "https://pokeapi.co/api/v2"
OUTPUT_DIR = Path("data")
POKEMON_DATA_FILE = OUTPUT_DIR / "pokemon-data.json"
MAX_POKEMON = 1025  # Get all Pokemon
DELAY_BETWEEN_REQUESTS = 0.5  # Be respectful to PokeAPI

def create_output_directory():
    """Create the output directory if it doesn't exist."""
    OUTPUT_DIR.mkdir(exist_ok=True)
    print(f"Output directory: {OUTPUT_DIR.absolute()}")

def fetch_pokemon_data(pokemon_id: int) -> Dict[str, Any]:
    """
    Fetch Pokemon data from PokeAPI.
    
    Args:
        pokemon_id: The Pokemon ID to fetch
        
    Returns:
        Dictionary containing Pokemon data
    """
    try:
        # Fetch Pokemon data with retry logic
        pokemon_url = f"{POKEAPI_BASE_URL}/pokemon/{pokemon_id}"
        
        for attempt in range(3):  # Try up to 3 times
            try:
                pokemon_response = requests.get(pokemon_url, timeout=15)
                pokemon_response.raise_for_status()
                pokemon_data = pokemon_response.json()
                
                # Validate the response
                if not pokemon_data or not isinstance(pokemon_data, dict):
                    print(f"  ⚠️ Invalid Pokemon data for {pokemon_id} (attempt {attempt + 1})")
                    if attempt < 2:
                        time.sleep(1)  # Wait before retry
                        continue
                    return None
                    
                break  # Success, exit retry loop
                
            except requests.exceptions.RequestException as e:
                print(f"  ⚠️ Request error for Pokemon {pokemon_id} (attempt {attempt + 1}): {e}")
                if attempt < 2:
                    time.sleep(2)  # Wait longer before retry
                    continue
                return None
        
        # Check if species data exists
        if not pokemon_data.get("species") or not pokemon_data["species"].get("url"):
            print(f"  ⚠️ No species data for Pokemon {pokemon_id}")
            return None
            
        # Fetch species data for additional info with retry logic
        species_url = pokemon_data["species"]["url"]
        
        for attempt in range(3):  # Try up to 3 times
            try:
                species_response = requests.get(species_url, timeout=15)
                species_response.raise_for_status()
                species_data = species_response.json()
                
                # Validate the response
                if not species_data or not isinstance(species_data, dict):
                    print(f"  ⚠️ Invalid species data for Pokemon {pokemon_id} (attempt {attempt + 1})")
                    if attempt < 2:
                        time.sleep(1)  # Wait before retry
                        continue
                    species_data = None  # Use None if all attempts fail
                    
                break  # Success, exit retry loop
                
            except requests.exceptions.RequestException as e:
                print(f"  ⚠️ Species request error for Pokemon {pokemon_id} (attempt {attempt + 1}): {e}")
                if attempt < 2:
                    time.sleep(2)  # Wait longer before retry
                    continue
                species_data = None  # Use None if all attempts fail
        
        # Extract relevant data with comprehensive error handling
        pokemon_info = {
            "id": pokemon_data.get("id", pokemon_id),
            "name": pokemon_data.get("name", f"pokemon-{pokemon_id}"),
            "height": (pokemon_data.get("height", 0) / 10) if pokemon_data.get("height") else 0,
            "weight": (pokemon_data.get("weight", 0) / 10) if pokemon_data.get("weight") else 0,
            "types": [type_info["type"]["name"] for type_info in pokemon_data.get("types", [])],
            "base_stats": {
                "hp": pokemon_data["stats"][0]["base_stat"] if pokemon_data.get("stats") and len(pokemon_data["stats"]) > 0 else 0,
                "attack": pokemon_data["stats"][1]["base_stat"] if pokemon_data.get("stats") and len(pokemon_data["stats"]) > 1 else 0,
                "defense": pokemon_data["stats"][2]["base_stat"] if pokemon_data.get("stats") and len(pokemon_data["stats"]) > 2 else 0,
                "special_attack": pokemon_data["stats"][3]["base_stat"] if pokemon_data.get("stats") and len(pokemon_data["stats"]) > 3 else 0,
                "special_defense": pokemon_data["stats"][4]["base_stat"] if pokemon_data.get("stats") and len(pokemon_data["stats"]) > 4 else 0,
                "speed": pokemon_data["stats"][5]["base_stat"] if pokemon_data.get("stats") and len(pokemon_data["stats"]) > 5 else 0,
            },
            "abilities": [ability["ability"]["name"] for ability in pokemon_data.get("abilities", [])],
            "generation": (species_data.get("generation") or {}).get("name", "unknown") if species_data else "unknown",
            "habitat": (species_data.get("habitat") or {}).get("name", "unknown") if species_data else "unknown",
            "is_legendary": species_data.get("is_legendary", False) if species_data else False,
            "is_mythical": species_data.get("is_mythical", False) if species_data else False,
            "capture_rate": species_data.get("capture_rate", 0) if species_data else 0,
            "base_happiness": species_data.get("base_happiness", 0) if species_data else 0,
            "growth_rate": (species_data.get("growth_rate") or {}).get("name", "unknown") if species_data else "unknown",
            "egg_groups": [group["name"] for group in species_data.get("egg_groups", [])] if species_data else [],
            "flavor_text_entries": [
                {
                    "text": entry["flavor_text"].replace("\n", " ").replace("\f", " "),
                    "language": entry["language"]["name"],
                    "version": entry["version"]["name"]
                }
                for entry in species_data.get("flavor_text_entries", [])
                if entry.get("language", {}).get("name") == "en"
            ][:3] if species_data else [],  # Limit to 3 entries
        }
        
        # Add additional data that might be available
        if pokemon_data.get("base_experience"):
            pokemon_info["base_experience"] = pokemon_data["base_experience"]
        
        if pokemon_data.get("order"):
            pokemon_info["order"] = pokemon_data["order"]
            
        if pokemon_data.get("is_default") is not None:
            pokemon_info["is_default"] = pokemon_data["is_default"]
            
        # Add forms data if available
        if pokemon_data.get("forms"):
            pokemon_info["forms"] = [
                {
                    "name": form.get("name", ""),
                    "url": form.get("url", "")
                }
                for form in pokemon_data["forms"]
            ]
        
        return pokemon_info
        
    except requests.exceptions.RequestException as e:
        print(f"Request error for Pokemon {pokemon_id}: {e}")
        return None
    except Exception as e:
        print(f"Unexpected error for Pokemon {pokemon_id}: {e}")
        import traceback
        traceback.print_exc()
        return None

def load_existing_data() -> Dict[str, Any]:
    """Load existing Pokemon data if it exists."""
    if POKEMON_DATA_FILE.exists():
        try:
            with open(POKEMON_DATA_FILE, 'r', encoding='utf-8') as f:
                data = json.load(f)
                print(f"Loaded existing data with {len(data.get('pokemon', {}))} Pokemon")
                return data
        except Exception as e:
            print(f"Error loading existing data: {e}")
    
    return {"pokemon": {}, "last_updated": None}

def save_pokemon_data(data: Dict[str, Any]):
    """Save Pokemon data to file."""
    try:
        with open(POKEMON_DATA_FILE, 'w', encoding='utf-8') as f:
            json.dump(data, f, indent=2, ensure_ascii=False)
        print(f"Data saved to {POKEMON_DATA_FILE}")
    except Exception as e:
        print(f"Error saving data: {e}")

def main():
    """Main function to fetch and store Pokemon data."""
    print("Pokemon Data Fetcher")
    print("=" * 50)
    
    # Create output directory
    create_output_directory()
    
    # Load existing data
    data = load_existing_data()
    pokemon_data = data.get("pokemon", {})
    
    # Determine which Pokemon to fetch
    pokemon_to_fetch = []
    for pokemon_id in range(1, MAX_POKEMON + 1):
        if str(pokemon_id) not in pokemon_data:
            pokemon_to_fetch.append(pokemon_id)
    
    if not pokemon_to_fetch:
        print("All Pokemon data is already available!")
        return
    
    print(f"Fetching data for {len(pokemon_to_fetch)} Pokemon...")
    
    # Fetch Pokemon data
    successful_fetches = 0
    failed_fetches = 0
    
    for i, pokemon_id in enumerate(pokemon_to_fetch, 1):
        print(f"Fetching Pokemon {pokemon_id} ({i}/{len(pokemon_to_fetch)})...")
        
        pokemon_info = fetch_pokemon_data(pokemon_id)
        
        if pokemon_info:
            pokemon_data[str(pokemon_id)] = pokemon_info
            successful_fetches += 1
            print(f"  ✓ {pokemon_info['name'].title()} - {', '.join(pokemon_info['types']).title()}")
        else:
            failed_fetches += 1
            print(f"  ✗ Failed to fetch Pokemon {pokemon_id}")
        
        # Be respectful to PokeAPI
        if i < len(pokemon_to_fetch):
            time.sleep(DELAY_BETWEEN_REQUESTS)
        
        # Save progress every 50 Pokemon
        if i % 50 == 0:
            data["pokemon"] = pokemon_data
            data["last_updated"] = time.strftime("%Y-%m-%d %H:%M:%S")
            save_pokemon_data(data)
            print(f"Progress saved: {i}/{len(pokemon_to_fetch)}")
    
    # Final save
    data["pokemon"] = pokemon_data
    data["last_updated"] = time.strftime("%Y-%m-%d %H:%M:%S")
    save_pokemon_data(data)
    
    print("\n" + "=" * 50)
    print("Fetch Complete!")
    print(f"Successful fetches: {successful_fetches}")
    print(f"Failed fetches: {failed_fetches}")
    print(f"Total Pokemon in database: {len(pokemon_data)}")
    print(f"Data saved to: {POKEMON_DATA_FILE.absolute()}")
    
    if failed_fetches > 0:
        print(f"\n⚠️ {failed_fetches} Pokemon failed to fetch.")
        print("This might be due to:")
        print("- API rate limiting (try again later)")
        print("- Pokemon not existing in the API")
        print("- Network issues")
        print("\nYou can run the script again to retry failed Pokemon.")

if __name__ == "__main__":
    main()
