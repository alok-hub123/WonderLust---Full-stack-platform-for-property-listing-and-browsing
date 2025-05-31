// Initialize the map when the page loads
document.addEventListener('DOMContentLoaded', () => {
  // Get the map container element
  const mapElement = document.getElementById('map');
  
  // Check if the map element exists on the page
  if (mapElement) {
    // Get the coordinates from the data attributes
    const lat = parseFloat(mapElement.getAttribute('data-lat') || 40.7128);
    const lng = parseFloat(mapElement.getAttribute('data-lng') || -74.006);
    
    // Initialize the map
    const map = new google.maps.Map(mapElement, {
      center: { lat, lng },
      zoom: 13,
      scrollwheel: false
    });
    
    // Add a marker at the listing location
    const marker = new google.maps.Marker({
      position: { lat, lng },
      map: map,
      title: 'Listing Location'
    });
  }
});
