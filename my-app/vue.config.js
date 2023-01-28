const { defineConfig } = require("@vue/cli-service");
module.exports = defineConfig({
  transpileDependencies: true,
  pwa: {
    name: "Dictionary",
    appleMobileWebAppCapable: "yes",
    manifestOptions: {
      display: "fullscreen",
      name: "Dictionary",
      short_name: "Dictionary",
    },
  },
});
