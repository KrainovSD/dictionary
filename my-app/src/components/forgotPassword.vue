<template>
  <info-popup ref="info" />
  <loading-popup v-if="isLoading == true" />
  <div class="modal__backDrop" style="z-index: 6" ref="backDrop">
    <div class="forgotPassword">
      <close-modal-button @close="closePopup" class="sign__closeButton" />
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
            @keyup.enter="checkData"
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
            @keyup.enter="checkData"
          />
        </div>
        <p class="sign__infoMessage">{{ responseMessage }}</p>
        <div class="newPassword__confirmContainer">
          <confirm-button text="Отправить" @click="checkData" fontSize="14" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import inputTooltipIcon from "../components/inputTooltipIcon.vue";
import confirmButton from "../components/confirmButton.vue";
import closeModalButton from "../components/closeModalButton.vue";
import infoPopup from "../components/infoPopup.vue";
import loadingPopup from "../components/loadingPopup.vue";
export default {
  components: {
    inputTooltipIcon,
    confirmButton,
    closeModalButton,
    infoPopup,
    loadingPopup,
  },
  data() {
    return {
      nickName: "",
      email: "",
      errors: {},
      responseMessage: "",
      isLoading: false,
    };
  },

  methods: {
    async showInfo(header, title) {
      await this.$refs.info.show(header, title);
    },
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
            if (fieldData.length < 3 && fieldData.length > 16) {
              this.errors[field] =
                "Длина NickName не должна превышать 16 символов или быть меньше, чем 3 символа!";
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
            if (fieldData.length < 3 && fieldData.length > 16) {
              this.errors[field] =
                "Длина NickName не должна превышать 16 символов или быть меньше, чем 3 символа!";
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
    checkData() {
      this.responseMessage = "";
      let form = {
        nickName: this.nickName,
        email: this.email,
      };

      this.validateForm(form);

      if (Object.keys(this.errors).length === 0) {
        this.sendData(form);
      } else {
        console.log(this.errors);
      }
    },
    async sendData(form) {
      try {
        if (this.isLoading == true) return;
        this.isLoading = true;
        let res = await this.$api.user.forgot(form);
        let message = res?.data?.message || "";
        this.isLoading = false;
        await this.showInfo("Смена пароля", message);
        this.closePopup();
      } catch (err) {
        this.isLoading = false;
        if (err?.response?.status == 400) {
          this.responseMessage = err?.response?.data?.message;
          return;
        }
        console.log(err);
        this.responseMessage = "Сервер не отвечает";
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

<style>
.forgotPassword {
  margin: auto;
  background: linear-gradient(-42deg, #fce5f9 50%, #e7fcf5 50%);
  display: flex;
  flex-direction: column;
  width: 345px;
}
</style>
