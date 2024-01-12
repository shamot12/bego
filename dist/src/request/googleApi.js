var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
function GoogleGoordinatesRequest(placeId) {
    return __awaiter(this, void 0, void 0, function* () {
        const url = `https://maps.googleapis.com/maps/api/geocode/json?place_id=${placeId}&key=${process.env.MAPS_GOOGLE_APIS_KEY}`;
        const response = yield fetch(url);
        const body = yield response.json();
        if (body.status == 'OK') {
            return { lat: body.results[0].geometry.location.lat, lng: body.results[0].geometry.location.lng };
        }
        else {
            throw { message: 'Trouble with remote request. Status: ' + body.status };
        }
    });
}
function GoogleDistanceRequest(from, to) {
    return __awaiter(this, void 0, void 0, function* () {
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
        const response = yield fetch(url, options);
        try {
            const body = yield response.json();
            if (!isNaN(body.routes[0].distanceMeters)) {
                return (body.routes[0].distanceMeters / 1000); // Distance in km
            }
            throw { message: 'Invalid remote response.' };
        }
        catch (err) {
            throw { message: 'Trouble with remote request.' };
        }
    });
}
export { GoogleGoordinatesRequest, GoogleDistanceRequest };
