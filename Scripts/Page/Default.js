
//To do: Load map to container function to be triggred and configured - google maps script added to page and configured already
function loadMapToPage(defaultLat, defaultLon, zoom) {

	var lat = defaultLat;
	var lon = defaultLon;

	initialize(lat, lon, zoom);

	//create our location...
	createMarker(lat, lon, '<a class="mapLink" href="#"/>Our Name</a>', "../../Images/Grey-Marker.png");

	for (var i = 0; i < 5; i++) {

		//random lat lon location generation
		var thisLatLon = [{ "lat": (Math.random() * ((lat.toFixed(4) + 1) - (lat.toFixed(4) - 1) + 1) + (lat.toFixed(4) - 1)), "lon": (Math.random() * ((lon.toFixed(4) + 1) - (lon.toFixed(4) - 1) + 1) + (lon.toFixed(4) - 1)) }];

		console.log(thisLatLon[0].lon + "- " + thisLatLon[0].lat);
		createMarker(thisLatLon[0].lat, thisLatLon[0].lon, '<a class="mapLink" href="#"/>Name</a>', "../../Images/Blue-Marker.png", true, true);
		
		//Add geo lines from our location to each child site
		createLine(52, -2, thisLatLon[0].lat, thisLatLon[0].lat, '#3498db', false, true, "Name 1", "Name 2");
		fitBounds();
	}
};