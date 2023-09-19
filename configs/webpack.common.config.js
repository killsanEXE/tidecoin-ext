const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ESLintWebpackPlugin = require('eslint-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const path = require('path');
const fs = require('fs');
const getCSSModuleLocalIdent = require('react-dev-utils/getCSSModuleLocalIdent');
const cssRegex = /\.css$/;
const cssModuleRegex = /\.module\.css$/;
const sassRegex = /\.(scss|sass)$/;
const sassModuleRegex = /\.module\.scss$/;
const WasmModuleWebpackPlugin = require('wasm-module-webpack-plugin');
const { getBrowserPaths } = require('./paths');

const config = () => {
    const paths = getBrowserPaths("chrome");
    const shouldUseSourceMap = false;
    const isEnvDevelopment = true;
    const isEnvProduction = false;
    const shouldUseReactRefresh = false;
    const hasJsxRuntime = (() => {
        if (process.env.DISABLE_NEW_JSX_TRANSFORM === 'true') {
            return false;
        }

        try {
            require.resolve('react/jsx-runtime');
            return true;
        } catch (e) {
            return false;
        }
    })();

    const getStyleLoaders = (cssOptions, preProcessor) => {
        const loaders = [
            isEnvDevelopment && require.resolve('style-loader'),
            isEnvProduction &&
            {
                loader: MiniCssExtractPlugin.loader,
                options: paths.publicUrlOrPath.startsWith('.') ? { publicPath: '../../' } : {}
            },
            {
                loader: require.resolve('css-loader'),
                options: cssOptions
            },
            {
                loader: require.resolve('postcss-loader'),
                options: {
                    postcssOptions: {
                        ident: 'postcss',
                        config: false,
                        plugins: [
                            'postcss-flexbugs-fixes',
                            ['postcss-preset-env', { autoprefixer: { flexbox: 'no-2009' }, stage: 3 }],
                            'postcss-normalize'
                        ]
                    },
                    sourceMap: isEnvProduction ? shouldUseSourceMap : isEnvDevelopment
                }
            },
            {
                loader: require.resolve('sass-loader'),
                options: {
                    sourceMap: isEnvProduction ? shouldUseSourceMap : isEnvDevelopment,
                }
            }
        ].filter(Boolean);
        return loaders;
    };

    const config = {
        entry: {
            background: paths.rootResolve('src/background/index.ts'),
            'content-script': paths.rootResolve('src/content-script/index.ts'),
            pageProvider: paths.rootResolve('src/content-script/pageProvider/index.ts'),
            ui: paths.rootResolve('src/ui/index.tsx')
        },
        output: {
            path: paths.dist,
            filename: '[name].js',
            publicPath: '/',
            globalObject: 'this'
        },
        resolve: {
            alias: {
                '@': path.resolve(__dirname, "..", 'src/'),
            },
            extensions: [".ts", ".tsx", ".js", ".jsx"]
        },
        module: {
            rules: [
                shouldUseSourceMap && {
                    enforce: 'pre',
                    exclude: /@babel(?:\/|\\{1,2})runtime/,
                    test: /\.(js|mjs|jsx|ts|tsx|css)$/,
                    loader: require.resolve('source-map-loader')
                },
                {
                    oneOf: [
                        {
                            test: /\.(js|mjs|jsx|ts|tsx)$/,
                            include: paths.appSrc,
                            loader: require.resolve('babel-loader'),
                            options: {
                                customize: require.resolve('babel-preset-react-app/webpack-overrides'),
                                presets: [
                                    [
                                        require.resolve('babel-preset-react-app'),
                                        {
                                            runtime: hasJsxRuntime ? 'automatic' : 'classic'
                                        }
                                    ]
                                ],

                                plugins: [isEnvDevelopment && shouldUseReactRefresh && require.resolve('react-refresh/babel')].filter(
                                    Boolean
                                ),
                                cacheDirectory: true,
                                cacheCompression: false,
                                compact: isEnvProduction
                            }
                        },
                        {
                            test: /\.(js|mjs)$/,
                            exclude: /@babel(?:\/|\\{1,2})runtime/,
                            loader: require.resolve('babel-loader'),
                            options: {
                                babelrc: false,
                                configFile: false,
                                compact: false,
                                presets: [[require.resolve('babel-preset-react-app/dependencies'), { helpers: true }]],
                                cacheDirectory: true,
                                cacheCompression: false,

                                sourceMaps: shouldUseSourceMap,
                                inputSourceMap: shouldUseSourceMap
                            }
                        },
                        {
                            test: cssRegex,
                            exclude: cssModuleRegex,
                            use: getStyleLoaders({
                                importLoaders: 1,
                                sourceMap: isEnvProduction ? shouldUseSourceMap : isEnvDevelopment,
                                modules: {
                                    mode: 'icss'
                                }
                            }),
                            sideEffects: true
                        },
                        {
                            test: cssModuleRegex,
                            use: getStyleLoaders({
                                importLoaders: 1,
                                sourceMap: isEnvProduction ? shouldUseSourceMap : isEnvDevelopment,
                                modules: {
                                    mode: 'local',
                                    getLocalIdent: getCSSModuleLocalIdent
                                }
                            })
                        },
                        {
                            test: sassRegex,
                            exclude: sassModuleRegex,
                            use: getStyleLoaders(
                                { importLoaders: 3, sourceMap: isEnvProduction },
                                'sass-loader'
                            ),
                            sideEffects: true,
                        },
                        {
                            test: sassRegex,
                            exclude: sassModuleRegex,
                            use: getStyleLoaders(
                                {
                                    importLoaders: 3,
                                    sourceMap: isEnvProduction ? shouldUseSourceMap : isEnvDevelopment,
                                    modules: {
                                        mode: 'icss'
                                    }
                                },
                                'sass-loader'
                            ),
                            sideEffects: true
                        },
                        {
                            exclude: [/^$/, /\.(js|mjs|jsx|ts|tsx)$/, /\.html$/, /\.json$/],
                            type: 'asset/resource'
                        },
                        {
                            test: /\.m?js$/,
                            include: [path.join(paths.appNodeModules, 'tiny-secp256k1')],
                            use: {
                                loader: 'babel-loader',
                                options: {
                                    presets: ['@babel/preset-env'],
                                    plugins: [
                                        '@babel/plugin-syntax-dynamic-import',
                                        WasmModuleWebpackPlugin.BabelPlugin
                                    ]
                                }
                            }
                        }
                    ]
                }
            ].filter(Boolean)
        },
        plugins: [
            new ESLintWebpackPlugin({
                extensions: ['ts', 'tsx', 'js', 'jsx']
            }),
            new HtmlWebpackPlugin({
                inject: true,
                template: paths.notificationHtml,
                chunks: ['ui'],
                filename: 'notification.html'
            }),
            new HtmlWebpackPlugin({
                inject: true,
                template: paths.indexHtml,
                chunks: ['ui'],
                filename: 'index.html'
            }),
            new HtmlWebpackPlugin({
                inject: true,
                template: paths.backgroundHtml,
                chunks: ['background'],
                filename: 'background.html'
            }),
            new webpack.ProvidePlugin({
                Buffer: ['buffer', 'Buffer']
            }),
            new MiniCssExtractPlugin({
                filename: 'static/css/[name].css',
                chunkFilename: 'static/css/[name].chunk.css'
            }),
            new WasmModuleWebpackPlugin.WebpackPlugin()
        ],
        stats: 'minimal',
        experiments: {
            asyncWebAssembly: true
        }
    };
    config.module.rules = config.module.rules.map((rule) => {
        if (rule.oneOf instanceof Array) {
            return {
                ...rule,
                oneOf: [{ test: /\.wasm$/, type: 'webassembly/async' }, ...rule.oneOf]
            };
        }
        return rule;
    });
    return config;
};

module.exports = config;
