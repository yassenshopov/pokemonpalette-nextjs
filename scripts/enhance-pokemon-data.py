#!/usr/bin/env python3
"""
Pokemon Data Enhancer
Enhances existing pokemon-data.json with forms and evolution chain data.
"""

import json
import requests
import time
from pathlib import Path
from typing import Dict, List, Any, Optional

# Configuration
POKEAPI_BASE_URL = "https://pokeapi.co/api/v2"
DATA_FILE = Path("data/pokemon-data.json")
DELAY_BETWEEN_REQUESTS = 0.1  # Be respectful to PokeAPI

def load_pokemon_data() -> Dict[str, Any]:
    """Load existing Pokemon data."""
    if not DATA_FILE.exists():
        print(f"Error: {DATA_FILE} not found. Run fetch-pokemon-data.py first.")
        return {}
    
    try:
        with open(DATA_FILE, 'r', encoding='utf-8') as f:
            data = json.load(f)
            print(f"Loaded existing data with {len(data.get('pokemon', {}))} Pokemon")
            return data
    except Exception as e:
        print(f"Error loading data: {e}")
        return {}

def save_pokemon_data(data: Dict[str, Any]):
    """Save enhanced Pokemon data."""
    try:
        with open(DATA_FILE, 'w', encoding='utf-8') as f:
            json.dump(data, f, indent=2, ensure_ascii=False)
        print(f"Enhanced data saved to {DATA_FILE}")
    except Exception as e:
        print(f"Error saving data: {e}")

def fetch_evolution_chain(evolution_chain_url: str) -> Optional[Dict[str, Any]]:
    """Fetch evolution chain data."""
    try:
        response = requests.get(evolution_chain_url, timeout=10)
        response.raise_for_status()
        return response.json()
    except Exception as e:
        print(f"Error fetching evolution chain: {e}")
        return None

def fetch_pokemon_species(pokemon_id: int) -> Optional[Dict[str, Any]]:
    """Fetch Pokemon species data for forms and evolution info."""
    try:
        # First get Pokemon data to find species URL
        pokemon_response = requests.get(f"{POKEAPI_BASE_URL}/pokemon/{pokemon_id}", timeout=10)
        pokemon_response.raise_for_status()
        pokemon_data = pokemon_response.json()
        
        # Get species data
        species_response = requests.get(pokemon_data["species"]["url"], timeout=10)
        species_response.raise_for_status()
        species_data = species_response.json()
        
        return species_data
    except Exception as e:
        print(f"Error fetching species data for Pokemon {pokemon_id}: {e}")
        return None

def process_evolution_chain(chain_data: Dict[str, Any]) -> Dict[str, Any]:
    """Process evolution chain data into a structured format."""
    def extract_evolution_info(evolution_detail: Dict[str, Any]) -> Dict[str, Any]:
        """Extract evolution details."""
        return {
            "trigger": evolution_detail.get("trigger", {}).get("name", "unknown"),
            "min_level": evolution_detail.get("min_level"),
            "min_happiness": evolution_detail.get("min_happiness"),
            "min_affection": evolution_detail.get("min_affection"),
            "min_beauty": evolution_detail.get("min_beauty"),
            "time_of_day": evolution_detail.get("time_of_day"),
            "known_move": evolution_detail.get("known_move", {}).get("name") if evolution_detail.get("known_move") else None,
            "known_move_type": evolution_detail.get("known_move_type", {}).get("name") if evolution_detail.get("known_move_type") else None,
            "location": evolution_detail.get("location", {}).get("name") if evolution_detail.get("location") else None,
            "held_item": evolution_detail.get("held_item", {}).get("name") if evolution_detail.get("held_item") else None,
            "item": evolution_detail.get("item", {}).get("name") if evolution_detail.get("item") else None,
            "gender": evolution_detail.get("gender"),
            "needs_overworld_rain": evolution_detail.get("needs_overworld_rain", False),
            "turn_upside_down": evolution_detail.get("turn_upside_down", False),
        }

    def process_chain_link(chain_link: Dict[str, Any], level: int = 0) -> Dict[str, Any]:
        """Recursively process evolution chain links."""
        pokemon_info = {
            "id": int(chain_link["species"]["url"].split("/")[-2]),
            "name": chain_link["species"]["name"],
            "level": level,
            "evolves_to": []
        }
        
        # Process evolution details
        if chain_link.get("evolution_details"):
            pokemon_info["evolution_details"] = [
                extract_evolution_info(detail) for detail in chain_link["evolution_details"]
            ]
        
        # Process evolved forms
        for evolved_form in chain_link.get("evolves_to", []):
            pokemon_info["evolves_to"].append(process_chain_link(evolved_form, level + 1))
        
        return pokemon_info

    return {
        "id": chain_data.get("id"),
        "chain": process_chain_link(chain_data["chain"]) if chain_data.get("chain") else None
    }

def get_pokemon_forms(pokemon_id: int) -> List[Dict[str, Any]]:
    """Get all forms for a Pokemon."""
    try:
        response = requests.get(f"{POKEAPI_BASE_URL}/pokemon/{pokemon_id}", timeout=10)
        response.raise_for_status()
        pokemon_data = response.json()
        
        forms = []
        for form in pokemon_data.get("forms", []):
            form_info = {
                "name": form["name"],
                "url": form["url"],
                "is_default": form.get("is_default", False),
                "is_mega": form["name"].startswith("mega-"),
                "is_gigantamax": form["name"].startswith("gigantamax-"),
                "is_alolan": "alola" in form["name"],
                "is_galarian": "galar" in form["name"],
                "is_hisui": "hisui" in form["name"],
                "is_paldean": "paldea" in form["name"],
            }
            forms.append(form_info)
        
        return forms
    except Exception as e:
        print(f"Error fetching forms for Pokemon {pokemon_id}: {e}")
        return []

def enhance_pokemon_data(pokemon_data: Dict[str, Any]) -> Dict[str, Any]:
    """Enhance Pokemon data with forms and evolution information."""
    enhanced_data = pokemon_data.copy()
    pokemon_dict = enhanced_data.get("pokemon", {})
    
    total_pokemon = len(pokemon_dict)
    processed = 0
    enhanced_count = 0
    
    print(f"Enhancing data for {total_pokemon} Pokemon...")
    
    for pokemon_id_str, pokemon_info in pokemon_dict.items():
        pokemon_id = int(pokemon_id_str)
        processed += 1
        
        print(f"Processing Pokemon {pokemon_id} ({pokemon_info['name']}) - {processed}/{total_pokemon}")
        
        try:
            # Fetch species data for evolution chain info
            species_data = fetch_pokemon_species(pokemon_id)
            if species_data:
                # Add evolution chain data
                if species_data.get("evolution_chain", {}).get("url"):
                    evolution_chain_data = fetch_evolution_chain(species_data["evolution_chain"]["url"])
                    if evolution_chain_data:
                        pokemon_info["evolution_chain"] = process_evolution_chain(evolution_chain_data)
                        enhanced_count += 1
                
                # Add form data
                forms = get_pokemon_forms(pokemon_id)
                if forms:
                    pokemon_info["forms"] = forms
                
                # Add additional species info
                evolution_chain_url = species_data.get("evolution_chain", {}).get("url", "")
                pokemon_info["evolution_chain_id"] = evolution_chain_url.split("/")[-2] if evolution_chain_url else None
                pokemon_info["has_gender_differences"] = species_data.get("has_gender_differences", False)
                pokemon_info["forms_switchable"] = species_data.get("forms_switchable", False)
                pokemon_info["order"] = species_data.get("order", 0)
                pokemon_info["conquest_order"] = species_data.get("conquest_order", 0)
                
                # Add color and shape info
                pokemon_info["color"] = (species_data.get("color") or {}).get("name", "unknown")
                pokemon_info["shape"] = (species_data.get("shape") or {}).get("name", "unknown")
                
                # Add egg groups with more detail
                egg_groups = []
                for egg_group in species_data.get("egg_groups", []):
                    egg_groups.append({
                        "name": egg_group["name"],
                        "url": egg_group["url"]
                    })
                pokemon_info["egg_groups_detailed"] = egg_groups
                
                # Add flavor text with more versions
                flavor_texts = []
                for entry in species_data.get("flavor_text_entries", []):
                    if entry.get("language", {}).get("name") == "en":
                        flavor_text_entry = {
                            "text": entry.get("flavor_text", "").replace("\n", " ").replace("\f", " "),
                            "version": entry.get("version", {}).get("name", "unknown")
                        }
                        # Add version_group if it exists
                        if entry.get("version_group"):
                            flavor_text_entry["version_group"] = entry["version_group"].get("name", "unknown")
                        flavor_texts.append(flavor_text_entry)
                pokemon_info["flavor_text_entries_extended"] = flavor_texts[:5]  # Limit to 5 entries
            
            # Be respectful to PokeAPI
            time.sleep(DELAY_BETWEEN_REQUESTS)
            
            # Save progress every 25 Pokemon
            if processed % 25 == 0:
                enhanced_data["pokemon"] = pokemon_dict
                enhanced_data["last_enhanced"] = time.strftime("%Y-%m-%d %H:%M:%S")
                save_pokemon_data(enhanced_data)
                print(f"Progress saved: {processed}/{total_pokemon}")
                
        except Exception as e:
            print(f"Error enhancing Pokemon {pokemon_id}: {e}")
            continue
    
    # Final save
    enhanced_data["pokemon"] = pokemon_dict
    enhanced_data["last_enhanced"] = time.strftime("%Y-%m-%d %H:%M:%S")
    save_pokemon_data(enhanced_data)
    
    return enhanced_data

def main():
    """Main function to enhance Pokemon data."""
    print("Pokemon Data Enhancer")
    print("=" * 50)
    
    # Load existing data
    data = load_pokemon_data()
    if not data:
        return
    
    # Enhance the data
    enhanced_data = enhance_pokemon_data(data)
    
    print("\n" + "=" * 50)
    print("Enhancement Complete!")
    print(f"Enhanced Pokemon data with forms and evolution chains")
    print(f"Data saved to: {DATA_FILE.absolute()}")

if __name__ == "__main__":
    main()
