const path = require('path');
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
        new CopyPlugin({
            patterns: [
              { from: 'public'}
            ],
          })
    ]
}