var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { validationResult, matchedData } from 'express-validator';
import { Order, OrderType, Status } from '../../db/models/Order.js';
import { Route } from '../../db/models/Route.js';
import { Truck } from '../../db/models/Truck.js';
import { Point } from '../../db/models/Point.js';
/**
 * Retrieves all orders available.
 */
function AllOrders(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            var orders = yield Order.getAllOrders();
            res.status(200).send(orders);
        }
        catch (error) {
            res.status(500).send({ success: false, errors: error.message });
        }
    });
}
/**
 * Creates a new valid order.
 */
function CreateOrder(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const result = validationResult(req);
            if (!result.isEmpty()) { // Valid data for request
                return res.status(400).send({ success: false, errors: result.array().map(function (err) {
                        return err.msg; // Returns errors of data validation
                    }) });
            }
            const data = matchedData(req);
            if (data.route.pickup == data.route.dropoff) { // Departure and arrival must be different.
                return res.status(400).send({ success: false, message: 'Invalid route payload' });
            }
            // First, verify that the starting and the ending Points are valid.
            yield Point.getPoint(data.route.pickup);
            yield Point.getPoint(data.route.dropoff);
            // Verify valid route
            const route = yield Route.getRoute(data.route.pickup, data.route.dropoff);
            // Verify valid truck
            const truck = yield Truck.getTruck(data.truck);
            // Order document creation
            var order = new Order({
                type: OrderType[data.type],
                description: data.description,
                route: route._id,
                status: Status[data.status],
                truck: truck._id
            });
            yield order.save();
            return res.status(200).send({ success: true, message: 'Order created succesfully.' });
        }
        catch (error) {
            return res.status(400).send({ success: false, message: error.message });
        }
    });
}
export { AllOrders, CreateOrder };
