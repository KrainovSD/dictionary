const { defineConfig } = require("@vue/cli-service");
module.exports = defineConfig({
  transpileDependencies: true,
  pwa: {
    name: "KR Dictionary",
    themeColor: "#e7fcf5",
    msTileColor: "#f5f5f5", // цвет плитки
    appleMobileWebAppCapable: "yes",
    appleMobileWebAppStatusBarStyle: "#e7fcf5", // цвет стату бара
    assetsVersion: "1.0",
    manifestOptions: {
      display: "standalone",
      name: "KR Dictionary",
      short_name: "KR Dictionary",
      background_color: "#000000", // цвет рабочей области
      theme_color: "#e7fcf5", // цвет статус бара
      start_url: "/index.html",
      icons: [
        {
          src: "./img/icons/android-chrome-192x192.png",
          sizes: "192x192",
          type: "image/png",
        },
        {
          src: "./img/icons/android-chrome-512x512.png",
          sizes: "512x512",
          type: "image/png",
        },
        {
          src: "./img/icons/android-chrome-maskable-192x192.png",
          sizes: "192x192",
          type: "image/png",
          purpose: "maskable",
        },
        {
          src: "./img/icons/android-chrome-maskable-512x512.png",
          sizes: "512x512",
          type: "image/png",
          purpose: "maskable",
        },
      ],
    },
    iconPaths: {
      faviconSVG: "img/icons/favicon.svg",
      favicon32: "img/icons/favicon-32x32.png",
      favicon16: "img/icons/favicon-16x16.png",
      maskIcon: "img/icons/safari-pinned-tab.svg",
      msTileImage: "img/icons/msapplication-icon-144x144.png",
    },
    workboxOptions: {
      skipWaiting: true,
      clientsClaim: true,
    },
  },
});
process.env.VUE_APP_COUNT_WORDS_TO_ACTIVE_CATEGORY = 3;
process.env.VUE_APP_SYNC_SIGNATURE = "@mdfsakdmcx,234weds@";
