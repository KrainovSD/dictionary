<template>
  <info-popup
    v-if="infoVisiable == true"
    :infoTittle="infoTittle"
    :infoHeader="infoHeader"
    @close="
      this.infoVisiable = false;
      this.infoTittle = '';
      this.infoHeader = '';
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
    form.id = this.$route.params.id;
    console.log(form);
    this.$api.auth
      .confirm(form)
      .then((res) => {
        let responseMessage = res.data.message;
        this.showInfoPopup("Confirm", responseMessage);
      })
      .catch((err) => {
        if (err.response.status == 400) {
          let errors = err.response.data;
          let message = "";
          Object.values(errors).forEach((err) => {
            if (message == "") {
              message = `${err} \n`;
              return;
            }
            message += `${err} \n`;
          });
          let responseMessage = message;
          this.showInfoPopup("Confirm", responseMessage);
          return;
        }
        if (err.response.status == 404) {
          let responseMessage = err.response.data.message;
          this.showInfoPopup("Confirm", responseMessage);
        }
        let responseMessage = "Сервер не отвечает";
        this.showInfoPopup("Confirm", responseMessage);
      });
  },
  methods: {
    showInfoPopup(header, tittle) {
      this.infoHeader = header;
      this.infoTittle = tittle;
      this.infoVisiable = true;
    },
  },
};
</script>

<style></style>
