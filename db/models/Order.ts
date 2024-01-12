import { Schema, model, Model, HydratedDocument, Types } from 'mongoose';

enum orderType {
    Normal,
    Urgent,
    Fragile
};

enum Status {
    Created,
    Accepted,
    OnProgress,
    Completed
};

// Order interface
interface IOrder {
    type: number;
    description: string;
    route : Types.ObjectId;
    status : number;
    truck : Types.ObjectId;
}

interface IOrderMethods { }
  
interface OrderModel extends Model<Required<IOrder>, {}, IOrderMethods> {
    getAllOrders():  Promise<Array<HydratedDocument<Required<IOrder>, IOrderMethods>>>;
}

// Order schema based on Order interface
const orderSchema = new Schema<Required<IOrder>, OrderModel, IOrderMethods>({
    type: {
        type: Number,
        default: orderType.Normal,
        enum: Object.values(orderType)
    },
    description: String,
    route : { type: 'ObjectID', ref: 'Route' },
    status : {
        type: Number,
        default: Status.Created,
        enum: Object.values(Status)
    },
    truck : { type: 'ObjectID', ref: 'Truck' },
});

/**
 * Gets all existing Orders
 * @returns Orders document array
 */
orderSchema.static('getAllOrders', async function getAllOrders ():  Promise<Array<HydratedDocument<IOrder, IOrderMethods>>>{
    const Orders = await Order.find();
    
    return Orders;
});


// Order model based on Order schema
const Order = model<Required<IOrder>, OrderModel> ('Order' , orderSchema);

export { Order }
