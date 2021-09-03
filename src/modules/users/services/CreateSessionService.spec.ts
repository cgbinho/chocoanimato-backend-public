import 'reflect-metadata';
import AppError from '@shared/errors/AppError';

import CreateSessionService from './CreateSessionService';

import FakeUsersRepository from '../../users/repositories/fakes/FakeUsersRepository';
import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider';
// import FakeCacheProvider from '@shared/container/providers/CacheProvider/fakes/FakeCacheProvider';
// import FakeQueueProvider from '@shared/container/providers/QueueProvider/fakes/FakeQueueProvider';

let fakeUsersRepository: FakeUsersRepository;
let fakeHashProvider: FakeHashProvider;
// let fakeCacheProvider: FakeCacheProvider;
// let fakeQueueProvider: FakeQueueProvider;
let createSession: CreateSessionService;

describe('CreateSession', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeHashProvider = new FakeHashProvider();
    // fakeCacheProvider = new FakeCacheProvider();
    // fakeQueueProvider = new FakeQueueProvider();

    createSession = new CreateSessionService(
      fakeUsersRepository,
      fakeHashProvider
    );
  });

  it('should be able to create a new session', async () => {
    let user = await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123456789'
    });

    user.is_verified = true;
    user.role = 'basic';

    const session = await createSession.execute({
      email: 'johndoe@example.com',
      password: '123456789'
    });

    expect(session).toHaveProperty('token');
    expect(session.user).toEqual(user);
  });

  /*
  FAIL TESTS
  */
  it('should not be able to authenticate with non existing user', async () => {
    await expect(
      createSession.execute({
        email: 'john@doe.com',
        password: '123456789'
      })
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to authenticate with wrong password', async () => {
    await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123456'
    });

    await expect(
      createSession.execute({
        email: 'johndoe@example.com',
        password: 'wrongpassword'
      })
    ).rejects.toBeInstanceOf(AppError);
  });
});
