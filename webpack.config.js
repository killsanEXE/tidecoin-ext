const webpackMerge = require('webpack-merge');
const commonConfig = require('./configs/webpack.common.config');
const configs = {
    dev: require('./configs/webpack.dev.config'),
};

const config = () => {
    process.env.BABEL_ENV = 'development'
    process.env.NODE_ENV = 'development'
    let stuff = webpackMerge.merge(commonConfig(), configs["dev"]);
    return stuff;
};
module.exports = config;
