import { Router } from 'express';
import appConfig from '@config/app';

// Route versions can be imported here.
// Current version is v1
// version is v2 is just an example.

import apiRoutesV1 from './api/v1';
import apiRoutesV2 from './api/v2';
import assetRoutes from './assets.routes';
import adminRoutes from './admin.routes';
import publicRoutes from './public.routes';

const backendRoutes = Router();
const appRoutes = Router();

// Paths are /backend/api/, /backend/assets/, etc...
appRoutes.use('/api/v1', apiRoutesV1);
appRoutes.use('/api/v2', apiRoutesV2);

appRoutes.use('/admin', adminRoutes);
// This sets the chosen api version to root path '/'
appRoutes.use('/api', apiRoutesV1);
appRoutes.use('/assets', assetRoutes);
appRoutes.use('/public', publicRoutes);

backendRoutes.use(`/backend`, appRoutes);
// backendRoutes.use(`/backend`, appRoutes);

export default backendRoutes;
