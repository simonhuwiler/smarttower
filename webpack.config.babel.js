import path from "path";
import HtmlWebpackPlugin from "html-webpack-plugin";
import ScriptExtHtmlWebpackPlugin from "script-ext-html-webpack-plugin";
import MiniCssExtractPlugin from "mini-css-extract-plugin";
const webpack = require('webpack');
const CopyPlugin = require('copy-webpack-plugin');

export default {
    entry: path.join(__dirname, 'src/index.js'),
    output: {
        path: path.join(__dirname, 'dist'),
        filename: '[name].bundle.js'
    },
    module: {
        rules: [
            {
                test: /\.js/,
                exclude: /(node_modules|bower_components)/,
                use: [{
                    loader: 'babel-loader'
                }]
            },
            {
                test: /\.css$/,
                use: [MiniCssExtractPlugin.loader, "css-loader"]
            },
            {
                test: /\.(png|jp(e*)g|gif|svg)$/,  
                use: [{
                    loader: 'url-loader',
                    options: { 
                        limit: 8000, // Convert images < 8kb to base64 strings
                        name: 'images/[hash]-[name].[ext]'
                    } 
                }]
            }
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({
            title: 'Custom template',
            template: path.join(__dirname, 'src/index.html')
        }),
        new ScriptExtHtmlWebpackPlugin({
            defaultAttribute: 'defer'
        }),
        new MiniCssExtractPlugin({
          filename: "[name].css",
          chunkFilename: "[id].css"
        }),
        new webpack.HotModuleReplacementPlugin(),
        new CopyPlugin([
            { from: 'public', to: './' },
            // { from: 'src/images/facebook.jpg', to: './images/facebook.jpg'}
          ])
    ],
    stats: {
        colors: true
    },
    devtool: 'source-map',
    mode:"development",
      devServer: {
              contentBase: './dist',
              inline: true,
              hot: true,
              port: 3000
      }
};