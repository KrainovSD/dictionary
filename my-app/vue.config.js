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
process.env.VUE_APP_COUNT_WORDS_TO_ACTIVE_CATEGORY = 3;
process.env.VUE_APP_SYNC_SIGNATURE = "@mdfsakdmcx,234weds@";
