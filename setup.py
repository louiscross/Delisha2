#!/usr/bin/env python3
"""
Setup script for England Media Map
This script will install dependencies and extract GPS data from your media files.
"""

import subprocess
import sys
import os

def install_requirements():
    """Install required Python packages"""
    print("Installing required packages...")
    try:
        subprocess.check_call([sys.executable, "-m", "pip", "install", "-r", "requirements.txt"])
        print("✓ Packages installed successfully!")
        return True
    except subprocess.CalledProcessError as e:
        print(f"✗ Error installing packages: {e}")
        return False

def run_gps_extraction():
    """Run the GPS extraction script"""
    print("\nExtracting GPS data from media files...")
    try:
        subprocess.check_call([sys.executable, "extract_gps.py"])
        return True
    except subprocess.CalledProcessError as e:
        print(f"✗ Error running GPS extraction: {e}")
        return False

def check_media_folder():
    """Check if media folder exists and has files"""
    if not os.path.exists("media"):
        print("✗ Media folder not found!")
        print("Please create a 'media' folder and put your photos/videos in it.")
        return False
    
    files = [f for f in os.listdir("media") if f.lower().endswith(('.jpg', '.jpeg', '.png', '.mp4'))]
    if not files:
        print("✗ No media files found in the media folder!")
        print("Please add some photos or videos to the media folder.")
        return False
    
    print(f"✓ Found {len(files)} media files in the media folder")
    return True

def main():
    """Main setup function"""
    print("England Media Map - Setup")
    print("=" * 40)
    
    # Check if media folder exists
    if not check_media_folder():
        return
    
    # Install requirements
    if not install_requirements():
        print("\nSetup failed. Please try installing Pillow manually:")
        print("pip install Pillow")
        return
    
    # Run GPS extraction
    if run_gps_extraction():
        print("\n" + "=" * 40)
        print("Setup completed successfully!")
        print("\nNext steps:")
        print("1. Open index.html in your web browser")
        print("2. Click 'Import GPS Data' button to load extracted coordinates")
        print("3. Your photos will appear as markers on the map!")
    else:
        print("\nGPS extraction failed. You can still use the website manually.")

if __name__ == "__main__":
    main() 