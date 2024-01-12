import express from 'express';

import { AllTrucks } from '../controllers/trucks.js'

export const trucksRouter = express.Router();

/**
 * Retrieves all trucks available
 */
trucksRouter.get('/getAll', AllTrucks);
