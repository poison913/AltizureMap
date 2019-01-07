var path = require('path')
module.exports = {
  entry: ["./src/index.ts"], //,"./src/layer/IntegratedMeshLayer.ts"  //输入文件

  devtool: "source-map",
  module: {
    //   loaders: [
    //       // all files with a '.ts' or '.tsx' extension will be handled by 'ts-loader'
    //       { test: /\.tsx?$/, loader: "ts-loader" }
    //   ]
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/
      },
      {
        test: /\.worker\.js$/,
        use: { loader: 'worker-loader' }
      }
    ]
  },
  resolve: {
    // Add '.ts' and '.tsx' as a resolvable extension.
    extensions: [".ts", ".tsx", ".js"]
  },
  output: {
    path: path.resolve(__dirname, './dist'),
    filename: "bundle.js",

    library: "hky",
    libraryTarget: "umd"
  }
};