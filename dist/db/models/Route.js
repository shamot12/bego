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
        const route = yield Route.findOne({ "pointA.name": namePointA, "pointB.name": namePointB }, { pointA: 1, pointB: 1, distance: 1 });
        if (route !== null)
            return route;
        throw { message: 'The route does not exist.' };
    });
});
// Route model based on Route schema
const Route = model('Route', routeSchema);
export { Route };
