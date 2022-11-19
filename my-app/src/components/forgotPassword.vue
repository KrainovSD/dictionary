<template>
  <div class="modal__backDrop" style="z-index: 6" ref="backDrop">
    <div class="forgotPassword">
      <img
        src="@/assets/close.png"
        alt=""
        class="sign__closeButton"
        @click.stop="closePopup"
      />
      <div class="sign__container">
        <h1 class="sign__header">Восстановление пароля</h1>
        <p class="sign__description">Укажите свой Nickname и Email</p>
        <div class="sign__inputIconContainer">
          <input-tooltip-icon
            v-model="nickName"
            type="text"
            field="nickName"
            icon="user.png"
            placeholder="NickName"
            fontSize="14"
            :errors="errors"
          />
        </div>
        <div class="sign__inputIconContainer">
          <input-tooltip-icon
            v-model="email"
            type="text"
            field="email"
            icon="email.png"
            placeholder="Email"
            fontSize="14"
            :errors="errors"
          />
        </div>

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
  components: {
    inputTooltipIcon,
  },
  data() {
    return {
      nickName: "",
      email: "",
      errors: {},
    };
  },

  methods: {
    closePopup() {
      if (!this.$refs.backDrop.classList.contains("close")) {
        this.$refs.backDrop.classList.toggle("close");
        setTimeout(() => {
          this.$refs.backDrop.classList.toggle("close");
          this.$emit("close");
        }, 300);
      }
    },
    validateForm(form) {
      this.errors = {};
      Object.keys(form).forEach((field) => {
        let fieldData = form[field];
        switch (field) {
          case "nickName":
            if (!/^([A-Za-z0-9_]+)$/.test(fieldData)) {
              this.errors[field] =
                "NickName должнен состоять только из латинских букв, цифр или символа нижнего подчеркивания!";
              return;
            }
            if (fieldData.length < 3 && fieldData.length > 25) {
              this.errors[field] =
                "Длина NickName не должна превышать 25 символов или быть меньше, чем 3 символа!";
              return;
            }
            break;
          case "email":
            if (
              !/^[a-z0-9][a-z0-9-_.]+@([a-z]|[a-z0-9]?[a-z0-9-]+[a-z0-9]).[a-z0-9]{2,10}(?:.[a-z]{2,10})?$/.test(
                fieldData
              )
            ) {
              this.errors[field] = "Неверный формат введенного Email!";
              return;
            }
            break;
        }
      });
    },
    validateField(field, fieldData) {
      if (this.errors[field]) {
        switch (field) {
          case "nickName":
            if (!/^([A-Za-z0-9_]+)$/.test(fieldData)) {
              this.errors[field] =
                "NickName должнен состоять только из латинских букв, цифр или символа нижнего подчеркивания!";
              return;
            }
            if (fieldData.length < 3 && fieldData.length > 25) {
              this.errors[field] =
                "Длина NickName не должна превышать 25 символов или быть меньше, чем 3 символа!";
              return;
            }
            break;
          case "email":
            if (
              !/^[a-z0-9][a-z0-9-_.]+@([a-z]|[a-z0-9]?[a-z0-9-]+[a-z0-9]).[a-z0-9]{2,10}(?:.[a-z]{2,10})?$/.test(
                fieldData
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
    sendData() {
      let confirm = this.$refs.confirm;
      if (!confirm.classList.contains("_active")) {
        confirm.classList.toggle("_active");
        let form = {
          nickName: this.nickName,
          email: this.email,
        };

        this.validateForm(form);
        if (Object.keys(this.errors).length === 0) {
          setTimeout(() => {
            confirm.classList.toggle("_active");
            this.$emit("send", form);
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
    nickName() {
      this.validateField("nickName", this.nickName);
    },
    email() {
      this.validateField("email", this.email);
    },
  },
};
</script>

<style></style>
