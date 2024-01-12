import express from 'express';
import { body } from 'express-validator';

import { AllRoutes, CreateRoute, ReadRoute, UpdateRoute, DeleteRoute } from '../controllers/routes.js'

export const routesRouter = express.Router();

/**
 * Retrieves all routes available
 */
routesRouter.get('/getAll', AllRoutes);

const routeValidatorSchema = [
    body('pointA').trim().isLength({ min: 4 }).withMessage('Invalid payload'),
    body('pointB').trim().isLength({ min: 4 }).withMessage('Invalid payload')
];

const routeUpdateValidatorSchema = [
    body('old.pointA').trim().isLength({ min: 4 }).withMessage('Invalid payload'),
    body('old.pointB').trim().isLength({ min: 4 }).withMessage('Invalid payload'),
    body('new.pointA').trim().isLength({ min: 4 }).withMessage('Invalid payload'),
    body('new.pointB').trim().isLength({ min: 4 }).withMessage('Invalid payload')
];

/**
 * Creates a new route
 */
routesRouter.post('/create', routeValidatorSchema, CreateRoute);

/**
 * Reads an existing route
 */
routesRouter.get('/read', routeValidatorSchema, ReadRoute);

/**
 * Updates an existing route
 */
routesRouter.put('/update', routeUpdateValidatorSchema, UpdateRoute);

/**
 * Deletes an existing route
 */
routesRouter.delete('/delete', routeValidatorSchema, DeleteRoute);
