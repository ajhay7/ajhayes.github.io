// Code for the View Location page.

// This is sample code to demonstrate navigation.
// You need not use it for final app.
var cache2 = new LocationWeatherCache();
var map;

alert("Please reload browser page to get weather information for a new location" + "   " + "                                                                                               Pleases reload browser page to update your weather information");//This alert deals with a current bug.
// This function is called by the google maps API when the viewLocationPage.js is loaded. Otherwise it works the same as the initMap() function in the addlocationPage.js
function initialMap(){
    map = new google.maps.Map(document.getElementById("locationMap"), {
        center: {lat: -37.8136, lng: 144.9631},
        zoom: 10
    });
    updateMap(locationLatitude,locationLongitude);
}

var locationsFromStorage = loadLocations();//this variable is equal to what is returned from the loadLocations() function in the locationWeatherCache.js

var locationIndex = localStorage.getItem(APP_PREFIX + "-selectedLocation");// variable that equals the selected location index saved in localStorage
var locationName = locationsFromStorage[locationIndex].locationName;// variable that equals the selected locations nickname
var locationLatitude = locationsFromStorage[locationIndex].lat;// variable that equals the selected locations latitude
var locationLongitude = locationsFromStorage[locationIndex].lng;// variable that equals the selected locations longitude

if(locationName == ""){
	locationName = "Untitled Location"; //If the locationName property in the selected locations object loaded from localStorage is empty, the locationName is set to "Untitled Location".
}
	document.getElementById("headerBarTitle").textContent = locationName;//Sets the text in the title to the value of locationName

var date = new Date(); //Generates today's date

cache2.getWeatherAtIndexForDate(locationIndex, date)//This calls the getWeatherAtIndexForDate method in the locationWeatherCache class and passes the locationIndex of the selected location and today's date. This is how the weather information for the location is gathered.

//This function is called in the initialMap() function, is passed the selected locations latitude and longitude and sets the maps centre to be at these coordinates.
function updateMap(locationLatitude, locationLongitude){
    map.setCenter({lat: locationLatitude, lng: locationLongitude});
    var marker = new google.maps.Marker(
    {
        map: map,
        position: {lat: locationLatitude, lng: locationLongitude}
    });
}
//This function call passes the displayWeather function the forecast information from the selected location from local storage.
 displayWeather(locationsFromStorage[locationIndex].forecasts);

function displayWeather(weather){
    // These variables are assigned to id attributes. This allows weather data to be displayed on the view location page
    var weatherSummaryRef = document.getElementById("weatherSummary");
    var weatherMinTempRef = document.getElementById("weatherMinTemp");
    var weatherMaxTempRef = document.getElementById("weatherMaxTemp");
    var weatherHumidityRef = document.getElementById("weatherHumidity");
    var weatherWindSpeedRef = document.getElementById("weatherWindSpeed");
	var iconRef = document.getElementById("icon");
	
    //This sets the weather data to the id attributes as mentioned above
    weatherSummaryRef.textContent = weather.weatherSummary;
    weatherMinTempRef.textContent = weather.minTemp + "C";
    weatherMaxTempRef.textContent = weather.maxTemp + "C";
    weatherHumidityRef.textContent = (weather.humidity*100) + "%";
    weatherWindSpeedRef.textContent = weather.windSpeed + "kph";
	
	//This creates an image element with a source from the skeleton files imbedded with the forecast information returned by the forecast.io API. This image is then appended to the iconRef id attribute.
	var iconImage = document.createElement("img");
	iconImage.src = "images/" + weather.icon + ".png";
	iconRef.appendChild(iconImage);
}
console.log(locationsFromStorage[locationIndex].forecasts.icon);  
currentDate();

//This function obtains the current date and sets it to the id attribute 
function currentDate(){
	var date = new Date;
	date = date.forecastDateString()//formulates the data into the required format using the forecastDateString method
	var dateOnPage = document.getElementById("date")
	dateOnPage.innerHTML = "Today's Date: " + date;
}








/*function deleteSavedLocation(){

    locationsFromStorage.splice(locationIndex, 1)

}*/

setTimeout(initialMap, 1000)





