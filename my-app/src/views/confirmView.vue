<template>
  <info-popup ref="info" />
</template>

<script>
import infoPopup from "../components/infoPopup.vue";
export default {
  components: {
    infoPopup,
  },
  data() {
    return {
      infoVisiable: false,
    };
  },
  mounted() {
    let form = {};
    form.key = this.$route.params.key;
    console.log(form);
    this.$api.auth
      .confirm(form)
      .then((res) => {
        let responseMessage = res.data.message;
        this.showInfoPopup("Подтверждение", responseMessage);
      })
      .catch((err) => {
        if (err.response.status == 400) {
          this.showInfoPopup("Подтверждение", err.response.data.message);
          return;
        }
        if (err.response.status == 404) {
          this.showInfoPopup("Подтверждение", err.response.data.message);
        }
        let responseMessage = "Сервер не отвечает";
        this.showInfoPopup("Подтверждение", responseMessage);
      });
  },
  methods: {
    updateInfo() {
      this.$api.auth
        .checkAuth()
        .then((res) => {
          let user = res.data.user;
          let token = res.data.token;
          this.$store.commit("setUserInfo", user);
          this.$store.commit("setAccessToken", token);
        })
        .catch(() => {
          this.$store.commit("resetAuth");
        });
    },
    async showInfoPopup(header, title) {
      await this.$refs.info.show(header, title);
      this.updateInfo();
      this.redirect();
    },
    redirect() {
      this.$router.push({ name: "home" });
    },
  },
};
</script>

<style></style>
