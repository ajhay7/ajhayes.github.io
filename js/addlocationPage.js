
// Include necessary JavaScript file, if not already loaded.
// Only need to do this check if code is being used in the Playground.
// In a normal web page we would just include this tag in the head element.
if (!document.getElementById("mapsapi"))
{
    // Only create the Google Maps API script tag if we haven't already 
    // added it to the page.
    var script = document.createElement("script");
    script.setAttribute("id","map");
    script.setAttribute("id", "mapsapi");
    var bodyNode = document.getElementsByTagName("body")[0];
    bodyNode.appendChild(script);
}

 var map;
 var cache =  new LocationWeatherCache();

        
 // initMap() is called by the google maps API when the addLocationPage.js loads       
 function initMap() {
	// This creates a new google maps in the id attribute 'map'
    map = new google.maps.Map(document.getElementById('map'), {
        center: {lat: -35.9120467, lng: 145.1343136}, // Centres the map on the selected coordinates
        zoom: 10 // The zoom is set to 10
        });
        map.setCenter({lat: -37.9120467, lng: 145.1343136});
                    
        geocoder = new google.maps.Geocoder();
	    // When the 'find it' button is pressed in the interface, this eventlistener is alerted and the findit function is called
        document.getElementById('submit').addEventListener('click', function(){findit(geocoder,map);}) 
 }
        
        
 function findit(geocoder, resultsMap){
    // This address is what the user typed into the 'enter a location' text field
    var address = document.getElementById('address').value;
    // The geocoder API takes the address and returns a result or alerts the user to the fact that no result was found
    geocoder.geocode({'address': address},function(results, status){
	if(status === google.maps.GeocoderStatus.OK){
      resultsMap.setCenter(results[0].geometry.location); // The results is an array. This sets the map to centre on the location selected by the user
	  // This sets a marker on the map at the position the user selected
      var marker = new google.maps.Marker({
        map: resultsMap,
        position: results[0].geometry.location,
      });
    
    latitude = results[0].geometry.location.lat();
    longitude = results[0].geometry.location.lng();
    // This creates an infowindow on the above marker, sets its content to a formatted version of what the user requested (returned by the API) and opens the window    
    markerAddress = results[0].formatted_address;
    infowindow = new google.maps.InfoWindow;
    infowindow.setContent(markerAddress);
    infowindow.open(resultsMap, marker);
        
    // If the location was not found, an alert message is shown to the user which informs them of the status of the issue 
    }else{
      alert('Geocode was not successful for the following reason: '+ status);
    }
  });
}

   var latitude; 
   var longitude;
  
  // This function is called when the 'add location' button is hit by the user
  function addLocations(latitude, longitude){
    var lat = latitude;
    var lng = longitude;
	// If the user did not enter a nickname into the 'nickname' text field, the nickname variable is set to "Untitled Location"
    if (document.getElementById('nickname').value === ""){
		var nickname = "Untitled Location"
	}
	// If they did however, the variable is assigned this value
	else{
		var nickname = document.getElementById('nickname').value;
	}  
    cache.addLocation(lat,lng,nickname);// This calls an instance of the locationWeatherCache class's addLocation method and passes it the latitude, longitude and nickname of the users selected location.
    
  }

 
  
  



 
// Give maps API time to load, then initialise map.
setTimeout(initMap, 5000);