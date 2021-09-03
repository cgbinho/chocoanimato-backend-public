import { getRepository, Repository, LessThanOrEqual } from 'typeorm';

import IAuthProvidersRepository from '@modules/users/repositories/IAuthProvidersRepository';

import AuthProvider from '../entities/AuthProvider';
import ICreateAuthProvidersDTO from '@modules/users/dtos/ICreateAuthProvidersDTO';



class AuthProvidersRepository implements IAuthProvidersRepository {
  private ormRepository: Repository<AuthProvider>;

  constructor() {
    this.ormRepository = getRepository(AuthProvider);
  }

  public async findByUserIdAndType(user_id:string,type:string): Promise<AuthProvider | undefined> {
    const authProvider = await this.ormRepository.findOne({ where: { type, user_id } });

    return authProvider || null;
  }

  public async findByUserId(
    user_id: string
  ): Promise<AuthProvider | undefined> {
    const authProvider = await this.ormRepository.findOne({
      where: { user_id }
    });

    return authProvider || null;
  }

  public async create({
    id,
    type,
    user_id
  }: ICreateAuthProvidersDTO): Promise<AuthProvider> {
    const authProvider = this.ormRepository.create({
      id,
      type,
      user_id
    });

    await this.ormRepository.save(authProvider);

    return authProvider;
  }

  public async save(authProvider: AuthProvider): Promise<AuthProvider> {
    return this.ormRepository.save(authProvider);
  }

  public async remove(authProvider: AuthProvider): Promise<AuthProvider> {
    return this.ormRepository.remove(authProvider);
  }
}
export default AuthProvidersRepository;
