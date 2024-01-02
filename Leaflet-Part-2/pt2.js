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
  
  // Add different base maps to choose from (OpenStreetMap and Dark Map)
  var baseMaps = {
    "OpenStreetMap": L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      maxZoom: 18,
    }),
    "Dark Map": L.tileLayer("https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png", {
      attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      maxZoom: 18,
    })
  };
  
  // Add base maps to the map
  baseMaps["OpenStreetMap"].addTo(myMap);
  
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
    })
    .catch(error => console.error('Error fetching earthquake data:', error));
  
  // Fetch tectonic plates data and create a layer for it
  fetch('https://raw.githubusercontent.com/fraxen/tectonicplates/master/GeoJSON/PB2002_boundaries.json')
    .then(response => response.json())
    .then(tectonicData => {
      // Create a layer for tectonic plates
      var tectonicPlates = L.geoJSON(tectonicData, {
        style: {
          color: '#FF5733',
          weight: 2,
        }
      });
  
      // Add tectonic plates layer to the map
      tectonicPlates.addTo(myMap);
  
      // Create overlays for layer control
      var overlays = {
        "Earthquakes": myMap,
        "Tectonic Plates": tectonicPlates,
      };
  
      // Add layer controls to the map
      L.control.layers(baseMaps, overlays).addTo(myMap);
    })
    .catch(error => console.error('Error fetching tectonic plates data:', error));