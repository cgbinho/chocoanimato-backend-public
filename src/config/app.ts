//import 'dotenv/config';

interface IAppConfig {
  node_env: string;
  web_url: string;
  backend_url: string;
  backend_port: number;
  frontend_port: number;
  admin: IAdmin;
}

interface IAdmin {
  name: string;
  email: string;
  password: string;
}

export default {
  node_env: process.env.NODE_ENV,
  web_url:
    process.env.NODE_ENV === 'development'
      ? `http://localhost:${Number(process.env.FRONTEND_PORT)}`
      : process.env.WEB_URL,
  backend_url:
    process.env.NODE_ENV === 'development'
      ? `http://localhost:${Number(process.env.BACKEND_PORT)}`
      : process.env.WEB_URL,
  backend_port: Number(process.env.BACKEND_PORT),
  frontend_port: Number(process.env.FRONTEND_PORT),
  admin: {
    name: process.env.ADMIN_NAME,
    email: process.env.ADMIN_EMAIL,
    password: process.env.ADMIN_PASS
  }
} as IAppConfig;
