import AppError from '@shared/errors/AppError';

import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import ShowProfileService from './ShowProfileService';

let fakeUsersRepository: FakeUsersRepository;
let showProfile: ShowProfileService;

describe('ShowProfile', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();

    showProfile = new ShowProfileService(fakeUsersRepository);
  });

  it('should be able to show the profile', async () => {
    const user = await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'john@doe.com',
      password: '123456789'
    });

    const profile = await showProfile.execute(user.id);

    expect(profile.name).toBe('John Doe');
    expect(profile.email).toBe('john@doe.com');
  });

  it('should NOT be able to show the profile of a non-existing user', async () => {
    await expect(showProfile.execute('non-existing-id')).rejects.toBeInstanceOf(
      AppError
    );
  });
});
