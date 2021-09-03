import User from '../infra/typeorm/entities/User';

export interface ICreateSessionsDTO {
  user: User;
  token: string;
  provider: string;
}
