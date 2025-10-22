import express from 'express';
import customItemsController from '../controllers/customItems.js';

const customItemsRouter = express.Router();

customItemsRouter.get('/', customItemsController.getAllCustomItems);
customItemsRouter.get('/:id', customItemsController.getCustomItemById);

customItemsRouter.post('/', customItemsController.createCustomItem);

customItemsRouter.put('/:id', customItemsController.updateCustomItem);

customItemsRouter.delete('/:id', customItemsController.deleteCustomItem);

export default customItemsRouter;