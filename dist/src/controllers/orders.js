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
            return res.status(200).send({ success: true, message: 'Order created succesfully.', orderId: order._id });
        }
        catch (error) {
            return res.status(400).send({ success: false, message: error.message });
        }
    });
}
/**
 * Retrieves an existing order
 */
function ReadOrder(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const result = validationResult(req);
            if (!result.isEmpty()) { // Valid data for request
                return res.status(400).send({ success: false, errors: result.array().map(function (err) {
                        return err.msg; // Returns errors of data validation
                    }) });
            }
            const data = matchedData(req);
            var order = yield Order.getExtendedOrder(data.orderId);
            return res.status(200).send({ success: true, order: order });
        }
        catch (error) {
            return res.status(400).send({ success: false, message: error.message });
        }
    });
}
/**
 * Updates an existing Order
 */
function NextStatus(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const result = validationResult(req);
            if (!result.isEmpty()) { // Valid data for request
                return res.status(400).send({ success: false, errors: result.array().map(function (err) {
                        return err.msg; // Returns errors of data validation
                    }) });
            }
            const data = matchedData(req);
            // Look for the order
            var order = yield Order.getOrder(data.orderId);
            if (order.status == Status[Status.Completed]) {
                // Order completed. There are no more changes
                return res.status(200).send({ success: true, message: 'Order completed. No further status.' });
            }
            if (yield order.nextStatus()) {
                return res.status(200).send({ success: true, message: 'Order status was successfully updated. Currently ' + Status[Status[order.status] + 1] });
            }
            else {
                return res.status(200).send({ success: false, message: 'An error has occured on updating the status.' });
            }
        }
        catch (error) {
            return res.status(400).send({ success: false, message: error.message });
        }
    });
}
/**
 * Updates an existing Order
 */
function UpdateOrder(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const result = validationResult(req);
            if (!result.isEmpty()) { // Valid data for request
                return res.status(400).send({ success: false, errors: result.array().map(function (err) {
                        return err.msg; // Returns errors of data validation
                    }) });
            }
            const data = matchedData(req);
            // No changes requested
            if (data.type == undefined && data.description == undefined &&
                data.status == undefined && data.truck == undefined) {
                if (data.route == undefined) {
                    return res.status(200).send({ success: true, message: 'No changes requested' });
                }
                else if (data.route.pickup == undefined && data.route.dropoff == undefined)
                    return res.status(200).send({ success: true, message: 'No changes requested' });
            }
            // Look for the order
            var order = yield Order.getOrder(data.orderId);
            if (order.status == Status[Status.Completed]) {
                // Order completed. There are no more changes
                return res.status(200).send({ success: true, message: 'Order completed. No changes allowed.' });
            }
            if (order.status == Status[Status.OnProgress]) {
                // Order on progress. No changes allowed.
                return res.status(200).send({ success: false, message: 'The order is in progress. It cannot be modified.' });
            }
            var routeId;
            if (data.route != undefined) { // Change route ?
                if (data.route.pickup != undefined || data.route.dropoff != undefined) { // New points for route
                    var currentRoute = yield Route.getRouteById(order.route);
                    // Get points for new route
                    var pickup = data.route.pickup == undefined ? currentRoute.pointA.name : data.route.pickup;
                    var dropoff = data.route.dropoff == undefined ? currentRoute.pointB.name : data.route.dropoff;
                    // Verify updating points are valid.
                    yield Point.getPoint(pickup);
                    yield Point.getPoint(dropoff);
                    // Verify existing new route.
                    const newRoute = yield Route.getRoute(pickup, dropoff);
                    routeId = newRoute._id;
                }
            }
            var truckId;
            if (data.truck != undefined) { // Change truck ?
                // Verify valid truck
                const newTruck = yield Truck.getTruck(data.truck);
                truckId = newTruck._id;
            }
            const type = data.type == undefined ? undefined : OrderType[data.type];
            const status = data.status == undefined ? undefined : Status[data.status];
            // Update
            yield order.updateOrder(type, data.description, routeId, status, truckId);
            return res.status(200).send({ success: true, message: 'Order was successfully updated' });
        }
        catch (error) {
            return res.status(400).send({ success: false, message: error.message });
        }
    });
}
/**
 * Deletes an existing order
 */
function DeleteOrder(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const result = validationResult(req);
            if (!result.isEmpty()) { // Valid data for request
                return res.status(400).send({ success: false, errors: result.array().map(function (err) {
                        return err.msg; // Returns errors of data validation
                    }) });
            }
            const data = matchedData(req);
            // Look for the order
            var order = yield Order.getOrder(data.orderId);
            if (yield order.deleteOrder()) {
                return res.status(200).send({ success: true, message: 'Order was successfully deleted' });
            }
            else {
                return res.status(200).send({ success: false, message: 'The order is in progress. It cannot be deleted.' });
            }
        }
        catch (error) {
            return res.status(400).send({ success: false, message: error.message });
        }
    });
}
export { AllOrders, CreateOrder, ReadOrder, UpdateOrder, DeleteOrder, NextStatus };
