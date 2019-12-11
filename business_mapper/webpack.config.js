const HtmlWebPackPlugin = require("html-webpack-plugin");
const FaviconsWebpackPlugin = require('favicons-webpack-plugin');

module.exports = {
    module: {
      rules: [
        {
          test: /\.(js|js)$/,
          exclude: /node_modules/,
          use: {
            loader: "babel-loader"
          }
        },
        {
            test: /\.css$/i,
            use: ["style-loader", "css-loader"]
        },
        {
            test: /\.svg$/,
            use: {
                loader: "svg-inline-loader"
            }
        },
        {
          test: /\.html%/,
          use: {
            loader: "html-loader"
          }
        }
      ]
    },
    plugins: [
      new HtmlWebPackPlugin({
        template: "./public/index.html",
        filename: "./index.html"
      })
    ]
};  