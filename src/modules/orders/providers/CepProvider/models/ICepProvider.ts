export default interface ICepProvider {
  show(cep: string): Promise<any>;
}
