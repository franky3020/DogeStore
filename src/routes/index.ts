
import { Application } from 'express';
import ProductRoutes from './ProductRoutes';
import UserRoutes from './UserRoutes';
import PurchaseRouter from './PurchaseRouter';

export default class Routes {
	constructor(app: Application) {
		app.use('/api/product', ProductRoutes);
		app.use('/api/user', UserRoutes);
		app.use('/api/purchase', PurchaseRouter);
	}
}