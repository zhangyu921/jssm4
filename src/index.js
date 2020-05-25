import base64js from "base64-js";
import { Context, sm4_crypt_ecb, sm4_setkey_enc, sm4_setkey_dec } from "./sm4";
import { stringToByte, byteToString } from "./utils";

function JSSM4(key) {
  this.seckey = key;
  this.encryptData_ECB = encryptData_ECB;
  this.decryptData_ECB = decryptData_ECB;

  // this.hexString = false;
  function encryptData_ECB(plainText) {
    var ctx = new Context();

    ctx.isPadding = true;
    ctx.mode = 1;
    var keyBytes;
    try {
      if (this.seckey == null) {
        throw "key 不规范";
      }
      keyBytes = stringToByte(this.seckey);
    } catch (e) {
      Error(e.message);
    }
    // alert("key"+keyBytes.length)
    sm4_setkey_enc(ctx, keyBytes);
    var encrypted = sm4_crypt_ecb(ctx, stringToByte(plainText));
    var cipherText = base64js.fromByteArray(encrypted);
    if (cipherText != null && cipherText.trim().length > 0) {
      cipherText.replace(/(\s*|\t|\r|\n)/g, "");
    }
    // alert(cipherText);
    return cipherText;
  }

  function decryptData_ECB(cipherText) {
    try {
      var ctx = new Context();
      ctx.isPadding = true;
      ctx.mode = 0;

      var keyBytes = stringToByte(this.seckey);
      sm4_setkey_dec(ctx, keyBytes);
      var decrypted = sm4_crypt_ecb(ctx, base64js.toByteArray(cipherText));
      return byteToString(decrypted);
    } catch (e) {
      Error(e.message);
      return null;
    }
  }
}

export default JSSM4;
