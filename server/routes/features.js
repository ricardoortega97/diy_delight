import express from 'express';
import featuresController from '../controllers/features.js';

const featuresRouter = express.Router();

featuresRouter.get('/', featuresController.getAllFeatures);

export default featuresRouter;