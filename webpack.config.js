var path =  require('path');
const webpack = require('webpack');
const Dotenv = require('dotenv-webpack');

module.exports = {
  entry: ["./index.ts"],
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname,"build")
  },
  
  devServer: {
    port:9000,
    compress: true,
    hot:true,
    proxy: {
        "/api": {
          target: "http://localhost:3080",
          pathRewrite: {"^/api" : ""}
        }
    }
  },
  module: {
    rules: [
      { test: /\.tsx?$/, loader: 'ts-loader',exclude: /node_modules/,},
      { test: /\.json/, loader: "json-loader", exclude:/node_modules/,}
    ]
  },  
  resolve: {
    extensions: [".tsx", ".ts", ".js",".json"]
  },
  target: 'node',
  plugins: [
    new Dotenv({
      path: './environment/.env', // Path to .env file (this is the default) 
      safe: false // load .env.example (defaults to "false" which does not use dotenv-safe) 
    }),
    new webpack.NewWatchingPlugin()
  ]
};