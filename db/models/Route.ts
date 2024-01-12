import { Schema, model, Model, HydratedDocument } from 'mongoose';

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

interface IRouteMethods { 
    deleteRoute(): Promise<boolean>;
    updateRoute(namePointA: string, latPointA: number, lngPointA: number,
        namePointB: string, latPointB: number, lngPointB: number, distance: number): Promise<boolean>;
}
  
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
    const routes = await Route.find({}, {'_id': 0 });
    
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
 * Gets an existing route
 * @returns Route document
 * @throws message
 */
routeSchema.static('getRoute', async function getRoute (namePointA: string, namePointB: string):  Promise<HydratedDocument<Required<IRoute>, IRouteMethods>> {
    const route = await Route.findOne({ "pointA.name": namePointA, "pointB.name": namePointB }, {'_id': 0 });
    if(route !== null)
        return route;

    throw { message : 'The route does not exist.' };
});

/**
 * Updates the current instance document 
 * @returns boolean true when success
 * @throws message
 */
routeSchema.method('updateRoute', async function updateRoute (namePointA: string, latPointA: number, lngPointA: number,
    namePointB: string, latPointB: number, lngPointB: number, distance: number):  Promise<boolean> {
    try{
        const update = await Route.updateOne({ _id : this._id }, {
            "pointA.name" : namePointA,
            "pointA.lat" : latPointA,
            "pointA.lng" : lngPointA,
            "pointB.name" : namePointB,
            "pointB.lat" : latPointB,
            "pointB.lng" : lngPointB,
            "distane": distance
        });
        
        return update.acknowledged;
    } catch(e) {
        throw { message : 'Error on deleting route' };
    }
});

/**
 * Deletes the current instance document 
 * @returns boolean true when success
 * @throws message
 */
routeSchema.method('deleteRoute', async function deleteRoute ():  Promise<boolean> {
    try{
        await this.deleteOne();
        return true;
    } catch(e) {
        throw { message : 'Error on deleting route' };
    }
});


// Route model based on Route schema
const Route = model<Required<IRoute>, RouteModel> ('Route' , routeSchema);

export { Route }
