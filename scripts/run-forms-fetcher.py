#!/usr/bin/env python3
"""
Quick runner script for the Pokemon Forms Fetcher
"""

import subprocess
import sys
from pathlib import Path

def main():
    """Run the Pokemon forms fetcher script."""
    script_path = Path(__file__).parent / "fetch-pokemon-forms.py"
    
    if not script_path.exists():
        print(f"Error: {script_path} not found!")
        return 1
    
    print("Running Pokemon Forms Fetcher...")
    print("=" * 50)
    
    try:
        result = subprocess.run([sys.executable, str(script_path)], check=True)
        print("\n" + "=" * 50)
        print("Forms fetcher completed successfully!")
        return 0
    except subprocess.CalledProcessError as e:
        print(f"\nError running forms fetcher: {e}")
        return 1
    except Exception as e:
        print(f"\nUnexpected error: {e}")
        return 1

if __name__ == "__main__":
    sys.exit(main())

