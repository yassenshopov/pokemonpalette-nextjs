#!/usr/bin/env python3
"""
Script to add genus (species classification) data to pokemon-data.json
Fetches genus information from PokeAPI and updates the local data file.
"""

import json
import requests
import time
from typing import Dict, Any, Optional

def fetch_genus_data(pokemon_id: int) -> Optional[str]:
    """
    Fetch genus data for a specific Pokemon from PokeAPI.
    
    Args:
        pokemon_id: The Pokemon ID to fetch genus for
        
    Returns:
        The genus string in English, or None if not found
    """
    try:
        url = f"https://pokeapi.co/api/v2/pokemon-species/{pokemon_id}"
        response = requests.get(url, timeout=10)
        response.raise_for_status()
        
        data = response.json()
        
        # Find the English genus
        for genus_entry in data.get('genera', []):
            if genus_entry.get('language', {}).get('name') == 'en':
                return genus_entry.get('genus')
        
        return None
        
    except requests.exceptions.RequestException as e:
        print(f"Error fetching data for Pokemon {pokemon_id}: {e}")
        return None
    except Exception as e:
        print(f"Unexpected error for Pokemon {pokemon_id}: {e}")
        return None

def update_pokemon_data_with_genus(input_file: str, output_file: str, max_pokemon: int = 1025):
    """
    Update pokemon-data.json with genus information.
    
    Args:
        input_file: Path to the input pokemon-data.json file
        output_file: Path to the output file (can be same as input)
        max_pokemon: Maximum Pokemon ID to process (default 1025)
    """
    print(f"Loading Pokemon data from {input_file}...")
    
    try:
        with open(input_file, 'r', encoding='utf-8') as f:
            data = json.load(f)
    except FileNotFoundError:
        print(f"Error: File {input_file} not found!")
        return
    except json.JSONDecodeError as e:
        print(f"Error parsing JSON: {e}")
        return
    
    if 'pokemon' not in data:
        print("Error: 'pokemon' key not found in data!")
        return
    
    pokemon_data = data['pokemon']
    total_pokemon = len(pokemon_data)
    updated_count = 0
    skipped_count = 0
    
    print(f"Found {total_pokemon} Pokemon entries")
    print(f"Processing up to Pokemon ID {max_pokemon}...")
    print("-" * 50)
    
    for pokemon_id_str, pokemon_info in pokemon_data.items():
        try:
            pokemon_id = int(pokemon_id_str)
            
            # Skip if Pokemon ID is beyond our limit
            if pokemon_id > max_pokemon:
                continue
                
            # Skip if genus already exists
            if 'genus' in pokemon_info:
                skipped_count += 1
                print(f"Pokemon {pokemon_id}: Genus already exists, skipping")
                continue
            
            print(f"Processing Pokemon {pokemon_id} ({pokemon_info.get('name', 'Unknown')})...")
            
            # Fetch genus data
            genus = fetch_genus_data(pokemon_id)
            
            if genus:
                pokemon_info['genus'] = genus
                updated_count += 1
                print(f"  ✓ Added genus: {genus}")
            else:
                print(f"  ✗ No genus data found")
            
            # Rate limiting - be nice to the API
            time.sleep(0.1)
            
        except ValueError:
            print(f"Skipping invalid Pokemon ID: {pokemon_id_str}")
            continue
        except Exception as e:
            print(f"Error processing Pokemon {pokemon_id_str}: {e}")
            continue
    
    print("-" * 50)
    print(f"Processing complete!")
    print(f"Updated: {updated_count} Pokemon")
    print(f"Skipped: {skipped_count} Pokemon (already had genus)")
    
    # Save the updated data
    print(f"Saving updated data to {output_file}...")
    try:
        with open(output_file, 'w', encoding='utf-8') as f:
            json.dump(data, f, indent=2, ensure_ascii=False)
        print("✓ Data saved successfully!")
    except Exception as e:
        print(f"Error saving data: {e}")

def main():
    """Main function to run the script."""
    import argparse
    
    parser = argparse.ArgumentParser(description='Add genus data to pokemon-data.json')
    parser.add_argument('--input', '-i', 
                       default='data/pokemon-data.json',
                       help='Input pokemon-data.json file path')
    parser.add_argument('--output', '-o',
                       default='data/pokemon-data.json',
                       help='Output file path (defaults to same as input)')
    parser.add_argument('--max-id', '-m',
                       type=int,
                       default=1025,
                       help='Maximum Pokemon ID to process (default: 1025)')
    parser.add_argument('--backup', '-b',
                       action='store_true',
                       help='Create a backup of the original file')
    
    args = parser.parse_args()
    
    # Create backup if requested
    if args.backup:
        import shutil
        backup_file = f"{args.input}.backup"
        print(f"Creating backup: {backup_file}")
        try:
            shutil.copy2(args.input, backup_file)
            print("✓ Backup created successfully!")
        except Exception as e:
            print(f"Error creating backup: {e}")
            return
    
    # Run the update
    update_pokemon_data_with_genus(args.input, args.output, args.max_id)

if __name__ == "__main__":
    main()




