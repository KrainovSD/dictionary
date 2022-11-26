<template>
  <info-popup
    v-if="infoVisiable == true"
    :infoTittle="infoTittle"
    :infoHeader="infoHeader"
    @close="
      this.infoVisiable = false;
      this.infoTittle = '';
      this.infoHeader = '';
      updateInfo();
      redirect();
    "
  />
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
        this.showInfoPopup("Confirm", responseMessage);
      })
      .catch((err) => {
        if (err.response.status == 400) {
          this.showInfoPopup("Confirm", err.response.data.message);
          return;
        }
        if (err.response.status == 404) {
          this.showInfoPopup("Confirm", err.response.data.message);
        }
        let responseMessage = "Сервер не отвечает";
        this.showInfoPopup("Confirm", responseMessage);
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
    showInfoPopup(header, tittle) {
      this.infoHeader = header;
      this.infoTittle = tittle;
      this.infoVisiable = true;
    },
    redirect() {
      this.$router.push({ name: "home" });
    },
  },
};
</script>

<style></style>
