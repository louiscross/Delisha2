// Global variables
let map;
let markers = [];
let locationGroups = {}; // Groups photos by location
let mediaFiles = [];
let locations = JSON.parse(localStorage.getItem('mediaLocations')) || {};

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    initializeMap();
    // GPS data will be automatically imported by gps_import_working.js
});

// Initialize the map centered on England
function initializeMap() {
    map = L.map('map').setView([52.3555, -1.1743], 7); // Center of England
    
    // Add OpenStreetMap tiles
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors',
        maxZoom: 18
    }).addTo(map);
    
    // Add a boundary for England (simplified)
    const englandBounds = [
        [49.9, -6.0], // Southwest
        [55.8, 1.8]   // Northeast
    ];
    
    // Add a subtle overlay to highlight England
    L.rectangle(englandBounds, {
        color: "#667eea",
        weight: 2,
        fillOpacity: 0.1
    }).addTo(map);
}

// Group photos by location (within ~50 meters)
function groupPhotosByLocation(locations) {
    const groups = {};
    const processed = new Set();
    
    Object.keys(locations).forEach(fileName => {
        if (processed.has(fileName)) return;
        
        const location = locations[fileName];
        const groupKey = `${location.lat.toFixed(4)},${location.lng.toFixed(4)}`;
        
        if (!groups[groupKey]) {
            groups[groupKey] = {
                lat: location.lat,
                lng: location.lng,
                photos: []
            };
        }
        
        // Find all photos within ~50 meters of this location
        Object.keys(locations).forEach(otherFileName => {
            if (processed.has(otherFileName)) return;
            
            const otherLocation = locations[otherFileName];
            const distance = getDistance(location.lat, location.lng, otherLocation.lat, otherLocation.lng);
            
            if (distance < 0.05) { // ~50 meters
                groups[groupKey].photos.push({
                    fileName: otherFileName,
                    lat: otherLocation.lat,
                    lng: otherLocation.lng,
                    description: otherLocation.description
                });
                processed.add(otherFileName);
            }
        });
    });
    
    return groups;
}

// Calculate distance between two coordinates in kilometers
function getDistance(lat1, lon1, lat2, lon2) {
    const R = 6371; // Earth's radius in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
              Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
}

// Load media files from the media folder
function loadMediaFiles() {
    // This would normally be done server-side, but for this demo we'll use a predefined list
    // In a real implementation, you'd scan the media folder and get the file list
    const mediaExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.mp4', '.mov', '.avi'];
    
    // For demo purposes, we'll create a list based on common file patterns
    // In a real implementation, you'd get this from the server
    mediaFiles = [
        'IMG_1772.mp4',
        'IMG_1779.jpg',
        'IMG_1778.jpg',
        'IMG_1780.jpg',
        'IMG_1773.jpg',
        'IMG_1777.jpg',
        'IMG_1775.jpg',
        'IMG_1776.jpg',
        'IMG_1771.jpg',
        'IMG_1774.jpg',
        'IMG_1770.jpg',
        'IMG_1768.mp4',
        'IMG_1766.jpg',
        'IMG_1769.jpg',
        'IMG_1764.jpg',
        'IMG_1762.jpg',
        'IMG_1765.jpg',
        'IMG_1767.jpg',
        'IMG_1763.jpg',
        'IMG_1761.jpg',
        'IMG_1751.mp4',
        'IMG_1760.jpg',
        'IMG_1759.jpg',
        'IMG_1758.jpg',
        'IMG_1757.jpg',
        'IMG_1754.jpg',
        'IMG_1756.jpg',
        'IMG_1755.jpg',
        'IMG_1753.jpg',
        'IMG_1752.jpg',
        'IMG_1750.jpg',
        'IMG_1749.jpg',
        'IMG_1748.jpg',
        'IMG_1745.jpg',
        'IMG_1747.jpg',
        'IMG_1744.jpg',
        'IMG_1743.jpg',
        'IMG_1746.jpg',
        'IMG_1742.jpg',
        'IMG_1741.jpg',
        'IMG_1740.jpg',
        'IMG_1734.jpg',
        'IMG_1739.jpg',
        'IMG_1736.jpg',
        'IMG_1738.jpg',
        'IMG_1737.jpg',
        'IMG_1735.jpg',
        'IMG_1733.jpg',
        'IMG_1731.jpg',
        'IMG_1732.jpg',
        'IMG_1730.jpg',
        'IMG_1729.mp4',
        'IMG_1728.jpg',
        'IMG_1727.jpg',
        'IMG_1726.jpg',
        'IMG_1725.jpg',
        'IMG_1724.jpg',
        'IMG_1723.jpg',
        'IMG_1721.jpg',
        'IMG_1722.jpg',
        'IMG_1719.jpg',
        'IMG_1718.jpg',
        'IMG_1720.jpg',
        'IMG_1717.jpg',
        'IMG_1711.jpg',
        'IMG_1715.jpg',
        'IMG_1714.jpg',
        'IMG_1716.jpg',
        'IMG_1713.jpg',
        'IMG_1712.jpg',
        'IMG_1709.jpg',
        'IMG_1708.jpg',
        'IMG_1710.jpg',
        'IMG_1707.jpg',
        'IMG_1705.jpg',
        'IMG_1699.mp4',
        'IMG_1706.jpg',
        'IMG_1704.jpg',
        'IMG_1701.jpg',
        'IMG_1703.jpg',
        'IMG_1702.jpg',
        'IMG_1700.jpg',
        'IMG_1698.mp4',
        'IMG_1695.mp4',
        'IMG_1691.mp4',
        'IMG_1693.jpg',
        'IMG_1694.jpg',
        'IMG_1690.jpg',
        'IMG_1692.jpg',
        'IMG_2794.jpg',
        'IMG_2780.jpg',
        '3E436F99-7952-4FC5-9635-77E94732D42D.jpg',
        'IMG_1689.jpg',
        'IMG_1685.mp4',
        'IMG_2782.jpg',
        'IMG_1686.jpg',
        'IMG_1688.jpg',
        'BF100406-E97A-4179-B1BD-E857A5916D8B.jpg',
        'IMG_1684.jpg',
        'IMG_1683.jpg'
    ];
}

// Add a marker to the map
function addMarker(groupKey, groupData) {
    // Remove existing marker for this group if it exists
    removeMarker(groupKey);
    
    // Create custom icon based on number of photos
    const photoCount = groupData.photos.length;
    const isMultiple = photoCount > 1;
    
    const icon = L.divIcon({
        className: 'custom-marker',
        html: `<div style="background: ${isMultiple ? '#ff6b6b' : '#4ecdc4'}; width: ${isMultiple ? '24px' : '20px'}; height: ${isMultiple ? '24px' : '20px'}; border-radius: 50%; border: 2px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.3); display: flex; align-items: center; justify-content: center; color: white; font-weight: bold; font-size: ${isMultiple ? '10px' : '0px'};">${isMultiple ? photoCount : ''}</div>`,
        iconSize: [isMultiple ? 24 : 20, isMultiple ? 24 : 20],
        iconAnchor: [isMultiple ? 12 : 10, isMultiple ? 12 : 10]
    });
    
    // Create marker
    const marker = L.marker([groupData.lat, groupData.lng], { icon: icon }).addTo(map);
    
    // Create popup content
    const popupContent = createPopupContent(groupData);
    marker.bindPopup(popupContent);
    
    // Store marker reference
    markers[groupKey] = marker;
}

// Create popup content for markers
function createPopupContent(groupData) {
    const photos = groupData.photos;
    
    if (photos.length === 1) {
        // Single photo - show just the image
        const photo = photos[0];
        const isVideo = photo.fileName.toLowerCase().endsWith('.mp4') || photo.fileName.toLowerCase().endsWith('.mov') || photo.fileName.toLowerCase().endsWith('.avi');
        const mediaPath = `media/${photo.fileName}`;
        
        let mediaElement = '';
        if (isVideo) {
            mediaElement = `<video controls style="max-width: 100%; max-height: 300px;">
                <source src="${mediaPath}" type="video/mp4">
                Your browser does not support the video tag.
            </video>`;
        } else {
            mediaElement = `<img src="${mediaPath}" alt="${photo.fileName}" style="max-width: 100%; max-height: 300px;">`;
        }
        
        return `<div class="media-popup">${mediaElement}</div>`;
    } else {
        // Multiple photos - show grid of images
        let mediaGrid = '';
        photos.forEach(photo => {
            const isVideo = photo.fileName.toLowerCase().endsWith('.mp4') || photo.fileName.toLowerCase().endsWith('.mov') || photo.fileName.toLowerCase().endsWith('.avi');
            const mediaPath = `media/${photo.fileName}`;
            
            if (isVideo) {
                mediaGrid += `<div style="display: inline-block; margin: 5px; width: 80px; height: 80px; background: #ff6b6b; border-radius: 8px; display: flex; align-items: center; justify-content: center; color: white; font-size: 12px;">VIDEO</div>`;
            } else {
                mediaGrid += `<img src="${mediaPath}" alt="${photo.fileName}" style="width: 80px; height: 80px; object-fit: cover; margin: 5px; border-radius: 8px; cursor: pointer;" onclick="showFullImage('${mediaPath}')">`;
            }
        });
        
        return `
            <div class="media-popup">
                <div style="text-align: center; margin-bottom: 10px; font-weight: bold; color: #333;">
                    ${photos.length} photos at this location
                </div>
                <div style="max-width: 300px; max-height: 200px; overflow-y: auto;">
                    ${mediaGrid}
                </div>
            </div>
        `;
    }
}

// Function to show full image in a modal
function showFullImage(imagePath) {
    // Create modal
    const modal = document.createElement('div');
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0,0,0,0.9);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 10000;
        cursor: pointer;
    `;
    
    const img = document.createElement('img');
    img.src = imagePath;
    img.style.cssText = `
        max-width: 90%;
        max-height: 90%;
        object-fit: contain;
    `;
    
    modal.appendChild(img);
    document.body.appendChild(modal);
    
    // Close modal on click
    modal.addEventListener('click', () => {
        document.body.removeChild(modal);
    });
}

// Remove a marker from the map
function removeMarker(groupKey) {
    if (markers[groupKey]) {
        map.removeLayer(markers[groupKey]);
        delete markers[groupKey];
    }
}

// Load all saved markers
function loadMarkers() {
    // Group photos by location
    locationGroups = groupPhotosByLocation(locations);
    
    // Add markers for each group
    Object.keys(locationGroups).forEach(groupKey => {
        const groupData = locationGroups[groupKey];
        addMarker(groupKey, groupData);
    });
}

// Update the media list display
function updateMediaList() {
    const mediaList = document.getElementById('mediaList');
    mediaList.innerHTML = '';
    
    mediaFiles.forEach(file => {
        const mediaItem = document.createElement('div');
        mediaItem.className = 'media-item';
        
        if (locations[file]) {
            mediaItem.classList.add('has-location');
        }
        
        const location = locations[file];
        const locationText = location 
            ? `${location.lat.toFixed(4)}, ${location.lng.toFixed(4)}`
            : 'No location set';
        
        mediaItem.innerHTML = `
            <div class="media-name">${file}</div>
            <div class="media-location">${locationText}</div>
        `;
        
        // Add click handler to center map on marker if it exists
        mediaItem.addEventListener('click', () => {
            if (location) {
                map.setView([location.lat, location.lng], 12);
                markers[file].openPopup();
            } else {
                alert('No location set for this file. Click "Add Location" to set one.');
            }
        });
        
        mediaList.appendChild(mediaItem);
    });
}

// Refresh the map
function refreshMap() {
    // Clear all markers
    Object.keys(markers).forEach(fileName => {
        removeMarker(fileName);
    });
    
    // Reload markers
    loadMarkers();
    
    // Reset map view to England
    map.setView([52.3555, -1.1743], 7);
    
    alert('Map refreshed!');
}

// Add some sample locations for demonstration
function addSampleLocations() {
    const sampleLocations = {
        'IMG_1779.jpg': { lat: 51.5074, lng: -0.1278, description: 'London - Big Ben' },
        'IMG_1778.jpg': { lat: 53.4808, lng: -2.2426, description: 'Manchester - City Centre' },
        'IMG_1777.jpg': { lat: 52.4862, lng: -1.8904, description: 'Birmingham - Bullring' },
        'IMG_1776.jpg': { lat: 53.4084, lng: -2.9916, description: 'Liverpool - Albert Dock' },
        'IMG_1775.jpg': { lat: 54.9783, lng: -1.6178, description: 'Newcastle - Quayside' },
        'IMG_1774.jpg': { lat: 50.8225, lng: -0.1372, description: 'Brighton - Pier' },
        'IMG_1773.jpg': { lat: 52.2053, lng: 0.1218, description: 'Cambridge - King\'s College' },
        'IMG_1772.mp4': { lat: 51.4545, lng: -2.5879, description: 'Bristol - Harbourside' },
        'IMG_1771.jpg': { lat: 53.8008, lng: -1.5491, description: 'Leeds - City Square' },
        'IMG_1770.jpg': { lat: 52.9548, lng: -1.1581, description: 'Nottingham - Market Square' }
    };
    
    // Add sample locations if they don't exist
    Object.keys(sampleLocations).forEach(fileName => {
        if (!locations[fileName] && mediaFiles.includes(fileName)) {
            locations[fileName] = sampleLocations[fileName];
        }
    });
    
    // Save to localStorage
    localStorage.setItem('mediaLocations', JSON.stringify(locations));
    
    // Update display
    loadMarkers();
    updateMediaList();
}

// Add a button to add sample locations (for demo purposes)
document.addEventListener('DOMContentLoaded', function() {
    // Add sample locations button after a short delay
    setTimeout(() => {
        const controls = document.querySelector('.controls');
        const sampleBtn = document.createElement('button');
        sampleBtn.className = 'btn';
        sampleBtn.textContent = 'Add Sample Locations (Demo)';
        sampleBtn.addEventListener('click', addSampleLocations);
        controls.appendChild(sampleBtn);
    }, 1000);
}); 