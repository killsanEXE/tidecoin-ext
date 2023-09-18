const webpackMerge = require('webpack-merge');
const commonConfig = require('./configs/webpack.common.config');
const configs = {
    dev: require('./configs/webpack.dev.config'),
};

const config = (env) => {
    return webpackMerge.merge(commonConfig(env), "development");
};

module.exports = config;
