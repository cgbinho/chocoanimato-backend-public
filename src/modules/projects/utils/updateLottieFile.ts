import IFieldsDTO from '../dtos/IFieldsDTO';

interface IRequest {
  lottie: Object;
  fields: IFieldsDTO[];
  imageData: IImageDataDTO;
}

interface IImageDataDTO {
  file: Express.Multer.File | undefined;
  image_path: string;
  removeImageFromField: string | undefined;
}

interface IAssetDTO {
  id: string; // 'image_produto01'
  w: number; // 1920
  h: number; // 1080
  u: string; // 'images/'
  p: string; // 'image_produto01_998ef093f1638c7381a7.jpg'
  e: number; // 0
}

const UpdateLottieFile = async ({
  lottie,
  fields,
  imageData
}: IRequest): Promise<any> => {
  /*
  UPDATE A LOTTIE JSON
  */
  let updatedLottie = lottie;
  let fieldsArray = [...fields];

  // iterando sobre os fields:
  fieldsArray.map(async field => {
    let { category } = field;

    switch (category) {
      case 'text':
        await handleText(updatedLottie, field);
        break;
      case 'color':
        await handleColor(updatedLottie, field);
        break;
      case 'image':
        await handleImage(updatedLottie, field, imageData);
        break;
      default:
    }
  });

  async function handleImage(
    lottie: any,
    field: IFieldsDTO,
    imageData: IImageDataDTO
  ): Promise<void> {
    // GET FIELDNAME FROM FILE OR REMOVEIMAGEFIELD:
    const fieldname = imageData?.file?.fieldname
      ? imageData.file.fieldname
      : imageData.removeImageFromField;

    try {
      // if image field is equal to file uploaded.
      if (field.fieldname === fieldname) {
        let findIndex = lottie.assets.findIndex(
          (asset: IAssetDTO) => asset.id === fieldname
        );
        lottie.assets[findIndex].p = field.value;
        lottie.assets[findIndex].u = imageData.image_path;
      }
    } catch (error) {}
    // console.log('update image!', imageData);
    // busca o asset com mesmo id ( fieldname é usado como id)
    /*
    UPDATE ASSET PATH IF FIELD
    */
    // IF FILE EXISTS, UPDATE FIELD
    // if (imageData?.file) {
    //   try {
    //     // if image field is equal to file uploaded.
    //     if (field.fieldname === imageData.file.fieldname) {
    //       let findIndex = lottie.assets.findIndex(
    //         (asset: IAssetDTO) => asset.id === imageData.file.fieldname
    //       );
    //       lottie.assets[findIndex].p = field.value;
    //       lottie.assets[findIndex].u = imageData.image_path;
    //       console.log('updated.');
    //     }
    //   } catch (error) {
    //     console.log('error: ', error);
    //   }
    // }

    // REMOVE IMAGE FROM FIELD ADDS 'TRANSPARENT.PNG' TO FIELD:
    // if (imageData?.removeImageFromField) {
    //   const fieldname = imageData.removeImageFromField;

    //   try {
    //     // if image field is equal to file uploaded.
    //     if (field.fieldname === fieldname) {
    //       let findIndex = lottie.assets.findIndex(
    //         (asset: IAssetDTO) => asset.id === fieldname
    //       );
    //       lottie.assets[findIndex].p = field.value;
    //       lottie.assets[findIndex].u = imageData.image_path;
    //       console.log('updated.');
    //     }
    //   } catch (error) {
    //     console.log('error: ', error);
    //   }
    // }
  }

  async function handleText(lottie: any, field: IFieldsDTO): Promise<void> {
    let textLayer = lottie.layers.filter(
      layer => layer.nm === field.fieldname
    )[0];
    textLayer.t.d.k[0].s.t = field.value;
  }

  async function handleColor(lottie: any, field: IFieldsDTO): Promise<void> {
    // get 'colors' layer
    let colorLayer = lottie.layers.filter(layer => layer.nm === 'colors')[0];
    // get property with same name as the field
    let colorProperty = colorLayer.ef.filter(
      effect => effect.nm === field.fieldname
    )[0];

    colorProperty.ef[0].v.k = formatRGBAColor(field.value);

    function formatRGBAColor(color: string) {
      let rawColor = color.split(',');
      //converte a cor de 255 para 0-1 ( padrão do after effects e lottie):
      let rgbColor = rawColor.map((c: String) =>
        Number((Number(c) / 255).toFixed(5))
      );

      return rgbColor;
    }
  }

  return updatedLottie;
};

export default UpdateLottieFile;
