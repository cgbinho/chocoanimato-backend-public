import ICreateUserDTO from '@modules/users/dtos/ICreateUserDTO';
import IIndexUserDTO from '@modules/users/dtos/IIndexUserDTO';
import IUsersRepository from '@modules/users/repositories/IUsersRepository';
import { Pagination } from '@shared/infra/typeorm/pagination/entities/Pagination';
import { v4 as uuidv4 } from 'uuid';
import User from '../../infra/typeorm/entities/User';

class UsersRepository implements IUsersRepository {
  private users: User[] = [];

  public async findAllUsers(): Promise<User[] | undefined> {
    return this.users;
  }

  public async paginate(options: IIndexUserDTO): Promise<Pagination<User>> {
    const { is_verified, sort, page, take } = options;

    return new Pagination<User>({
      results: this.users,
      total: this.users.length
    });
  }

  public async findById(id: string): Promise<User | undefined> {
    const findUser = this.users.find(user => user.id === id);

    return findUser;
  }

  public async findByGoogleId(id: string): Promise<User | undefined> {
    const findUser = this.users.find(user => user.google_id === id);

    return findUser;
  }

  public async findByEmail(email: string): Promise<User | undefined> {
    const findUser = this.users.find(user => user.email === email);

    return findUser;
  }

  public async createAdmin(data: ICreateUserDTO): Promise<User> {
    const user = new User();

    Object.assign(
      user,
      { id: uuidv4() },
      data,
      { role: 'admin' },
      { is_verified: true }
    );

    this.users.push(user);

    return user;
  }

  public async create(userData: ICreateUserDTO): Promise<User> {
    const user = new User();

    Object.assign(
      user,
      { id: uuidv4() },
      userData,
      { role: 'basic' },
      { is_verified: false }
    );

    this.users.push(user);

    return user;
  }

  public async save(user: User): Promise<User> {
    const findIndex = this.users.findIndex(findUser => findUser.id === user.id);

    this.users[findIndex] = user;

    return user;
  }

  public async remove(user: User): Promise<User> {
    const findIndex = this.users.findIndex(
      userToRemove => userToRemove.id === user.id
    );
    return this.users[findIndex];
  }
}
export default UsersRepository;
