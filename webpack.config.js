const webpackMerge = require('webpack-merge');
const commonConfig = require('./configs/webpack.common.config');
const configs = {
    dev: require('./configs/webpack.dev.config'),
};
const fs = require("fs")
const path = require('path');

const config = () => {
    process.env.BABEL_ENV = 'development';
    process.env.NODE_ENV = 'development';

    const distPath = path.resolve(__dirname, "dist");
    const distChromePath = path.resolve(__dirname, "dist", "chrome");
    if (!fs.existsSync(distPath)) {
        fs.mkdirSync(distPath);
        fs.mkdirSync(distChromePath);
    } else {
        if (!fs.existsSync(distChromePath)) {
            fs.mkdirSync(distChromePath);
        }
    }

    const files = ["manifest.json", "favicon.ico"];
    for (let file of files) {
        fs.copyFile(
            path.resolve(__dirname, "configs", "_raw", file),
            path.resolve(__dirname, "dist", "chrome", file),
            (err) => { });
    }

    let stuff = webpackMerge.merge(commonConfig(), configs["dev"]);
    return stuff;
};
module.exports = config;
