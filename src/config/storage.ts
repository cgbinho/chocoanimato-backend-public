import { resolve } from 'path';
import appConfig from '@config/app';

interface IStorageConfig {
  driver: 's3' | 'disk';
  preview: {
    expiresIn: number;
  };
  delivery: {
    expiresIn: number;
  };
  disk: {
    private: {
      root: string;
      downloads: string;
      images: string;
      music: string;
      projects: string;
      receipts: string;
      templates: string;
      temp: string;
    };
    public: {
      music: string;
      templates: string;
      images: string;
    };
    url: {
      music: string;
      templates: string;
      images: string;
    };
  };
  s3: {
    private: {
      downloads: string;
      images: string;
      music: string;
      projects: string;
      receipts: string;
      templates: string;
    };
    public: {
      music: string;
      templates: string;
      images: string;
    };
    url: {
      music: string;
      templates: string;
      downloads: string;
      images: string;
    };
    region: string;
  };
}

export default {
  driver: process.env.STORAGE_DRIVER,

  preview: {
    expiresIn:
      appConfig.node_env === 'production' ? 60 * 60 * 24 * 1000 : 60 * 5000 // 1 dia ou 5 minutos
  },
  delivery: {
    expiresIn:
      appConfig.node_env === 'production' ? 60 * 60 * 24 * 7 * 1000 : 60 * 5000 // 7 dias ou 5 minutos
  },
  disk: {
    private: {
      root: resolve('storage', 'disk'),
      downloads: resolve('storage', 'disk', 'chocoani-private-downloads'),
      images: resolve('storage', 'disk', 'chocoani-private-images'),
      music: resolve('storage', 'disk', 'chocoani-private-music'),
      projects: resolve('storage', 'disk', 'chocoani-private-projects'),
      receipts: resolve('storage', 'disk', 'chocoani-private-receipts'),
      templates: resolve('storage', 'disk', 'chocoani-private-templates'),
      temp: resolve('storage', 'disk', 'temp')
    },
    public: {
      music: resolve('storage', 'disk', 'chocoani-public-music'),
      templates: resolve('storage', 'disk', 'chocoani-public-templates'),
      images: resolve('storage', 'disk', 'chocoani-public-images')
    },
    url: {
      music: `${appConfig.backend_url}/backend/public/music`,
      images: `${appConfig.backend_url}/backend/public/images`,
      templates: `${appConfig.backend_url}/backend/public/templates`
    }
  },
  s3: {
    private: {
      downloads: 'chocoani-private-downloads',
      images: 'chocoani-private-images',
      music: 'chocoani-private-music',
      projects: 'chocoani-private-projects',
      receipts: 'chocoani-private-receipts',
      templates: 'chocoani-private-templates'
    },
    public: {
      music: 'chocoani-public-music',
      images: 'chocoani-public-images',
      templates: 'chocoani-public-templates'
    },
    url: {
      music: `https://s3.${process.env.AWS_DEFAULT_REGION}.amazonaws.com/chocoani-public-music`,
      images: `https://s3.${process.env.AWS_DEFAULT_REGION}.amazonaws.com/chocoani-public-images`,
      templates: `https://s3.${process.env.AWS_DEFAULT_REGION}.amazonaws.com/chocoani-public-templates`,
      downloads: `https://s3.${process.env.AWS_DEFAULT_REGION}.amazonaws.com/chocoani-public-templates`
    },
    region: process.env.AWS_DEFAULT_REGION
  }
} as IStorageConfig;

// process.env.NODE_ENV === 'development'
//   ? `${appConfig.backend_url[appConfig.node_env]}/backend/public/music`
//   : `${process.env.WEB_URL}/backend/public/music`,
// process.env.NODE_ENV === 'development'
//   ? `http://localhost:${process.env.BACKEND_PORT}/backend/public/images`
//   : `${process.env.WEB_URL}/backend/public/images`,
// process.env.NODE_ENV === 'development'
//   ? `http://localhost:${process.env.BACKEND_PORT}/backend/public/templates`
//   : `${process.env.WEB_URL}/backend/public/templates`
