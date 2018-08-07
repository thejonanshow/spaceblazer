const path = require('path');
const nodeExternals = require('webpack-node-externals');
const copyWebpackPlugin = require('copy-webpack-plugin');
const startServerPlugin = require('start-server-webpack-plugin');

const serverConfig = {
  mode: process.env.WEBPACK_SERVE ? 'development' : 'production',

  target: 'node',
  entry: {
    app: './src/server.js'
  },
  output: {
    path: path.resolve(__dirname, 'build'),
    filename: 'server.bundle.js'
  },
  externals: [nodeExternals()],
  plugins: [
    new startServerPlugin({
      name: 'server.bundle.js'
    })
  ]
};

const clientConfig = {
  mode: process.env.WEBPACK_SERVE ? 'development' : 'production',

  target: 'web',
  entry: {
    app: './src/client.js'
  },
  output: {
    path: path.resolve(__dirname, 'build'),
    filename: 'client.bundle.js'
  },

  module: {
    rules: [
      {
        test: /\.js$/,
        include: path.resolve(__dirname, 'src/'),
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['env']
          }
        }
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /\.(png|jp(e*)g|svg)$/,
        use: ["file-loader"]
      }
    ]
  },
  performance: { hints: false },
  plugins: [
    new copyWebpackPlugin([
      {
        from: 'src/index.html',
        to: 'index.html'
      }
    ])
  ]
};

module.exports = [serverConfig, clientConfig]
