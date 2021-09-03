import sharp from 'sharp';

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

export default class SharpProvider implements IImageTransformProvider {
  public async convert({
    input,
    dimensions,
    isAlphaRequired,
    alphaColor
  }: IConvertDTO): Promise<Buffer> {
    // const { width, height } = dimensions;

    const height = 400;

    let image: sharp.Sharp = sharp(input.path);

    const metadata = await image.metadata();

    /*
    CREATE PNG * SHARP IS FAST BUT DOES NOT HAVE SUPPORT FOR COLOR REPLACING! *
    */
    if (isAlphaRequired && !metadata.hasAlpha) {
      const { data, info } = await image
        .resize({ height })
        .png()
        .toBuffer({ resolveWithObject: true });

      return data;
    }

    /*
    CREATE JPG IMAGE
    */
    const { data, info } = await image
      .resize({ height })
      .jpeg({
        quality: 75,
        chromaSubsampling: '4:4:4'
      })
      .toBuffer({ resolveWithObject: true });

    return data;

    // try {
    //   const image = sharp(input.path)
    //     .resize({ height: 1080 })
    //     .jpeg({
    //       quality: 75,
    //       chromaSubsampling: '4:4:4'
    //     })
    //     .toBuffer();
    //   return image;
    // } catch (err) {}
  }
}
