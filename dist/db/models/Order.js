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
 * Gets all existing Orders
 * @returns Orders document array
 */
orderSchema.static('getAllOrders', function getAllOrders() {
    return __awaiter(this, void 0, void 0, function* () {
        const Orders = yield Order.find();
        return Orders;
    });
});
// Order model based on Order schema
const Order = model('Order', orderSchema);
export { Order, OrderType, Status };
