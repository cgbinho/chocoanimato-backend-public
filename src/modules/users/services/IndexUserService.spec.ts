import 'reflect-metadata';
import AppError from '@shared/errors/AppError';

import IndexUserService from './IndexUserService';

import FakeUsersRepository from '../../users/repositories/fakes/FakeUsersRepository';
import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider';
import FakeCacheProvider from '@shared/container/providers/CacheProvider/fakes/FakeCacheProvider';
import FakeQueueProvider from '@shared/container/providers/QueueProvider/fakes/FakeQueueProvider';

let fakeUsersRepository: FakeUsersRepository;
let fakeHashProvider: FakeHashProvider;
let fakeCacheProvider: FakeCacheProvider;
let fakeQueueProvider: FakeQueueProvider;
let indexUserService: IndexUserService;

describe('IndexUser', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeHashProvider = new FakeHashProvider();
    fakeCacheProvider = new FakeCacheProvider();
    fakeQueueProvider = new FakeQueueProvider();
    indexUserService = new IndexUserService(fakeUsersRepository);
  });

  it('should be able to index users', async () => {
    const response = await indexUserService.execute({
      page: 0,
      sort: 'DESC',
      is_verified: false,
      take: 20
    });

    expect(response).toHaveProperty('total');
    expect(response).toHaveProperty('results');
  });
});
