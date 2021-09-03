import app from './app';
import appConfig from '@config/app';

app.listen(appConfig.backend_port, () => {
  console.log(`Server started on port ${appConfig.backend_port}`);
});
