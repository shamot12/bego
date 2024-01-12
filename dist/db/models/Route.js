var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { Schema, model } from 'mongoose';
// Route schema based on Route interface
const routeSchema = new Schema({
    pointA: {
        name: String,
        lat: Number,
        lng: Number
    },
    pointB: {
        name: String,
        lat: Number,
        lng: Number
    },
    distance: Number
});
/**
 * Gets all existing routes
 * @returns Routes document array
 */
routeSchema.static('getAllRoutes', function getAllRoutes() {
    return __awaiter(this, void 0, void 0, function* () {
        const routes = yield Route.find();
        return routes;
    });
});
/**
 * Verifies if a route from point A to point B exists
 * @returns boolean
 */
routeSchema.static('routeExists', function routeExists(namePointA, namePointB) {
    return __awaiter(this, void 0, void 0, function* () {
        const existingRoute = yield Route.findOne({ "pointA.name": namePointA, "pointB.name": namePointB });
        return existingRoute !== null;
    });
});
/**
 * Gets an existing route, if it exists
 * @returns Route document
 * @throws message
 */
routeSchema.static('getRoute', function getRoute(namePointA, namePointB) {
    return __awaiter(this, void 0, void 0, function* () {
        const route = yield Route.findOne({ "pointA.name": namePointA, "pointB.name": namePointB });
        if (route !== null)
            return route;
        throw { message: 'The route does not exist.' };
    });
});
/**
 * Updates the current instance document
 * @returns boolean true when success
 * @throws message
 */
routeSchema.method('updateRoute', function updateRoute(namePointA, latPointA, lngPointA, namePointB, latPointB, lngPointB, distance) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const update = yield Route.updateOne({ _id: this._id }, {
                "pointA.name": namePointA,
                "pointA.lat": latPointA,
                "pointA.lng": lngPointA,
                "pointB.name": namePointB,
                "pointB.lat": latPointB,
                "pointB.lng": lngPointB,
                "distane": distance
            });
            return update.acknowledged;
        }
        catch (e) {
            throw { message: 'Error on deleting route' };
        }
    });
});
/**
 * Deletes the current instance document
 * @returns boolean true when success
 * @throws message
 */
routeSchema.method('deleteRoute', function deleteRoute() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield this.deleteOne();
            return true;
        }
        catch (e) {
            throw { message: 'Error on deleting route' };
        }
    });
});
// Route model based on Route schema
const Route = model('Route', routeSchema);
export { Route };
