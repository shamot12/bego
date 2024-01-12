import { Schema, model, Model, HydratedDocument } from 'mongoose';

// Point interface
interface IPoint {
    location: {
        name: string;
        placeId: string
    };
}

interface IPointMethods { }
  
interface PointModel extends Model<Required<IPoint>, {}, IPointMethods> {
    getAllPoints():  Promise<Array<HydratedDocument<Required<IPoint>, IPointMethods>>>;
    getPoint(name : string):  Promise<HydratedDocument<Required<IPoint>, IPointMethods>>;
}

// Point schema based on Point interface
const pointSchema = new Schema<Required<IPoint>, PointModel, IPointMethods>({
    location: {
        name: {
            type: String,
            required: [true, 'Name required']
        },
        placeId: {
            type: String,
            required: [true, 'Place Id required']
        }
    }
});

/**
 * Gets all existing points
 * @returns Points document array
 */
pointSchema.static('getAllPoints', async function getAllPoints ():  Promise<Array<HydratedDocument<IPoint, IPointMethods>>>{
    const points = await Point.find();
    
    return points;
});

/**
 * Gets an existing point, if it exists
 * @returns Point document
 * @throws message
 */
pointSchema.static('getPoint', async function getPoint (name : string):  Promise<HydratedDocument<Required<IPoint>, IPointMethods>> {
    const point = await Point.findOne({ 'location.name' : name });
    if(point !== null)
        return point;

    throw { message : 'Invalid point' };
});

// Point model based on Point schema
const Point = model<Required<IPoint>, PointModel> ('Point' , pointSchema);

export { Point, IPoint, pointSchema }