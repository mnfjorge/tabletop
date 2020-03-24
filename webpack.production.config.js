const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const webpack = require('webpack');

module.exports = {
    mode: 'production',
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
        new CopyPlugin([
            { from: 'static', to: 'dist' },
        ]),
    ],
    output: {
        path: path.resolve(__dirname, 'dist'),
        publicPath: '/'
    }
};
