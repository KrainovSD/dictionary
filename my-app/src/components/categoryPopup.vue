<template>
  <div class="modal__backDrop" ref="backDrop">
    <div class="categoryIcon" ref="categoryIcon" v-if="addIconVisible == true">
      <img
        src="@/assets/close.png"
        alt=""
        class="sign__closeButton"
        @click.stop="closeCategoryIcon"
      />
      <div class="categoryIcon__container">
        <div class="categoryIcon__containerIcon">
          <img
            v-for="(item, index) in iconProd"
            :key="index"
            :src="require(`@/assets/category/${item}.png`)"
            alt=""
            :id="item"
            class="categoryIcon__icon categIcon"
            :class="currentSelectionIcon == item ? '_focus' : ''"
          />
        </div>
        <button
          class="wordPopup__confirmButton"
          :style="currentSelectionIcon == '' ? 'disable: true' : ''"
          ref="confirmIconButton"
          @click="chooseIcon"
          :disabled="isCurrentSelectionIconEmpty"
        >
          Выбрать иконку
        </button>
      </div>
    </div>
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

        <div style="position: relative">
          <input
            type="text"
            class="categoryPopup__input"
            :class="errors.name ? '_error' : ''"
            placeholder="Name"
            name="name"
            v-model="name"
            autocomplete="off"
          />
          <div
            class="wordPopup__tooltip"
            v-if="errors.name && currentFocusInput == 'name'"
            :tooltip="errors.name"
          ></div>
        </div>
        <div class="categoryPopup__containerIcon">
          <div class="categoryPopup__addIcon" @click="openCategoryIcon">
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
            :tooltip="'Укажите шаблон регулярности повторения слов в выбранной категории. Общее количество повторений равняется 12-ти. Максимальный интервал между повторениями 16 дней.'"
          ></div>
        </div>

        <div class="categoryPopup__containerRegularity">
          <div
            style="position: relative"
            v-for="(item, index) in regularityToRepeat"
            :key="index"
          >
            <input
              type="text"
              class="categoryPopup__regularityCase onlyNumber"
              :class="errors?.regularityToRepeat?.[index] ? '_error' : ''"
              v-model="regularityToRepeat[index]"
              :name="`regular${index}`"
              autocomplete="off"
            />
            <div
              class="wordPopup__tooltip"
              v-if="
                errors.regularityToRepeat?.[index] &&
                currentFocusInput == `regular${index}`
              "
              :tooltip="errors.regularityToRepeat?.[index]"
            ></div>
          </div>
        </div>

        <button
          class="wordPopup__confirmButton"
          ref="confirmButton"
          @click.stop="operationWithCategory('add')"
          v-if="categoryPopupType == 'add'"
        >
          Добавить категорию
        </button>
        <button
          class="wordPopup__confirmButton"
          ref="confirmButton"
          @click.stop="operationWithCategory('update')"
          v-else
        >
          Редактировать категорию
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { nextTick } from "@vue/runtime-core";
export default {
  props: {
    categoryPopupType: String,
  },
  data() {
    return {
      name: "",
      icon: "",
      regularityToRepeat: ["", "", "", "", "", "", "", "", "", "", "", ""],
      errors: {},
      tooltip: false,
      currentFocusInput: "",
      addIconVisible: false,
      currentSelectionIcon: "",
      iconProd: [
        "apple",
        "bag",
        "beers",
        "belt",
        "block",
        "box",
        "cap",
        "car",
        "cat",
        "chrome",
        "clock",
        "cloud",
        "coffee",
        "crown",
        "fist",
        "flag",
        "folder",
        "heart",
        "hole",
        "home",
        "key",
        "location",
        "mask",
        "money",
        "paw",
        "plane",
        "playpen",
        "puzzle",
        "shield",
        "space",
        "star",
        "telephone",
        "trophy",
        "t-shirt",
      ],
    };
  },
  mounted() {
    let inputs = Array.from(document.querySelectorAll("input"));
    inputs.forEach((input) => {
      input.addEventListener("focus", this.selectInput);
    });
    inputs.forEach((input) => {
      input.addEventListener("focusout", this.unSelectInput);
    });

    inputs = Array.from(document.querySelectorAll(".onlyNumber"));
    inputs.forEach((input) => {
      input.addEventListener("keydown", this.enterNumber);
    });
  },
  beforeUnmount() {
    let inputs = Array.from(document.querySelectorAll("input"));
    inputs.forEach((input) => {
      input.removeEventListener("focus", this.selectInput);
    });
    inputs.forEach((input) => {
      input.removeEventListener("focusout", this.unSelectInput);
    });
    inputs = Array.from(document.querySelectorAll(".onlyNumber"));
    inputs.forEach((input) => {
      input.removeEventListener("keydown", this.enterNumber);
    });
  },
  computed: {
    isCurrentSelectionIconEmpty() {
      if (this.currentSelectionIcon == "") return true;
      return false;
    },
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
    selectInput(event) {
      let input = event.target;
      if (!input.classList.contains("_focus")) {
        input.classList.toggle("_focus");
        this.currentFocusInput = input.name;
      }
    },
    unSelectInput(event) {
      let input = event.target;
      if (input.classList.contains("_focus")) {
        input.classList.toggle("_focus");
        this.currentFocusInput = "";
      }
    },
    enterNumber(event) {
      if (!/^Backspace$|\d/.test(event.key)) {
        event.preventDefault();
      }
      if (event.target.value.length >= 2 && event.key != "Backspace") {
        event.preventDefault();
      }
    },
    async openCategoryIcon() {
      this.addIconVisible = true;
      if (this.icon != "") this.currentSelectionIcon = this.icon;
      await nextTick();
      let imgs = Array.from(document.querySelectorAll(".categIcon"));
      imgs.forEach((img) => {
        img.addEventListener("click", this.selectIcon);
      });
    },
    closeCategoryIcon() {
      let div = this.$refs.categoryIcon;
      if (!div.classList.contains("close")) {
        div.classList.toggle("close");
      }
      setTimeout(() => {
        this.currentSelectionIcon = "";
        this.addIconVisible = false;
      }, 300);
    },
    selectIcon(event) {
      let icon = event.target;
      this.currentSelectionIcon = icon.id;
      console.log(this.currentSelectionIcon);
    },
    chooseIcon() {
      if (!this.$refs.confirmIconButton.classList.contains("_active")) {
        this.$refs.confirmIconButton.classList.toggle("_active");
      }

      if (this.currentSelectionIcon != "") {
        setTimeout(() => {
          if (this.$refs.confirmIconButton.classList.contains("_active")) {
            this.$refs.confirmIconButton.classList.toggle("_active");
            this.icon = this.currentSelectionIcon;
            this.closeCategoryIcon();
          }
        }, 300);
      } else {
        setTimeout(() => {
          if (this.$refs.confirmIconButton.classList.contains("_active")) {
            this.$refs.confirmIconButton.classList.toggle("_active");
          }
        }, 300);
      }
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
            if (form[key].length > 20) {
              this.errors[key] =
                "Имя категории должно быть не длиннее 30-ти символов!";
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
            if (fieldData.length > 20) {
              this.errors[field] =
                "Имя категории должно быть не длиннее 30-ти символов!";
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
      if (!this.$refs.confirmButton.classList.contains("_active")) {
        this.$refs.confirmButton.classList.toggle("_active");
      }

      let form = {
        name: this.name,
        icon: this.icon,
        regularityToRepeat: this.regularityToRepeat,
      };

      this.validateForm(form);
      if (Object.keys(this.errors).length === 0) {
        setTimeout(() => {
          this.$refs.confirmButton.classList.toggle("_active");
          this.$emit(type, form);
          // this.closePopup();
        }, 300);
      } else {
        console.log(this.errors);
        setTimeout(() => {
          this.$refs.confirmButton.classList.toggle("_active");
        }, 300);
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
