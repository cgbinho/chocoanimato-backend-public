import { rgbToHex } from '@modules/projects/utils/rgbaToHex';
import Jimp from 'jimp';
import ReplaceColor from 'replace-color';
import { IConvertDTO } from '../dtos/IConvertDTO';
import IImageTransformProvider from '../models/IImageTransformProvider';

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

export default class JimpProvider implements IImageTransformProvider {
  public async convert({
    input,
    dimensions,
    isAlphaRequired,
    alphaColor
  }: IConvertDTO): Promise<Buffer> {
    try {
      let JimpImage: Jimp = await Jimp.read(input.path);

      /*
      CREATE PNG WITH ALPHA ( if alpha is required and image does not have alpha already )
      */
      if (isAlphaRequired && !JimpImage.hasAlpha()) {
        const alphaColorHex = await rgbToHex(alphaColor);

        JimpImage = await ReplaceColor({
          image: input.path,
          colors: {
            type: 'hex',
            targetColor: `${alphaColorHex}`, // White '#FFFFFF'
            replaceColor: '#00000000'
          },
          deltaE: 10
        });

        const image = JimpImage.scaleToFit(
          dimensions.width,
          dimensions.height
        ).quality(70);

        const mime = Jimp.MIME_PNG;
        const imageBuffer = await image.getBufferAsync(mime);

        return imageBuffer;
      }
      /*
      CREATE IMAGE
      */
      const image = JimpImage.scaleToFit(
        dimensions.width,
        dimensions.height
      ).quality(70);

      const mime = image.getMIME();
      const imageBuffer = await image.getBufferAsync(mime);

      return imageBuffer;
    } catch (err) {}

    /*
    image.contain( w, h[, alignBits || mode, mode] );    // scale the image to the given width and height, some parts of the image may be letter boxed
    image.cover( w, h[, alignBits || mode, mode] );      // scale the image to the given width and height, some parts of the image may be clipped
    image.resize( w, h[, mode] );     // resize the image. Jimp.AUTO can be passed as one of the values.
    image.scale( f[, mode] );         // scale the image by the factor f
    image.scaleToFit( w, h[, mode] ); // scale the image to the largest size that fits inside the given width and height
    */

    // try {
    //   const imageFile = await Jimp.read(input.path);
    //   const image = imageFile
    //     .scaleToFit(dimensions.width, dimensions.height)
    //     .quality(70);

    //   const mime = image.getMIME();
    //   const imageBuffer = await image.getBufferAsync(mime);

    //   return imageBuffer;
    // } catch (err) {
    //   console.log(err);
    // }
  }
}
