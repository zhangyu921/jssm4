import JSSM4 from "../lib/jssm4.esm.js";

const sKey = "qawsedrftgyhujik";
const sIv = "1234567890123456";
const sm4 = new JSSM4(sKey);

console.log("Testing CBC Mode...");
const testTexts = [
  "Hello SM4 CBC!",
  "国密算法加密测试",
  "Emoji Test: 🇨🇳 🛡️ 🚀",
  "Long Text: " + "A".repeat(100)
];

testTexts.forEach(text => {
  const encrypted = sm4.encryptData_CBC(text, sIv);
  const decrypted = sm4.decryptData_CBC(encrypted, sIv);
  console.log(`Original: ${text}`);
  console.log(`Encrypted: ${encrypted}`);
  console.assert(decrypted === text, `CBC Decrypt Error for: ${text}`);
});

console.log("CBC Mode Test Passed!");
