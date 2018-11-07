const path = require('path')
const webpack = require('webpack')
const HTMLPlugin = require('html-webpack-plugin')

const { VueLoaderPlugin } = require('vue-loader')


const isDev = process.env.NODE_ENV = 'development'  //判断环境

const config = {
  target: 'web',
  // entry - 入口，可配置多个入口
  entry: path.join(__dirname, 'src/index.js'),  
  // output - 输出
  output: {
    filename: 'bundle.js',
    path: path.join(__dirname, 'dist') 
  },
  // loader - 处理多种文件格式的机制，生成可以支持打包的模块
  module: {
    rules: [
      {
        test: /\.vue$/,
        loader: 'vue-loader'
      },
      {
        test: /\.jsx$/,
        loader: 'babel-loader'
      },
      {
        test: /\.css$/,
        use: [
          'style-loader',
          'css-loader'
        ]
      },
      {
        test: /\.(jpg|jpeg|png|gif|svg)$/,
        use: [
          {
            loader: 'url-loader', // 依赖于file-loader,将图片转化成base64的代码，直接写在js内容里而不用生成新的文件，减少http请求
            options: {
              limit: 1024,
              name: '[name]-aaa.[ext]'
            }
          }
        ]
      },
      {
        test: /\.styl/,
        use: [
          'style-loader',
          'css-loader',
          {
            loader: 'postcss-loader',
            options: {
              sourceMap: true
            }
          },
          'stylus-loader'
        ]
      }
    ]
  },
  // plugins - 处理loader之外的其他任何需求
  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: isDev ? '"development"' : '"production"'
      }
    }),
    new VueLoaderPlugin(),
    new HTMLPlugin()
  ],
}

if(isDev) {
  config.devtool = '#cheap-module-eval-source-map'
  config.devServer = {
    port: 8000,
    host: '0.0.0.0',
    overlay: {
      errors: true,
    },
    hot: true,  // 至渲染当前主页面
    open: false  // 是否启动打开新页面
  }
  config.plugins.push(
    new webpack.HotModuleReplacementPlugin(), //HMR - 热替换模块
    new webpack.NoEmitOnErrorsPlugin()
  )
}

module.exports = config