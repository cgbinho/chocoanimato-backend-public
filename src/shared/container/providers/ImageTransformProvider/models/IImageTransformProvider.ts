import { IConvertDTO } from '../dtos/IConvertDTO';

export default interface IImageTransformProvider {
  convert({ input, dimensions }: IConvertDTO): Promise<Buffer>;
}
