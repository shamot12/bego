import { Request, Response } from 'express';
import { validationResult, matchedData } from 'express-validator';

import { Order, OrderType, Status } from '../../db/models/Order.js'
import { Route } from '../../db/models/Route.js'
import { Truck } from '../../db/models/Truck.js'
import { Point } from '../../db/models/Point.js'

/**
 * Retrieves all orders available.
 */
async function AllOrders (req: Request, res: Response) {
    try {
        var orders = await Order.getAllOrders();

        res.status(200).send(orders);
    } catch (error: any) {
        res.status(500).send({ success: false, errors : error.message });
    }
}


/**
 * Creates a new valid order.
 */
async function CreateOrder (req: Request, res: Response) {
    try {
        const result = validationResult(req);
        if (!result.isEmpty()) { // Valid data for request
            return res.status(400).send({ success: false, errors: result.array().map(function(err){
                return err.msg // Returns errors of data validation
            })});
        }
        const data = matchedData(req);


        if(data.route.pickup == data.route.dropoff){ // Departure and arrival must be different.
            return res.status(400).send({ success: false, message : 'Invalid route payload' });
        }

        // First, verify that the starting and the ending Points are valid.
        await Point.getPoint(data.route.pickup);
        await Point.getPoint(data.route.dropoff);

        // Verify valid route
        const route = await Route.getRoute(data.route.pickup, data.route.dropoff);

        // Verify valid truck
        const truck = await Truck.getTruck(data.truck);

        // Order document creation
        var order = new Order({
            type: OrderType[data.type],
            description: data.description,
            route : route._id,
            status : Status[data.status],
            truck : truck._id
        });
        await order.save();

        return res.status(200).send({ success: true, message : 'Order created succesfully.' });
    } catch (error: any) {
        return res.status(400).send({ success: false, message : error.message });
    }
}

/**
 * Retrieves an existing Order
 */
async function ReadOrder (req: Request, res: Response) {
    try {
        const result = validationResult(req);
        if (!result.isEmpty()) { // Valid data for request
            return res.status(400).send({ success: false, errors: result.array().map(function(err){
                return err.msg // Returns errors of data validation
            })});
        }
        const data = matchedData(req);
        
        var order = await Order.getOrder(data.orderId);

        return res.status(200).send({ success: true, order : order });
    } catch (error: any) {
        return res.status(400).send({ success: false, message : error.message });
    }
}


export { AllOrders, CreateOrder, ReadOrder }