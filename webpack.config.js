const webpack = require('webpack');
const path = require('path');
const TerserPlugin = require('terser-webpack-plugin');

module.exports = {
  // モード値を production に設定すると最適化された状態で出力される
  // development に設定するとソースマップ有効でJSファイルが出力される
  mode: 'production',

  // メインとなるJavaScriptファイル（エントリーポイント）
  entry: {
    common: path.join(__dirname, '_static', 'src', 'assets', 'js', 'common.js'),
    top: path.join(__dirname, '_static', 'src', 'assets', 'js', 'top.js'),
  },

  // ファイルの出力設定
  output: {
    path: path.join(__dirname, '_static', 'dist', 'assets', 'js'),
    // filename: 'bundle.js',
    filename: '[name].bundle.js', // ファイル名をそのまま保持したい場合
  },

  // babel
  module: {
    rules: [
      {
        // 拡張子 .js の場合
        test: /\.js$/,
        use: [
          {
            // Babel を利用する
            loader: 'babel-loader',
            // Babel のオプションを指定する
            options: {
              presets: [
                // プリセットを指定することで、ES2020 を ES5 に変換
                '@babel/preset-env',
              ],
            },
          },
        ],
      },
    ],
  },
  // ES5(IE11等)向けの指定
  target: ['web', 'es5'],

  optimization: {
    // LICENSE.txtを出力させない
    minimizer: [
      new TerserPlugin({
        extractComments: false,
      }),
    ],
    // jQueryやgsapなどの外部ファイルを別ファイル（vendors.js）として出力したい場合に使用
    // splitChunks: {
    //   name: 'vendors',
    //   chunks: 'initial'
    // },
  },
};
