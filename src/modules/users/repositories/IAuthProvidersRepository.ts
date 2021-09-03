import AuthProvider from '../infra/typeorm/entities/AuthProvider';
import ICreateAuthProvidersDTO from '../dtos/ICreateAuthProvidersDTO';

export default interface IAuthProvidersRepository {
  findByUserIdAndType(user_id: string,type: string): Promise<AuthProvider | undefined>;
  findByUserId(user_id: string): Promise<AuthProvider | undefined>;
  create(data: ICreateAuthProvidersDTO): Promise<AuthProvider>;
  save(authProvider: AuthProvider): Promise<AuthProvider>;
  remove(authProvider: AuthProvider): Promise<AuthProvider>;
}
