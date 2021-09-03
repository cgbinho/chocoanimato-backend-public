// import { IJobDTO } from '../dtos/IJobDTO';

export default interface IRenderProvider {
  create(
    animationData: string | null,
    output: string,
    path?: string | null,
    opts?: any
  ): Promise<any>;
}
