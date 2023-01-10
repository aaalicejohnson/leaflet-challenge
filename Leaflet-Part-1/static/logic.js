//API Endpoint
var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"

//GET request
d3.json(queryUrl).then(function (data) {
    // Send the data.features object to the createFeatures function.
    createFeatures(data.features);
}); 

function getColor(depth) {
    return depth >= 90 ? 'red':
        depth > 70 ? '#fc7f03':
            depth > 50 ? '#fdb829':
                depth > 30 ? '##f7db10':
                     depth > 10 ? '#ddf400':
                        '#a4f600';    
};

//createFeatures function
function createFeatures(earthquakeData) { 

    //Function to run for each feature of the array
    function onEachFeature(feature, layer) {
        layer.bindPopup(`<h3>${feature.properties.place}</h3><hr>
        <p>${new Date(feature.properties.time)}</p>
        <p>Magnitude: ${feature.properties.mag}</p>
        <p>Depth: ${feature.geometry.coordinates[2]}`);
    };
    
    //Circle layer function for the pointToLayer attribute of the geoJSON, goes through each feature of the array.
    function circleLayer(feature, latlng) {


        return new L.CircleMarker(latlng, {
        	radius: feature.properties.mag * 4, 
        	fillOpacity: 0.75,
            color: 'black',
            fillColor: getColor(feature.geometry.coordinates[2]),
            weight: 1
        });
    };

    // Create a GeoJSON layer that contains the features array on the earthquakeData object.
    // Run the onEachFeature and pointToLayer function once for each piece of data in the array.
    var earthquakes = L.geoJSON(earthquakeData, {
        onEachFeature: onEachFeature,
        pointToLayer: circleLayer
    });
    
    // Send our earthquakes layer to the createMap function.
    createMap(earthquakes);
};

function createMap(earthquakes) {

    //Base layers.
    var street = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    });

    var topo = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
        attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
    });
    
    //baseMaps object.
    var baseMaps = {
        "Street Map": street,
        "Topographic Map": topo
    };

    //Overlay object.
    var overlayMaps = {
        Earthquakes: earthquakes
    };

    // Create our map, giving it the streetmap and earthquakes layers to display on load.
     var myMap = L.map("map", {
        center: [
            37.09, -95.71
        ],
        zoom: 4,
        layers: [street, earthquakes]
    });

    // Create a layer control.
    // Pass it our baseMaps and overlayMaps.
    // Add the layer control to the map.
    L.control.layers(baseMaps, overlayMaps, {
        collapsed: false
    }).addTo(myMap);

    var info = L.control({ position: "bottomright" });
    info.onAdd = function (map) {
        var div = L.DomUtil.create("div", "legend"),
            depth = [-10, 10, 30, 50, 70, 90];
        for (var i = 0; i < depth.length; i++){
            div.innerHTML +=
                '<i style="background:' + getColor(depth[i]) + '"></i> ' +
                depth[i] + (depth[i + 1] ? '&ndash;' + depth[i + 1] + '<br>' : '+');
        }
        return div;
    };
    // Add the info legend to the map.
    info.addTo(myMap);

   
};
