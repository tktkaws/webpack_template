/*
プラグイン関係
*/
const gulp = require('gulp'); //gulp本体
// const { src, dest, watch, series, parallel } = require('gulp'); // gulpコマンドの省略
const del = require('del'); //ファイルの削除

// browser-sync
const browserSync = require('browser-sync'); //ブラウザリロード

// cssのコード整形
const postcss = require('gulp-postcss'); //gulpでPostCSSを実行
const autoprefixer = require('autoprefixer'); //Autoprefixer
var csscomb = require('gulp-csscomb'); //csscomb

//scss
const sass = require('gulp-dart-sass'); //Dart Sass はSass公式が推奨 @use構文などが使える
const plumber = require('gulp-plumber'); // エラーが発生しても強制終了させない
const notify = require('gulp-notify'); // エラー発生時のアラート出力
const mqpacker = require('css-mqpacker'); //メディアクエリをまとめる
const cssdeclsort = require('css-declaration-sorter'); //コンパイル後のCSS並び順を整える

// media query
const mode = require('gulp-mode')({
  modes: ['production', 'development'],
  default: 'development',
  verbose: false,
});

// webpack
const webpack = require('webpack');
const webpackStream = require('webpack-stream'); // gulpでwebpackを使うために必要なプラグイン

// webpackの設定ファイルの読み込み
const webpackConfig = require('./webpack.config');

// WebPでの画像圧縮
const tinyping = require('gulp-tinypng-compress');
const webp = require('gulp-webp');

// ejs
const ejs = require('gulp-ejs');
const replace = require('gulp-replace');
const fs = require('fs');
const htmlbeautify = require('gulp-html-beautify');
const rename = require('gulp-rename');

/*
パス関係
*/
// 入出力するフォルダを指定
const srcBase = './_static/src';
const distBase = './_static/dist';

const srcPath = {
  html: srcBase + '/**/*.html',
  ejs: srcBase + '/ejs/**/!(_)*.ejs',
  scss: srcBase + '/assets/scss/**/*.scss',
  js: srcBase + '/assets/js/**/*.js',
  externaljs: srcBase + '/assets/js/external/*.js',
  img: srcBase + '/assets/images/**/*',
  video: srcBase + '/assets/video/**/*',
  font: srcBase + '/assets/font/**/*',
  // php: srcBase + '/**/*.php',
  // doc: srcBase + '/assets/documents/**/*',
};

const distPath = {
  html: distBase + '/',
  ejs: distBase + '/',
  css: distBase + '/assets/css/',
  js: distBase + '/assets/js/',
  img: distBase + '/assets/images/',
  video: distBase + '/assets/video/',
  font: distBase + '/assets/font/',
  // doc: distBase + '/assets/documents/',
  // php: distBase + '/',
};

const watchPath = {
  ejs: [srcBase + '/ejs/**/*.ejs', srcBase + '/ejs/**/*.json'],
};

const ejsData = {
  data: srcBase + '/ejs/data/site.json',
};

/*
機能
*/
// clean
const clean = () => {
  return del(distBase + '/**');
};

// sassのコンパイル・ベンダープレフィックス自動付与
const cssSass = () => {
  return gulp
    .src(srcPath.scss, {
      sourcemaps: true,
    })
    .pipe(
      //エラーが出ても処理を止めない
      plumber({
        errorHandler: notify.onError('Error:<%= error.message %>'),
      }),
    )
    .pipe(sass({ outputStyle: 'expanded' })) //指定できるキー expanded compressed
    .pipe(postcss([autoprefixer()])) //autoprefixer
    .pipe(postcss([mqpacker()])) // メディアクエリをまとめる
    .pipe(postcss([cssdeclsort({ order: 'smacss' })])) // コンパイル後のプロパティ順序
    .pipe(gulp.dest(distPath.css, { sourcemaps: './' })) //コンパイル先
    .pipe(browserSync.stream())
    .pipe(
      notify({
        message: 'Sassをコンパイルし、ベンダープレフィックスを付与しました！',
        onLast: true,
      }),
    );
};

// html
const html = () => {
  return gulp.src(srcPath.html).pipe(gulp.dest(distPath.html));
};

// WebPへの変換
const gulpwebp = () => {
  return gulp
    .src(srcPath.img + '.{svg,gif,ico,png,jpg,jpeg}')
    .pipe(webp())
    .pipe(gulp.dest(distPath.img));
};

// 画像圧縮
const tinypng = () => {
  return gulp
    .src(srcPath.img + '.{png,jpg,jpeg}')
    .pipe(
      tinyping({
        key: '', // TinyPNGのAPI Key
      }),
    )
    .pipe(gulp.dest(distPath.img));
};

// video
const video = () => {
  return gulp.src(srcPath.video).pipe(gulp.dest(distPath.video));
};

// ejsをhtmlへ変換
const ejsHTML = () => {
  const json_path = ejsData.data;
  const json = JSON.parse(fs.readFileSync(json_path));

  return gulp
    .src(srcPath.ejs)
    .pipe(
      //エラーが出ても処理を止めない
      plumber({
        errorHandler: notify.onError('Error:<%= error.message %>'),
      }),
    )
    .pipe(
      ejs({
        jsonData: json,
      }),
    )
    .pipe(
      htmlbeautify({
        indent_size: 2, //インデントサイズ
        indent_char: ' ', // インデントに使う文字列。\tにするとタブでインデント
        max_preserve_newlines: 0, // 許容する連続改行数。0にすると改行を全て削除してコンパイル
        preserve_newlines: true, // コンパイル前のコードの改行を維持する。改行を無視して整形したいならfalseにする
        indent_inner_html: false, //// <head>と<body>をインデントする
        extra_liners: [], // 終了タグの前に改行を入れるタグ。配列で指定。<head>, <body>, <html>の前で改行したくない場合は[]を指定
      }),
    )
    .pipe(
      rename({
        extname: '.html',
      }),
    ) //拡張子をhtmlに
    .pipe(replace(/[\s\S]*?(<!DOCTYPE)/, '$1'))
    .pipe(gulp.dest(distPath.ejs))
    .pipe(browserSync.stream())
    .pipe(
      notify({
        message: 'HTMLをコンパイルしました！',
        onLast: true,
      }),
    );
};

// webpack
const bundleJs = () => {
  // webpackStreamの第2引数にwebpackを渡す
  return webpackStream(webpackConfig, webpack).pipe(gulp.dest(distPath.js));
  // .pipe(gulp.dest(wpPath.js));
};

// 外部jsライブラリ
const externaljs = () => {
  return gulp.src(srcPath.externaljs).pipe(gulp.dest(distPath.js));
};

// php
// const php = () => {
//   return gulp.src(srcPath.php).pipe(gulp.dest(distPath.php));
// };

// font
const font = () => {
  return gulp.src(srcPath.font).pipe(gulp.dest(distPath.font));
};

/*
サーバー立ち上げやファイル監視
*/
// ローカルサーバー立ち上げ;
const browserSyncFunc = () => {
  browserSync.init(browserSyncOption);
};

const browserSyncOption = {
  port: 8080,
  server: { baseDir: './_static/dist/' },

  open: true,
  notify: false,
  watchOptions: {
    debounceDelay: 1000,
  },
};

// リロード
const browserSyncReload = (done) => {
  browserSync.reload();
  done();
};

// ファイル監視
const watchFiles = () => {
  gulp.watch(srcPath.html, gulp.series(html, browserSyncReload));
  gulp.watch(srcPath.scss, gulp.series(cssSass));
  gulp.watch(srcPath.img, gulp.series(gulpwebp, tinypng, browserSyncReload));
  gulp.watch(srcPath.img, gulp.series(tinypng, browserSyncReload));
  gulp.watch(srcPath.js, gulp.series(bundleJs, browserSyncReload));
  gulp.watch(srcPath.externaljs, gulp.series(externaljs, browserSyncReload));
  gulp.watch(srcPath.font, gulp.series(font, browserSyncReload));
  gulp.watch(watchPath.ejs, gulp.series(ejsHTML));
  gulp.watch(srcPath.video, gulp.series(video, browserSyncReload));
  // gulp.watch(srcPath.php, gulp.series(php, browserSyncReload));
  // gulp.watch(watchPath.doc, gulp.series(doc, browserSyncReload));
};

// 一度cleanでdistフォルダ内を削除し、最新のものをdistする
exports.default = gulp.series(clean, gulp.parallel(html, cssSass, tinypng, gulpwebp, video, bundleJs, externaljs, font, ejsHTML), gulp.parallel(watchFiles, browserSyncFunc));
