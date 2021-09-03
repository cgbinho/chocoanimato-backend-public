// import { hash } from 'bcryptjs';
import { inject, injectable } from 'tsyringe';
import ICouponsRepository from '../../repositories/ICouponsRepository';

@injectable()
export default class DeleteCouponByCodeService {
  constructor(
    @inject('CouponsRepository')
    private couponsRepository: ICouponsRepository
  ) {}

  public async execute(code: string): Promise<void> {
    await this.couponsRepository.deleteByCode(code);
  }
}
