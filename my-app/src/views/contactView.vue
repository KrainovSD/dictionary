<template>
  <info-popup ref="info" />
  <div class="contact appearVision">
    <p class="contact__info">
      Вы можете оставить отзыв или внести предложение по улучшению работы
      сервиса, воспользовавшись формой для отправки сообщения ниже.
      <span style="color: red">(Только для авторизованных пользователей) </span>
    </p>
    <div class="mailer">
      <h1>Мы на связи</h1>
      <p>Оставьте свой вопрос или предложение, и мы свяжемся с вами.</p>
      <div class="mailer__container">
        <div class="mailer__leftSide">
          <div class="mailer__inputContainer">
            <input-tooltip
              type="input"
              v-model="userName"
              fontSize="18"
              :error="errors?.userName"
              placeholder="Имя"
            />
          </div>
          <div class="mailer__inputContainer">
            <input-tooltip
              type="input"
              v-model="email"
              fontSize="18"
              :error="errors?.email"
              placeholder="Адресс почты для связи"
            />
          </div>
          <div class="mailer__inputMobileContainer">
            <input-tooltip
              type="textarea"
              maxLength="600"
              v-model="message"
              fontSize="18"
              :error="errors?.message"
              placeholder="Ваше сообщение"
              tooltip="top"
            />
          </div>
          <span>
            Нажимая на кнопку отправить, вы соглашаетесь на обработку
            персональных данных в соответствии с Политикой конфиденциальности.
          </span>
          <div class="mailer__confirmContainer">
            <confirm-button
              text="Отправить"
              @click="validateMessage"
              fontSize="15px"
            />
          </div>
        </div>
        <div class="mailer__rightSide">
          <input-tooltip
            type="textarea"
            maxLength="600"
            v-model="message"
            fontSize="18"
            :error="errors?.message"
            placeholder="Ваше сообщение"
            tooltip="top"
          />
        </div>
      </div>
    </div>
    <div class="networks">
      <img src="@/assets/networks/vk.png" alt="" class="networks__item" />
      <img
        src="@/assets/networks/instagram.png"
        alt=""
        class="networks__item"
      />
      <img src="@/assets/networks/telegram.png" alt="" class="networks__item" />
      <img src="@/assets/networks/whatsapp.png" alt="" class="networks__item" />
      <img src="@/assets/networks/youtube.png" alt="" class="networks__item" />
      <img src="@/assets/networks/twitter.png" alt="" class="networks__item" />
      <img src="@/assets/networks/reddit.png" alt="" class="networks__item" />
      <img src="@/assets/networks/facebook.png" alt="" class="networks__item" />
    </div>
  </div>
</template>

<script>
import inputTooltip from "../components/inputTooltip.vue";
import confirmButton from "../components/confirmButton.vue";
import infoPopup from "../components/infoPopup.vue";
export default {
  components: {
    inputTooltip,
    confirmButton,
    infoPopup,
  },
  data() {
    return {
      userName: "",
      email: "",
      message: "",
      errors: {},
    };
  },

  methods: {
    async showInfo(header, title) {
      await this.$refs.info.show(header, title);
    },
    validateForm(form) {
      this.errors = {};
      Object.keys(form).forEach((field) => {
        let fieldData = form[field];
        if (fieldData == "") {
          this.errors[field] = "Заполните поле!";
          return;
        }

        if (typeof fieldData != "string") {
          this.errors[field] = "Неверный тип данных!";
          return;
        }
        switch (field) {
          case "userName": {
            if (!/^[А-Яа-яA-Za-z]+$/.test(fieldData)) {
              this.errors[field] =
                "При заполнении имени разрешено использовать только буквы английского и русского алфавита!";
              return;
            }
            if (fieldData.length < 2 && fieldData.length > 15) {
              this.errors[field] =
                "Длина Имени не должна превышать 15 символов или быть меньше, чем 2 символа! Если ваше имя содержит более 15-ти символов, используйте, пожалуйста, сокращенную версию!";
              return;
            }
            break;
          }
          case "email": {
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
          case "message": {
            if (!/^[А-Яа-яA-Za-z0-9 \-:!?.,]+$/.test(fieldData)) {
              this.errors[field] =
                "При заполнении сообщения разрешено использовать только буквы английского, русского алфавита, цифры и знаки препинания!";
              return;
            }
            if (fieldData.length > 600) {
              this.errors[field] =
                "Длина сообщения не должна превышать 600 символов!";
              return;
            }
            break;
          }
        }
      });
    },
    validateField(field, fieldData) {
      if (this.errors?.[field]) {
        if (fieldData == "") {
          this.errors[field] = "Заполните поле!";
          return;
        }

        if (typeof fieldData != "string") {
          this.errors[field] = "Неверный тип данных!";
          return;
        }
        switch (field) {
          case "userName": {
            if (!/^[А-Яа-яA-Za-z]+$/.test(fieldData)) {
              this.errors[field] =
                "При заполнении имени разрешено использовать только буквы английского и русского алфавита!";
              return;
            }
            if (fieldData.length < 2 && fieldData.length > 15) {
              this.errors[field] =
                "Длина Имени не должна превышать 15 символов или быть меньше, чем 2 символа! Если ваше имя содержит более 15-ти символов, используйте, пожалуйста, сокращенную версию!";
              return;
            }
            break;
          }
          case "email": {
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
          case "message": {
            if (!/^[А-Яа-яA-Za-z0-9 \-:!?.,]+$/.test(fieldData)) {
              this.errors[field] =
                "При заполнении сообщения разрешено использовать только буквы английского, русского алфавита, цифры и знаки препинания!";
              return;
            }
            if (fieldData.length > 600) {
              this.errors[field] =
                "Длина сообщения не должна превышать 600 символов!";
              return;
            }
            break;
          }
        }
        delete this.errors[field];
      }
    },
    validateMessage() {
      let form = {
        userName: this.userName,
        email: this.email,
        message: this.message,
      };

      this.validateForm(form);

      if (Object.keys(this.errors).length === 0) {
        this.sendMessage(form);
      }
    },
    async sendMessage(form) {
      try {
        let res = await this.$api.user.message(form);
        let message = res?.data?.message;
        await this.showInfo("Отправка сообщения", message);

        this.userName = "";
        this.email = "";
        this.message = "";
      } catch (err) {
        console.log(err);
        if (err?.response?.status == 401) {
          return this.showInfo(
            "Отправка сообщения",
            "Отправка сообщения доступна только для зарегистрированных пользователей!"
          );
        }
        let message = err?.response?.data?.message;
        this.showInfo("Отправка сообщения", message);
      }
    },
  },
  watch: {
    userName() {
      this.validateField("userName", this.userName);
    },
    email() {
      this.validateField("email", this.email);
    },
    message() {
      this.validateField("message", this.message);
    },
  },
};
</script>

<style></style>
