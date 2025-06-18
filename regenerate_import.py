import json
from datetime import datetime

def regenerate_import():
    """Regenerate the GPS import script from the JSON data"""
    
    # Load the GPS data
    try:
        with open('gps_data_working.json', 'r', encoding='utf-8') as f:
            gps_data = json.load(f)
    except FileNotFoundError:
        print("Error: gps_data_working.json not found!")
        print("Please run extract_gps_working.py first to generate the GPS data.")
        return
    
    # Generate the JavaScript import code
    js_code = f"""
// Working GPS data from media files
// Generated on: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}

const autoGpsData = {json.dumps(gps_data, indent=2)};

// Function to import GPS data into the website
function importGpsData() {{
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
    updateMediaList();
    
    console.log('Working GPS data imported successfully!');
    alert('Working GPS data imported successfully!');
}}

// Auto-import GPS data when page loads
document.addEventListener('DOMContentLoaded', function() {{
    // Import the GPS data automatically
    importGpsData();
}});
"""
    
    # Save the import script
    with open("gps_import_working.js", 'w', encoding='utf-8') as f:
        f.write(js_code)
    
    print(f"GPS import script regenerated successfully!")
    print(f"Total files with GPS data: {len(gps_data)}")
    print(f"Import script saved to: gps_import_working.js")

if __name__ == "__main__":
    regenerate_import() 