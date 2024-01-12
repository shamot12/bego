var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { Schema, model } from 'mongoose';
var OrderType;
(function (OrderType) {
    OrderType[OrderType["Normal"] = 0] = "Normal";
    OrderType[OrderType["Urgent"] = 1] = "Urgent";
    OrderType[OrderType["Fragile"] = 2] = "Fragile";
})(OrderType || (OrderType = {}));
;
var Status;
(function (Status) {
    Status[Status["Created"] = 0] = "Created";
    Status[Status["Accepted"] = 1] = "Accepted";
    Status[Status["OnProgress"] = 2] = "OnProgress";
    Status[Status["Completed"] = 3] = "Completed";
})(Status || (Status = {}));
;
// Order schema based on Order interface
const orderSchema = new Schema({
    type: {
        type: String,
        enum: Object.values(OrderType)
    },
    description: String,
    route: { type: 'ObjectID', ref: 'Route' },
    status: {
        type: String,
        enum: Object.values(Status)
    },
    truck: { type: 'ObjectID', ref: 'Truck' }
});
/**
 * Gets all existing orders
 * @returns Orders document array
 */
orderSchema.static('getAllOrders', function getAllOrders() {
    return __awaiter(this, void 0, void 0, function* () {
        const Orders = yield Order.find({}, { _id: 0 });
        return Orders;
    });
});
/**
 * Gets an existing order
 * @returns Order document
 * @throws message
 */
orderSchema.static('getOrder', function getOrder(orderId) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const order = yield Order.findOne({ '_id': orderId })
                .populate('route', { _id: 0 }).populate('truck');
            if (order !== null)
                return order;
            throw { message: 'The order does not exist.' };
        }
        catch (err) {
            // Invalid oid
            throw { message: 'The order does not exist.' };
        }
    });
});
/**
 * Deletes the current instance document
 * @returns boolean true when success
 * @throws message
 */
orderSchema.method('deleteOrder', function deleteOrder() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            if (this.status == Status[Status.OnProgress]) {
                return false;
            }
            yield this.deleteOne();
            return true;
        }
        catch (e) {
            throw { message: 'Error on deleting order' };
        }
    });
});
// Order model based on Order schema
const Order = model('Order', orderSchema);
export { Order, OrderType, Status };
