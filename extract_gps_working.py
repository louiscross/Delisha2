from PIL import Image
from PIL.ExifTags import TAGS, GPSTAGS
import os
import json
from datetime import datetime

def get_exif_data(image_path):
    """Extract EXIF data from an image file"""
    try:
        image = Image.open(image_path)
        exif_data = image._getexif()
        if not exif_data:
            return {}
        
        exif = {}
        for tag, value in exif_data.items():
            decoded = TAGS.get(tag, tag)
            if decoded == "GPSInfo":
                gps_data = {}
                for t in value:
                    sub_decoded = GPSTAGS.get(t, t)
                    gps_data[sub_decoded] = value[t]
                exif[decoded] = gps_data
            else:
                exif[decoded] = value
        return exif
    except Exception as e:
        print(f"Error reading EXIF from {image_path}: {e}")
        return {}

def convert_to_degrees(value):
    """Convert GPS coordinates from degrees, minutes, seconds to decimal degrees"""
    def to_float(ratio):
        return float(ratio) if isinstance(ratio, float) else ratio.numerator / ratio.denominator

    d, m, s = value
    return to_float(d) + to_float(m)/60 + to_float(s)/3600

def get_lat_lon(exif_data):
    """Extract latitude and longitude from EXIF GPS data"""
    gps_info = exif_data.get("GPSInfo")
    if not gps_info:
        return None, None

    lat = gps_info.get("GPSLatitude")
    lat_ref = gps_info.get("GPSLatitudeRef")
    lon = gps_info.get("GPSLongitude")
    lon_ref = gps_info.get("GPSLongitudeRef")

    if lat and lat_ref and lon and lon_ref:
        lat_deg = convert_to_degrees(lat)
        if lat_ref != "N":
            lat_deg = -lat_deg

        lon_deg = convert_to_degrees(lon)
        if lon_ref != "E":
            lon_deg = -lon_deg

        return lat_deg, lon_deg
    return None, None

def get_image_date(exif_data):
    """Extract date from EXIF data"""
    date_fields = ['DateTime', 'DateTimeOriginal', 'DateTimeDigitized']
    for field in date_fields:
        if field in exif_data:
            try:
                date_str = exif_data[field]
                # Parse date string (format: YYYY:MM:DD HH:MM:SS)
                date_obj = datetime.strptime(date_str, '%Y:%m:%d %H:%M:%S')
                return date_obj.strftime('%Y-%m-%d %H:%M:%S')
            except:
                continue
    return None

def scan_media_folder(folder_path="media"):
    """Scan the media folder and extract GPS data from all supported files"""
    if not os.path.exists(folder_path):
        print(f"Error: Folder '{folder_path}' does not exist!")
        return {}
    
    # Supported image and video formats
    image_extensions = ('.jpg', '.jpeg', '.png', '.bmp', '.tiff', '.tif')
    video_extensions = ('.mp4', '.mov', '.avi')
    all_extensions = image_extensions + video_extensions
    
    gps_data = {}
    total_files = 0
    files_with_gps = 0
    
    print(f"Working GPS Extraction - Scanning folder: {folder_path}")
    print("=" * 60)
    
    for filename in os.listdir(folder_path):
        if filename.lower().endswith(all_extensions):
            total_files += 1
            file_path = os.path.join(folder_path, filename)
            
            print(f"Processing: {filename}")
            
            exif_data = get_exif_data(file_path)
            lat, lon = get_lat_lon(exif_data)
            date_taken = get_image_date(exif_data)
            
            if lat and lon:
                files_with_gps += 1
                gps_data[filename] = {
                    "lat": lat,
                    "lng": lon,
                    "date_taken": date_taken,
                    "description": f"Auto-extracted from {filename}"
                }
                print(f"  ✓ GPS found: {lat:.6f}, {lon:.6f}")
                if date_taken:
                    print(f"  📅 Date: {date_taken}")
            else:
                print(f"  ✗ No GPS data found")
    
    print("\n" + "=" * 60)
    print(f"Summary:")
    print(f"  Total media files: {total_files}")
    print(f"  Files with GPS data: {files_with_gps}")
    print(f"  Files without GPS data: {total_files - files_with_gps}")
    
    return gps_data

def save_to_json(gps_data, output_file="gps_data_working.json"):
    """Save GPS data to a JSON file"""
    with open(output_file, 'w', encoding='utf-8') as f:
        json.dump(gps_data, f, indent=2, ensure_ascii=False)
    print(f"\nGPS data saved to: {output_file}")

def generate_web_data(gps_data):
    """Generate JavaScript code to import GPS data into the website"""
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

// Add import button to the controls
document.addEventListener('DOMContentLoaded', function() {{
    setTimeout(() => {{
        const controls = document.querySelector('.controls');
        const importBtn = document.createElement('button');
        importBtn.className = 'btn';
        importBtn.textContent = 'Import Working GPS Data';
        importBtn.addEventListener('click', importGpsData);
        controls.appendChild(importBtn);
    }}, 1500);
}});
"""
    
    with open("gps_import_working.js", 'w', encoding='utf-8') as f:
        f.write(js_code)
    print(f"Web import script saved to: gps_import_working.js")

def main():
    """Main function to run the working GPS extraction"""
    print("England Media Map - Working GPS Data Extractor")
    print("=" * 60)
    
    # Scan the media folder
    gps_data = scan_media_folder()
    
    if gps_data:
        # Save to JSON file
        save_to_json(gps_data)
        
        # Generate web import script
        generate_web_data(gps_data)
        
        print(f"\nTo use this data in your website:")
        print(f"1. Replace the line in index.html:")
        print(f"   <script src='gps_import.js'></script>")
        print(f"   with:")
        print(f"   <script src='gps_import_working.js'></script>")
        print(f"2. Refresh your website and click 'Import Working GPS Data' button")
        
        # Show sample of extracted data
        print(f"\nSample extracted data:")
        for filename, data in list(gps_data.items())[:5]:
            print(f"  {filename}: {data['lat']:.6f}, {data['lng']:.6f}")
    else:
        print("\nNo GPS data found in any images.")
        print("Make sure your photos were taken with GPS-enabled devices.")

if __name__ == "__main__":
    main() 