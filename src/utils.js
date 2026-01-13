const encoder = new TextEncoder();
const decoder = new TextDecoder();

/**
 * 将字符串转换为字节数组 (UTF-8)
 * @param {string} str 
 * @returns {Uint8Array}
 */
export function stringToByte(str) {
  return encoder.encode(str);
}

/**
 * 将字节数组转换为字符串 (UTF-8)
 * @param {Uint8Array|number[]} arr 
 * @returns {string}
 */
export function byteToString(arr) {
  if (typeof arr === "string") {
    return arr;
  }
  const uint8 = arr instanceof Uint8Array ? arr : new Uint8Array(arr);
  return decoder.decode(uint8);
}
