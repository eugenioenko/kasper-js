const path = require("path");

module.exports = {
  entry: "./src/kasper.ts",
  mode: "production",
  watch: false,
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: "ts-loader",
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: [".tsx", ".ts", ".js"],
  },
  output: {
    filename: "kasper.min.js",
    path: path.resolve(__dirname, "dist"),
    // libraryTarget: "window",
  },
};
