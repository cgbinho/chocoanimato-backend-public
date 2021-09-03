import 'reflect-metadata';
import AppError from '@shared/errors/AppError';

import CreateUserAdminService from './CreateUserAdminService';

import FakeUsersRepository from '../../users/repositories/fakes/FakeUsersRepository';
import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider';
import FakeCacheProvider from '@shared/container/providers/CacheProvider/fakes/FakeCacheProvider';
import FakeQueueProvider from '@shared/container/providers/QueueProvider/fakes/FakeQueueProvider';

let fakeUsersRepository: FakeUsersRepository;
let fakeHashProvider: FakeHashProvider;
let fakeCacheProvider: FakeCacheProvider;
let fakeQueueProvider: FakeQueueProvider;
let createUserAdminService: CreateUserAdminService;

describe('CreateUserAdmin', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeHashProvider = new FakeHashProvider();
    fakeCacheProvider = new FakeCacheProvider();
    fakeQueueProvider = new FakeQueueProvider();
    createUserAdminService = new CreateUserAdminService(
      fakeUsersRepository,
      fakeHashProvider
    );
  });

  it('should be able to create an Admin user', async () => {
    const generateHash = jest.spyOn(fakeHashProvider, 'generateHash');

    const adminData = {
      name: 'Admin name',
      email: 'admin@email.com',
      password: '123456'
    };
    await createUserAdminService.execute(adminData);

    // expect(admin).toHaveProperty('id');
    expect(generateHash).toHaveBeenCalled();
  });
});
