<template>
  <div class="responceMessage__container">
    <div class="responceMessage">{{ responceMessage }}</div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      responceMessage: "account has been confirmed successfully!",
    };
  },
  mounted() {
    let form = {};
    form.id = this.$route.params.id;
    console.log(form);
    this.$api.auth
      .confirm(form)
      .then((res) => {
        this.responceMessage = res.data.message;
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
          this.responseMessage = message;
          return;
        }
        if (err.response.status == 404) {
          this.responceMessage = err.response.data.message;
        }
        this.responseMessage = "Сервер не отвечает";
      });
  },
};
</script>

<style>
.responceMessage__container {
  display: flex;
  margin: 0 auto;
  max-width: 1000px;
}
.responceMessage {
  margin: 40px auto;
  font-size: 5vw;
  font-family: antique;
  text-align: center;
}
</style>
