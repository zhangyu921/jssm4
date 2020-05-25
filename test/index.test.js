const SM4 = require("../dist/jssm4.min.js");

var sKey = "qawsedrftgyhujik";
var sm4 = new SM4(sKey);

var endata = sm4.encryptData_ECB("ABC");
console.assert(endata === "+EYlYYdds6S9o8gG6BVZIQ==", "Encrypt Error!");

var dedata = sm4.decryptData_ECB("+EYlYYdds6S9o8gG6BVZIQ==");
console.assert(dedata === "ABC", "Decrypt Error!");

["ABC", "abc", ""].map((text) => {
  console.log("原文：", text);
  console.time("加密耗时");
  var endata = sm4.encryptData_ECB(text);
  console.timeEnd("加密耗时");
  console.log("密文：", endata);
  console.time("解密耗时");
  var dedata = sm4.decryptData_ECB(endata);
  console.timeEnd("解密耗时");
  console.log("解密：", dedata);
  console.log("-----------");
});

console.time("加密100w耗时");
for (var i = 0; i < 1000000; i++) {
  sm4.encryptData_ECB("ABC");
}
console.timeEnd("加密100w耗时");

console.time("解密100w耗时");
for (var i = 0; i < 1000000; i++) {
  sm4.encryptData_ECB("+EYlYYdds6S9o8gG6BVZIQ==");
}
console.timeEnd("解密100w耗时");
