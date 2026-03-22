export class JSSM4 {
  constructor(key: string);
  /**
   * ECB mode encryption
   * @param plainText The text to encrypt
   * @returns Base64 encoded cipher text
   */
  encryptData_ECB(plainText: string): string;
  /**
   * ECB mode decryption
   * @param cipherText Base64 encoded cipher text
   * @returns Decrypted plain text
   */
  decryptData_ECB(cipherText: string): string;
  /**
   * CBC mode encryption
   * @param plainText The text to encrypt
   * @param iv 16-byte initialization vector
   * @returns Base64 encoded cipher text
   */
  encryptData_CBC(plainText: string, iv: string): string;
  /**
   * CBC mode decryption
   * @param cipherText Base64 encoded cipher text
   * @param iv 16-byte initialization vector
   * @returns Decrypted plain text
   */
  decryptData_CBC(cipherText: string, iv: string): string;
}

export default JSSM4;
