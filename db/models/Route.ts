import { Schema, model, Model, HydratedDocument, Types } from 'mongoose';

// Route interface
interface IRoute {
    pointA : {
        name: string;
        lat: number;
        lng: number;
    };
    pointB : {
        name: string;
        lat: number;
        lng: number;
    };
    distance: number;
}

interface IRouteMethods { }
  
interface RouteModel extends Model<Required<IRoute>, {}, IRouteMethods> {
    getAllRoutes():  Promise<Array<HydratedDocument<Required<IRoute>, IRouteMethods>>>;
    routeExists(pointA: string, pointB: string):  Promise<boolean>;
    getRoute(pointA: string, pointB: string):  Promise<HydratedDocument<Required<IRoute>, IRouteMethods>>;
}

// Route schema based on Route interface
const routeSchema = new Schema<Required<IRoute>, RouteModel, IRouteMethods>({
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
routeSchema.static('getAllRoutes', async function getAllRoutes ():  Promise<Array<HydratedDocument<IRoute, IRouteMethods>>>{
    const routes = await Route.find();
    
    return routes;
});

/**
 * Verifies if a route from point A to point B exists
 * @returns boolean
 */
routeSchema.static('routeExists', async function routeExists (namePointA: string, namePointB: string):  Promise<boolean> {
    const existingRoute = await Route.findOne({ "pointA.name": namePointA, "pointB.name": namePointB });
    return existingRoute !== null;
});

/**
 * Gets an existing route, if it exists
 * @returns Route document
 * @throws message
 */
routeSchema.static('getRoute', async function getRoute (namePointA: string, namePointB: string):  Promise<HydratedDocument<Required<IRoute>, IRouteMethods>> {
    const route = await Route.findOne({ "pointA.name": namePointA, "pointB.name": namePointB });
    if(route !== null)
        return route;

    throw { message : 'The route does not exist.' };
});


// Route model based on Route schema
const Route = model<Required<IRoute>, RouteModel> ('Route' , routeSchema);

export { Route }
