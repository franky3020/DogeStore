
import { Application } from 'express';
import ProductRoutes from './ProductRoutes';
import UserRoutes from './UserRoutes';

export default class Routes {
    constructor(app: Application) {
      app.use('/api/product', ProductRoutes);
      app.use('/api/user', UserRoutes);
    }
}