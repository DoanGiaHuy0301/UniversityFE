const { defineConfig } = require("@vue/cli-service");
module.exports = defineConfig({
  transpileDependencies: true,
  devServer: {
    port: 8083, // Cổng bạn muốn sử dụng
  },
  // chainWebpack: (config) => {
  //   config.module
  //     .rule("excel")
  //     .test(/\.(xlsx|xls|csv)$/)
  //     .use("file-loader")
  //     .loader("file-loader")
  //     .options({
  //       name: "assets/[name].[ext]", // Đảm bảo rằng tên file và định dạng được giữ nguyên
  //     })
  //     .end();
  // },
  // publicPath: process.env.BASE_URL || "/",
});
