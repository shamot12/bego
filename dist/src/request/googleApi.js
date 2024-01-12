var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
/**
 * Function to perform a delay between each remote request
 * @param ms miliseconds to wait
 */
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
/**
 * Request to Google Maps API that transform placeId to global coordinates
 * Docs: https://developers.google.com/maps/documentation/geocoding/requests-geocoding?hl=en#GeocodingResponses
 * @param placeId of the point which coordenates are required
 * @returns Object with latitude and longitude coordinates. { lat : 0.0 , lng : 0.0 }
 */
function GoogleGoordinatesRequest(placeId) {
    return __awaiter(this, void 0, void 0, function* () {
        yield delay(100);
        const url = `https://maps.googleapis.com/maps/api/geocode/json?place_id=${placeId}&key=${process.env.MAPS_GOOGLE_APIS_KEY}`;
        const options = {
            method: 'GET',
            headers: {
                'Connection': 'keep-alive'
            }
        };
        // console.log(url);
        try {
            const response = yield fetch(url, options);
            const body = yield response.json();
            if (body.status == 'OK') {
                return { lat: body.results[0].geometry.location.lat, lng: body.results[0].geometry.location.lng };
            }
            else {
                throw { message: 'Trouble with remote geocoding request. Status: ' + body.status };
            }
        }
        catch (err) {
            throw { message: 'Trouble with remote geocoding request: ' + err.toString() };
        }
    });
}
/**
 * Request to Google Maps API that retrieves the distance between two points when driving.
 * Docs: https://developers.google.com/maps/documentation/routes/compute_route_directions?hl=en
 * @param from Object with latitude and longitude coordinates of the origin point. { lat : 0.0 , lng : 0.0 }
 * @param to Object with latitude and longitude coordinates of the destination point. { lat : 0.0 , lng : 0.0 }
 * @returns Distance in km between the points
 */
function GoogleDistanceRequest(from, to) {
    return __awaiter(this, void 0, void 0, function* () {
        yield delay(100);
        const data = {
            "origin": {
                "location": {
                    "latLng": {
                        "latitude": from.lat,
                        "longitude": from.lng
                    }
                }
            },
            "destination": {
                "location": {
                    "latLng": {
                        "latitude": to.lat,
                        "longitude": to.lng
                    }
                }
            },
            "travelMode": "DRIVE"
        };
        const apiKey = (process.env.MAPS_GOOGLE_APIS_KEY || '');
        const options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': JSON.stringify(data).length.toString(),
                'Connection': 'keep-alive',
                'X-Goog-Api-Key': apiKey,
                'X-Goog-FieldMask': 'routes.distanceMeters'
            },
            body: JSON.stringify(data)
        };
        const url = 'https://routes.googleapis.com/directions/v2:computeRoutes';
        try {
            const response = yield fetch(url, options);
            const body = yield response.json();
            if (!isNaN(body.routes[0].distanceMeters)) {
                return (body.routes[0].distanceMeters / 1000); // Distance in km
            }
            throw { message: 'Invalid remote response.' };
        }
        catch (err) {
            throw { message: 'Trouble with remote distance request: ' + err.toString() };
        }
    });
}
export { GoogleGoordinatesRequest, GoogleDistanceRequest };
