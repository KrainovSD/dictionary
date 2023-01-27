<template>
  <info-popup ref="info" />
  <loading-popup v-if="isLoading == true" />
  <div class="modal__backDrop z9" ref="backDrop"></div>
  <div class="modal__container info z10">
    <category-icon
      v-if="addIconVisible == true"
      :icon="icon"
      @close="addIconVisible = false"
      @add="
        (payload) => {
          icon = payload;
          addIconVisible = false;
        }
      "
    />

    <div class="categoryPopup">
      <close-modal-button @close="closePopup" class="sign__closeButton" />
      <div class="sign__container">
        <h1 class="sign__header" v-if="categoryPopupType == 'add'">
          Новая категория
        </h1>
        <h1 class="sign__header" v-else>Редактирование категории</h1>
        <p class="sign__description" v-if="categoryPopupType == 'add'">
          Добавление новой категории
        </p>
        <p class="sign__description" v-else>
          Редактирование выбранной категории
        </p>

        <div class="categoryPopup__inputContainer">
          <input-tooltip
            type="input"
            v-model="name"
            fontSize="16"
            :error="errors?.name"
            placeholder="Name"
            @keyup.enter="operationWithCategory"
          />
        </div>

        <div class="categoryPopup__containerIcon">
          <div class="categoryPopup__addIcon" @click="addIconVisible = true">
            Выбрать иконку
          </div>
          <p style="color: red" v-if="icon == ''">Выберите иконку!</p>
          <p v-else>{{ icon }}.png</p>
        </div>
        <div class="categoryPopup__containerHelper">
          <p>Регулярность повторения</p>
          <img
            src="@/assets/question.png"
            alt=""
            class="categoryPopup__iconHelper"
            ref="iconHelper"
            @mouseover="tooltip = true"
            @mouseout="tooltip = false"
          />
          <div
            class="categoryPopup__helper"
            v-if="tooltip == true"
            :tooltip="'Укажите шаблон регулярности повторения слов в выбранной категории. Общее количество повторений равняется 12-ти. Максимальный интервал между повторениями 16 дней. Ниже представлен наиболее удобный вариант для хорошего запоминания блока слов (можно изменить).'"
          ></div>
        </div>

        <div class="categoryPopup__containerRegularity">
          <div
            class="categoryPopup__multipleInputContainer"
            v-for="(item, index) in regularityToRepeat"
            :key="index"
          >
            <multiple-input-tooltip
              v-model="regularityToRepeat[index]"
              :index="index"
              :errors="errors"
              field="regularityToRepeat"
              fontSize="18"
              @keyup.enter="operationWithCategory"
            />
          </div>
        </div>
        <div
          class="newPassword__confirmContainer"
          v-if="categoryPopupType == 'add'"
        >
          <confirm-button
            text="Добавить категорию"
            @click="operationWithCategory"
            fontSize="14"
          />
        </div>
        <div class="newPassword__confirmContainer" v-else>
          <confirm-button
            text="Редактировать категорию"
            @click="operationWithCategory"
            fontSize="14"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import inputTooltip from "../components/inputTooltip.vue";
import confirmButton from "../components/confirmButton.vue";
import multipleInputTooltip from "../components/multipleInputTooltip.vue";
import categoryIcon from "../components/categoryIcon.vue";
import infoPopup from "../components/infoPopup.vue";
import closeModalButton from "../components/closeModalButton.vue";
import loadingPopup from "../components/loadingPopup.vue";
export default {
  components: {
    inputTooltip,
    confirmButton,
    multipleInputTooltip,
    categoryIcon,
    infoPopup,
    closeModalButton,
    loadingPopup,
  },
  emits: ["close"],
  props: {
    categoryPopupType: String,
    options: Object,
  },
  data() {
    return {
      name: "",
      icon: "",
      regularityToRepeat: [
        "2",
        "2",
        "2",
        "2",
        "4",
        "4",
        "4",
        "4",
        "8",
        "8",
        "16",
        "16",
      ],
      id: "",
      errors: {},
      tooltip: false,
      addIconVisible: false,
      isLoading: false,
    };
  },
  mounted() {
    if (this.options == null) return;
    if (Object.keys(this.options)?.length > 0) {
      this.id = this.options?._id;
      this.name = this.options?.name;
      this.icon = this.options?.icon;
      this.options?.regularityToRepeat.forEach((number, index) => {
        this.regularityToRepeat[index] = `${number}`;
      });
    }
  },

  methods: {
    closePopup() {
      if (this.addIconVisible == true) return;
      if (!this.$refs.backDrop.classList.contains("close")) {
        this.$refs.backDrop.classList.toggle("close");
        setTimeout(() => {
          this.$refs.backDrop.classList.toggle("close");
          this.$emit("close");
        }, 300);
      }
    },
    async showInfo(header, title) {
      await this.$refs.info.show(header, title);
      return;
    },
    validateForm(form) {
      this.errors = {};
      Object.keys(form).forEach((key) => {
        if (
          typeof form[key] != "string" &&
          form[key] != "" &&
          key != "regularityToRepeat"
        ) {
          this.errors[key] = "Неверный тип данных!";
          return;
        }
        if (form[key] == "" && key != "regularityToRepeat") {
          this.errors[key] = "Заполните поле!";
          return;
        }
        switch (key) {
          case "name": {
            if (form[key].length > 20 || form[key].length < 5) {
              this.errors[key] =
                "Имя категории должно быть не длиннее 20-ти символов или короче 5!";
            }
            if (!/^[A-Za-zА-Яа-я0-9\- ]+$/.test(form[key])) {
              this.errors[key] =
                "Имя категории может состоять из букв русского, английского алфавита и цифр без использования специальных символов!";
            }
            break;
          }
          case "regularityToRepeat": {
            this.errors.regularityToRepeat = {};
            Object.keys(form[key]).forEach((keyRegular) => {
              if (form[key][keyRegular] == "") {
                this.errors[key][keyRegular] = "Заполните интервал!";
                return;
              }
              let keyData = +form[key][keyRegular];
              if (typeof keyData != "number") {
                this.errors[key][keyRegular] =
                  "Интервал должен указываться целым не отрицательным числом!";
                return;
              }
              if (keyData > 16 || keyData < 1) {
                this.errors[key][keyRegular] =
                  "Интервал не может превышать 16-ти дней и быть меньше 1-ого дня!";
                return;
              }
            });
            if (Object.keys(this.errors[key]).length == 0)
              delete this.errors[key];
            break;
          }
        }
      });
    },
    validateField(field, fieldData) {
      if (this.errors[field]) {
        if (
          typeof fieldData != "string" &&
          fieldData != "" &&
          field != "regularityToRepeat"
        ) {
          this.errors[field] = "Неверный тип данных!";
          return;
        }
        if (fieldData == "" && field != "regularityToRepeat") {
          this.errors[field] = "Заполните поле!";
          return;
        }
        switch (field) {
          case "name": {
            if (fieldData.length > 20 || fieldData.length < 5) {
              this.errors[field] =
                "Имя категории должно быть не длиннее 20-ти символов или короче 5!";
              return;
            }
            if (!/^[A-Za-zА-Яа-я0-9\- ]+$/.test(fieldData)) {
              this.errors[field] =
                "Имя категории может состоять из букв русского, английского алфавита и цифр без использования специальных символов!";
              return;
            }
            break;
          }
          case "regularityToRepeat": {
            this.errors.regularityToRepeat = {};
            Object.keys(fieldData).forEach((keyRegular) => {
              if (fieldData[keyRegular] == "") {
                this.errors[field][keyRegular] = "Заполните интервал!";
                return;
              }
              let keyData = +fieldData[keyRegular];
              if (typeof keyData != "number") {
                this.errors[field][keyRegular] =
                  "Интервал должен указываться целым не отрицательным числом!";
                return;
              }
              if (keyData > 16 || keyData < 1) {
                this.errors[field][keyRegular] =
                  "Интервал не может превышать 16-ти дней и быть меньше 1-ого дня!";
                return;
              }
            });
            break;
          }
        }
        console.log(this.errors);
        if (
          field != "regularityToRepeat" ||
          (Object.keys(this.errors?.regularityToRepeat).length == 0 &&
            field == "regularityToRepeat")
        )
          delete this.errors[field];
      }
    },
    operationWithCategory() {
      let form = {
        name: this.name,
        icon: this.icon,
        regularityToRepeat: this.regularityToRepeat,
      };

      this.validateForm(form);
      form.regularityToRepeat = this.regularityToRepeat.map((x) => +x);

      if (Object.keys(this.errors).length === 0) {
        if (this.categoryPopupType == "add") this.addCategory(form);
        if (this.categoryPopupType == "update") this.updateCaregory(form);
      }
    },
    async addCategory(form) {
      try {
        if (this.isLoading == true) return;
        this.isLoading = true;

        let res = this.$store.getters.getAuth
          ? await this.$api.words.addCategory(form)
          : this.$api.offline.addCategory(form);

        if (this.$store.getters.getAuth) {
          let userInfo = res?.data?.user;
          this.$store.commit("setUserInfo", userInfo);
          localStorage.setItem("userInfo", JSON.stringify(userInfo));
        }
        let message = res?.data?.message || res?.message;

        this.isLoading = false;
        await this.showInfo("Добавление категории", message);
        this.closePopup();
      } catch (err) {
        this.isLoading = false;
        let message = err?.response?.data?.message || err?.message;
        let status = err?.response?.status;
        if (status == 0 || status == 500) {
          message =
            "Сервер не отвечает или интернет соединение утеряно, переводим операции в режим оффлайн, выполните операцию повторно!";
          this.$store.commit("resetAuth");
        }
        this.showInfo("Добавление категории", message);
      }
    },
    async updateCaregory(form) {
      try {
        if (this.isLoading == true) return;
        this.isLoading = true;

        form.id = this.id;
        let res = this.$store.getters.getAuth
          ? await this.$api.words.updateCategory(form)
          : this.$api.offline.updateCategory(form);

        if (this.$store.getters.getAuth) {
          let userInfo = res?.data?.user;
          this.$store.commit("setUserInfo", userInfo);
          this.$api.offline.setSignatureAPI(userInfo);
        }
        let message = res?.data?.message || res?.message;
        this.isLoading = false;
        await this.showInfo("Редактирование категории", message);
        this.closePopup();
      } catch (err) {
        this.isLoading = false;
        let message = err?.response?.data?.message || err?.message;
        let status = err?.response?.status;
        if (status == 0 || status == 500) {
          message =
            "Сервер не отвечает или интернет соединение утеряно, переводим операции в режим оффлайн, выполните операцию повторно!";
          this.$store.commit("resetAuth");
        }
        this.showInfo("Редактирование категории", message);
      }
    },
  },
  watch: {
    name() {
      this.validateField("name", this.name);
    },
    regularityToRepeat: {
      handler: function () {
        this.validateField("regularityToRepeat", this.regularityToRepeat);
      },
      deep: true,
    },
  },
};
</script>

<style></style>
