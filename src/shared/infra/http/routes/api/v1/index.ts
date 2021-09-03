import { Router } from 'express';
import usersRouter from '@modules/users/infra/http/routes/users.routes';
import contactRouter from '@modules/users/infra/http/routes/contact.routes';

import passwordRouter from '@modules/users/infra/http/routes/password.routes';
import profileRouter from '@modules/users/infra/http/routes/profile.routes';
import sessionsRouter from '@modules/users/infra/http/routes/sessions.routes';

import templatesRouter from '@modules/templates/infra/http/routes/templates.routes';
import musicRouter from '@modules/templates/infra/http/routes/music.routes';

import projectsRouter from '@modules/projects/infra/http/routes/projects.routes';
import renderInfosRouter from '@modules/projects/infra/http/routes/render-infos.routes';

import couponsRouter from '@modules/orders/infra/http/routes/coupons.routes';
import cepsRouter from '@modules/orders/infra/http/routes/ceps.routes';
import ordersRouter from '@modules/orders/infra/http/routes/orders.routes';
import paymentsRouter from '@modules/orders/infra/http/routes/payments.routes';

const apiRoutes = Router();

apiRoutes.get('/test', (req, res) => {
  res.status(200).json({ message: 'Get request successfull v1' });
});

apiRoutes.use('/users', usersRouter);
apiRoutes.use('/contact', contactRouter);

apiRoutes.use('/password', passwordRouter);
apiRoutes.use('/profile', profileRouter);
apiRoutes.use('/sessions', sessionsRouter);

apiRoutes.use('/templates', templatesRouter);
apiRoutes.use('/projects', projectsRouter);

apiRoutes.use('/music', musicRouter);
apiRoutes.use('/render-infos', renderInfosRouter);

apiRoutes.use('/cep', cepsRouter);
apiRoutes.use('/coupons', couponsRouter);
apiRoutes.use('/orders', ordersRouter);
apiRoutes.use('/payments', paymentsRouter);

export default apiRoutes;
