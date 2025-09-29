#!/usr/bin/env python3
"""
Comprehensive Pokemon Forms Fetcher
Fetches all Pokemon forms including:
- Regional variants (Alolan, Galarian, Hisuian, Paldean)
- Mega Evolutions
- Gigantamax forms
- Seasonal variants (Sawsbuck, Deerling, etc.)
- Gender differences
- Other special forms
"""

import json
import requests
import time
from pathlib import Path
from typing import Dict, Any, List, Optional
import re

# Configuration
DATA_FILE = Path("../public/data/pokemon-data.json")
POKEAPI_BASE_URL = "https://pokeapi.co/api/v2"
DELAY_BETWEEN_REQUESTS = 0.5  # Be respectful to the API
MAX_RETRIES = 3

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

def fetch_with_retry(url: str, max_retries: int = MAX_RETRIES) -> Optional[Dict[str, Any]]:
    """Fetch data with retry logic."""
    for attempt in range(max_retries):
        try:
            response = requests.get(url, timeout=10)
            response.raise_for_status()
            return response.json()
        except requests.exceptions.RequestException as e:
            print(f"Attempt {attempt + 1} failed for {url}: {e}")
            if attempt < max_retries - 1:
                time.sleep(1 * (attempt + 1))  # Exponential backoff
            else:
                print(f"Failed to fetch {url} after {max_retries} attempts")
                return None
        except Exception as e:
            print(f"Unexpected error for {url}: {e}")
            return None
    return None

def get_form_type(form_name: str, pokemon_name: str) -> str:
    """Determine the type of form based on name patterns."""
    form_name_lower = form_name.lower()
    pokemon_name_lower = pokemon_name.lower()
    
    # Default form
    if form_name_lower == pokemon_name_lower:
        return 'default'
    
    # Mega forms
    if "mega" in form_name_lower:
        return 'mega'
    
    # Gigantamax forms
    if "gigantamax" in form_name_lower or "gmax" in form_name_lower:
        return 'gigantamax'
    
    # Regional variants
    if "alola" in form_name_lower or "alolan" in form_name_lower:
        return 'alolan'
    if "galar" in form_name_lower or "galarian" in form_name_lower:
        return 'galarian'
    if "hisui" in form_name_lower or "hisuian" in form_name_lower:
        return 'hisui'
    if "paldea" in form_name_lower or "paldean" in form_name_lower:
        return 'paldean'
    
    # Seasonal forms
    if any(season in form_name_lower for season in ["spring", "summer", "autumn", "winter", "fall"]):
        return 'seasonal'
    
    # Gender forms
    if "female" in form_name_lower or "male" in form_name_lower:
        return 'gender'
    
    # Special forms
    if "totem" in form_name_lower:
        return 'totem'
    if "primal" in form_name_lower:
        return 'primal'
    if "eternamax" in form_name_lower:
        return 'eternamax'
    if "origin" in form_name_lower:
        return 'origin'
    if "hero" in form_name_lower:
        return 'hero'
    if "zen" in form_name_lower:
        return 'zen'
    
    # Weather forms (Castform)
    if any(weather in form_name_lower for weather in ["rainy", "sunny", "snowy", "ice"]):
        return 'weather'
    
    # Color forms (Flabébé line, Minior)
    if any(color in form_name_lower for color in ["red", "yellow", "orange", "blue", "white", "green", "indigo", "violet"]):
        return 'color'
    
    # Trim forms (Furfrou)
    if any(trim in form_name_lower for trim in ["dandy", "debutante", "diamond", "heart", "kabuki", "la-reine", "matron", "pharaoh", "star"]):
        return 'trim'
    
    # Style forms (Oricorio)
    if any(style in form_name_lower for style in ["baile", "pom-pom", "pau", "sensu"]):
        return 'style'
    
    # Coat forms (Burmy/Wormadam)
    if any(coat in form_name_lower for coat in ["plant", "sandy", "trash"]):
        return 'coat'
    
    # Sea forms (Gastrodon/Shellos)
    if "east" in form_name_lower or "west" in form_name_lower:
        return 'sea'
    
    # Mood forms (Morpeko)
    if any(mood in form_name_lower for mood in ["full", "hangry"]):
        return 'mood'
    
    # Strike forms (Urshifu)
    if any(strike in form_name_lower for strike in ["single", "rapid"]):
        return 'strike'
    
    # Segment forms (Dudunsparce)
    if any(segment in form_name_lower for segment in ["two", "three"]):
        return 'segment'
    
    # Family forms (Maushold)
    if any(family in form_name_lower for family in ["family", "three"]):
        return 'family'
    
    # Shape forms (specific Pokemon with unique shapes)
    if any(shape in form_name_lower for shape in ["school", "busted", "gulping", "gorging", "ice", "noice", "curly", "droopy", "stretchy"]):
        return 'shape'
    
    # Default to other for unrecognized forms
    return 'other'

def get_form_display_name(form_name: str, pokemon_name: str) -> str:
    """Get a user-friendly display name for the form."""
    form_name_lower = form_name.lower()
    pokemon_name_lower = pokemon_name.lower()
    
    # Handle special cases
    if form_name_lower == pokemon_name_lower:
        return pokemon_name.replace('-', ' ').title()
    
    # Remove Pokemon name from form name
    display_name = form_name.replace(f"{pokemon_name}-", "").replace(f"{pokemon_name}_", "")
    
    # Handle specific form types
    if "mega" in form_name_lower:
        if "x" in form_name_lower:
            display_name = "Mega X"
        elif "y" in form_name_lower:
            display_name = "Mega Y"
        else:
            display_name = "Mega"
    elif "gigantamax" in form_name_lower or "gmax" in form_name_lower:
        display_name = "Gigantamax"
    elif "alola" in form_name_lower:
        display_name = "Alolan"
    elif "galar" in form_name_lower:
        display_name = "Galarian"
    elif "hisui" in form_name_lower:
        display_name = "Hisuian"
    elif "paldea" in form_name_lower:
        display_name = "Paldean"
    elif "totem" in form_name_lower:
        display_name = "Totem"
    elif "primal" in form_name_lower:
        display_name = "Primal"
    elif "eternamax" in form_name_lower:
        display_name = "Eternamax"
    elif "ash" in form_name_lower:
        display_name = "Ash"
    elif "origin" in form_name_lower:
        display_name = "Origin"
    elif "hero" in form_name_lower:
        display_name = "Hero"
    elif "zen" in form_name_lower:
        display_name = "Zen"
    elif "school" in form_name_lower:
        display_name = "School"
    elif "busted" in form_name_lower:
        display_name = "Busted"
    elif "noice" in form_name_lower:
        display_name = "Noice"
    elif "hangry" in form_name_lower:
        display_name = "Hangry"
    elif "rapid" in form_name_lower:
        display_name = "Rapid Strike"
    elif "single" in form_name_lower:
        display_name = "Single Strike"
    elif "therian" in form_name_lower:
        display_name = "Therian"
    elif "incarnate" in form_name_lower:
        display_name = "Incarnate"
    elif "zero" in form_name_lower:
        display_name = "Zero"
    elif "curly" in form_name_lower:
        display_name = "Curly"
    elif "droopy" in form_name_lower:
        display_name = "Droopy"
    elif "stretchy" in form_name_lower:
        display_name = "Stretchy"
    elif "three" in form_name_lower:
        display_name = "Three-Segment"
    elif "family" in form_name_lower:
        display_name = "Family of Three"
    
    # Handle seasonal forms
    seasons = {
        "spring": "Spring",
        "summer": "Summer", 
        "autumn": "Autumn",
        "winter": "Winter",
        "fall": "Fall"
    }
    for season, display in seasons.items():
        if season in form_name_lower:
            display_name = display
    
    # Handle color forms
    colors = {
        "red": "Red",
        "yellow": "Yellow",
        "orange": "Orange",
        "blue": "Blue",
        "white": "White",
        "green": "Green",
        "indigo": "Indigo",
        "violet": "Violet"
    }
    for color, display in colors.items():
        if color in form_name_lower:
            display_name = display
    
    # Handle gender forms
    if "female" in form_name_lower:
        display_name = "Female"
    elif "male" in form_name_lower:
        display_name = "Male"
    
    # Handle regional forms
    regions = {
        "east": "East Sea",
        "west": "West Sea"
    }
    for region, display in regions.items():
        if region in form_name_lower:
            display_name = display
    
    # Handle trim forms (Furfrou)
    trims = {
        "dandy": "Dandy",
        "debutante": "Debutante",
        "diamond": "Diamond",
        "heart": "Heart",
        "kabuki": "Kabuki",
        "la-reine": "La Reine",
        "matron": "Matron",
        "pharaoh": "Pharaoh",
        "star": "Star"
    }
    for trim, display in trims.items():
        if trim in form_name_lower:
            display_name = display
    
    # Handle Oricorio styles
    styles = {
        "baile": "Baile",
        "pom-pom": "Pom-Pom",
        "pau": "Pau",
        "sensu": "Sensu"
    }
    for style, display in styles.items():
        if style in form_name_lower:
            display_name = display
    
    # Handle Lycanroc forms
    lycanroc_forms = {
        "midday": "Midday",
        "midnight": "Midnight",
        "dusk": "Dusk"
    }
    for form, display in lycanroc_forms.items():
        if form in form_name_lower:
            display_name = display
    
    # Handle Cramorant forms
    cramorant_forms = {
        "gulping": "Gulping",
        "gorging": "Gorging"
    }
    for form, display in cramorant_forms.items():
        if form in form_name_lower:
            display_name = display
    
    return display_name.replace('-', ' ').title()

def fetch_pokemon_forms(pokemon_id: int) -> List[Dict[str, Any]]:
    """Fetch all forms for a Pokemon."""
    try:
        # Get Pokemon data
        pokemon_data = fetch_with_retry(f"{POKEAPI_BASE_URL}/pokemon/{pokemon_id}")
        if not pokemon_data:
            return []
        
        pokemon_name = pokemon_data["name"]
        forms = []
        
        # Process each form
        for form in pokemon_data.get("forms", []):
            form_name = form["name"]
            form_url = form["url"]
            
            # Get detailed form data
            form_data = fetch_with_retry(form_url)
            if not form_data:
                continue
            
            # Determine form type
            form_type = get_form_type(form_name, pokemon_name)
            
            # Get form display name
            display_name = get_form_display_name(form_name, pokemon_name)
            
            # Create form info
            form_info = {
                "name": form_name,
                "display_name": display_name,
                "url": form_url,
                "form_id": form_data.get("id"),
                "form_order": form_data.get("form_order", 0),
                "is_default": form_type == 'default',
                "is_battle_only": form_data.get("is_battle_only", False),
                "form_type": form_type,
                "sprites": form_data.get("sprites", {})
            }
            
            forms.append(form_info)
        
        return forms
        
    except Exception as e:
        print(f"Error fetching forms for Pokemon {pokemon_id}: {e}")
        return []

def fetch_all_pokemon_forms() -> Dict[str, Any]:
    """Fetch forms for all Pokemon."""
    print("Fetching Pokemon Forms...")
    print("=" * 60)
    
    # Load existing data
    data = load_pokemon_data()
    if not data:
        print("No existing data found!")
        return {}
    
    pokemon_dict = data.get("pokemon", {})
    total_pokemon = len(pokemon_dict)
    processed = 0
    enhanced_count = 0
    
    print(f"Processing forms for {total_pokemon} Pokemon...")
    
    for pokemon_id_str, pokemon_info in pokemon_dict.items():
        pokemon_id = int(pokemon_id_str)
        pokemon_name = pokemon_info.get("name", "unknown")
        processed += 1
        
        print(f"[{processed}/{total_pokemon}] Processing {pokemon_name} (#{pokemon_id})...", end=" ")
        
        try:
            # Fetch forms for this Pokemon
            forms = fetch_pokemon_forms(pokemon_id)
            
            if forms:
                # Update Pokemon data with forms
                pokemon_info["forms"] = forms
                pokemon_info["has_forms"] = len(forms) > 1
                pokemon_info["form_count"] = len(forms)
                
                # Count different form types
                form_type_counts = {
                    "mega_forms": sum(1 for f in forms if f.get("form_type") == "mega"),
                    "gigantamax_forms": sum(1 for f in forms if f.get("form_type") == "gigantamax"),
                    "regional_forms": sum(1 for f in forms if f.get("form_type") in ["alolan", "galarian", "hisui", "paldean"]),
                    "seasonal_forms": sum(1 for f in forms if f.get("form_type") == "seasonal"),
                    "gender_forms": sum(1 for f in forms if f.get("form_type") == "gender"),
                    "weather_forms": sum(1 for f in forms if f.get("form_type") == "weather"),
                    "color_forms": sum(1 for f in forms if f.get("form_type") == "color"),
                    "trim_forms": sum(1 for f in forms if f.get("form_type") == "trim"),
                    "style_forms": sum(1 for f in forms if f.get("form_type") == "style"),
                    "coat_forms": sum(1 for f in forms if f.get("form_type") == "coat"),
                    "sea_forms": sum(1 for f in forms if f.get("form_type") == "sea"),
                    "mood_forms": sum(1 for f in forms if f.get("form_type") == "mood"),
                    "strike_forms": sum(1 for f in forms if f.get("form_type") == "strike"),
                    "segment_forms": sum(1 for f in forms if f.get("form_type") == "segment"),
                    "family_forms": sum(1 for f in forms if f.get("form_type") == "family"),
                    "shape_forms": sum(1 for f in forms if f.get("form_type") == "shape"),
                    "other_forms": sum(1 for f in forms if f.get("form_type") == "other")
                }
                
                pokemon_info["form_type_counts"] = form_type_counts
                enhanced_count += 1
                print(f"[OK] Found {len(forms)} forms")
            else:
                pokemon_info["forms"] = []
                pokemon_info["has_forms"] = False
                pokemon_info["form_count"] = 0
                print("[X] No forms found")
            
            # Be respectful to the API
            time.sleep(DELAY_BETWEEN_REQUESTS)
            
            # Save progress every 25 Pokemon
            if processed % 25 == 0:
                data["pokemon"] = pokemon_dict
                data["last_forms_fetch"] = time.strftime("%Y-%m-%d %H:%M:%S")
                save_pokemon_data(data)
                print(f"Progress saved: {processed}/{total_pokemon}")
                
        except Exception as e:
            print(f"[ERROR] Error: {e}")
            continue
    
    # Final save
    data["pokemon"] = pokemon_dict
    data["last_forms_fetch"] = time.strftime("%Y-%m-%d %H:%M:%S")
    data["forms_summary"] = {
        "total_pokemon": total_pokemon,
        "pokemon_with_forms": enhanced_count,
        "pokemon_without_forms": total_pokemon - enhanced_count,
        "total_forms": sum(pokemon.get("form_count", 0) for pokemon in pokemon_dict.values()),
        "mega_forms": sum(pokemon.get("form_type_counts", {}).get("mega_forms", 0) for pokemon in pokemon_dict.values()),
        "gigantamax_forms": sum(pokemon.get("form_type_counts", {}).get("gigantamax_forms", 0) for pokemon in pokemon_dict.values()),
        "regional_forms": sum(pokemon.get("form_type_counts", {}).get("regional_forms", 0) for pokemon in pokemon_dict.values()),
        "seasonal_forms": sum(pokemon.get("form_type_counts", {}).get("seasonal_forms", 0) for pokemon in pokemon_dict.values()),
        "gender_forms": sum(pokemon.get("form_type_counts", {}).get("gender_forms", 0) for pokemon in pokemon_dict.values()),
        "weather_forms": sum(pokemon.get("form_type_counts", {}).get("weather_forms", 0) for pokemon in pokemon_dict.values()),
        "color_forms": sum(pokemon.get("form_type_counts", {}).get("color_forms", 0) for pokemon in pokemon_dict.values()),
        "trim_forms": sum(pokemon.get("form_type_counts", {}).get("trim_forms", 0) for pokemon in pokemon_dict.values()),
        "style_forms": sum(pokemon.get("form_type_counts", {}).get("style_forms", 0) for pokemon in pokemon_dict.values()),
        "coat_forms": sum(pokemon.get("form_type_counts", {}).get("coat_forms", 0) for pokemon in pokemon_dict.values()),
        "sea_forms": sum(pokemon.get("form_type_counts", {}).get("sea_forms", 0) for pokemon in pokemon_dict.values()),
        "mood_forms": sum(pokemon.get("form_type_counts", {}).get("mood_forms", 0) for pokemon in pokemon_dict.values()),
        "strike_forms": sum(pokemon.get("form_type_counts", {}).get("strike_forms", 0) for pokemon in pokemon_dict.values()),
        "segment_forms": sum(pokemon.get("form_type_counts", {}).get("segment_forms", 0) for pokemon in pokemon_dict.values()),
        "family_forms": sum(pokemon.get("form_type_counts", {}).get("family_forms", 0) for pokemon in pokemon_dict.values()),
        "shape_forms": sum(pokemon.get("form_type_counts", {}).get("shape_forms", 0) for pokemon in pokemon_dict.values()),
        "other_forms": sum(pokemon.get("form_type_counts", {}).get("other_forms", 0) for pokemon in pokemon_dict.values()),
    }
    save_pokemon_data(data)
    
    print("\n" + "=" * 60)
    print("Pokemon Forms Fetch Complete!")
    print(f"Processed: {processed} Pokemon")
    print(f"Pokemon with forms: {enhanced_count}")
    print(f"Pokemon without forms: {total_pokemon - enhanced_count}")
    
    if "forms_summary" in data:
        summary = data["forms_summary"]
        print(f"\nForm Summary:")
        print(f"  Total forms: {summary['total_forms']}")
        print(f"  Mega forms: {summary['mega_forms']}")
        print(f"  Gigantamax forms: {summary['gigantamax_forms']}")
        print(f"  Regional forms: {summary['regional_forms']}")
        print(f"  Seasonal forms: {summary['seasonal_forms']}")
        print(f"  Gender forms: {summary['gender_forms']}")
        print(f"  Other forms: {summary['other_forms']}")
    
    return data

def main():
    """Main function to fetch Pokemon forms."""
    print("Pokemon Forms Fetcher")
    print("=" * 60)
    print("This script will fetch all Pokemon forms including:")
    print("• Regional variants (Alolan, Galarian, Hisuian, Paldean)")
    print("• Mega Evolutions")
    print("• Gigantamax forms")
    print("• Seasonal variants (Sawsbuck, Deerling, etc.)")
    print("• Gender differences")
    print("• Other special forms")
    print("=" * 60)
    
    # Fetch the forms
    data = fetch_all_pokemon_forms()
    
    if data and "forms_summary" in data:
        print(f"\nForms data saved to: {DATA_FILE.absolute()}")
        print("The PokemonSpriteV2 component will now display all forms!")
    else:
        print("No forms data was fetched.")

if __name__ == "__main__":
    main()
