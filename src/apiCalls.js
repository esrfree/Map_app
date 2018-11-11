export function load_google_maps() {
  return new Promise(function(resolve, reject) {
    // define the global callback that will run when google maps is loaded
    window.resolveGoogleMapsPromise = function() {
      // resolve the google object
      resolve(window.google);
      // delete the global callback to tidy up since it is no longer needed
      delete window.resolveGoogleMapsPromise;
    }
    // Lets load the Google Maps API
    const script = document.createElement("script");
    const API_KEY = 'AIzaSyBc96HESyLDQT3zu5AtAs9F4gl_YtL0JX4';
    script.src = `https://maps.googleapis.com/maps/api/js?libraries=places&key=${API_KEY}&callback=resolveGoogleMapsPromise`;
    script.async = true;
    document.body.appendChild(script);
  });
}

export function load_foursquare_places() {
    let parameters= {
            client_id: "PWJ5SH0VBN22WVD0SANZN4NPBIRQ4YOXAWYRFNFVFBENLOC2",
            client_secret: "W5JDB0FCLMIMFTKYPO1LVIJTNSNHDDUJDMW0W1NMFSAFL3ZO",
            query: "food",
            near: "Miami",
            radius: 10000,
            v: "20181108"
        };
    const endPoint = "https://api.foursquare.com/v2/venues/explore?"
    //return the promise
    return fetch(endPoint + new URLSearchParams(parameters))
        .then(resp =>resp.json())
}
