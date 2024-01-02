// Function to determine marker color based on depth
function getMarkerColor(depth) {
    return depth > 90 ? '#d73027' :
           depth > 70 ? '#4575b4' :
           depth > 50 ? '#91bfdb' :
           depth > 30 ? '#313695' :
                        '#313695';
  }
  
  // Leaflet map setup
  var myMap = L.map("map", {
    center: [37.7749, -122.4194],
    zoom: 3,
  });
  
  // Add a tile layer to the map using OpenStreetMap
  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    maxZoom: 18,
  }).addTo(myMap);
  
  // Fetch earthquake data and create markers
  fetch('https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson')
    .then(response => response.json())
    .then(data => {
      // Loop through earthquake data and create markers
      data.features.forEach(quake => {
        // Extract relevant information
        const magnitude = quake.properties.mag;
        const depth = quake.geometry.coordinates[2];
        const latitude = quake.geometry.coordinates[1];
        const longitude = quake.geometry.coordinates[0];
        const location = quake.properties.place;
  
        // Create a marker with size and color based on magnitude and depth
        L.circleMarker([latitude, longitude], {
          radius: magnitude * 3,
          color: getMarkerColor(depth),
          fillOpacity: 0.7
        }).bindPopup(`<strong>Location:</strong> ${location}<br><strong>Magnitude:</strong> ${magnitude}<br><strong>Depth:</strong> ${depth} km`).addTo(myMap);
      });
  
      // Create a legend
      var legend = L.control({ position: 'bottomright' });
  
      legend.onAdd = function () {
        var div = L.DomUtil.create('div', 'info legend');
        var depths = [0, 30, 50, 70, 90];
        var labels = [];
  
        // Loop through depths and generate a label with a colored square for each interval
        for (var i = 0; i < depths.length; i++) {
          div.innerHTML +=
            '<i style="background:' + getMarkerColor(depths[i] + 1) + '"></i> ' +
            depths[i] + (depths[i + 1] ? '&ndash;' + depths[i + 1] + ' km<br>' : '+ km');
        }
  
        return div;
      };
  
      legend.addTo(myMap);
    })
    .catch(error => console.error('Error fetching data:', error));