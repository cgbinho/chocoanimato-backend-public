import { Router } from 'express';
import imagesRouter from '@modules/projects/infra/http/routes/images.routes';
import videosRouter from '@modules/projects/infra/http/routes/videos.routes';

const assetRoutes = Router();

assetRoutes.get('/test', (req, res) => {
  res.status(200).json({ message: 'Get assets request successfull' });
});

assetRoutes.use('/images', imagesRouter);
assetRoutes.use('/videos', videosRouter);

export default assetRoutes;
