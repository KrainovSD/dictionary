<template>
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
          />
        </div>

        <!-- RESPONSE -->
        <p class="sign__infoMessage">{{ responseMessage }}</p>

        <button class="sign__logInButton" ref="confirm" @click.stop="sendData">
          Отправить
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import inputTooltipIcon from "../components/inputTooltipIcon.vue";
export default {
  components: { inputTooltipIcon },
  data() {
    return {
      password: "",
      repeatPassword: "",
      errors: {},
      key: "",
      responseMessage: "",
    };
  },
  mounted() {
    this.key = this.$route.params.key;
  },

  methods: {
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
    sendData() {
      let confirm = this.$refs.confirm;
      if (!confirm.classList.contains("_active")) {
        confirm.classList.toggle("_active");

        let form = {
          password: this.password,
          repeatPassword: this.repeatPassword,
        };

        this.validateForm(form);

        if (Object.keys(this.errors).length === 0) {
          setTimeout(() => {
            confirm.classList.toggle("_active");
            console.log("OK");
          }, 300);
        } else {
          console.log(this.errors);
          setTimeout(() => {
            confirm.classList.toggle("_active");
          }, 300);
        }
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

<style></style>
