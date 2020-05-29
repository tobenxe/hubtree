const path = require('path');
const  HtmlWebpackPlugin =  require('html-webpack-plugin');
const CopyPlugin = require("copy-webpack-plugin");

module.exports = {
    entry:'./index.js',
    optimization: {
        minimize: false
    },
    output : {
        path : path.resolve(__dirname , 'hubtree'),
        filename: 'main.js'
    },
    target: 'node',
    plugins:  [
        new HtmlWebpackPlugin ({
            template : './public/popup.html'
        }),
        new CopyPlugin({
            patterns: [
              { from: 'public'}
            ],
          })
    ]
}