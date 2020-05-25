const path = require("path");

module.exports = {
  entry: "./src/index.js",

  output: {
    filename: "jssm4.min.js",
    path: path.resolve(__dirname, "dist"),
    library: "JSSM4",
    libraryTarget: "umd",
    libraryExport: "default",
    globalObject: "this",
  },
};
