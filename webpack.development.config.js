const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');

module.exports = {
    mode: 'development',
    entry: './src/client/index.js',
    devtool: 'inline-source-map',
    module: {
        rules: [
            {
                test: /\.scss$/i,
                use: [
                    // Creates `style` nodes from JS strings
                    'style-loader',
                    // Translates CSS into CommonJS
                    'css-loader',
                    // Compiles Sass to CSS
                    'sass-loader',
                ],
            },
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({
            title: 'Table Top Game',
        }),
        new webpack.ProvidePlugin({
            CANNON: 'cannon'
        }),
    ],
    devServer: {
        contentBase: path.join(__dirname, 'static')
    },
    output: {
        publicPath: '/'
    }
};
