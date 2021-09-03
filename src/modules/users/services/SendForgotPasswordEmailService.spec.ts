import AppError from '@shared/errors/AppError';

import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import SendForgotPasswordEmailService from './SendForgotPasswordEmailService';

import FakeCacheProvider from '@shared/container/providers/CacheProvider/fakes/FakeCacheProvider';
import FakeQueueProvider from '@shared/container/providers/QueueProvider/fakes/FakeQueueProvider';

let fakeUsersRepository: FakeUsersRepository;
let fakeCacheProvider: FakeCacheProvider;
let fakeQueueProvider: FakeQueueProvider;
let sendForgotPasswordEmail: SendForgotPasswordEmailService;
/*
FAKES A UUID
*/
jest.mock('uuid', () => {
  return {
    v4: jest.fn(() => 'uuid_string')
  };
});

describe('SendForgotPasswordEmail', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeCacheProvider = new FakeCacheProvider();
    fakeQueueProvider = new FakeQueueProvider();
    sendForgotPasswordEmail = new SendForgotPasswordEmailService(
      fakeUsersRepository,
      fakeCacheProvider,
      fakeQueueProvider
    );
  });

  it('should be able to recover the password providing email', async () => {
    const sendMail = jest.spyOn(fakeQueueProvider, 'add');

    await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123456'
    });
    await sendForgotPasswordEmail.execute({
      email: 'johndoe@example.com'
    });
    expect(sendMail).toHaveBeenCalled();
  });

  it('should NOT be able to recover a non-existing user password', async () => {
    await expect(
      sendForgotPasswordEmail.execute({
        email: 'johndoe@example.com'
      })
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should generate a forgot password token', async () => {
    const cacheToken = jest.spyOn(fakeCacheProvider, 'saveWithExpiration');

    await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123456'
    });

    await sendForgotPasswordEmail.execute({
      email: 'johndoe@example.com'
    });

    expect(cacheToken).toHaveBeenCalled();
  });
});
