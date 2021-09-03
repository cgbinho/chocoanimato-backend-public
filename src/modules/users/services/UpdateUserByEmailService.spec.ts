import AppError from '@shared/errors/AppError';

import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider';
import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import UpdateUserByEmailService from './UpdateUserByEmailService';

let fakeUsersRepository: FakeUsersRepository;
let fakeHashProvider: FakeHashProvider;
let updateUserByEmail: UpdateUserByEmailService;

describe('UpdateUserByEmail', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeHashProvider = new FakeHashProvider();

    updateUserByEmail = new UpdateUserByEmailService(
      fakeUsersRepository,
      fakeHashProvider
    );
  });

  it('should be able to update the user by email', async () => {
    const user = await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123456'
    });

    const updatedUser = await updateUserByEmail.execute({
      user_email: 'johndoe@example.com',
      name: 'John Treh',
      email: 'johntreh@example.com',
      role: 'basic',
      password: '1234567890',
      is_verified: true
    });

    expect(updatedUser.name).toBe('John Treh');
    expect(updatedUser.email).toBe('johntreh@example.com');
  });

  it('should NOT be able to update an user with invalid email', async () => {
    const user = await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123456'
    });

    await expect(
      updateUserByEmail.execute({
        user_email: 'johntreh@example.com',
        name: 'John Treh',
        email: 'johntreh@example.com',
        role: 'basic',
        password: '1234567890',
        is_verified: true
      })
    ).rejects.toBeInstanceOf(AppError);
  });
});
