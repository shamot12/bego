import { Schema, model, Model, HydratedDocument, Types } from 'mongoose';

// Route interface
interface IRoute {
    pointA : Types.ObjectId;
    pointB : Types.ObjectId;
}

interface IRouteMethods { }
  
interface RouteModel extends Model<Required<IRoute>, {}, IRouteMethods> {
    getAllRoutes():  Promise<Array<HydratedDocument<IRoute, IRouteMethods>>>;
}

// Route schema based on Route interface
const routeSchema = new Schema<Required<IRoute>, RouteModel, IRouteMethods>({
    pointA: { type: Types.ObjectId, ref: 'Point' },
    pointB: { type: Types.ObjectId, ref: 'Point' }
});

routeSchema.static('getAllRoutes', async function getAllRoutes ():  Promise<Array<HydratedDocument<IRoute, IRouteMethods>>>{
    const routes = await Route.find().populate(['pointA', 'pointB']);
    
    return routes;
})

// Route model based on Route schema
const Route = model<Required<IRoute>, RouteModel> ('Route' , routeSchema);

export { Route }
