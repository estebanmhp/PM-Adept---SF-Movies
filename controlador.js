var moviesData = [];
var locationsFromMovies = new Map();
var markers = new OpenLayers.Layer.Markers("Markers");

function getUniqueValues(data) {
  uniqueValue = [];
  for (const obj of data) {
    if (!uniqueValue.includes(obj.title)) {
      uniqueValue.push(obj.title);
    }
  }
  return uniqueValue;
}

function setLocationsFromMovies(uniqueNames) {
  for (const name of uniqueNames) {
    locationsFromMovies.set(name, []);
  }

  for (const info of moviesData) {
    var currentArray = locationsFromMovies.get(info.title);
    currentArray.push(info.locations);
    locationsFromMovies.set(info.title, currentArray);
  }
  console.log(locationsFromMovies);
}

function addEventListenerToForm() {
  $("#autocomplete-form").submit(function (e) {
    e.preventDefault();
    markers.clearMarkers();
    var locationsNames = locationsFromMovies.get(
      document.getElementById("myInput").value
    );
    console.log(locationsNames);
    if (
      locationsNames != null &&
      locationsNames.length != 0 &&
      locationsNames[0] != undefined
    ) {
      for (const name of locationsNames) {
        var nameParametrized = name.replace(" ", "+");
        $.ajax({
          url:
            "https://nominatim.openstreetmap.org/search?q=" +
            nameParametrized +
            "%2C+San+Francisco&format=geocodejson",
          type: "GET",
        }).done(function (data) {
          if (data["features"].length != 0) {
            var coordinates = data["features"][0]["geometry"]["coordinates"];
            var lonLat = new OpenLayers.LonLat(
              coordinates[0],
              coordinates[1]
            ).transform(
              new OpenLayers.Projection("EPSG:4326"), // transform from WGS 1984
              map.getProjectionObject() // to Spherical Mercator Projection
            );
            markers.addMarker(new OpenLayers.Marker(lonLat));
          }
        });
      }
    }
  });
}
