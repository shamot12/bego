
async function GoogleGoordinatesRequest(placeId: string) {
    const url = `https://maps.googleapis.com/maps/api/geocode/json?place_id=${placeId}&key=${process.env.MAPS_GOOGLE_APIS_KEY}`
    const response = await fetch(url);
    const body = await response.json();
    if(body.status == 'OK'){
        return { lat: body.results[0].geometry.location.lat, lng : body.results[0].geometry.location.lng };
    } else {
        throw { message: 'Trouble with remote request. Status: ' + body.status };
    }
}

async function GoogleDistanceRequest(from, to) {
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
    const response = await fetch(url, options);

    try{
        const body = await response.json();
        if(!isNaN(body.routes[0].distanceMeters)){
            return (body.routes[0].distanceMeters / 1000); // Distance in km
        }
        throw { message : 'Invalid remote response.' };
    } catch(err){
        throw { message : 'Trouble with remote request.' };
    }
}

export { GoogleGoordinatesRequest, GoogleDistanceRequest }