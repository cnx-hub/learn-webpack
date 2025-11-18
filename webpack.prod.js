const path = require("path");
const fs = require("fs");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const TerserPlugin = require("terser-webpack-plugin");
const webpack = require("webpack");
const glob = require("glob");
const PerformanceAnalysisPlugin = require("./plugins/PerformanceAnalysisPlugin");
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');

// 使用环境变量控制是否启用性能分析
const enablePerformanceAnalysis = process.env.ENABLE_SPEED_MEASURE === "true";

const getMPA = () => {
  const entry = {};
  const htmlWebpackPlugins = [];

  const entryFiles = glob.sync(path.join(__dirname, "./src/*/index.js"));
  entryFiles.map((entryFile) => {
    // /Users/nanxiao/webpack/src/search/index.js
    const match = entryFile.match(/src\/(.*)\/index\.js/);
    const pageName = match && match[1];
    entry[pageName] = entryFile;

    htmlWebpackPlugins.push(
      new HtmlWebpackPlugin({
        template: path.join(__dirname, `src/${pageName}/index.html`),
        filename: `${pageName}.html`,
        chunks: [pageName],
        inject: true,
        minify: {
          html5: true,
          collapseWhitespace: true,
          preserveLineBreaks: false,
          minifyCSS: true,
          minifyJS: true,
          removeComments: false,
        },
      })
    );
  });

  return {
    entry,
    htmlWebpackPlugins,
  };
};

const { entry, htmlWebpackPlugins } = getMPA();

const config = {
  entry,
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "[name]_[chunkhash:8].js",
    // filename: "build.js",
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
        },
      },
      {
        test: /.css$/,
        use: [
          MiniCssExtractPlugin.loader,
          "css-loader",
          {
            loader: "postcss-loader",
            options: {
              postcssOptions: {
                plugins: [require("autoprefixer")],
              },
            },
          },
        ],
      },
      {
        test: /\.less$/,
        use: [
          MiniCssExtractPlugin.loader,
          "css-loader",
          "less-loader",
          {
            loader: "postcss-loader",
            options: {
              postcssOptions: {
                plugins: [require("autoprefixer")],
              },
            },
          },
          {
            loader: "px2rem-loader",
            options: {
              remUnit: 10,
              remPrecision: 8,
            },
          },
        ],
      },
      {
        test: /\.(png|jpg|gif|jpeg)$/,
        use: [
          {
            loader: "url-loader",
            options: {
              limit: 10240,
            },
            // loader: "file-loader",
          },
        ],
      },
      {
        test: /.(woff|woff2|eot|ttf|otf)$/,
        use: "file-loader",
      },
      {
        test: /\.(js)$/,
        use: [
          {
            loader: 'thread-loader',
            options: {
              workers: 3
            }
          }]
      }
    ],
  },
  mode: "none",
  // mode: 'production',
  devtool: "source-map", // 生产环境推荐配置
  plugins: [
    new MiniCssExtractPlugin({
      filename: "[name].[contenthash:8].css",
      chunkFilename: "[name].[contenthash:8].chunk.css",
    }),
    new CleanWebpackPlugin(), // 使用 webpack 5 内置清理功能
    new webpack.optimize.ModuleConcatenationPlugin(),
    // 条件性添加性能分析插件
    ...(enablePerformanceAnalysis ? [new PerformanceAnalysisPlugin({ loaderTopFiles: 10 })] : []),
    // function () {
    //   this.hooks.done.tap("done", (stats) => {
    //     if (
    //       stats.compilation.errors &&
    //       stats.compilation.errors.length &&
    //       process.argv.indexOf("--watch") == -1
    //     ) {
    //       console.log("build error");
    //       process.exit(1);
    //     }
    //   });
    // },
    // new BundleAnalyzerPlugin(),
    new webpack.DllReferencePlugin({
      manifest: require('./build/library/library.json')
    }),
  ].concat(htmlWebpackPlugins),
  optimization: {
    minimize: true,
    minimizer: [
      new TerserPlugin({
        parallel: 4
      }),
      new CssMinimizerPlugin({
        // 可选：更强压缩 & 去注释
        minimizerOptions: {
          preset: ["default", { discardComments: { removeAll: true } }],
        },
      }),
    ],

    splitChunks: {
      minSize: 0,
      cacheGroups: {
        commons: {
          name: "commons",
          chunks: "all",
          minChunks: 2,
        },
      },
    },
  },

  //   自动补全文件扩展名
  //   resolve: {
  //     extensions: ['.js', '.jsx']
  //   }

  // 外部依赖配置 - 使用 CDN
  // externals: {
  //   react: "React",
  //   "react-dom": "ReactDOM",
  // },
  stats: {
    // all: false,
    errors: true,
    warnings: true,
    errorDetails: true,
    colors: true,
    timings: true,
    builtAt: true,
  },
}

// 直接导出配置（使用自定义性能分析插件，避免兼容性问题）
module.exports = config;
