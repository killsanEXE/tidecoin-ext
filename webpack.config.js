const webpackMerge = require('webpack-merge');
const commonConfig = require('./configs/webpack.common.config');
const configs = {
    dev: require('./configs/webpack.dev.config'),
};

const config = (env) => {
    let stuff = webpackMerge.merge(commonConfig(env), "development");
    return stuff;
};
module.exports = config;
