import AppError from '@shared/errors/AppError';

import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider';
import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import ShowUserByEmailService from './ShowUserByEmailService';

let fakeUsersRepository: FakeUsersRepository;
let fakeHashProvider: FakeHashProvider;
let showUserByEmail: ShowUserByEmailService;

describe('ShowUserByEmail', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeHashProvider = new FakeHashProvider();

    showUserByEmail = new ShowUserByEmailService(fakeUsersRepository);
  });

  it('should be able to show the user by email', async () => {
    await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123456'
    });

    const showUser = await showUserByEmail.execute({
      email: 'johndoe@example.com'
    });

    expect(showUser.name).toBe('John Doe');
    expect(showUser.email).toBe('johndoe@example.com');
  });

  it('should NOT be able to show a user with invalid email', async () => {
    await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123456'
    });

    await expect(
      showUserByEmail.execute({
        email: 'invalid@email.com'
      })
    ).rejects.toBeInstanceOf(AppError);
  });

  // it('should NOT be able to update an user with invalid email', async () => {
  //   const user = await fakeUsersRepository.create({
  //     name: 'John Doe',
  //     email: 'johndoe@example.com',
  //     password: '123456'
  //   });

  //   await expect(
  //     ShowUserByEmail.execute({
  //       user_email: 'johntreh@example.com',
  //       name: 'John Treh',
  //       email: 'johntreh@example.com',
  //       role: 'basic',
  //       password: '1234567890',
  //       is_verified: true
  //     })
  //   ).rejects.toBeInstanceOf(AppError);
  // });
});
