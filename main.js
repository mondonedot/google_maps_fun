var map;

//Global variables that need to be kept while a game is running
var score = 0;
var game_list = [];
var markers = [];

//Keeps track of the current route the user has clicked on
var routeLength = 0;
var route = [];

/*
* City object that holds the city name and its latitude and longitude.
*/
function city(name, lat, lng){
	this.name = name;
	this.lat = lat;
	this.lng = lng
}

//List of City objects that can be chosen for the game.
var city_list = [
	{name:"Chicago", coord:{lat:41.8518078, lng:-87.8420512}},
	{name:"Champaign", coord:{lat:40.11461, lng:-88.3471495}},
	{name:"New_York", coord:{lat:40.705311, lng:-74.2581946}},
	{name:"San Francisco", coord:{lat:37.7576793, lng:-122.5076404}},
];

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

/**
* Generates a new game based upon the number of cities requested.
*/
function newGame(num_cities){
	map = new google.maps.Map(document.getElementById('map'), {
		center: {lat:37.7658365, lng:-94.1998214},
		zoom: 4
	});

	//Create the list of cities for the game
	game_list = generateCities(num_cities);

	//Plot the cities on the map
	markers = [];
	var i;
	for(i = 0; i < num_cities; i++){
		var marker = new google.maps.Marker({
			position: game_list[i].coord,
			map: map,
			//label: game_list[i].name,
			labelClass: "labels",
			title: game_list[i].name,
		});

		//Setup the popup for the city name
		var infowindow = new google.maps.InfoWindow();

		marker.addListener('click', function() {
			infowindow.setContent(this.title);
			infowindow.open(map, this);
		});

		markers.push(marker);
	}

	//Set the starting point
}

/*
* Bind buttons to start a new game.
*/
function bind_btns(){
	$('.start-game').hide();

	//Bind the start game button
	$('#new-game-btn').click(function(){
		$('.start-game').show();
		$('#new-game-btn').hide();

		$('#start-game-btn').click(function(){

			var input = $('#city-num-input').val();
			if(isNaN(input) || input > city_list.length){
				alert("Please enter a number less than " + city_list.length);
			} else {
				$('.start-game').hide();
				$('#new-game-btn').show();
				newGame(input);
			}
		});
	});
}

$(document).ready(function(){
	
	bind_btns();

});
