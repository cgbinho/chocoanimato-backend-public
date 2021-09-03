//import 'dotenv/config';

export default {
  s3: {
    apiVersion: '2006-03-01',
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_ACCESS_SECRET,
    region: process.env.AWS_DEFAULT_REGION
  },
  ses: {
    apiVersion: '2010-12-01',
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_ACCESS_SECRET,
    region: process.env.AWS_DEFAULT_REGION
  }
};
