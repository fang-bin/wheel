const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  devtool: 'source-map',
  mode: 'development',
  entry: './src/index.js',
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, './dist'),
  },
  devServer: {
    port: '8080',
    host: 'localhost',
    hot: true,
    open: true,
  },
  resolve: {
    extensions: ['.tsx', '.jsx', '.ts', '.js', '.json'],
  },
  module: {
    rules: [
      {
        test: /\.less/,
        use: ['style-loader', 'css-loader', 'postcss-loader', 'less-loader'],
      },
      {
        test: /\.css/,
        use: ['style-loader', 'css-loader', 'postcss-loader'],
      },
      {
        test: /\.jsx?$/,
        use: 'babel-loader',
      },
      {
        test: /\.(png|gif|jpe?g)$/i,
        use: 'url-loader',
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './build/index.html',
      filename: 'index.html',
      inject: true,
      meta: {
        'viewport': 'width=device-width, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0, user-scale=no',
      },
    }),
  ],
}