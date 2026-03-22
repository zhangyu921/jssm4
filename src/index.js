import base64js from "base64-js";
import { Context, sm4_crypt_ecb, sm4_crypt_cbc, sm4_setkey_enc, sm4_setkey_dec } from "./sm4";
import { stringToByte, byteToString } from "./utils";

/**
 * JSSM4 加解密类
 */
class JSSM4 {
  /**
   * @param {string} key 16 字节密钥字符串
   */
  constructor(key) {
    if (!key || key.length !== 16) {
      throw new Error("Key must be a 16-character string.");
    }
    this.seckey = key;
  }

  /**
   * ECB 模式加密
   * @param {string} plainText 明文字符串
   * @returns {string} Base64 编码的密文
   */
  encryptData_ECB(plainText) {
    if (plainText === null || plainText === undefined) {
      throw new Error("plainText cannot be null or undefined.");
    }

    const ctx = new Context();
    ctx.isPadding = true;
    ctx.mode = 1;

    const keyBytes = stringToByte(this.seckey);
    const plainBytes = stringToByte(plainText);

    sm4_setkey_enc(ctx, keyBytes);
    const encrypted = sm4_crypt_ecb(ctx, plainBytes);
    
    return base64js.fromByteArray(encrypted);
  }

  /**
   * ECB 模式解密
   * @param {string} cipherText Base64 编码的密文
   * @returns {string} 明文字符串
   */
  decryptData_ECB(cipherText) {
    if (!cipherText) {
      return "";
    }

    const ctx = new Context();
    ctx.isPadding = true;
    ctx.mode = 0;

    const keyBytes = stringToByte(this.seckey);
    const cipherBytes = base64js.toByteArray(cipherText);

    sm4_setkey_dec(ctx, keyBytes);
    const decrypted = sm4_crypt_ecb(ctx, cipherBytes);
    
    return byteToString(decrypted);
  }

  /**
   * CBC 模式加密
   * @param {string} plainText 明文字符串
   * @param {string} iv 16 字节向量字符串
   * @returns {string} Base64 编码的密文
   */
  encryptData_CBC(plainText, iv) {
    if (plainText === null || plainText === undefined) {
      throw new Error("plainText cannot be null or undefined.");
    }
    if (!iv || iv.length !== 16) {
      throw new Error("IV must be a 16-character string.");
    }

    const ctx = new Context();
    ctx.isPadding = true;
    ctx.mode = 1;

    const keyBytes = stringToByte(this.seckey);
    const ivBytes = stringToByte(iv);
    const plainBytes = stringToByte(plainText);

    sm4_setkey_enc(ctx, keyBytes);
    const encrypted = sm4_crypt_cbc(ctx, ivBytes, plainBytes);
    
    return base64js.fromByteArray(encrypted);
  }

  /**
   * CBC 模式解密
   * @param {string} cipherText Base64 编码的密文
   * @param {string} iv 16 字节向量字符串
   * @returns {string} 明文字符串
   */
  decryptData_CBC(cipherText, iv) {
    if (!cipherText) {
      return "";
    }
    if (!iv || iv.length !== 16) {
      throw new Error("IV must be a 16-character string.");
    }

    const ctx = new Context();
    ctx.isPadding = true;
    ctx.mode = 0;

    const keyBytes = stringToByte(this.seckey);
    const ivBytes = stringToByte(iv);
    const cipherBytes = base64js.toByteArray(cipherText);

    sm4_setkey_dec(ctx, keyBytes);
    const decrypted = sm4_crypt_cbc(ctx, ivBytes, cipherBytes);
    
    return byteToString(decrypted);
  }
}

export default JSSM4;
