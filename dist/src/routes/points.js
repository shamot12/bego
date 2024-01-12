import express from 'express';
import { AllPoints } from '../controllers/points.js';
export const pointsRouter = express.Router();
/**
 * Retrieves all points available
 */
pointsRouter.get('/getAll', AllPoints);
