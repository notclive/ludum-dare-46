const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');

module.exports = {
    entry: './src/index.ts',
    module: {
        rules: [
            {
                test: /\.ts$/,
                use: 'ts-loader',
                exclude: /node_modules/,
            },
            {
                test: /\.css$/i,
                use: ['style-loader', 'css-loader'],
            },
            {
              test: [/\.vert$/, /\.frag$/],
              use: "raw-loader"
            },
            {
              test: /\.(gif|png|jpe?g|svg|xml|webp|mp3)$/i,
              use: "file-loader"
            }
        ],
    },
    resolve: {
        extensions: ['.ts', '.js'],
    },
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'dist'),
    },
    devServer: {
        contentBase: path.resolve(__dirname, 'dist'),
    },
    plugins: [
        new HtmlWebpackPlugin({
            title: 'snowball\'s day in'
        }),
        new webpack.DefinePlugin({
          CANVAS_RENDERER: JSON.stringify(true),
          WEBGL_RENDERER: JSON.stringify(true)
        }),
    ]
};
