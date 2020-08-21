const path = require("path");

module.exports = {
  entry: "./src/index.js",

  output: {
    filename: "jssm4.js",
    path: path.resolve(__dirname, "lib"),
    library: "JSSM4",
    libraryTarget: "umd",
    libraryExport: "default",
    globalObject: "this",
  },
};
