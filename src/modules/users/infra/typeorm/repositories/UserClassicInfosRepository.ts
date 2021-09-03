import { getRepository, Repository, LessThanOrEqual } from 'typeorm';

import IAuthProvidersRepository from '@modules/users/repositories/IAuthProvidersRepository';

import UserClassicInfo from '../entities/UserClassicInfo';
import ICreateUserClassicInfosDTO from '@modules/users/dtos/ICreateUserClassicInfosDTO';
import IUserClassicInfosRepository from '@modules/users/repositories/IUserClassicInfosRepository';

class UserClassicInfosRepository implements IUserClassicInfosRepository {
  private ormRepository: Repository<UserClassicInfo>;

  constructor() {
    this.ormRepository = getRepository(UserClassicInfo);
  }

  public async findById(id: string): Promise<UserClassicInfo | undefined> {
    const userClassicInfo = await this.ormRepository.findOne(id);

    return userClassicInfo || null;
  }

  public async findByUserId(
    user_id: string
  ): Promise<UserClassicInfo | undefined> {
    const userClassicInfo = await this.ormRepository.findOne({
      where: { user_id }
    });

    return userClassicInfo || null;
  }

  public async create({
    user_id,
    password,
    is_verified
  }: ICreateUserClassicInfosDTO): Promise<UserClassicInfo> {
    const userClassicInfo = this.ormRepository.create({
      user_id,
      password,
      is_verified
    });

    await this.ormRepository.save(userClassicInfo);

    return userClassicInfo;
  }

    public async save(userClassicInfo: UserClassicInfo): Promise<UserClassicInfo> {
    return this.ormRepository.save(userClassicInfo);
  }

  public async remove(userClassicInfo: UserClassicInfo): Promise<UserClassicInfo> {
    return this.ormRepository.remove(userClassicInfo);
  }
}
export default UserClassicInfosRepository;
