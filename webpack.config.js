const dotEnv = require('dotenv');
dotEnv.config();

const path = require('path');
const nodeExternals = require('webpack-node-externals');
const copyWebpackPlugin = require('copy-webpack-plugin');
const startServerPlugin = require('start-server-webpack-plugin');
const webpack = require('webpack');

const serverConfig = {
  mode: process.env.WEBPACK_SERVE ? 'development' : 'production',

  target: 'node',
  watch: false,
  entry: [
    './src/app.js'
  ],
  output: {
    path: path.resolve(__dirname, 'build'),
    filename: 'app.bundle.js'
  },
  externals: [nodeExternals({
    whitelist: ['webpack/hot/poll?1000']
  })],
  plugins: [
  ]
};

if (process.env.SPACEBLAZER_ENV == "development") {
  console.log("******* Including development plugins *******")
  serverConfig["plugins"].push(
    new startServerPlugin({
      name: 'app.bundle.js'
    }),
  );
  serverConfig["plugins"].push(
    new webpack.HotModuleReplacementPlugin()
  );
  serverConfig["watch"] = true;
  serverConfig["entry"].push('webpack/hot/poll?1000');
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
