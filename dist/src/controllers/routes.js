var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { validationResult, matchedData } from 'express-validator';
import { GoogleGoordinatesRequest, GoogleDistanceRequest } from '../request/googleApi.js';
import { Route } from '../../db/models/Route.js';
import { Point } from '../../db/models/Point.js';
/**
 * Retrieves all Routes available.
 */
function AllRoutes(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            var routes = yield Route.getAllRoutes();
            res.status(200).send(routes);
        }
        catch (error) {
            res.status(500).send({ success: false, errors: error.message });
        }
    });
}
/**
 * Creates a new valid route.
 */
function CreateRoute(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const result = validationResult(req);
            if (!result.isEmpty()) { // Valid data for request
                return res.status(400).send({ success: false, errors: result.array().map(function (err) {
                        return err.msg; // Returns errors of data validation
                    }) });
            }
            const data = matchedData(req);
            if (data.pointA == data.pointB) { // Departure and arrival must be different.
                return res.status(400).send({ success: false, message: 'Invalid payload' });
            }
            // First, verify that the starting and the ending Points are valid.
            const pointA = yield Point.getPoint(data.pointA);
            const pointB = yield Point.getPoint(data.pointB);
            // If both points are valid, check there is no existing route
            if (yield Route.routeExists(data.pointA, data.pointB)) {
                return res.status(200).send({ success: false, message: 'Route already defined.' });
            }
            // Get pointA and pointB coordinates
            const latlngA = yield GoogleGoordinatesRequest(pointA.location.placeId);
            const latlngB = yield GoogleGoordinatesRequest(pointB.location.placeId);
            // Get distance in KM between points
            const distance = yield GoogleDistanceRequest(latlngA, latlngB);
            // Route document creation
            var route = new Route({
                pointA: {
                    name: data.pointA,
                    lat: latlngA.lat,
                    lng: latlngA.lng
                },
                pointB: {
                    name: data.pointB,
                    lat: latlngA.lat,
                    lng: latlngA.lng
                },
                distance: distance
            });
            yield route.save();
            return res.status(200).send({ success: true, message: 'Route created succesfully.' });
        }
        catch (error) {
            return res.status(400).send({ success: false, message: error.message });
        }
    });
}
/**
 * Reads an existing route
 */
function ReadRoute(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const result = validationResult(req);
            if (!result.isEmpty()) { // Valid data for request
                return res.status(400).send({ success: false, errors: result.array().map(function (err) {
                        return err.msg; // Returns errors of data validation
                    }) });
            }
            const data = matchedData(req);
            if (data.pointA == data.pointB) { // Departure and arrival must be different.
                return res.status(400).send({ success: false, message: 'Invalid payload' });
            }
            // First, verify that the starting and the ending Points are valid.
            const pointA = yield Point.getPoint(data.pointA);
            const pointB = yield Point.getPoint(data.pointB);
            // If both points are valid, look for route
            var route = yield Route.getRoute(data.pointA, data.pointB);
            return res.status(200).send({ success: true, route: route });
        }
        catch (error) {
            return res.status(400).send({ success: false, message: error.message });
        }
    });
}
export { AllRoutes, CreateRoute, ReadRoute };
