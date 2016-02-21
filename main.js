var map;

//Global variables that need to be kept while a game is running
var gameList = [];
var markers = [];

//Keeps track of the current route the user has clicked on
var routeLength = 0;
var route = [];
var printed = 0;

/*
* City object that holds the city name and its latitude and longitude.
*/
function city(name, lat, lng){
	this.name = name;
	this.lat = lat;
	this.lng = lng
}

//List of City objects that can be chosen for the game.
var temp = '[{"name": "Chicago, IL", "coord": {"lat": 41.8781136, "lng": -87.6297982}}, {"name": "New York, NY", "coord": {"lat": 40.7127837, "lng": -74.0059413}}, {"name": "San Francisco, CA", "coord": {"lat": 37.7749295, "lng": -122.4194155}}, {"name": "Champaign, IL", "coord": {"lat": 40.1164204, "lng": -88.2433829}}, {"name": "Miami, FL", "coord": {"lat": 25.7616798, "lng": -80.1917902}}, {"name": "Austin, TX", "coord": {"lat": 30.267153, "lng": -97.7430608}}, {"name": "Los Angeles, CA", "coord": {"lat": 34.0522342, "lng": -118.2436849}}, {"name": "Houston, TX", "coord": {"lat": 29.7604267, "lng": -95.3698028}}, {"name": "Philadelphia, PA", "coord": {"lat": 39.9525839, "lng": -75.1652215}}, {"name": "Detroit, MI", "coord": {"lat": 42.331427, "lng": -83.0457538}}, {"name": "Orlando, FL", "coord": {"lat": 28.5383355, "lng": -81.3792365}}, {"name": "St. Louis, MO", "coord": {"lat": 38.6270025, "lng": -90.19940419999999}}, {"name": "Helena, MT", "coord": {"lat": 46.5883707, "lng": -112.0245054}}, {"name": "Boston, MA", "coord": {"lat": 42.3600825, "lng": -71.0588801}}, {"name": "Phoenix, AZ", "coord": {"lat": 33.4483771, "lng": -112.0740373}}, {"name": "New Orleans, LA", "coord": {"lat": 29.95106579999999, "lng": -90.0715323}}, {"name": "Minneapolis, MN", "coord": {"lat": 44.977753, "lng": -93.2650108}}, {"name": "Omaha NE", "coord": {"lat": 41.2523634, "lng": -95.99798829999999}}, {"name": "Salt Lake City, UT", "coord": {"lat": 40.7607793, "lng": -111.8910474}}, {"name": "Washington D.C.", "coord": {"lat": 38.9071923, "lng": -77.0368707}}, {"name": "Atlanta, GA", "coord": {"lat": 33.7489954, "lng": -84.3879824}}, {"name": "Seattle, WA", "coord": {"lat": 47.6062095, "lng": -122.3320708}}]';
var city_list = JSON.parse(temp);



/*var city_list = [
	{name:"Chicago", coord:{lat:41.8518078, lng:-87.8420512}},
	{name:"Champaign", coord:{lat:40.11461, lng:-88.3471495}},
	{name:"New York", coord:{lat:40.705311, lng:-74.2581946}},
	{name:"San Francisco", coord:{lat:37.7576793, lng:-122.5076404}},
];*/


/*
* Function that is called when the page is loaded that loads in the google map. 
*/
function initMap() {
	map = new google.maps.Map(document.getElementById('map'), {
		center: {lat:37.7658365, lng:-94.1998214},
		zoom: 4
	});
}

/**
* Generates a randomized array of city objects of num_cities length.
*/
function generateCities(num_cities){
	var city_list_copy = jQuery.extend(true, [], city_list);
	var currIndex = city_list.length;

	//Iterate through the array starting from the end and shuffle the indices
	while (currIndex != 0) {

		//Choose random index to swap with
		var randomIndex = Math.floor(Math.random() * currIndex);
		currIndex -= 1;

		//Swap indices
		var temp = city_list_copy[currIndex];
		city_list_copy[currIndex] = city_list_copy[randomIndex];
		city_list_copy[randomIndex] = temp;
	}

	//Slice the array to num_cities length
	return city_list_copy.slice(0, num_cities);
}

/*
* Submits the user's attempt and calculates the difference from google map's attempt.
* Compares the user's route with the answer and plots the answer on the map.
* The results are processed in the processResults function that is called by the api.
*/
function submitRoute() {

	//Remove all the icons of the markers
	var i;
	for(i = 0; i < markers.length; i++){
		markers[i].setMap(null);
	}

	//Hide the submit and clear buttons
	$('#clear-route-btn').hide();
	$('#submit-route-btn').hide();
	
	//Show google info section
	$('#google-info').show();

	var startPoint = new google.maps.LatLng(route[0].coord.lat, route[0].coord.lng);
	//Create the destination array of LatLng google values
	var destinations = [];
	var i;
	for(i = 1; i < route.length; i++){
		destinations.push({
			location: new google.maps.LatLng(route[i].coord.lat, route[i].coord.lng),
			stopover: true,
		});	
	}

	var directionsService = new google.maps.DirectionsService;
	var directionsDisplay = new google.maps.DirectionsRenderer;
	directionsDisplay.setMap(map);

	var googleDist = 0;
	var userDist = 0;

	//Get the directions info about the user's route.
	directionsService.route({
		origin: startPoint,
		destination: startPoint,
		waypoints: destinations,
		optimizeWaypoints: false,
		travelMode: google.maps.TravelMode.DRIVING
	}, function(response, status){
		if (status === google.maps.DirectionsStatus.OK) {
			var retRoute = response.routes[0];

			for(i = 0; i < retRoute.legs.length; i++){
				userDist += retRoute.legs[i].distance.value;
			}
			userDist = Math.round(userDist/1609.344);
			$('#user-dist').html(userDist + " miles");

		} else {
			alert('Directions request failed due to ' + status);
		}
	});

	//Get the directions info about google's route.
	directionsService.route({
		origin: startPoint,
		destination: startPoint,
		waypoints: destinations,
		optimizeWaypoints: true,
		travelMode: google.maps.TravelMode.DRIVING
	}, function(response, status){
		if (status === google.maps.DirectionsStatus.OK) {
			var retRoute = response.routes[0];

			//Display route on the map
			directionsDisplay.setDirections(response);

			console.log("test");
			for(i = 0; i < retRoute.legs.length; i++){
				googleDist += retRoute.legs[i].distance.value;
				
				//Append the list of cities to display
				if(i > 0 && !printed){
					$('#google-route-list').append("<li style=\"font-size:12px\">" + (i) + ")  " + retRoute.legs[i].start_address + "<li>");
				}
			}
			printed = 1;
			googleDist = Math.round(googleDist/1609.344);
			$('#google-dist').html(googleDist + " miles");	

		} else {
			alert('Directions request failed due to ' + status);
		}
	});

	score = Math.max(2500 - (4*(userDist-googleDist)), 0);
	$('#score').html("<h3>You scored " + score + " points!</h3>");
	//$('#score').show();

}

/*
* Adds the city that was clicked on to the route list if it is not already in it.
*/
function addToCurrRoute(city) {
	//First check if the city is not already on the list.
	var i;
	for(i = 0; i < route.length; i++ ) {
		if(city.name == route[i].name) {
			return;
		}
	}
	routeLength++;
	route.push(city);

	//Add the city to the displayed list
	$('#route-list').append("<li style=\"font-size: 12px\">" + (route.length-1) + ")  " + city.name + "</li>");

	//If all cities have been clicked then ungrey the submit button
	if(routeLength == gameList.length) {
		$('#submit-route-btn').prop('disabled', false);
		$('#submit-route-btn').css('background-color', '#ff9933');

		//Bind submit route button
		$('#submit-route-btn').click(function(){
			submitRoute();
		});
	}
}

/*
* Clears the route list and resets the icons.
*/
function clearRoute() {
	route = gameList.slice(0,1);
	routeLength = 1;
	var i;
	for(i = 1; i < markers.length; i++){
		markers[i].setIcon("http://maps.google.com/mapfiles/ms/icons/red-dot.png");
	}

	//Clear the html on the page.
	$('#route-list').html("<h3>Your Route</h3><h4>Start City: "+ gameList[0].name +"</h4>");

	//Disable the submit route button initially.
	$('#submit-route-btn').prop('disabled', true);
	$('#submit-route-btn').css('background-color', 'grey')
}

/**
* Generates a new game based upon the number of cities requested.
*/
function newGame(num_cities){
	map = new google.maps.Map(document.getElementById('map'), {
		center: {lat:37.7658365, lng:-94.1998214},
		zoom: 4
	});

	//Create the list of cities for the game
	gameList = generateCities(num_cities);

	printed = 0;
	markers = [];
	clearRoute();

	//Clear all saved html and show/hide necessary items.
	$('#user-dist').html("");
	$('#google-dist').html("");
	$('#google-route-list').html("");
	$('#google-route-list').html("<h4>Google's Route</h4><h4>Start City: "+ gameList[0].name +"</h4>");

	$('#score').html();
	$('#score').hide();
	$('#google-info').hide();
	$('#clear-route-btn').show();
	$('#submit-route-btn').show();
	$('#directions').hide();


	//Plot the cities on the map
	markers = [];
	var i;
	for(i = 0; i < num_cities; i++){
		var marker = new google.maps.Marker({
			position: gameList[i].coord,
			map: map,
			icon: "http://maps.google.com/mapfiles/ms/icons/red-dot.png",
			//label: gameList[i].name,
			labelClass: "labels",
			title: gameList[i].name,
		});

		//Setup the popup for the city name when you hover your mouse over.
		var infowindow = new google.maps.InfoWindow();

		marker.addListener('mouseover', function() {
			infowindow.setContent(this.title);
			infowindow.open(map, this);
		});

		marker.addListener('mouseout', function() {
			infowindow.close(map, this);
		});

		//Bind each icon that when clicked it will be added to the route.
		marker.addListener('click', function() {
			addToCurrRoute({name:this.title, coord:{lat:this.getPosition().lat(), lng:this.getPosition().lng()}});
			this.setIcon('http://maps.google.com/mapfiles/ms/icons/green-dot.png')
		});

		markers.push(marker);
	}

	google.maps.event.trigger(markers[0], 'click');
	$('#route-list').html("<h3>Your Route</h3><h5>Start City: "+route[0].name +"</h5>");

}

/*
* Bind buttons to start a new game.
*/
function bind_btns(){
	$('.start-game').hide();
	$('.ingame').hide();
	$('#google-info').hide();
	$('#score').hide();

	//Bind the start game button
	$('#new-game-btn').click(function(){
		$('.start-game').show();
		$('#new-game-btn').hide();

		$('#start-game-btn').click(function(){

			var input = $('#city-num-input').val();
			if(isNaN(input) || input > city_list.length || input < 3 || input > 8){
				alert("Please enter a number greater than 2 and less than 9");
			} else {
				$('.start-game').hide();
				$('.ingame').show();
				$('#new-game-btn').show();
				newGame(input);
			}
		});
	});

	//Bind clear route button
	$('#clear-route-btn').click(function(){
		clearRoute();
	});
}

$(document).ready(function(){
	
	bind_btns();
});
