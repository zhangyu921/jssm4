declare module "jssm4" {
  class JSSM4 {
    constructor(key: string);

    encryptData_ECB(text: string): string;
    decryptData_ECB(serect: string): string;
  }

  export default JSSM4;
}
