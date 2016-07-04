// Code for the main app page (locations list).

// This is sample code to demonstrate navigation.
// You need not use it for final app.
var cache2 = new LocationWeatherCache();// an instance of the locationWeatherCache.
// This function is called when a location is selected from the main page
function viewLocation(locationIndex)
{
    // Save the desired location to local storage
    localStorage.setItem(APP_PREFIX + "-selectedLocation", locationIndex);// Saves the index of the selected location to local storage
    // And load the view location page.
    location.href = 'viewlocation.html'; // moves the user to the view location page
}

var locationsFromStorage = loadLocations(); // loads locations from local storage
locationListGeneration(); // calls the function below

function locationListGeneration(){
    locationListRef = document.getElementById("locationList") // a reference to the id attribute for the location list.
    
    var locationListString;
	// a for loop that loops through the saved locations and creates a list. This list displays the locations nickname and the locations weather summary, max and min temperatures
    for (i=0;i<locationsFromStorage.length;i++){
        locationListString = "";
        locationListString += "<li class=\"mdl-list__item mdl-list__item--three-line\" onclick=\"viewLocation(" + i + ");\">";
        locationListString += "                  <span class=\"mdl-list__item-primary-content\">";
        locationListString += "                    <img class=\"mdl-list__item-icon\" id=\"icon" + "\" src=\"images\/loading.png\" class=\"list-avatar\" \/>";
        locationListString += "                    <span>" + locationsFromStorage[i].locationName + "<\/span>" + "<br>";
        if (locationsFromStorage[i].forecasts !== undefined){
			locationListString += "                    <span>" + "Weather Summary: " + locationsFromStorage[i].forecasts.weatherSummary + "<br>" +   "Max Temp: " + locationsFromStorage[i].forecasts.maxTemp + "   Min Temp: " + locationsFromStorage[i].forecasts.minTemp + "<\/span>";
		}
	    locationListString += "                  <\/span>";
        locationListString += "                <\/li>";	
		
	var date = new Date();
    locationList.innerHTML += locationListString;// appends the location list to the id attribute.
    
    }

}






