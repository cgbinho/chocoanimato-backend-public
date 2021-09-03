import FakeCacheProvider from '@shared/container/providers/CacheProvider/fakes/FakeCacheProvider';
import AppError from '@shared/errors/AppError';
import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider';
import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import ResetPasswordService from './ResetPasswordService';

let fakeUsersRepository: FakeUsersRepository;
let fakeHashProvider: FakeHashProvider;
let fakeCacheProvider: FakeCacheProvider;
let resetPassword: ResetPasswordService;

describe('ResetPasswordService', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeHashProvider = new FakeHashProvider();
    fakeCacheProvider = new FakeCacheProvider();

    resetPassword = new ResetPasswordService(
      fakeUsersRepository,
      fakeHashProvider,
      fakeCacheProvider
    );
  });

  it('should be able to reset the password', async () => {
    const user = await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123456'
    });

    jest
      .spyOn(fakeCacheProvider, 'recover')
      .mockImplementation(async () => user.id);

    const generateHash = jest.spyOn(fakeHashProvider, 'generateHash');

    await resetPassword.execute({
      password: '123123',
      token: 'test'
    });

    const updatedUser = await fakeUsersRepository.findById(user.id);

    expect(updatedUser?.password).toBe('123123');
    expect(generateHash).toHaveBeenCalledWith(updatedUser?.password);
  });

  it('should not be able to reset the password with non existing token', async () => {
    await expect(
      resetPassword.execute({
        token: 'non-existing-token',
        password: '123456'
      })
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to reset the password with non existing user', async () => {
    const user = jest
      .spyOn(fakeUsersRepository, 'findById')
      .mockImplementation(async () => null);

    await expect(
      resetPassword.execute({
        token: 'test',
        password: '123456'
      })
    ).rejects.toBeInstanceOf(AppError);
  });

  // it('should NOT be able to reset password with token generated for more than 2 hours', async () => {
  //   const user = await fakeUsersRepository.create({
  //     name: 'John Doe',
  //     email: 'johndoe@example.com',
  //     password: '123456'
  //   });

  //   const { token } = await fakeUserTokensRepository.generate(user.id);

  //   jest.spyOn(Date, 'now').mockImplementationOnce(() => {
  //     const customDate = new Date();

  //     return customDate.setHours(customDate.getHours() + 3);
  //   });

  //   await expect(
  //     resetPassword.execute({
  //       password: '123123',
  //       token
  //     })
  //   ).rejects.toBeInstanceOf(AppError);
  // });
});
