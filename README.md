# JSSM4

国密 SM4 加解密 JavaScript 实现，支持浏览器与 Node.js 环境

## 特性

- ✅ 纯 JavaScript 实现，无需额外依赖
- ✅ 支持 Node.js 和浏览器环境
- ✅ 解决了大多数 JS 实现中循环左移位数丢失问题
- ✅ 高性能：100万次加密仅需 1.6s
- ✅ 支持 ESM、CommonJS、UMD 多种模块格式
- ✅ 包含 TypeScript 类型定义

## 性能

100万次加解密耗时：
```
加密100w耗时: 1.647s
解密100w耗时: 2.659s
```

## 安装

```bash
npm install jssm4
```

## 使用

### Node.js 环境

```javascript
// ESM
import JSSM4 from 'jssm4';

// CommonJS
const JSSM4 = require('jssm4');

const sKey = "qawsedrftgyhujik";
const sm4 = new JSSM4(sKey);

// 加密
const encrypted = sm4.encryptData_ECB("ABC");
console.log(encrypted); // +EYlYYdds6S9o8gG6BVZIQ==

// 解密
const decrypted = sm4.decryptData_ECB(encrypted);
console.log(decrypted); // ABC
```

### 浏览器环境

```html
<script src="./lib/jssm4.js"></script>
<script>
  const sKey = "qawsedrftgyhujik";
  const sm4 = new JSSM4(sKey);

  ["ABC", "abc", "ABCabc", "ABC123", "abc123", "123", "你好吗"].map((text) => {
    console.log("原文：", text);
    const encrypted = sm4.encryptData_ECB(text);
    console.log("密文：", encrypted);
    const decrypted = sm4.decryptData_ECB(encrypted);
    console.log("解密：", decrypted);
  });
</script>
```

## API

### `new JSSM4(key: string)`

创建 SM4 实例

- **key**: 16 字符长度的密钥字符串

### `encryptData_ECB(plainText: string): string`

ECB 模式加密

- **plainText**: 待加密的明文字符串
- **返回**: Base64 编码的密文字符串

### `decryptData_ECB(cipherText: string): string`

ECB 模式解密

- **cipherText**: Base64 编码的密文字符串
- **返回**: 解密后的明文字符串

## 开发

```bash
# 安装依赖
npm install

# 开发模式（监听文件变化）
npm run dev

# 构建
npm run build

# 测试
npm test
```

## 构建输出

| 格式 | 文件 | 用途 |
|------|------|------|
| ESM | `lib/jssm4.esm.js` | 现代打包工具（Vite、Webpack 等） |
| CommonJS | `lib/jssm4.cjs.js` | Node.js require() |
| UMD | `lib/jssm4.js` | 浏览器 `<script>` 标签 |


---

基于 泪血夕阳 [sm4实现博文](https://blog.csdn.net/qq_38683138/article/details/99609068)
参考 [windard](https://github.com/windard/sm4) 循环左移实现

