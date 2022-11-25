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
export default {
  components: {
    inputTooltipIcon,
    confirmButton,
  },
  data() {
    return {
      nickName: "",
      email: "",
      errors: {},
      responseMessage: "",
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
    sendData(form) {
      this.$api.change
        .forgot(form)
        .then((res) => {
          if (!this.$refs.backDrop.classList.contains("close")) {
            this.$refs.backDrop.classList.toggle("close");
            setTimeout(() => {
              this.$refs.backDrop.classList.toggle("close");
              this.$emit("forgot", res.data.message);
            }, 300);
          }
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
          console.log(err);
          this.responseMessage = "Сервер не отвечает";
        });
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
