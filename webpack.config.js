const path = require('path');

module.exports = {
    mode: "production",
    entry: {
            index: './src/main.js'
        },
    output: {
        filename: "index.js",
        path: path.resolve(__dirname, "build"),
        // libraryTarget: "umd",
        // library: "Payper",
        // umdNamedDefine: true,
    },    
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                include: path.resolve(__dirname, 'src'),
                exclude: /(node_modules|dist)/,
                use: ['babel-loader']
            },
            {
                test: /\.(png|jpe?g|gif|svg)$/i,
                include: path.resolve(__dirname, 'src'),
                exclude: /(node_modules|dist)/,
                use: ['file-loader'],
            },
            {
                test: /\.css$/,
                use: ['style-loader','css-loader']
            }
        ],
    },
}