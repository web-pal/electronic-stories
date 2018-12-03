const path = require('path');
const webpack = require('webpack');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');

module.exports = () => ({
  mode: 'production',
  devtool: 'source-map',
  target: 'electron-main',
  entry: path.join(__dirname, 'app/main/index.js'),

  output: {
    path: path.resolve(__dirname, 'lib'),
    filename: 'main.prod.js',
  },
  resolve: {
    extensions: ['.js', '.jsx', '.mjs', '.wasm', '.json'],
  },
  plugins: [
    new webpack.EnvironmentPlugin({
      DEBUG_PROD: false,
    }),
    new BundleAnalyzerPlugin({
      analyzerMode: 'static',
    }),
  ],
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            babelrc: false,
            cacheDirectory: false,
            presets: [
              [
                '@babel/preset-env',
                {
                  targets: {
                    electron: '3.0.2',
                  },
                  modules: false,
                  useBuiltIns: 'entry',
                },
              ],
            ],
            plugins: [
              '@babel/plugin-proposal-export-namespace-from',
              '@babel/plugin-proposal-export-default-from',
              '@babel/plugin-proposal-class-properties',
              [
                // used only for babel helpers
                '@babel/plugin-transform-runtime',
                {
                  // regenerator runtime should be used from global polyfill
                  regenerator: false,
                  // define babel helpers as es modules
                  useESModules: true,
                },
              ],
            ],
          },
        },
      },
      {
        test: /\.(?:ico|gif|png|jpg|jpeg|eot|webp)$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: 'images/[name].[ext]',
            },
          },
        ],
      },
    ],
  },

  /**
   * Disables webpack processing of __dirname and __filename.
   * If you run the bundle in node.js it falls back to these values of node.js.
   * https://github.com/webpack/webpack/issues/2010
   */
  node: {
    __dirname: false,
    __filename: false,
  },
});
