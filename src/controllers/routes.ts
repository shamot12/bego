import { Request, Response } from 'express';

import { Route } from '../../db/models/Route.js'

/**
 * Retrieves all Routes available.
 */
async function AllRoutes (req: Request, res: Response) {
    try {
        var routes = await Route.getAllRoutes();

        res.status(200).send(routes);
    } catch (error: any) {
        res.status(500).send({ success: false, errors : error.message });
    }
}

export { AllRoutes }