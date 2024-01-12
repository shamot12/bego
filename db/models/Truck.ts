import { Schema, model, Model, HydratedDocument } from 'mongoose';

// Truck interface
interface ITruck {
    model: string;
    make: string;
    year: number;
    color: string;
    transportWeight: number;
    created_at: number;
}

interface ITruckMethods { }
  
interface TruckModel extends Model<Required<ITruck>, {}, ITruckMethods> {
    getAllTrucks():  Promise<Array<HydratedDocument<ITruck, ITruckMethods>>>;
    getTruck(truckId: string):  Promise<HydratedDocument<ITruck, ITruckMethods>>;
}

// Truck schema based on Truck interface
const truckSchema = new Schema<Required<ITruck>, TruckModel, ITruckMethods>({
    model: {
        type: String,
        required: [true, 'Model required']
    },
    make: {
        type: String,
        required: [true, 'Make required']
    },
    year: {
        type: Number,
        required: [true, 'Year required']
    },
    color: {
        type: String,
        required: [true, 'Color required']
    },
    transportWeight: {
        type: Number,
        required: [true, 'Transport Weight required']
    },
    created_at: {
        type: Number,
        required: [true, 'Created_at required']
    }
});

/**
 * Gets all existing trucks
 * @returns Trucks document array
 */
truckSchema.static('getAllTrucks', async function getAllTrucks ():  Promise<Array<HydratedDocument<ITruck, ITruckMethods>>>{
    const trucks = await Truck.find();
    
    return trucks;
});

/**
 * Gets all existing trucks
 * @returns Trucks document array
 */
truckSchema.static('getTruck', async function getTruck (truckId: string):  Promise<HydratedDocument<ITruck, ITruckMethods>> {
    try{
        const truck = await Truck.findOne({_id: truckId});
        if(truck !== null)
            return truck;

        throw { message : 'Invalid truck.' };
    } catch(err) {
        // Invalid oid
        throw { message : 'Invalid truck.' };
    }
});

// Truck model based on Truck schema
const Truck = model<Required<ITruck>, TruckModel> ('Truck' , truckSchema);

export { Truck }