interface ITemplateVariables {
  [key: string]: any;
}

export default interface IParseMailTemplateDTO {
  file: string;
  variables: ITemplateVariables;
}
