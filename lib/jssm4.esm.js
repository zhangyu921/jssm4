import base64js from 'base64-js';

/**
 * SM4 算法上下文
 */
class Context {
  constructor() {
    this.mode = 1; // 1: 加密, 0: 解密
    this.sk = new Uint32Array(32); // 轮密钥
    this.isPadding = true; // 是否开启填充
  }
}

/**
 * Byte 转 Long (Big-endian)
 */
function GET_ULONG_BE(b, i) {
  return (
    ((b[i] & 0xff) << 24) |
    ((b[i + 1] & 0xff) << 16) |
    ((b[i + 2] & 0xff) << 8) |
    (b[i + 3] & 0xff)
  );
}

/**
 * Long 转 Byte (Big-endian)
 */
function PUT_ULONG_BE(n, b, i) {
  b[i] = (n >>> 24) & 0xff;
  b[i + 1] = (n >>> 16) & 0xff;
  b[i + 2] = (n >>> 8) & 0xff;
  b[i + 3] = n & 0xff;
}

/**
 * 循环左移
 */
function ROTL(a, n) {
  return (a << n) | (a >>> (32 - n));
}

// S-Box 表
const SBOX_TABLE = new Uint8Array([
  0xd6, 0x90, 0xe9, 0xfe, 0xcc, 0xe1, 0x3d, 0xb7, 0x16, 0xb6, 0x14, 0xc2, 0x28, 0xfb, 0x2c, 0x05,
  0x2b, 0x67, 0x9a, 0x76, 0x2a, 0xbe, 0x04, 0xc3, 0xaa, 0x44, 0x13, 0x26, 0x49, 0x86, 0x06, 0x99,
  0x9c, 0x42, 0x50, 0xf4, 0x91, 0xef, 0x98, 0x7a, 0x33, 0x54, 0x0b, 0x43, 0xed, 0xcf, 0xac, 0x62,
  0xe4, 0xb3, 0x1c, 0xa9, 0xc9, 0x08, 0xe8, 0x95, 0x80, 0xdf, 0x94, 0xfa, 0x75, 0x8f, 0x3f, 0xa6,
  0x47, 0x07, 0xa7, 0xfc, 0xf3, 0x73, 0x17, 0xba, 0x83, 0x59, 0x3c, 0x19, 0xe6, 0x85, 0x4f, 0xa8,
  0x68, 0x6b, 0x81, 0xb2, 0x71, 0x64, 0xda, 0x8b, 0xf8, 0xeb, 0x0f, 0x4b, 0x70, 0x56, 0x9d, 0x35,
  0x1e, 0x24, 0x0e, 0x5e, 0x63, 0x58, 0xd1, 0xa2, 0x25, 0x22, 0x7c, 0x3b, 0x01, 0x21, 0x78, 0x87,
  0xd4, 0x00, 0x46, 0x57, 0x9f, 0xd3, 0x27, 0x52, 0x4c, 0x36, 0x02, 0xe7, 0xa0, 0xc4, 0xc8, 0x9e,
  0xea, 0xbf, 0x8a, 0xd2, 0x40, 0xc7, 0x38, 0xb5, 0xa3, 0xf7, 0xf2, 0xce, 0xf9, 0x61, 0x15, 0xa1,
  0xe0, 0xae, 0x5d, 0xa4, 0x9b, 0x34, 0x1a, 0x55, 0xad, 0x93, 0x32, 0x30, 0xf5, 0x8c, 0xb1, 0xe3,
  0x1d, 0xf6, 0xe2, 0x2e, 0x82, 0x66, 0xca, 0x60, 0xc0, 0x29, 0x23, 0xab, 0x0d, 0x53, 0x4e, 0x6f,
  0xd5, 0xdb, 0x37, 0x45, 0xde, 0xfd, 0x8e, 0x2f, 0x03, 0xff, 0x6a, 0x72, 0x6d, 0x6c, 0x5b, 0x51,
  0x8d, 0x1b, 0xaf, 0x92, 0xbb, 0xdd, 0xbc, 0x7f, 0x11, 0xd9, 0x5c, 0x41, 0x1f, 0x10, 0x5a, 0xd8,
  0x0a, 0xc1, 0x31, 0x88, 0xa5, 0xcd, 0x7b, 0xbd, 0x2d, 0x74, 0xd0, 0x12, 0xb8, 0xe5, 0xb4, 0xb0,
  0x89, 0x69, 0x97, 0x4a, 0x0c, 0x96, 0x77, 0x7e, 0x65, 0xb9, 0xf1, 0x09, 0xc5, 0x6e, 0xc6, 0x84,
  0x18, 0xf0, 0x7d, 0xec, 0x3a, 0xdc, 0x4d, 0x20, 0x79, 0xee, 0x5f, 0x3e, 0xd7, 0xcb, 0x39, 0x48,
]);

// 常数 CK
const CK = new Uint32Array([
  0x00070e15, 0x1c232a31, 0x383f464d, 0x545b6269, 0x70777e85, 0x8c939aa1, 0xa8afb6bd, 0xc4cbd2d9,
  0xe0e7eef5, 0xfc030a11, 0x181f262d, 0x343b4249, 0x50575e65, 0x6c737a81, 0x888f969d, 0xa4abb2b9,
  0xc0c7ced5, 0xdce3eaf1, 0xf8ff060d, 0x141b2229, 0x30373e45, 0x4c535a61, 0x686f767d, 0x848b9299,
  0xa0a7aeb5, 0xbcc3cad1, 0xd8dfe6ed, 0xf4fb0209, 0x10171e25, 0x2c333a41, 0x484f565d, 0x646b7279,
]);

// 系统参数 FK
const FK = new Uint32Array([0xa3b1bac6, 0x56aa3350, 0x677d9197, 0xb27022dc]);

/**
 * 8比特的s盒变换
 */
function sm4Sbox(inch) {
  return SBOX_TABLE[inch & 0xff];
}

/**
 * 线性变换 Lt
 */
function sm4Lt(ka) {
  const b0 = sm4Sbox(ka >>> 24);
  const b1 = sm4Sbox(ka >>> 16);
  const b2 = sm4Sbox(ka >>> 8);
  const b3 = sm4Sbox(ka);
  const bb = (b0 << 24) | (b1 << 16) | (b2 << 8) | b3;
  return bb ^ ROTL(bb, 2) ^ ROTL(bb, 10) ^ ROTL(bb, 18) ^ ROTL(bb, 24);
}

/**
 * 轮密钥生成中的线性变换 L'
 */
function sm4CalciRK(ka) {
  const b0 = sm4Sbox(ka >>> 24);
  const b1 = sm4Sbox(ka >>> 16);
  const b2 = sm4Sbox(ka >>> 8);
  const b3 = sm4Sbox(ka);
  const bb = (b0 << 24) | (b1 << 16) | (b2 << 8) | b3;
  return bb ^ ROTL(bb, 13) ^ ROTL(bb, 23);
}

/**
 * 轮密钥生成
 */
function sm4_setkey(SK, key) {
  const MK = new Uint32Array(4);
  MK[0] = GET_ULONG_BE(key, 0);
  MK[1] = GET_ULONG_BE(key, 4);
  MK[2] = GET_ULONG_BE(key, 8);
  MK[3] = GET_ULONG_BE(key, 12);

  const k = new Uint32Array(36);
  k[0] = MK[0] ^ FK[0];
  k[1] = MK[1] ^ FK[1];
  k[2] = MK[2] ^ FK[2];
  k[3] = MK[3] ^ FK[3];

  for (let i = 0; i < 32; i++) {
    k[i + 4] = k[i] ^ sm4CalciRK(k[i + 1] ^ k[i + 2] ^ k[i + 3] ^ CK[i]);
    SK[i] = k[i + 4];
  }
}

/**
 * 32轮迭代变换
 */
function sm4_rounds(sk, input, output) {
  let x0 = GET_ULONG_BE(input, 0);
  let x1 = GET_ULONG_BE(input, 4);
  let x2 = GET_ULONG_BE(input, 8);
  let x3 = GET_ULONG_BE(input, 12);

  for (let i = 0; i < 32; i++) {
    const temp = x1 ^ x2 ^ x3 ^ sk[i];
    const x4 = x0 ^ sm4Lt(temp);
    x0 = x1;
    x1 = x2;
    x2 = x3;
    x3 = x4;
  }

  PUT_ULONG_BE(x3, output, 0);
  PUT_ULONG_BE(x2, output, 4);
  PUT_ULONG_BE(x1, output, 8);
  PUT_ULONG_BE(x0, output, 12);
}

/**
 * PKCS7 填充
 */
function padding(input, mode) {
  if (mode === 1) {
    // 加密前填充
    const p = 16 - (input.length % 16);
    const ret = new Uint8Array(input.length + p);
    ret.set(input);
    ret.fill(p, input.length);
    return ret;
  } else {
    // 解密后去除填充
    const p = input[input.length - 1];
    if (p < 1 || p > 16) return input; // 无效填充
    for (let i = 1; i <= p; i++) {
      if (input[input.length - i] !== p) return input; // 填充不一致
    }
    return input.slice(0, input.length - p);
  }
}

/**
 * 设置加密密钥
 */
function sm4_setkey_enc(ctx, key) {
  if (!ctx) throw new Error("ctx is null!");
  if (!key || key.length !== 16) throw new Error("key error!");
  ctx.mode = 1;
  sm4_setkey(ctx.sk, key);
}

/**
 * 设置解密密钥
 */
function sm4_setkey_dec(ctx, key) {
  if (!ctx) throw new Error("ctx is null!");
  if (!key || key.length !== 16) throw new Error("key error!");
  ctx.mode = 0;
  sm4_setkey(ctx.sk, key);
  ctx.sk.reverse();
}

/**
 * ECB 模式加解密
 */
function sm4_crypt_ecb(ctx, input) {
  if (input === null || input === undefined) throw new Error("input is null!");

  let data = input;
  if (ctx.isPadding && ctx.mode === 1) {
    data = padding(input, 1);
  }

  const length = data.length;
  if (length === 0) {
    return new Uint8Array(0);
  }
  const output = new Uint8Array(length);

  for (let t = 0; t < length; t += 16) {
    const blockIn = data.slice(t, t + 16);
    const blockOut = new Uint8Array(16);
    sm4_rounds(ctx.sk, blockIn, blockOut);
    output.set(blockOut, t);
  }

  if (ctx.isPadding && ctx.mode === 0) {
    return padding(output, 0);
  }
  return output;
}

/**
 * CBC 模式加解密
 */
function sm4_crypt_cbc(ctx, iv, input) {
  if (!iv || iv.length !== 16) throw new Error("iv error!");
  if (input === null || input === undefined) throw new Error("input is null!");

  let data = input;
  if (ctx.isPadding && ctx.mode === 1) {
    data = padding(input, 1);
  }

  const length = data.length;
  if (length === 0) {
    return new Uint8Array(0);
  }
  const output = new Uint8Array(length);
  let ivTmp = new Uint8Array(iv);

  if (ctx.mode === 1) {
    // CBC 加密
    for (let t = 0; t < length; t += 16) {
      const blockIn = data.slice(t, t + 16);
      for (let i = 0; i < 16; i++) {
        blockIn[i] ^= ivTmp[i];
      }
      const blockOut = new Uint8Array(16);
      sm4_rounds(ctx.sk, blockIn, blockOut);
      ivTmp = blockOut;
      output.set(blockOut, t);
    }
  } else {
    // CBC 解密
    for (let t = 0; t < length; t += 16) {
      const blockIn = data.slice(t, t + 16);
      const blockOut = new Uint8Array(16);
      sm4_rounds(ctx.sk, blockIn, blockOut);
      for (let i = 0; i < 16; i++) {
        blockOut[i] ^= ivTmp[i];
      }
      ivTmp = blockIn;
      output.set(blockOut, t);
    }
  }

  if (ctx.isPadding && ctx.mode === 0) {
    return padding(output, 0);
  }
  return output;
}

const encoder = new TextEncoder();
const decoder = new TextDecoder();

/**
 * 将字符串转换为字节数组 (UTF-8)
 * @param {string} str 
 * @returns {Uint8Array}
 */
function stringToByte(str) {
  return encoder.encode(str);
}

/**
 * 将字节数组转换为字符串 (UTF-8)
 * @param {Uint8Array|number[]} arr 
 * @returns {string}
 */
function byteToString(arr) {
  if (typeof arr === "string") {
    return arr;
  }
  const uint8 = arr instanceof Uint8Array ? arr : new Uint8Array(arr);
  return decoder.decode(uint8);
}

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

export { JSSM4 as default };
//# sourceMappingURL=jssm4.esm.js.map
