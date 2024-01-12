import express from 'express';
import { checkSchema } from 'express-validator';

import { AllRoutes, CreateRoute, ReadRoute } from '../controllers/routes.js'

export const routesRouter = express.Router();

/**
 * Retrieves all routes available
 */
routesRouter.get('/getAll', AllRoutes);

/**
 * Creates a new route
 */
const routeValidatorSchema = checkSchema({
    pointA: {
        isLength: {
            options: { min: 4 },
            errorMessage: 'Invalid payload',
        },
    },
    pointB: {
        isLength: {
            options: { min: 4 },
            errorMessage: 'Invalid payload',
        },
    }
});
routesRouter.post('/create', routeValidatorSchema, CreateRoute);


/**
 * Reads an existing route
 */
routesRouter.post('/get', routeValidatorSchema, ReadRoute);