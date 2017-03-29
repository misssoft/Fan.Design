/*===================Google Methods==================================*/

//gloabl map variable
var map;
var latlngbounds;
var mapOptions;
var geocoder = new google.maps.Geocoder();
var googleMaps = [];
var infowindow = new google.maps.InfoWindow();
var openInfoWindow;

var maxZoom = 2, minZoom = 21;
var homePinDraggable = true;

mapsDefaultZoom = {
	Default: 4
};

var styles = [
	{
		featureType: "all",
		stylers: [
			{
				"visibility": "simplified"
			}
		]
	},
	{
		featureType: "water",
		elementType: "all",
		stylers: [
		  { saturation: -10 }
		]
	}
];

//start map
function initialize(lon, lat, zoom) {
	var myLatlng = new google.maps.LatLng(lon, lat);
	var mapOptions = { zoom: zoom, center: myLatlng, panControl: true, mapTypeId: google.maps.MapTypeId.ROADMAP, scrollwheel: false, styles: styles };

	map = new google.maps.Map(document.getElementById('map'), mapOptions);
	latlngbounds = new google.maps.LatLngBounds();

	google.maps.event.addListener(map, 'zoom_changed', function () { if (map.getZoom() < maxZoom) { map.setZoom(maxZoom); } else if (map.getZoom() > minZoom) { map.setZoom(minZoom); } });
	google.maps.event.addListener(map, 'click', function () { this.setOptions({ scrollwheel: true, draggable: true, maxZoom: 21 }); });
}

function fitBounds() {

	// Check to extend bounds so it doesn't zoom in too far on only one marker
	if (latlngbounds.getNorthEast().equals(latlngbounds.getSouthWest())) {
		var extendPoint1 = new google.maps.LatLng(latlngbounds.getNorthEast().lat() + 0.1, latlngbounds.getNorthEast().lng() + 0.1);
		var extendPoint2 = new google.maps.LatLng(latlngbounds.getNorthEast().lat() - 0.1, latlngbounds.getNorthEast().lng() - 0.1);
		latlngbounds.extend(extendPoint1);
		latlngbounds.extend(extendPoint2);
	}

	map.fitBounds(latlngbounds);
}

//create marker -  lat | lon | info window content | icon | extend boundaries (true/false) | push to array - type (true/false) | array/type name (if pushing)
function createMarker(lat, lon, html, icon, extend, push, type) {

	var location = new google.maps.LatLng(lat, lon);

	var newMarker = new google.maps.Marker({
		position: location,
		map: map,
		icon: icon,
		html: html
	});

	google.maps.event.addListener(newMarker, 'click', function (e) {
		infowindow.setContent(this.html);
		infowindow.open(map, this);
	});

	//extend the bounds for the new marker to fit the map to size once compelte
	if (extend) {
		latlngbounds.extend(location);
	}

	//not required unless an array is specified to push the marker to
	if (push) {
		type.push(newMarker);
	}
}

//create line -  start lat | start lon | end lat | end lon | colour | push to array - type (true/false) | info window | parent info window details | child info window details | arrow direction | line weight
function createLine(startLat, startLon, endLat, endLon, colour, push, click, parent, child, direction, weight) {

	var coordinates = [new google.maps.LatLng(startLat, startLon), new google.maps.LatLng(endLat, endLon)];

	var newLine = new google.maps.Polyline({
		path: coordinates,
		strokeColor: colour,
		strokeOpacity: 0.5,
		strokeWeight: 2,
		map: map,
		icons: null,
		lineWeight: weight == null ? 1 : weight
	});

	if (direction != null) {
		var lineSymbol = {
			path: direction == "inbound" ? google.maps.SymbolPath.BACKWARD_OPEN_ARROW : google.maps.SymbolPath.FORWARD_OPEN_ARROW
		};
		newLine.icons = [{ icon: lineSymbol, offset: '50%' }];
	}

	if (push) {
		type.push(newLine);
	}

	if (click) {
		var obj = {
			'parent': parent,
			'child': child
		};

		newLine.objInfo = obj;

		google.maps.event.addDomListener(newLine, 'mouseover', function () {
			this.setOptions({ strokeWeight: 5 });
		});
		google.maps.event.addListener(newLine, 'mouseout', function () {
			this.setOptions({ strokeWeight: 2 });
		});
		google.maps.event.addDomListener(newLine, 'click', calculateDistance);
	}
}

//calculate the length of a polyline
function calculateDistance() {

	var line = [];

	this.getPath().forEach(function (latLng) {
		line.push(latLng);
	});

	var polylineLengthMiles = calculateLineLength(line);

	var lineCenter = google.maps.geometry.spherical.interpolate(line[0], line[1], 0.5);
	var content = this.objInfo.parent + "<br/>" + this.objInfo.child;

	if (content.indexOf('-') == -1) {
		content = content.replace("<br/>", " to ");
	}

	infowindow.setContent('<p class="marginTop"><b>Distance</b> ' + polylineLengthMiles.toFixed(2) + ' miles</p><p class="smlMarginBottom">' + content + '</p>');
	infowindow.setPosition(lineCenter);
	infowindow.open(map);
}

//get length of ploy line
function calculateLineLength(line) {
	var polylineLength = google.maps.geometry.spherical.computeDistanceBetween((line[0]), (line[1]));
	return polylineLength / 1609.344;
}
