<template>
  <info-popup ref="info" />
  <div class="modal__backDrop" style="z-index: 4" ref="backDrop">
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
      <img
        src="@/assets/close.png"
        alt=""
        class="sign__closeButton"
        @click.stop="closePopup"
      />
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
            field="name"
            fontSize="16"
            :errors="errors"
            placeholder="Name"
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
            />
          </div>
        </div>
        <div
          class="newPassword__confirmContainer"
          v-if="categoryPopupType == 'add'"
        >
          <confirm-button
            text="Добавить категорию"
            @click="operationWithCategory('add')"
            fontSize="14"
          />
        </div>
        <div class="newPassword__confirmContainer" v-else>
          <confirm-button
            text="Редактировать категорию"
            @click="operationWithCategory('update')"
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
export default {
  components: {
    inputTooltip,
    confirmButton,
    multipleInputTooltip,
    categoryIcon,
    infoPopup,
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
    async showInfo(header, title) {
      await this.$refs.info.show(header, title);
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
    operationWithCategory(type) {
      let form = {
        name: this.name,
        icon: this.icon,
        regularityToRepeat: this.regularityToRepeat,
      };

      this.validateForm(form);
      form.regularityToRepeat = this.regularityToRepeat.map((x) => +x);

      if (Object.keys(this.errors).length === 0) {
        if (type == "add") this.addCategory(form);
        if (type == "update") this.updateCaregory(form);
      } else {
        console.log(this.errors);
      }
    },
    async addCategory(form) {
      try {
        let res = await this.$api.words.addCategory(form);
        await this.showInfo("Add Category", res.data.message);
        this.$store.commit("setUserInfo", res.data.user);
        this.closePopup();
      } catch (err) {
        this.showInfo("Add Category", err.response.data.message);
      }
    },
    async updateCaregory(form) {
      try {
        form.id = this.id;
        let res = await this.$api.words.updateCategory(form);
        await this.showInfo("Update Category", res.data.message);
        this.$store.commit("setUserInfo", res.data.user);
        this.closePopup();
      } catch (err) {
        this.showInfo("Update Category", err.response.data.message);
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
