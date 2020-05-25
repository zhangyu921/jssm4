# JSSM4

一个 SM4 加解密 JavaScript 实现

解决了大多数 js 实现中循环左移位数丢失问题

100w次加解密耗时：
```
加密100w耗时: 5222.376ms
解密100w耗时: 8622.148ms
```

## 使用

``` javascript
//  <script src="./path/to/jssm4.min.js"></script>
// or const JSSM4 = require("jssm4");

var sKey = "qawsedrftgyhujik";
var sm4 = new JSSM4(sKey);

["ABC", "abc", "ABCabc", "ABC123", "abc123", "123", "你好吗"].map(
  (text) => {
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
  }
);
```


---

基于 泪血夕阳 [sm4实现博文](https://blog.csdn.net/qq_38683138/article/details/99609068)
参考 [windard](https://github.com/windard/sm4) 循环左移实现

