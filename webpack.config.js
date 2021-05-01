module.exports = {
    entry: {
      app: './assets/global.js',
      login: './assets/login.js',
      signup: './assets/signup.js',
      contact: './assets/contact.js',
      dashboard: './assets/dashboard.js',
      dashboardview: './assets/dashboard-view.js',
      dashboardlist: './assets/dashboard-list.js'
    },
    output: {
      filename: '[name].js',
      path: __dirname + '/dist',
    },
    mode: 'development',
    target: 'web',
    module: {
        rules: [
          {
            test: /\.css$/,
            use: [
              'style-loader',
              'css-loader',
            ],
          },
          {
            test: /\.(png|jpe?g|gif)$/i,
            use: [
              {
                loader: 'file-loader',
                options: {
                    name: 'img/[name].[ext]',
                },
              },
            ],
          },
          {
            test: /\.(woff(2)?|ttf|eot|svg)(\?v=\d+\.\d+\.\d+)?$/,
            use: [
              {
                loader: 'file-loader',
                options: {
                  name: '[name].[ext]',
                  outputPath: 'fonts/'
                }
              }
            ]
          }
        ],
      },
  };
