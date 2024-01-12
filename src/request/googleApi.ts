/**
 * Function to perform a delay between each remote request
 * @param ms miliseconds to wait
 */
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Request to Google Maps API that transform placeId to global coordinates
 * Docs: https://developers.google.com/maps/documentation/geocoding/requests-geocoding?hl=en#GeocodingResponses
 * @param placeId of the point which coordenates are required
 * @returns Object with latitude and longitude coordinates. { lat : 0.0 , lng : 0.0 }
 */
async function GoogleGoordinatesRequest(placeId: string) {
    await delay(100);
    const url = `https://maps.googleapis.com/maps/api/geocode/json?place_id=${placeId}&key=${process.env.MAPS_GOOGLE_APIS_KEY}`
    console.log(url);
    try{
        const response = await fetch(url);
        const body = await response.json();
        if(body.status == 'OK'){
            return { lat: body.results[0].geometry.location.lat, lng : body.results[0].geometry.location.lng };
        } else {
            throw { message: 'Trouble with remote geocoding request. Status: ' + body.status };
        }
    } catch(err: any) {
        throw { message: 'Trouble with remote geocoding request: ' + err.toString() };
    }
}
/**
 * Request to Google Maps API that retrieves the distance between two points when driving.
 * Docs: https://developers.google.com/maps/documentation/routes/compute_route_directions?hl=en
 * @param from Object with latitude and longitude coordinates of the origin point. { lat : 0.0 , lng : 0.0 }
 * @param to Object with latitude and longitude coordinates of the destination point. { lat : 0.0 , lng : 0.0 }
 * @returns Distance in km between the points
 */
async function GoogleDistanceRequest(from, to) {
    await delay(100);
    const data = {
        "origin":{
          "location":{
            "latLng":{
              "latitude": from.lat,
              "longitude": from.lng
            }
          }
        },
        "destination":{
          "location":{
            "latLng":{
                "latitude": to.lat,
                "longitude": to.lng
            }
          }
        },
        "travelMode": "DRIVE"
    };

    const options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-Goog-Api-Key': process.env.MAPS_GOOGLE_APIS_KEY || '',
            'X-Goog-FieldMask': 'routes.distanceMeters'
        },
        body: JSON.stringify(data)
    };

    const url = 'https://routes.googleapis.com/directions/v2:computeRoutes';

    try{
        const response = await fetch(url, options);
        const body = await response.json();
        if(!isNaN(body.routes[0].distanceMeters)){
            return (body.routes[0].distanceMeters / 1000); // Distance in km
        }
        throw { message : 'Invalid remote response.' };
    } catch(err: any){
        throw { message : 'Trouble with remote distance request: ' + err.toString() };
    }
}

export { GoogleGoordinatesRequest, GoogleDistanceRequest }