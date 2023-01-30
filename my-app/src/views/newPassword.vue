<template>
  <info-popup ref="info" />
  <loading-popup v-if="isLoading == true" />
  <div class="newPassword">
    <div class="newPassword__container">
      <div class="sign__container">
        <h1 class="sign__header">Новый пароль</h1>
        <p class="sign__description">Придумайте свой новый пароль</p>
        <div class="sign__inputIconContainer">
          <input-tooltip-icon
            v-model="password"
            type="passwordAdvice"
            field="password"
            icon="house-key.png"
            placeholder="Password"
            fontSize="14"
            :errors="errors"
            @keyup.enter="checkData"
          />
        </div>
        <div class="sign__inputIconContainer">
          <input-tooltip-icon
            v-model="repeatPassword"
            type="password"
            field="repeatPassword"
            icon="padlock.png"
            placeholder="Repeat Password"
            fontSize="14"
            :errors="errors"
            @keyup.enter="checkData"
          />
        </div>

        <!-- RESPONSE -->
        <p class="sign__infoMessage">{{ responseMessage }}</p>

        <div class="newPassword__confirmContainer">
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
      password: "",
      repeatPassword: "",
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
    async showInfo(header, title) {
      await this.$refs.info.show(header, title);
      await this.updateInfo();
      this.redirect();
    },
    redirect() {
      this.$router.push({ name: "home" });
    },
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
          case "repeatPassword":
            if (!(fieldData === this.password)) {
              this.errors[field] = "Пароли не совпадают!";
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
          case "repeatPassword":
            if (!(fieldData === form.password)) {
              this.errors[field] = "Пароли не совпадают!";
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
        repeatPassword: this.repeatPassword,
      };

      this.validateForm(form);

      if (Object.keys(this.errors).length === 0) {
        this.sendData({ password: form.password, key: this.key });
      }
    },
    async sendData(form) {
      try {
        if (this.isLoading == true) return;
        this.isLoading = true;

        let res = await this.$api.user.password(form);

        let message = res?.data?.message;
        this.isLoading = false;
        this.showInfo("Новый пароль", message);
      } catch (err) {
        let status = err?.response?.status;
        let message = err?.response?.data?.message;
        this.isLoading = false;
        if (status == 400) {
          this.responseMessage = message;
          return;
        }
        this.responseMessage = "Сервер не отвечает";
      }
    },
  },
  watch: {
    password() {
      this.validateField("password", this.password);
    },
    repeatPassword() {
      this.validateField("repeatPassword", this.repeatPassword);
    },
  },
};
</script>

<style>
.newPassword {
  display: flex;
}
.newPassword__container {
  margin: 50px auto;
  background: linear-gradient(-42deg, #e7fcf5 50%, #fce5f9 50%);
  display: flex;
  flex-direction: column;
  width: 345px;
}
.newPassword__confirmContainer {
  margin-top: 16px;
}
</style>
