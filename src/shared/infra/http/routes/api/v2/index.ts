import { Router } from 'express';

// In case we need versioning the routes, we create new routes here.
const routeV2 = Router();

routeV2.get('/test', (req, res) => {
  res.status(200).json({ message: 'Get request successfull v2' });
});

export default routeV2;
