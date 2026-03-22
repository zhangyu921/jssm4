# JSSM4

国密 SM4 加解密 JavaScript 实现，支持浏览器与 Node.js 环境。

## 特性

- ✅ **高性能**：基于 `Uint32Array` 和位运算优化，100万次加密仅需 ~1.5s
- ✅ **现代化**：使用 ES6+ 语法，支持 `TextEncoder`/`TextDecoder` 原生编解码
- ✅ **模式支持**：完整支持 **ECB** 和 **CBC** 加解密模式
- ✅ **零依赖**：除必要的 `base64-js` 外无其他外部依赖
- ✅ **跨平台**：支持 ESM、CommonJS、UMD 多种模块格式，包含 TypeScript 类型定义

## 性能 (Node.js 20 + M3 Pro)

100万次加解密耗时 (3字符明文)：
```
加密100w耗时: ~1.5s
解密100w耗时: ~1.8s
```

## 安装

```bash
npm install jssm4
```

## 使用

### ECB 模式

```javascript
import JSSM4 from 'jssm4';

const sKey = "qawsedrftgyhujik"; // 16字节密钥
const sm4 = new JSSM4(sKey);

// 加密
const encrypted = sm4.encryptData_ECB("Hello SM4");
console.log(encrypted);

// 解密
const decrypted = sm4.decryptData_ECB(encrypted);
console.log(decrypted); // Hello SM4
```

### CBC 模式

```javascript
import JSSM4 from 'jssm4';

const sKey = "qawsedrftgyhujik"; // 16字节密钥
const sIv = "1234567890123456";  // 16字节向量
const sm4 = new JSSM4(sKey);

// 加密
const encrypted = sm4.encryptData_CBC("Hello CBC", sIv);

// 解密
const decrypted = sm4.decryptData_CBC(encrypted, sIv);
console.log(decrypted); // Hello CBC
```

## API

### `new JSSM4(key: string)`

创建 SM4 实例

- **key**: 16 字符长度的密钥字符串（UTF-8 编码应为 16 字节）

### `encryptData_ECB(plainText: string): string`
### `decryptData_ECB(cipherText: string): string`

ECB 模式加解密

### `encryptData_CBC(plainText: string, iv: string): string`
### `decryptData_CBC(cipherText: string, iv: string): string`

CBC 模式加解密

- **iv**: 16 字符长度的初始化向量字符串

## 开发

```bash
# 安装依赖
npm install

# 构建
npm run build

# 测试
npm test
```

## 环境要求

- **Node.js**: >= 20.0.0 (利用 `TextEncoder` 和现代位运算优化)
- **Browser**: 现代浏览器 (支持 `Uint32Array` 和 `TextEncoder`)

## 构建输出

| 格式 | 文件 | 用途 |
|------|------|------|
| ESM | `lib/jssm4.esm.js` | 现代打包工具（Vite、Webpack 等） |
| CommonJS | `lib/jssm4.cjs.js` | Node.js require() |
| UMD | `lib/jssm4.js` | 浏览器 `<script>` 标签 |

---

基于 泪血夕阳 [sm4实现博文](https://blog.csdn.net/qq_38683138/article/details/99609068)
参考 [windard](https://github.com/windard/sm4) 循环左移实现

