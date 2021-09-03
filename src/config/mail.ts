interface IMailConfig {
  driver: 'ethereal' | 'ses';

  defaults: {
    from: {
      name: string;
      email: string;
    };
    bcc: [
      {
        name: string;
        address: string;
      }
    ];
  };
}

export default {
  driver: process.env.MAIL_DRIVER || 'ethereal',

  defaults: {
    from: {
      name: 'Choco Animato - Cleber Galves Bordin',
      email: 'contato@chocoanimato.com'
    },
    bcc: [
      {
        name: 'Choco Animato - Cleber Galves Bordin',
        address: 'cleber@chocoanimato.com'
      }
    ]
  }
} as IMailConfig;
