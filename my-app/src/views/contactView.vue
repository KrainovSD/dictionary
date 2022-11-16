<template>
  <div class="contact">
    <p class="contact__info">
      Вы можете оставить отзыв или внести предложение по улучшению работы
      сервиса, воспользовавшись формой для отправки сообщения ниже.
      <span style="color: red">(Только для авторизованных пользователей) </span>
    </p>
    <div class="mailer">
      <h1>Мы на связи</h1>
      <p>Оставьте свой вопрос или предложение, и мы свяжемся с вами.</p>
      <div class="mailer__container">
        <div class="mailer__containerInput">
          <div style="position: relative">
            <input
              type="text"
              class="mailer__input"
              :class="errors.userName ? '_error' : ''"
              placeholder="Имя"
              name="userName"
              v-model="userName"
              autocomplete="off"
            />
            <div
              class="mailer__tooltip"
              v-if="errors.userName && currentFocusInput == 'userName'"
              :tooltip="errors.userName"
            ></div>
          </div>
          <div style="position: relative">
            <input
              type="text"
              class="mailer__input"
              :class="errors.email ? '_error' : ''"
              placeholder="Адресс почты для связи"
              name="email"
              v-model="email"
              autocomplete="off"
            />
            <div
              class="mailer__tooltip"
              v-if="errors.email && currentFocusInput == 'email'"
              :tooltip="errors.email"
            ></div>
          </div>
          <span>
            Нажимая на кнопку отправить, вы соглашаетесь на обработку
            персональных данных в соответствии с Политикой конфиденциальности.
          </span>
          <button
            class="mailer__confirm"
            ref="confirmButton"
            @click="sendMessage"
          >
            Отправить
          </button>
        </div>
        <div class="mailer__containerTextarea">
          <div style="position: relative">
            <textarea
              type="text"
              class="mailer__input textArea"
              :class="errors.message ? '_error' : ''"
              placeholder="Ваше сообщение"
              name="message"
              v-model="message"
              autocomplete="off"
              maxlength="600"
            ></textarea>
            <div
              class="mailer__tooltip"
              v-if="errors.message && currentFocusInput == 'message'"
              :tooltip="errors.message"
            ></div>
          </div>
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
export default {
  data() {
    return {
      userName: "",
      email: "",
      message: "",
      currentFocusInput: "",
      errors: {},
    };
  },
  mounted() {
    let input = Array.from(document.querySelectorAll("input"));
    let textarea = Array.from(document.querySelectorAll("textarea"));
    let inputs = [...input, ...textarea];
    inputs.forEach((input) => {
      input.addEventListener("focus", this.selectInput);
    });
    inputs.forEach((input) => {
      input.addEventListener("focusout", this.unselectInput);
    });
  },
  beforeUnmount() {
    let input = Array.from(document.querySelectorAll("input"));
    let textarea = Array.from(document.querySelectorAll("textarea"));
    let inputs = [...input, ...textarea];
    inputs.forEach((input) => {
      input.removeEventListener("focus", this.selectInput);
    });
    inputs.forEach((input) => {
      input.removeEventListener("focusout", this.unselectInput);
    });
  },

  methods: {
    selectInput(event) {
      let input = event.target;
      if (!input.classList.contains("_focus")) {
        this.currentFocusInput = input.name;
        input.classList.toggle("_focus");
      }
    },
    unselectInput(event) {
      let input = event.target;
      if (input.classList.contains("_focus")) {
        this.currentFocusInput = "";
        input.classList.toggle("_focus");
      }
    },
    validateForm(form) {
      this.errors = {};
      console.log(form);
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

    sendMessage() {
      if (!this.$refs.confirmButton.classList.contains("_active")) {
        this.$refs.confirmButton.classList.toggle("_active");
        let form = {
          userName: this.userName,
          email: this.email,
          message: this.message,
        };

        this.validateForm(form);

        if (Object.keys(this.errors).length === 0) {
          setTimeout(() => {
            this.$refs.confirmButton.classList.toggle("_active");
            //API
            //this.closePopup();
          }, 300);
        } else {
          console.log(this.errors);
          setTimeout(() => {
            this.$refs.confirmButton.classList.toggle("_active");
          }, 300);
        }
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
