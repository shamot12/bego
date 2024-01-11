import { Request, Response } from 'express';

import { Truck } from '../../db/models/Truck.js'

/**
 * Retrieves all trucks available.
 */
async function AllTrucks (req: Request, res: Response) {
    try {
        var trucks = await Truck.getAllTrucks();

        res.status(200).send(trucks);
    } catch (error: any) {
        res.status(500).send({ success: false, errors : error.message });
    }
}

export { AllTrucks }