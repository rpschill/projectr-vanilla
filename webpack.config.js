const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');

module.exports = {
    mode: 'development',
    entry: './src/index.js',
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'bundle.js',
        clean: true
    },
    module: {
        rules: [
            {
                test: /\.html$/i,
                loader: 'html-loader'
            },
            {
                test: /\.css$/i,
                use: ['style-loader', 'css-loader']
            },
            {
                test: /\.(woff|woff2|eot|ttf|otf)$/i,
                type: 'asset/resource'
            }
        ]
    },
    devtool: 'inline-source-map', 
    plugins: [
        new HtmlWebpackPlugin({
            title: 'projectr | simple project, task, and time management',
            template: './src/index.html',
            filename: 'index.html'
        })
    ],
    performance: {
        maxEntrypointSize: 400000
    }
}