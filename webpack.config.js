const { resolve } = require("path");

module.exports = {
  entry: "./src/index.ts",
  output: {
    filename: "index.bundle.js",
    path: resolve(__dirname, "dist")
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        exclude: /node_modules/,
        use: "ts-loader"
      }
    ]
  },
  resolve: {
    extensions: [".ts", ".js"]
  },
  target: "web",
  mode: "production",
  devServer: {
    static: {
      directory: "./"
    }
  }
};
