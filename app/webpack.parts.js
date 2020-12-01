const MiniCssExtractPlugin = require("mini-css-extract-plugin");

exports.loadJavaScript = ({ include, exclude } = {}) => ({
  module: {
    rules: [
      {
        test: /\.js$/,
        include,
        exclude,
        use: "babel-loader",
      },
    ],
  },
});

exports.extractCSS = ({ include, exclude, use = [] }) => {
  // Output extracted CSS to a file
  const plugin = new MiniCssExtractPlugin({
    filename: "assets/styles/[name].css",
  });

  return {
    module: {
      rules: [
        {
          test: /\.css$/,
          include,
          exclude,

          use: [
            MiniCssExtractPlugin.loader,
          ].concat(use),
        },
      ],
    },
    plugins: [plugin],
  };
};

exports.loadCSS = ({ include, exclude } = {}) => ({
    module: {
      rules: [
        {
          test: /\.css$/,
          include,
          exclude,
          use: ["style-loader", "css-loader"],
        },
      ],
    },
});

exports.devServer = ({ host, port } = {}) => ({
    devServer: {
        // Display only errors to reduce the amount of output
        stats: "errors-only",
        // Defaults to localhost
        host,
        // Defaults to 8080
        port,
        // Open the page in browser
        open: true,
        // Capture compilation related warnings and errors
        overlay: true,
    },
  });