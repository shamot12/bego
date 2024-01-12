import { Request, Response } from 'express';

import { Order } from '../../db/models/Order.js'

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


export { AllOrders }