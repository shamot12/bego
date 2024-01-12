import express from 'express';
import { checkSchema } from 'express-validator';
import { AllRoutes, CreateRoute, ReadRoute, DeleteRoute } from '../controllers/routes.js';
export const routesRouter = express.Router();
/**
 * Retrieves all routes available
 */
routesRouter.get('/getAll', AllRoutes);
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
/**
 * Creates a new route
 */
routesRouter.post('/create', routeValidatorSchema, CreateRoute);
/**
 * Reads an existing route
 */
routesRouter.post('/get', routeValidatorSchema, ReadRoute);
/**
 * Reads an existing route
 */
routesRouter.delete('/delete', routeValidatorSchema, DeleteRoute);
