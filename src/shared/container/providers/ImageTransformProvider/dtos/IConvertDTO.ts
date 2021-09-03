export interface IConvertDTO {
  input: Express.Multer.File;
  dimensions: { width: number; height: number };
  isAlphaRequired: boolean;
  alphaColor: string;
}
