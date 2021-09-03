import { ICreateVideoConverterDTO } from '../dtos/ICreateVideoConverterDTO';

export default interface IVideoConverterProvider {
  create({
    image_sequence,
    music,
    output,
    is_preview,
    watermark
  }: ICreateVideoConverterDTO): Promise<any>;
}
