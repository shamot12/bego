import express from 'express';

import { AllRoutes } from '../controllers/routes.js'

export const routesRouter = express.Router();

/**
 * Retrieves all routes available
 */
routesRouter.get('/get', AllRoutes);
