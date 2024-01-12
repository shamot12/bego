import express from 'express';

import { AllOrders } from '../controllers/orders.js'

export const ordersRouter = express.Router();

/**
 * Retrieves all orders available
 */
ordersRouter.get('/getAll', AllOrders);
