const path = require('path');
const fs = require('fs');
const appRoot = fs.realpathSync(process.cwd());
const rootResolve = path.resolve.bind(path, appRoot);
const buildPath = 'dist';

function getBrowserPaths(browser) {
    let ret = {
        root: appRoot,
        src: rootResolve('src'),
        indexHtml: rootResolve('_raw/index.html'),
        notificationHtml: rootResolve('_raw/notification.html'),
        backgroundHtml: rootResolve('src/background/background.html'),
        dist: rootResolve('dist/' + browser),
        rootResolve,
        appPath: rootResolve('.'),
        appBuild: rootResolve(buildPath),
        appPublic: rootResolve('public'),
        appHtml: rootResolve('public/index.html'),
        appPackageJson: rootResolve('package.json'),
        appSrc: rootResolve('src'),
        appTsConfig: rootResolve('tsconfig.json'),
        appNodeModules: rootResolve('node_modules'),
        appWebpackCache: rootResolve('node_modules/.cache'),
        appTsBuildInfoFile: rootResolve('node_modules/.cache/tsconfig.tsbuildinfo')
        // publicUrlOrPath,
    };
    return ret;
}

module.exports = {
    getBrowserPaths
};
