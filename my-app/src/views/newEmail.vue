<template>
  <info-popup ref="info" />
  <loading-popup v-if="isLoading == true" />
  <div class="newEmail">
    <div class="newEmail__container">
      <div class="sign__container">
        <h1 class="sign__header">Новый Email</h1>
        <p class="sign__description">Укажите новый email и свой пароль</p>
        <div class="sign__inputIconContainer">
          <input-tooltip-icon
            v-model="email"
            type="text"
            field="email"
            icon="email.png"
            placeholder="Email"
            fontSize="14"
            :errors="errors"
            @keyup.enter="checkData"
          />
        </div>
        <div class="sign__inputIconContainer">
          <input-tooltip-icon
            v-model="password"
            type="password"
            field="password"
            icon="house-key.png"
            placeholder="Password"
            fontSize="14"
            :errors="errors"
            @keyup.enter="checkData"
          />
        </div>

        <!-- RESPONSE -->
        <p class="sign__infoMessage">{{ responseMessage }}</p>

        <div class="newEmail__confirmContainer">
          <confirm-button text="Подтвердить" @click="checkData" fontSize="14" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import inputTooltipIcon from "../components/inputTooltipIcon.vue";
import confirmButton from "../components/confirmButton.vue";
import infoPopup from "../components/infoPopup.vue";
import loadingPopup from "../components/loadingPopup.vue";
export default {
  components: { inputTooltipIcon, confirmButton, infoPopup, loadingPopup },
  data() {
    return {
      email: "",
      password: "",
      errors: {},
      responseMessage: "",
      isLoading: false,
    };
  },
  computed: {
    key() {
      return this.$route.params.key;
    },
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
    validateField(field, fieldData) {
      if (this.errors[field]) {
        switch (field) {
          case "password":
            if (fieldData.length < 8) {
              this.errors[field] =
                "Пароль должен состоять не менее, чем из 8 символов!";
              return;
            }
            break;
          case "email":
            if (
              !/^[a-z0-9][a-z0-9-_.]+@([a-z]|[a-z0-9]?[a-z0-9-]+[a-z0-9]).[a-z0-9]{2,10}(?:.[a-z]{2,10})?$/.test(
                fieldData.toLowerCase()
              )
            ) {
              this.errors[field] = "Неверный формат введенного Email!";
              return;
            }
            break;
        }
        delete this.errors[field];
      }
    },
    validateForm(form) {
      this.errors = {};
      Object.keys(form).forEach((field) => {
        let fieldData = form[field];
        switch (field) {
          case "password":
            if (fieldData.length < 8) {
              this.errors[field] =
                "Пароль должен состоять не менее, чем из 8 символов!";
              return;
            }
            break;
          case "email":
            if (
              !/^[a-z0-9][a-z0-9-_.]+@([a-z]|[a-z0-9]?[a-z0-9-]+[a-z0-9]).[a-z0-9]{2,10}(?:.[a-z]{2,10})?$/.test(
                fieldData.toLowerCase()
              )
            ) {
              this.errors[field] = "Неверный формат введенного Email!";
              return;
            }
            break;
        }
      });
    },
    checkData() {
      this.responseMessage = "";
      let form = {
        password: this.password,
        email: this.email.toLowerCase(),
      };

      this.validateForm(form);

      if (Object.keys(this.errors).length === 0) {
        this.sendData({
          password: form.password,
          email: form.email,
          key: this.key,
        });
      } else {
        console.log(this.errors);
      }
    },
    async showInfo(header, title) {
      await this.$refs.info.show(header, title);
      await this.updateInfo();
      this.redirect();
    },
    async sendData(form) {
      try {
        if (this.isLoading == true) return;
        this.isLoading = true;

        let res = await this.$api.change.email(form);
        this.isLoading = false;
        this.showInfo("Смена Email", res?.data?.message);
      } catch (err) {
        let status = err?.response?.status;
        let message = err?.response?.data?.message;
        this.isLoading = false;
        if (status == 400) {
          this.responseMessage = message;
          return;
        }
        console.log(err);
        this.responseMessage = "Сервер не отвечает";
      }
    },
    redirect() {
      this.$router.push({ name: "home" });
    },
  },
  watch: {
    password() {
      this.validateField("password", this.password);
    },
    email() {
      this.validateField("email", this.email);
    },
  },
};
</script>

<style>
.newEmail {
  display: flex;
}
.newEmail__container {
  margin: 50px auto;
  background: linear-gradient(-42deg, #e7fcf5 50%, #fce5f9 50%);
  display: flex;
  flex-direction: column;
  width: 345px;
}
.newEmail__confirmContainer {
  margin-top: 16px;
}
</style>
