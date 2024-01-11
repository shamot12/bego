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
    getAllPoints():  Promise<Array<HydratedDocument<IPoint, IPointMethods>>>;
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

pointSchema.static('getAllPoints', async function getAllPoints ():  Promise<Array<HydratedDocument<IPoint, IPointMethods>>>{
    const points = await Point.find();
    
    return points;
})

// Point model based on Point schema
const Point = model<Required<IPoint>, PointModel> ('Point' , pointSchema);

export { Point, IPoint, pointSchema }