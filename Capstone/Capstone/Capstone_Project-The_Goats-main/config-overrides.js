const { override, addWebpackModuleRule } = require('customize-cra');

module.exports = override(
  addWebpackModuleRule({
    test: /\.html$/,
    use: [
      {
        loader: 'html-loader',
        options: {
          minimize: true,
        },
      },
    ],
  })
);