var webpack = require('webpack');

module.exports = {
    entry: {
        'app': './assets/app/main.polymer.ts'
    },

    resolve: {
        extensions: ['.js', '.ts']
    },

    module: {
        loaders: [
            {
                test: /\.ts$/,
                loaders: [
                    'awesome-typescript-loader',
                    'angular2-template-loader',
                    'angular2-router-loader'
                ]
            },
            {
                test: /\.html$/,
                loader: 'html'
            },
            {
                test: /\.css$/,
                loader: 'raw'
            },
            {
                test: /\.(jpe?g|jpg|png|gif|svg)/i,
                loader: 'file'
            }
        ]
    },

    plugins: [
        new webpack.ContextReplacementPlugin(
            // The (\\|\/) piece accounts for path separators in *nix and Windows
            /angular(\\|\/)core(\\|\/)(esm(\\|\/)src|src)(\\|\/)linker/,
            './src' // location of your src
        ),
        new webpack.LoaderOptionsPlugin({
            options: {
                htmlLoader: {
                    attrs: ['paper-card:image']
                }
            }
        })
    ]
};