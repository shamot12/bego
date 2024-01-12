import express from 'express';
import { body } from 'express-validator';

import { OrderType, Status } from '../../db/models/Order.js'

import { AllOrders, CreateOrder, ReadOrder, UpdateOrder, DeleteOrder, NextStatus } from '../controllers/orders.js'

export const ordersRouter = express.Router();

const orderDataValidatorSchema = [
    body('type').optional().isFloat({ min: 0, max: (Object.values(OrderType).length / 2 - 1) }).withMessage('Invalid type'),
    body('description').trim().isLength({ min: 4 }).withMessage('Invalid description'),
    body('route.pickup').trim().isLength({ min: 4 }).withMessage('Invalid pickup'),
    body('route.dropoff').trim().isLength({ min: 4 }).withMessage('Invalid dropoff'),
    body('status').optional().isFloat({ min: 0, max: (Object.values(Status).length / 2 - 1) }).withMessage('Invalid status'),
    body('truck').trim().isLength({ min: 10 }).withMessage('Invalid truck')
];

const orderIdValidatorSchema = [
    body('orderId').trim().isLength({ min: 10 }).withMessage('Invalid order id')
];

const orderUpdateValidatorSchema = [
    body('type').optional().isFloat({ min: 0, max: (Object.values(OrderType).length / 2 - 1) }).withMessage('Invalid type'),
    body('description').optional().trim().isLength({ min: 4 }).withMessage('Invalid description'),
    body('route.pickup').optional().trim().isLength({ min: 4 }).withMessage('Invalid pickup'),
    body('route.dropoff').optional().trim().isLength({ min: 4 }).withMessage('Invalid dropoff'),
    body('status').optional().isFloat({ min: 0, max: (Object.values(Status).length / 2 - 1) }).withMessage('Invalid status'),
    body('truck').optional().trim().isLength({ min: 10 }).withMessage('Invalid truck')
];

/**
 * Retrieves all orders available
 */
ordersRouter.get('/getAll', AllOrders);


/**
 * Creates a new order
 */
ordersRouter.post('/create', orderDataValidatorSchema, CreateOrder);

/**
 * Reads an existing order
 */
ordersRouter.get('/read', orderIdValidatorSchema, ReadOrder);

/**
 * Updates the status of an order
 */
ordersRouter.put('/nextStatus', orderIdValidatorSchema, NextStatus);

/**
 * Updates an existing order
 */
ordersRouter.put('/update', orderIdValidatorSchema.concat(orderUpdateValidatorSchema), UpdateOrder);

/**
 * Deletes an existing order
 */
ordersRouter.delete('/delete', orderIdValidatorSchema, DeleteOrder);





