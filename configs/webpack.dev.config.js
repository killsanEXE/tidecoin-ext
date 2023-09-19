const webpack = require('webpack');

const config = {
    mode: 'development',
    devtool: 'inline-cheap-module-source-map',
    watch: true,
    watchOptions: {
        ignored: ['**/public', '**/node_modules'],
        followSymlinks: false
    },
    plugins: [
        new webpack.DefinePlugin({
            'process.env.BUILD_ENV': JSON.stringify('DEV'),
            'process.env.DEBUG': true,
        })
    ]
};

module.exports = config;
