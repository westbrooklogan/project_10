const path = require('path');

module.exports = {
    entry: "./src/server",
    output: {
        path: __dirname + '/dist',
        publicPath: __dirname + '/dist',
        filename: "bundle.js"
    },
    module: {
        rules: [
          {
            test: /\.(js|js)$/,
            exclude: /node_modules/,
            use: {
              loader: "babel-loader"
            }
          }
        ]
    },
    devServer: {
        contentBase: path.join(__dirname, 'dist'),
        compress: true,
        port: 9000
    }
}