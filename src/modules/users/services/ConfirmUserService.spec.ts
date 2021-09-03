import 'reflect-metadata';
import AppError from '@shared/errors/AppError';
// import uuid from 'uuid';
import ConfirmUserService from './ConfirmUserService';
import CreateUserService from './CreateUserService';

import FakeUsersRepository from '../../users/repositories/fakes/FakeUsersRepository';
import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider';
import FakeCacheProvider from '@shared/container/providers/CacheProvider/fakes/FakeCacheProvider';
import FakeQueueProvider from '@shared/container/providers/QueueProvider/fakes/FakeQueueProvider';

let fakeUsersRepository: FakeUsersRepository;
let fakeHashProvider: FakeHashProvider;
let fakeCacheProvider: FakeCacheProvider;
let fakeQueueProvider: FakeQueueProvider;
let createUserService: CreateUserService;
let confirmUserService: ConfirmUserService;

/*
FAKES A UUID
*/
jest.mock('uuid', () => {
  return {
    v4: jest.fn(() => 'uuid_string')
  };
});

describe('ConfirmUser', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeHashProvider = new FakeHashProvider();
    fakeCacheProvider = new FakeCacheProvider();
    fakeQueueProvider = new FakeQueueProvider();
    createUserService = new CreateUserService(
      fakeUsersRepository,
      fakeHashProvider,
      fakeCacheProvider,
      fakeQueueProvider
    );

    confirmUserService = new ConfirmUserService(
      fakeUsersRepository,
      fakeHashProvider,
      fakeCacheProvider
    );
  });

  it('should be able to confirm a user', async () => {
    const user = await createUserService.execute({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123456'
    });

    await confirmUserService.execute({
      token: 'uuid_string'
    });

    expect(user.is_verified).toBeTruthy();
  });

  it('should NOT be able to confirm a user with a wrong token', async () => {
    const user = await createUserService.execute({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123456'
    });

    await expect(
      confirmUserService.execute({
        token: 'uuid_wrong_string'
      })
    ).rejects.toBeInstanceOf(AppError);
  });
});
