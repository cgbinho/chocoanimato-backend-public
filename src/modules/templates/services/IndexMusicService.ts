import { injectable, inject } from 'tsyringe';

import IStorageProvider from '@shared/container/providers/StorageProvider/models/IStorageProvider';

@injectable()
class IndexMusicService {
  constructor(
    @inject('StorageProvider')
    private storageProvider: IStorageProvider
  ) {}

  public async execute(): Promise<Object> {
    /*
    LIST ALL MUSIC
    */
    const music = await this.storageProvider.loadJson({
      folder: 'music',
      path: '/index.json'
    });

    return music;
  }
}

export default IndexMusicService;
