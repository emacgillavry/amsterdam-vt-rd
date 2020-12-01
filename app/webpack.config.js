const merge = require("webpack-merge");
const parts = require("./webpack.parts");
const HtmlPlugin = require("html-webpack-plugin");
const CopyPlugin = require("copy-webpack-plugin");
const {CleanWebpackPlugin} = require("clean-webpack-plugin");
const path = require("path");

const commonConfig = merge([
    parts.loadJavaScript({
        include: [
            path.resolve(__dirname, "src"),
            path.resolve(__dirname, "node_modules/@mapbox"),
            path.resolve(__dirname, "node_modules/ol-mapbox-style")
        ],
        exclude: /node_modules[\\/](?!(@mapbox|ol-mapbox-style)[\\/]).*/,
    }),
    {
        node: {fs: "empty"},
        output: {
            filename: "assets/scripts/[name].js",
        },
        plugins: [
            new CleanWebpackPlugin(),
            new CopyPlugin([
                {from: "src/data",
                to: "data"}
            ]),
            new HtmlPlugin({
                template: __dirname + "/index.html",
                favicon: "src/images/favicon.ico",
                minify: {
                    removeScriptTypeAttributes: true,
                    removeComments: true,
                    removeRedundantAttributes: true,
                    removeScriptTypeAttributes: true,
                    removeStyleLinkTypeAttributes: true,
                    useShortDoctype: true
                },
            }),
        ],
    }
]);

const productionConfig = merge([
    parts.extractCSS({
        use: "css-loader",
    }),
]);

const developmentConfig = merge([
    parts.devServer({
      // Customize host/port here if needed
      host: process.env.HOST,
      port: process.env.PORT,
    }),
    parts.loadCSS(),
    {
        devtool: "source-map",
    }
  ])

module.exports = mode => {
    if (mode === "production") {
      return merge(commonConfig, productionConfig, { mode });
    }
    return merge(commonConfig, developmentConfig, { mode });
  };