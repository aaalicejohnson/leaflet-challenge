//API Endpoint
var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"

//GET request
d3.json(queryUrl).then(function (data) {
    // Send the data.features object to the createFeatures function.
    createFeatures(data.features);
}); 

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

        var depth = feature.geometry.coordinates[2];
        var fillColor = "";
        if (depth > 90){
            fillColor = '#78f100';
        } else if (depth > 70){
            fillColor = '#fca35d';
        } else if (depth > 50){
            fillColor = '#fdb829';
        } else if (depth > 30){
            fillColor = '#f7db10';
        } else if (depth > 10){
            fillColor = '#ddf400';
        }else {
            fillColor = '#a4f600'
        };

        return new L.CircleMarker(latlng, {
        	radius: feature.properties.mag * 4, 
        	fillOpacity: 0.75,
            color: 'black',
            fillColor: fillColor,
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
    
};
