import { Connection, createConnection, getConnectionOptions } from 'typeorm';

// import typeormConfig from '@config/typeorm';

// export default async (name = 'default'): Promise<Connection> => {
//   const defaultOptions = await getConnectionOptions(name);
//   return createConnection(defaultOptions);
// };

export default async (name = 'default'): Promise<Connection> => {
  // const defaultOptions = await getConnectionOptions(name);
  // return createConnection(defaultOptions);
  return createConnection();
};

// const defaultConnection = typeormConfig.path === 'dist' ? 'dist' : 'default';

// const main = async () => {
//   await createConnection({
//     name: 'default',
//     type: 'postgres',
//     host: process.env.POSTGRES_HOST,
//     port: parseInt(process.env.POSTGRES_PORT, 10) || 5432,
//     username: process.env.POSTGRES_USER,
//     password: process.env.POSTGRES_PASS,
//     database: process.env.POSTGRES_DB,
//     entities: typeormConfig[typeormConfig.path].entities,
//     migrations: typeormConfig[typeormConfig.path].migrations,
//     cli: {
//       migrationsDir: typeormConfig[typeormConfig.path].migrationsDir
//     }
//   }).catch(error =>
//     console.log('Error found while trying to connect to postgres : ', error)
//   );
// };
// export default main;
