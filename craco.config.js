const WorkerPlugin = require('worker-plugin');

module.exports = {
  devServer: {
    publicPath: '/',
    hot: true,
    headers: {
      'Cross-Origin-Opener-Policy': 'same-origin',
      'Cross-Origin-Embedder-Policy': 'require-corp',
      'Cross-Origin-Resource-Policy': 'cross-origin',
    },
  },
  webpack: {
    configure: (webpackConfig) => {
      webpackConfig.plugins.push(new WorkerPlugin());

      webpackConfig.module.rules = [
        {
          test: /\.wasm$/,
          type: 'javascript/auto',
        },
        {
          test: /\/worker\.ts$/,
          use: {
            loader: 'worker-loader',
            options: {
              inline: true,
            },
          },
        },
        {
          test: /\.worker\.ts$/,
          use: {
            loader: 'worker-loader',
            options: {
              // Use directory structure & typical names of chunks produces by "react-scripts"
              filename: 'static/js/[name].[contenthash:8].js',
            },
          },
        },

        ...webpackConfig.module.rules,
      ];

      webpackConfig.module = {
        ...webpackConfig.module,
        exprContextCritical: false,
      };
      return webpackConfig;
    },
  },
};
