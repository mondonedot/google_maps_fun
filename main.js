var map;
var list = [1,2,3];

/*
* Function that is called when the page is loaded that loads in the google map. 
*/
function initMap() {
	map = new google.maps.Map(document.getElementById('map'), {
		center: {lat: 40, lng: -88},
		zoom: 4
	});
}

/**
* Generates an array of cities and their latitude, longitude in a tuple.
*/
function generateCities(num_cities){

}

/**
* Generates a new game based upon the number of cities requested.
*/
function newGame(num_cities){

}

$(document).ready(function(){
	console.log(list);
});
