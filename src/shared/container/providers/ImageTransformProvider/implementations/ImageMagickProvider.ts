import IImageTransformProvider from '../models/IImageTransformProvider';

import { IConvertDTO } from '../dtos/IConvertDTO';
// {
//   fieldname: 'image_produto01',
//   originalname: '9ee.jpg',
//   encoding: '7bit',
//   mimetype: 'image/jpeg',
//   destination: 'D:\\ChocoAnimato\\Development\\backend_v02\\temp',
//   filename: 'fcb824342dbe5a76ec75-9ee.jpg',
//   path: 'D:\\ChocoAnimato\\Development\\backend_v02\\temp\\fcb824342dbe5a76ec75-9ee.jpg',
//   size: 21842
// }

export default class ImageMagickProvider implements IImageTransformProvider {
  public async convert({
    input,
    dimensions,
    isAlphaRequired,
    alphaColor
  }: IConvertDTO): Promise<any> {
    // const { width, height } = dimensions;

    // convert img.png -fuzz 2% -fill none -draw "matte 0,0 floodfill" -channel alpha -blur 0x2 -level 50x100% +channel result.png
    return '';
  }
}
