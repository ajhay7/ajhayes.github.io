cache2 = new LocationWeatherCache;
//loadLocations(cache2)


// Returns a date in the format "YYYY-MM-DD".
Date.prototype.simpleDateString = function() {
    function pad(value)
    {
        return ("0" + value).slice(-2);
    }

    var dateString = this.getFullYear() + "-" + 
            pad(this.getMonth() + 1, 2) + '-' + 
            pad(this.getDate(), 2);
    
    return dateString;
}

// Date format required by forecast.io API.
// We always represent a date with a time of midday,
// so our choice of day isn't susceptible to time zone errors.
Date.prototype.forecastDateString = function() {
    return this.simpleDateString() + "T12:00:00";
}


// Code for LocationWeatherCache class and other shared code.

// Prefix to use for Local Storage.  You may change this.
var APP_PREFIX = "weatherApp";

function LocationWeatherCache()
{
    // Private attributes:

    var locations = [];
    var callbacks = {};
    
    //var locationsAsJson; Maybe we need a global variable?

    // Public methods:
    
    // Returns the number of locations stored in the cache.
    //
    this.length = function() {
        return locations.length;
    };
    
    // Returns the location object for a given index.
    // Indexes begin at zero.
    //
    this.locationAtIndex = function(index) {
        return location[index];
    };
    /*this.displayLocation = function(index){
        console.log(locations[index].locationName)
    }*/

    // Given a latitude, longitude and nickname, this method saves a 
    // new location into the cache.  It will have an empty 'forecasts'
    // property.  Returns the index of the added location.
    //
    this.addLocation = function(latitude, longitude, nickname, forecasts)
    {   
       // this is an object with properties equal to the parameters passed to the method by the addLocation function in the addlocationPage.js
		var newLocations = {
         lat: latitude,
         lng: longitude,
         locationName: nickname,
         forecasts: forecasts
		};
        var locationsFromStorage = loadLocations();//Loads the locations array that may have already been saved to local Storage
		// If localStorage is not empty, the localStorage content is loaded, newLocations is pushed into the locations array and the saveLocations() method is called
        if (locationsFromStorage !== null){
			locations = loadLocations();
			locations.push(newLocations);
            saveLocations();
		}
		// If localStorage is empty, push the newlocations variable into the locations array and call the saveLocations() method
		else {
		locations.push(newLocations);
            saveLocations();	
		}
	
     return locations.length;
    }
    
    // Removes the saved location at the given index.
    // 
    this.removeLocationAtIndex = function(index)
    {
        
        locations.splice(index,1);
		saveLocations(cache2)
        
    }

    // This method is used by JSON.stringify() to serialise this class.
    // Note that the callbacks attribute is only meaningful while there 
    // are active web service requests and so doesn't need to be saved.
    //
    this.toJSON = function() {
        var locationsAsJSON = JSON.stringify(locations)//Stringifies the locations array
        
        
       return locationsAsJSON 
    };
    
    // Given a public-data-only version of the class (such as from
    // local storage), this method will initialise the current
    // instance to match that version.
    //
    this.initialiseFromPDO = function(locationWeatherCachePDO) {
         //retrieve the stringified locations array from local storage then deserialise it 
        var locationFromStorage = localStorage.getItem(APP_PREFIX);
        locations = JSON.parse(locationFromStorage)
        return locations
        
    };

    // Request weather for the location at the given index for the
    // specified date.  'date' should be JavaScript Date instance.
    //
    // This method doesn't return anything, but rather calls the 
    // callback function when the weather object is available. This
    // might be immediately or after some indeterminate amount of time.
    // The callback function should have two parameters.  The first
    // will be the index of the location and the second will be the 
    // weather object for that location.
    // 
	
	
	
    // called when the view location page is loaded
	this.getWeatherAtIndexForDate = function(index, date){
        
        // an object the has properties of all the values required to call the forecast.io API and obtain the information required.
        var data = {
            latitude: locationsFromStorage[index].lat,
            longitude: locationsFromStorage[index].lng,
            time: date.forecastDateString()
        };
        
        // calls the jsonpRequest function, passing it the url, data and callback function.
        jsonpRequest("https://api.forecast.io/forecast/0b511a86b1f3472450d219cd350eedaf/", data, 'cache2.weatherResponse');

        
        
    };
    
       
    // This is a callback function passed to forecast.io API calls.
    // This will be called via JSONP when the API call is loaded.
    //
    // This should invoke the recorded callback function for that
    // weather request.
    //
    

	
	this.weatherResponse = function(response) {
        // doesn't do anything, just part of the development process
		var time = new Date(response.currently.time*1000);
        console.log(time);
        time = time.forecastDateString();
		
		console.log(response);
		// This object neatly gathers all the required forecast information for the selected location into one neat package
		var forecastInfo = {
			maxTemp: response.daily.data[0].temperatureMax,
			minTemp: response.daily.data[0].temperatureMin,
			weatherSummary: response.daily.data[0].summary,
			humidity: response.daily.data[0].humidity,
			windSpeed: response.daily.data[0].windSpeed,
			icon: response.daily.data[0].icon
		}
		
		var locationIndex = localStorage.getItem(APP_PREFIX + "-selectedLocation"); //gets the selected location index from local storage
		
		console.log(locationIndex);
		var locationsFromStorage = loadLocations();// loads the locations array from local storage
		
		locationsFromStorage[locationIndex].forecasts = forecastInfo;// add forecast info into the forecast property of the selected locations index
		var locationsFromStorageJSON = JSON.stringify(locationsFromStorage);// stringify the locations array
		localStorage.setItem(APP_PREFIX, locationsFromStorageJSON); // resaves the locations array to local storage
		console.log(locationsFromStorage[locationIndex].forecasts);
		console.log(locationsFromStorage);
		
		
		console.log(forecastInfo.maxTemp + " " + forecastInfo.minTemp + " " + forecastInfo.weatherSummary + " " + forecastInfo.humidity + " " + forecastInfo.windSpeed)
		
		
    };
//NOT USED
    // Private methods:
    
    // Given a latitude and longitude, this method looks through all
    // the stored locations and returns the index of the location with
    // matching latitude and longitude if one exists, otherwise it
    // returns -1.
    //
    function indexForLocation(latitude, longitude){
        
    };
   
}

// Restore the singleton locationWeatherCache from Local Storage.
//
function loadLocations()
{
    var getLocationJson = localStorage.getItem(APP_PREFIX);// get data from location storage
    var locationFromStorage = JSON.parse(getLocationJson);//de-stringify/parse the infromation
    return locationFromStorage; //return the parsed information
}

// Save the singleton locationWeatherCache to Local Storage.
//
function saveLocations()
{

        localStorage.setItem(APP_PREFIX, cache.toJSON());//saves the instance of the locationWeatherCache in a JSON format to the localStorage with the APP_PREFIX key
  
}


//This function builds the request to the API then appends the script to the body of the DOM. This calls the API.
function jsonpRequest(url, data, callback)
{
    // Build URL parameters from data object.
    var params = "";
    // For each key in data object...
    for (var key in data)
    {
        if (data.hasOwnProperty(key))
        {
            if (params.length > 0)
            {
                params += ",";
            }

            var encodedKey = encodeURIComponent(key);
            var encodedValue = encodeURIComponent(data[key]);

            params += encodedValue;
         }
    }
    params += "?callback=" + callback + "&units=si";// This sets the callback and asks for everything in SI units

    var script = document.createElement('script');
    script.src = url + params;
    document.body.appendChild(script);
    console.log(script.src);
}
