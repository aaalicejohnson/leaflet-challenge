var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"

d3.json(queryUrl).then(function (data) {
    createFeatures(data.features);
}); 

function createFeatures(earthquakeData) { 
    function onEachFeature(feature, layer) {
        layer.bindPopup(`<h3>${feature.properties.place}</h3><hr>
        <p>${new Date(feature.properties.time)}</p>
        <p>Magnitude: ${feature.properties.mag}</p>
        <p>Depth: ${feature.geometry.coordinates[2]}`);
    };
    
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

    var earthquakes = L.geoJSON(earthquakeData, {
        onEachFeature: onEachFeature,
        pointToLayer: circleLayer
    });
    
    createMap(earthquakes);
};

function createMap(earthquakes) {
    var street = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    });

    var topo = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
        attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
    });
    
    var baseMaps = {
        "Street Map": street,
        "Topographic Map": topo
    };

    var overlayMaps = {
        Earthquakes: earthquakes
    };

    var myMap = L.map("map", {
        center: [
            37.09, -95.71
        ],
        zoom: 4,
        layers: [street, earthquakes]
    });

    L.control.layers(baseMaps, overlayMaps, {
        collapsed: false
      }).addTo(myMap);

};
