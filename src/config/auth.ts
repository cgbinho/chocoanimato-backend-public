import appConfig from '@config/app';

const redirect_uris = `${appConfig.backend_url}/backend/api/sessions/google/callback`;

const javascript_origins = `${appConfig.backend_url}`;

// const redirect_uris =
//   appConfig.node_env === 'development'
//     ? [
//         `http://localhost:${appConfig.backend_port}/backend/api/sessions/google/callback`
//       ]
//     : [`${process.env.WEB_URL}/backend/api/sessions/google/callback`];

// const javascript_origins =
//   appConfig.node_env === 'development'
//     ? [`http://localhost:${appConfig.backend_port}`]
//     : [`${process.env.WEB_URL}`];

export default {
  jwt: {
    secret: process.env.JWT_SECRET,
    expiresIn: process.env.JWT_EXPIRESIN
  },
  google: {
    web: {
      client_id: process.env.GOOGLE_CLIENT_ID,
      client_secret: process.env.GOOGLE_SECRET,
      redirect_uris,
      javascript_origins,
      project_id: 'quickstart-1562811801114',
      auth_uri: 'https://accounts.google.com/o/oauth2/auth',
      token_uri: 'https://oauth2.googleapis.com/token',
      auth_provider_x509_cert_url: 'https://www.googleapis.com/oauth2/v1/certs'
    }
  }
};

// callback url:
// /users/google/callback
