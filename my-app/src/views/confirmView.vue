<template>
  <info-popup ref="info" />
  <loading-popup v-if="isLoading == true" />
</template>

<script>
import infoPopup from "../components/infoPopup.vue";
import loadingPopup from "../components/loadingPopup.vue";
export default {
  components: {
    infoPopup,
    loadingPopup,
  },
  data() {
    return {
      infoVisiable: false,
      isLoading: false,
    };
  },
  async mounted() {
    try {
      if (this.isLoading == true) return;
      this.isLoading = true;
      let form = {};
      form.key = this.$route.params.key;

      let res = await this.$api.auth.confirm(form);
      this.isLoading = false;
      let responseMessage = res?.data?.message;
      this.showInfoPopup("Подтверждение", responseMessage);
    } catch (err) {
      let status = err?.response?.status;
      let message = err?.response?.data?.message;
      this.isLoading = false;

      if (status == 400 || status == 404) {
        this.showInfoPopup("Подтверждение", message);
        return;
      }
      let responseMessage = "Сервер не отвечает";
      this.showInfoPopup("Подтверждение", responseMessage);
    }
  },
  methods: {
    async updateInfo() {
      try {
        if (this.isLoading == true) return;
        this.isLoading = true;

        let res = await this.$api.auth.checkAuth();
        let user = res?.data?.user;
        let token = res?.data?.token;

        this.isLoading = false;

        this.$store.commit("setUserInfo", user);
        this.$store.commit("setAccessToken", token);
      } catch (err) {
        this.isLoading = false;
        this.$store.commit("resetAuth");
      }
    },
    async showInfoPopup(header, title) {
      await this.$refs.info.show(header, title);
      await this.updateInfo();
      this.redirect();
    },
    redirect() {
      this.$router.push({ name: "home" });
    },
  },
};
</script>

<style></style>
