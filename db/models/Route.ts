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

routeSchema.static('getAllRoutes', async function getAllRoutes ():  Promise<Array<HydratedDocument<IRoute, IRouteMethods>>>{
    const routes = await Route.find();
    
    return routes;
});

routeSchema.static('routeExists', async function routeExists (namePointA: string, namePointB: string):  Promise<boolean> {
    const existingRoute = await Route.findOne({ "pointA.name": namePointA, "pointB.name": namePointB });
    return existingRoute !== null;
});


// Route model based on Route schema
const Route = model<Required<IRoute>, RouteModel> ('Route' , routeSchema);

export { Route }
