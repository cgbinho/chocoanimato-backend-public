import 'reflect-metadata';
import AppError from '@shared/errors/AppError';

import DeleteUserByEmailService from './DeleteUserByEmailService';

import FakeUsersRepository from '../../users/repositories/fakes/FakeUsersRepository';
import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider';
import FakeCacheProvider from '@shared/container/providers/CacheProvider/fakes/FakeCacheProvider';
import FakeQueueProvider from '@shared/container/providers/QueueProvider/fakes/FakeQueueProvider';

let fakeUsersRepository: FakeUsersRepository;
let fakeHashProvider: FakeHashProvider;
let fakeCacheProvider: FakeCacheProvider;
let fakeQueueProvider: FakeQueueProvider;
let deleteUserByEmail: DeleteUserByEmailService;

describe('DeleteUserByEmail', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeHashProvider = new FakeHashProvider();
    fakeCacheProvider = new FakeCacheProvider();
    fakeQueueProvider = new FakeQueueProvider();
    deleteUserByEmail = new DeleteUserByEmailService(fakeUsersRepository);
  });

  it('should be able to delete a user by email', async () => {
    const user = await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123456'
    });

    const deletedUser = await deleteUserByEmail.execute({
      email: 'johndoe@example.com'
    });

    expect(deletedUser.name).toBe('John Doe');
  });

  it('should NOT be able to delete an INEXISTENT user by email', async () => {
    await expect(
      deleteUserByEmail.execute({
        email: 'inexistent-user@mail.com'
      })
    ).rejects.toBeInstanceOf(AppError);
  });
});
