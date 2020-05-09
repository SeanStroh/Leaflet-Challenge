var query = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"
var API_KEY = "pk.eyJ1Ijoic2Vhbi1zdHJvaCIsImEiOiJjazhnbWpycjEwMzdhM2xydW11cGV3eW03In0.IY96KpGSSO_FranCp7qfCw"

d3.json(query, function(data) {
  earthquakeMap(data.features);
  console.log(data.features)
});

function earthquakeMap(earthquakeData) {

  function radiusSize(magnitude) {
    return magnitude * 18000;
  }
  function popUpFeature(feature, layer) {
    layer.bindPopup("<h3>" + feature.properties.place +
      "</h3><hr><p>" + new Date(feature.properties.time) + "</p>");
  }

  function circleColor(magnitude) {
    if (magnitude < 1) {
      return "#38a52e"
    }
    else if (magnitude < 2) {
      return "#ffbf00"
    }
    else if (magnitude < 3) {
      return "#ff4dd2"
    }
    else if (magnitude < 4) {
      return "#86c5da"
    }
    else if (magnitude < 5) {
      return "#000080"
    }
    else {
      return "#980cff"
    }
  }

  var earthquakes = L.geoJSON(earthquakeData, {
    pointToLayer: function(earthquakeData, latlng) {
      return L.circle(latlng, {
        radius: radiusSize(earthquakeData.properties.mag),
        color: circleColor(earthquakeData.properties.mag),
        fillOpacity: .7
      });
    },
    popUpFeature: popUpFeature
  });
  createMap(earthquakes);
}

function createMap(earthquakes) {


  var lightMap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.light",
    accessToken: API_KEY
  });
  
  var baseMaps = {
    "Light Map": lightMap,
    "Earthquake Map": earthquakes,
  };

  var myMap = L.map("map", {
    center: [
      37.09, -95.71
    ],
    zoom: 4,
    layers: [lightMap, earthquakes]
  });

  function addColor(c) {
    return c > 5 ? '#980cff' :
           c > 4  ? '#000080' :
           c > 3  ? '#86c5da' :
           c > 2  ? '#ff4dd2' :
           c > 1  ? '#ffbf00' :
                    '#38a52e';
  }

var legend = L.control({position: 'bottomright'});

legend.onAdd = function() {
  var div = L
    .DomUtil
    .create("div", "info legend");
  var grades = [0, 1, 2, 3, 4, 5];
  var colors = [
    "#38a52e",
    "#ffbf00",
    "#ff4dd2",
    "#86c5da",
    "#000080",
    "#980cff"
  ];
  // Loop through our intervals and generate a label with a colored square for each interval.
  for (var i = 0; i < grades.length; i++) {
    div.innerHTML += "<i style='background: " + colors[i] + "'></i> " +
      grades[i] + (grades[i + 1] ? "&ndash;" + grades[i + 1] + "<br>" : "+");
  }
  return div;
}
legend.addTo(myMap);
};