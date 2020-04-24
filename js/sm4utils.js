//smutils.js

(function webpackUniversalModuleDefinition(root, factory) {
  var moduleName = "sm4utils";
  if (typeof exports === "object" && typeof module === "object") {
    var sm4 = require("./sm4");
    var base64js = require("./base64js");
    module.exports = factory(sm4, base64js);
  } else {
    root[moduleName] = factory(root.sm4, root.base64js);
  }
})(this, function (sm4, base64js) {
  var Context = sm4.Context,
    sm4_crypt_ecb = sm4.sm4_crypt_ecb,
    sm4_setkey_enc = sm4.sm4_setkey_enc,
    sm4_setkey_dec = sm4.sm4_setkey_dec;

  function stringToByte(str) {
    var bytes = new Array();
    var len, c;
    len = str.length;
    for (var i = 0; i < len; i++) {
      c = str.charCodeAt(i);
      if (c >= 0x010000 && c <= 0x10ffff) {
        bytes.push(((c >> 18) & 0x07) | 0xf0);
        bytes.push(((c >> 12) & 0x3f) | 0x80);
        bytes.push(((c >> 6) & 0x3f) | 0x80);
        bytes.push((c & 0x3f) | 0x80);
      } else if (c >= 0x000800 && c <= 0x00ffff) {
        bytes.push(((c >> 12) & 0x0f) | 0xe0);
        bytes.push(((c >> 6) & 0x3f) | 0x80);
        bytes.push((c & 0x3f) | 0x80);
      } else if (c >= 0x000080 && c <= 0x0007ff) {
        bytes.push(((c >> 6) & 0x1f) | 0xc0);
        bytes.push((c & 0x3f) | 0x80);
      } else {
        bytes.push(c & 0xff);
      }
    }
    return bytes;
  }

  function byteToString(arr) {
    if (typeof arr === "string") {
      return arr;
    }
    var str = "",
      _arr = arr;
    for (var i = 0; i < _arr.length; i++) {
      var one = _arr[i].toString(2),
        v = one.match(/^1+?(?=0)/);
      if (v && one.length == 8) {
        var bytesLength = v[0].length;
        var store = _arr[i].toString(2).slice(7 - bytesLength);
        for (var st = 1; st < bytesLength; st++) {
          store += _arr[st + i].toString(2).slice(2);
        }
        str += String.fromCharCode(parseInt(store, 2));
        i += bytesLength - 1;
      } else {
        str += String.fromCharCode(_arr[i]);
      }
    }
    return str;
  }

  //封装sm4.js，实现ECB工作模式

  function sm4Utils(key) {
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

  return sm4Utils;
});
