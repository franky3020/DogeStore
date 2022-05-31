
import { Application } from 'express';
import ProductRoutes from './ProductRoutes';

export default class Routes {
    constructor(app: Application) {
      app.use('/api/product', ProductRoutes);
    }
}