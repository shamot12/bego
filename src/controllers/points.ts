import { Request, Response } from 'express';

import { Point } from '../../db/models/Point.js'

/**
 * Retrieves all points available.
 */
async function AllPoints (req: Request, res: Response) {
    try {
        var points = await Point.getAllPoints();

        res.status(200).send(points);
    } catch (error: any) {
        res.status(500).send({ success: false, errors : error.message });
    }
}

export { AllPoints }