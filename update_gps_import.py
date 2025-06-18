#!/usr/bin/env python3
"""
Script to automatically update the GPS import file with all extracted data
"""

import json
from datetime import datetime

def update_gps_import():
    """Update the GPS import file with all extracted data"""
    
    # Load the extracted GPS data
    try:
        with open("gps_data_working.json", 'r', encoding='utf-8') as f:
            gps_data = json.load(f)
    except FileNotFoundError:
        print("Error: gps_data_working.json not found!")
        print("Please run extract_gps_working.py first.")
        return
    
    # Generate the JavaScript import code
    js_code = f"""// Working GPS data from media files
// Generated on: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}

const autoGpsData = {json.dumps(gps_data, indent=2)};

// Automatically import GPS data when the page loads
document.addEventListener('DOMContentLoaded', function() {{
    // Wait a moment for the map to initialize
    setTimeout(() => {{
        // Import all GPS data automatically
        Object.keys(autoGpsData).forEach(fileName => {{
            const data = autoGpsData[fileName];
            if (!locations[fileName]) {{
                locations[fileName] = {{
                    lat: data.lat,
                    lng: data.lng,
                    description: data.description
                }};
            }}
        }});
        
        // Save to localStorage
        localStorage.setItem('mediaLocations', JSON.stringify(locations));
        
        // Update the map and list
        loadMarkers();
        
        console.log('GPS data automatically imported!');
    }}, 1000);
}});
"""
    
    # Write the updated import file
    with open("gps_import_working.js", 'w', encoding='utf-8') as f:
        f.write(js_code)
    
    print(f"✓ GPS import file updated with {len(gps_data)} locations")
    print(f"✓ File saved as: gps_import_working.js")
    print(f"✓ Data will now load automatically when you open index.html")

if __name__ == "__main__":
    print("Updating GPS import file...")
    update_gps_import() 