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
    Status[Status["Scheduled"] = 1] = "Scheduled";
    Status[Status["OnProgress"] = 2] = "OnProgress";
    Status[Status["Completed"] = 3] = "Completed";
})(Status || (Status = {}));
;
// Order schema based on Order interface
const orderSchema = new Schema({
    type: {
        type: String,
        default: OrderType[OrderType.Normal],
        enum: Object.values(OrderType)
    },
    description: String,
    route: { type: 'ObjectID', ref: 'Route' },
    status: {
        type: String,
        default: Status[Status.Created],
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
            const order = yield Order.findOne({ '_id': orderId });
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
 * Gets an existing order and populates it with the route and truck references.
 * Omits order Id on order instance.
 * @returns Order document
 * @throws message
 */
orderSchema.static('getExtendedOrder', function getExtendedOrder(orderId) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const order = yield Order.findOne({ '_id': orderId }, { _id: 0 })
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
 * Updates the current instance document
 * @returns boolean true when success
 * @throws message
 */
orderSchema.method('updateOrder', function updateOrder(type, description, routeId, status, truckId) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            if (this.status == Status[Status.OnProgress]) {
                return false;
            }
            const update = yield Order.updateOne({ _id: this._id }, {
                type: type,
                description: description,
                route: routeId,
                status: status,
                truck: truckId
            });
            if (update.acknowledged)
                return true;
            throw { message: 'Error on updating order' };
        }
        catch (e) {
            throw { message: 'Error on updating order' };
        }
    });
});
/**
 * Updates the status of the current instance
 * @returns boolean true when success
 * @throws message
 */
orderSchema.method('nextStatus', function nextStatus() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            if (this.status != Status[Status.Completed]) {
                const update = yield Order.updateOne({ _id: this._id }, {
                    status: Status[Status[this.status] + 1]
                });
                return update.acknowledged;
            }
            return false;
        }
        catch (e) {
            throw { message: 'Error on deleting order' };
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
