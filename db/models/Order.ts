import { Schema, model, Model, HydratedDocument, Types } from 'mongoose';

enum OrderType {
    Normal,
    Urgent,
    Fragile
};

enum Status {
    Created,
    Scheduled,
    OnProgress,
    Completed
};

// Order interface
interface IOrder {
    type : string;
    description: string;
    route : Types.ObjectId;
    status : string;
    truck : Types.ObjectId;
}

interface IOrderMethods {
    deleteOrder(): Promise<boolean>;
    updateOrder(type: string | undefined, description: string | undefined,
                routeId: Types.ObjectId | undefined, status: string | undefined,
                truckId: Types.ObjectId | undefined): Promise<boolean>;
    nextStatus(): Promise<boolean>;
}
  
interface OrderModel extends Model<Required<IOrder>, {}, IOrderMethods> {
    getAllOrders():  Promise<Array<HydratedDocument<Required<IOrder>, IOrderMethods>>>;
    getOrder(orderId: string):  Promise<HydratedDocument<Required<IOrder>, IOrderMethods>>;
    getExtendedOrder(orderId: string):  Promise<HydratedDocument<Required<IOrder>, IOrderMethods>>;
}

// Order schema based on Order interface
const orderSchema = new Schema<Required<IOrder>, OrderModel, IOrderMethods>({
    type: {
        type: String,
        default: OrderType[OrderType.Normal],
        enum: Object.values(OrderType)
    },
    description: String,
    route : { type: 'ObjectID', ref: 'Route' },
    status : {
        type: String,
        default: Status[Status.Created],
        enum: Object.values(Status)
    },
    truck : { type: 'ObjectID', ref: 'Truck' }
});

/**
 * Gets all existing orders
 * @returns Orders document array
 */
orderSchema.static('getAllOrders', async function getAllOrders ():  Promise<Array<HydratedDocument<IOrder, IOrderMethods>>>{
    const Orders = await Order.find({}, { _id : 0 });
    
    return Orders;
});

/**
 * Gets an existing order
 * @returns Order document
 * @throws message
 */
orderSchema.static('getOrder', async function getOrder (orderId: string):  Promise<HydratedDocument<Required<IOrder>, IOrderMethods>> {
    try{
        const order = await Order.findOne({ '_id': orderId });
        if(order !== null)
            return order;

        throw { message : 'The order does not exist.' };
    } catch (err) {
        // Invalid oid
        throw { message : 'The order does not exist.' };
    }
});

/**
 * Gets an existing order and populates it with the route and truck references.
 * Omits order Id on order instance.
 * @returns Order document
 * @throws message
 */
orderSchema.static('getExtendedOrder', async function getExtendedOrder (orderId: string):  Promise<HydratedDocument<Required<IOrder>, IOrderMethods>> {
    try{
        const order = await Order.findOne({ '_id': orderId }, { _id : 0 })
                                    .populate('route', { _id : 0 }).populate('truck');
        if(order !== null)
            return order;

        throw { message : 'The order does not exist.' };
    } catch (err) {
        // Invalid oid
        throw { message : 'The order does not exist.' };
    }
});

/**
 * Updates the current instance document 
 * @returns boolean true when success
 * @throws message
 */
orderSchema.method('updateOrder', async function updateOrder (type: string | undefined,
                                description: string | undefined, routeId: Types.ObjectId | undefined,
                                status: string | undefined, truckId: Types.ObjectId | undefined):  Promise<boolean> {
    try{
        if(this.status == Status[Status.OnProgress]) {
            return false;
        }

        const update = await Order.updateOne({ _id : this._id }, {
            type: type,
            description: description,
            route: routeId,
            status: status,
            truck: truckId
        });
        
        if(update.acknowledged) return true;

        throw { message : 'Error on updating order' };
    } catch(e) {
        throw { message : 'Error on updating order' };
    }
});

/**
 * Updates the status of the current instance
 * @returns boolean true when success
 * @throws message
 */
orderSchema.method('nextStatus', async function nextStatus ():  Promise<boolean> {
    try{
        if(this.status != Status[Status.Completed]) {
            const update = await Order.updateOne({ _id : this._id }, {
                status: Status[Status[this.status] + 1]
            });
            return update.acknowledged;
        }
        return false;
    } catch(e) {
        throw { message : 'Error on deleting order' };
    }
});

/**
 * Deletes the current instance document 
 * @returns boolean true when success
 * @throws message
 */
orderSchema.method('deleteOrder', async function deleteOrder ():  Promise<boolean> {
    try{
        if(this.status == Status[Status.OnProgress]) {
            return false;
        }
        await this.deleteOne();
        return true;
    } catch(e) {
        throw { message : 'Error on deleting order' };
    }
});


// Order model based on Order schema
const Order = model<Required<IOrder>, OrderModel> ('Order' , orderSchema);

export { Order, OrderType, Status}
