import { Request, Response } from 'express';
import { validationResult, matchedData } from 'express-validator';

import { GoogleGoordinatesRequest, GoogleDistanceRequest } from '../request/googleApi.js';

import { Route } from '../../db/models/Route.js'
import { Point } from '../../db/models/Point.js'

/**
 * Retrieves all Routes available.
 */
async function AllRoutes (req: Request, res: Response) {
    try {
        var routes = await Route.getAllRoutes();

        res.status(200).send(routes);
    } catch (error: any) {
        res.status(500).send({ success: false, errors : error.message });
    }
}


/**
 * Creates a new valid route.
 */
async function CreateRoute (req: Request, res: Response) {
    try {
        const result = validationResult(req);
        if (!result.isEmpty()) { // Valid data for request
            return res.status(400).send({ success: false, errors: result.array().map(function(err){
                return err.msg // Returns errors of data validation
            })});
        }
        const data = matchedData(req);
        if(data.pointA == data.pointB){ // Departure and arrival must be different.
            return res.status(400).send({ success: false, message : 'Invalid payload' });
        }
        // First, verify that the starting and the ending Points are valid.
        const pointA = await Point.getPoint(data.pointA);
        const pointB = await Point.getPoint(data.pointB);

        // If both points are valid, check there is no existing route
        if(await Route.routeExists(data.pointA, data.pointB)){
            return res.status(200).send({ success: false, message : 'Route already defined.' });
        }
        
        // Get pointA and pointB coordinates
        const latlngA = await GoogleGoordinatesRequest(pointA.location.placeId);
        const latlngB = await GoogleGoordinatesRequest(pointB.location.placeId);
        
        // Get distance in KM between points
        const distance = await GoogleDistanceRequest(latlngA, latlngB);

        // Route document creation
        var route = new Route({
            pointA : {
                name: data.pointA,
                lat: latlngA.lat,
                lng: latlngA.lng
            },
            pointB : {
                name: data.pointB,
                lat: latlngA.lat,
                lng: latlngA.lng
            },
            distance: distance
        });

        await route.save();

        return res.status(200).send({ success: true, message : 'Route created succesfully.' });
    } catch (error: any) {
        return res.status(400).send({ success: false, message : error.message });
    }
}


/**
 * Reads an existing route
 */
async function ReadRoute (req: Request, res: Response) {
    try {
        const result = validationResult(req);
        if (!result.isEmpty()) { // Valid data for request
            return res.status(400).send({ success: false, errors: result.array().map(function(err){
                return err.msg // Returns errors of data validation
            })});
        }
        const data = matchedData(req);
        if(data.pointA == data.pointB){ // Departure and arrival must be different.
            return res.status(400).send({ success: false, message : 'Invalid payload' });
        }
        // First, verify that the starting and the ending Points are valid.
        await Point.getPoint(data.pointA);
        await Point.getPoint(data.pointB);

        // If both points are valid, look for route
        var route = await Route.getRoute(data.pointA, data.pointB);

        return res.status(200).send({ success: true, route : route });
    } catch (error: any) {
        return res.status(400).send({ success: false, message : error.message });
    }
}


/**
 * Reads an existing route
 */
async function DeleteRoute (req: Request, res: Response) {
    try {
        const result = validationResult(req);
        if (!result.isEmpty()) { // Valid data for request
            return res.status(400).send({ success: false, errors: result.array().map(function(err){
                return err.msg // Returns errors of data validation
            })});
        }
        const data = matchedData(req);
        if(data.pointA == data.pointB){ // Departure and arrival must be different.
            return res.status(400).send({ success: false, message : 'Invalid payload' });
        }
        // First, verify that the starting and the ending Points are valid.
        await Point.getPoint(data.pointA);
        await Point.getPoint(data.pointB);

        // If both points are valid, look for route
        var route = await Route.getRoute(data.pointA, data.pointB);

        await route.deleteRoute();

        return res.status(200).send({ success: true, message : 'Route was successfully deleted' });
    } catch (error: any) {
        return res.status(400).send({ success: false, message : error.message });
    }
}


export { AllRoutes, CreateRoute, ReadRoute, DeleteRoute }