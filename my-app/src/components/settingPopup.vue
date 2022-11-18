<template>
  <icon-popup
    v-if="iconPopupVisible == true"
    @close="iconPopupVisible = false"
  />
  <div class="modal__backDrop" ref="backDrop">
    <div class="setting">
      <img
        src="@/assets/close.png"
        alt=""
        class="sign__closeButton"
        @click.stop="closePopup"
      />
      <h1 class="sign__header">Пользовательские настройки</h1>

      <div class="setting__avatarContainer">
        <img src="@/assets/avatar.png" alt="" class="setting__avatar" />
        <button class="setting__avatarReplace" @click="iconPopupVisible = true">
          Изменить аватар
        </button>
      </div>
      <!-- NICK NAME-->
      <div class="setting__userDataContainer data">
        <h1 class="setting__userDataHeader">Данные пользователя</h1>
        <div class="setting__container">
          <p class="setting__userDataTittle">Nick пользователя:</p>
          <p class="setting__userData" v-if="changes.nickNameChange == false">
            {{}}KrainovSD
          </p>
          <div style="position: relative">
            <input
              type="text"
              class="setting__userDataInput"
              :class="errors.nickName ? '_error' : ''"
              placeholder="Nick пользователя"
              name="nickName"
              id="nickName"
              v-if="changes.nickNameChange == true"
              autocomplete="off"
            />
            <div
              class="wordPopup__tooltip"
              v-if="errors.nickName && currentFocusInput == 'nickName'"
              :tooltip="errors.nickName"
            ></div>
          </div>
          <button
            class="setting__userDataReplace _change"
            v-if="changes.nickNameChange == false"
            @click="openEditor('nickName')"
          >
            Изменить
          </button>
          <img
            src="@/assets/closeRed.png"
            alt=""
            class="setting__userDataClose"
            v-if="changes.nickNameChange == true"
            @click="changes.nickNameChange = false"
          />
          <button
            class="setting__userDataReplace"
            v-if="changes.nickNameChange == true"
            @click="changeField('nickName')"
          >
            Сохранить
          </button>
        </div>
        <!-- USERNAME-->
        <div class="setting__container">
          <p class="setting__userDataTittle">Имя пользователя:</p>
          <p class="setting__userData" v-if="changes.userNameChange == false">
            {{}}Денис
          </p>
          <div style="position: relative">
            <input
              type="text"
              class="setting__userDataInput"
              :class="errors.userName ? '_error' : ''"
              placeholder="Имя пользователя"
              name="userName"
              id="userName"
              v-if="changes.userNameChange == true"
              autocomplete="off"
            />
            <div
              class="wordPopup__tooltip"
              v-if="errors.userName && currentFocusInput == 'userName'"
              :tooltip="errors.userName"
            ></div>
          </div>
          <button
            class="setting__userDataReplace _change"
            v-if="changes.userNameChange == false"
            @click="openEditor('userName')"
          >
            Изменить
          </button>
          <img
            src="@/assets/closeRed.png"
            alt=""
            class="setting__userDataClose"
            v-if="changes.userNameChange == true"
            @click="changes.userNameChange = false"
          />
          <button
            class="setting__userDataReplace"
            v-if="changes.userNameChange == true"
            @click="changeField('userName')"
          >
            Сохранить
          </button>
        </div>
        <!-- EMAIL -->
        <div class="setting__container">
          <p class="setting__userDataTittle">Email пользователя:</p>
          <p class="setting__userData" v-if="changes.emailChange == false">
            {{}}den***osev**@*****.com
          </p>
          <div style="position: relative">
            <input
              type="text"
              class="setting__userDataInput"
              :class="errors.email ? '_error' : ''"
              placeholder="Email пользователя"
              name="email"
              id="email"
              v-if="changes.emailChange == true"
              autocomplete="off"
            />
            <div
              class="wordPopup__tooltip"
              v-if="errors.email && currentFocusInput == 'email'"
              :tooltip="errors.email"
            ></div>
          </div>
          <button
            class="setting__userDataReplace _change"
            v-if="changes.emailChange == false"
            @click="openEditor('email')"
          >
            Изменить
          </button>
          <img
            src="@/assets/closeRed.png"
            alt=""
            class="setting__userDataClose"
            v-if="changes.emailChange == true"
            @click="changes.emailChange = false"
          />
          <button
            class="setting__userDataReplace"
            v-if="changes.emailChange == true"
            @click="changeField('email')"
          >
            Сохранить
          </button>
        </div>
        <!-- PASSWORD -->
        <div class="setting__container">
          <p class="setting__userDataTittle">
            Последний раз пароль был изменен:
          </p>
          <p class="setting__userData" v-if="changes.passwordChange == false">
            {{}}12.02.2031
          </p>
          <div style="position: relative">
            <input
              type="text"
              class="setting__userDataInput"
              :class="errors.password ? '_error' : ''"
              placeholder="Укажите email пользователя"
              name="password"
              id="password"
              v-if="changes.passwordChange == true"
              autocomplete="off"
            />
            <div
              class="wordPopup__tooltip"
              v-if="errors.password && currentFocusInput == 'password'"
              :tooltip="errors.password"
            ></div>
          </div>
          <button
            class="setting__userDataReplace _change"
            v-if="changes.passwordChange == false"
            @click="openEditor('password')"
          >
            Изменить
          </button>
          <img
            src="@/assets/closeRed.png"
            alt=""
            class="setting__userDataClose"
            v-if="changes.passwordChange == true"
            @click="changes.passwordChange = false"
          />
          <button
            class="setting__userDataReplace"
            v-if="changes.passwordChange == true"
            @click="changeField('password')"
          >
            Сохранить
          </button>
        </div>
      </div>
      <div class="setting__userDataContainer">
        <h1 class="setting__userDataHeader">Изученные слова</h1>
        <!-- COUNT AT ONE TIME -->
        <div class="setting__container">
          <p class="setting__userDataTittle">
            Количество слов предоставляемых за одно повторение:
          </p>
          <p
            class="setting__userData"
            v-if="changes.countWordsAtOneTimeChange == false"
          >
            {{}}50
          </p>
          <div style="position: relative">
            <input
              type="text"
              class="setting__userDataInput number"
              :class="errors.countWordsAtOneTime ? '_error' : ''"
              name="countWordsAtOneTime"
              id="countWordsAtOneTime"
              v-if="changes.countWordsAtOneTimeChange == true"
              autocomplete="off"
            />
            <div
              class="wordPopup__tooltip"
              v-if="
                errors.countWordsAtOneTime &&
                currentFocusInput == 'countWordsAtOneTime'
              "
              :tooltip="errors.countWordsAtOneTime"
            ></div>
          </div>
          <button
            class="setting__userDataReplace _change"
            v-if="changes.countWordsAtOneTimeChange == false"
            @click="openEditor('countWordsAtOneTime')"
          >
            Изменить
          </button>
          <img
            src="@/assets/closeRed.png"
            alt=""
            class="setting__userDataClose"
            v-if="changes.countWordsAtOneTimeChange == true"
            @click="changes.countWordsAtOneTimeChange = false"
          />
          <button
            class="setting__userDataReplace"
            v-if="changes.countWordsAtOneTimeChange == true"
            @click="changeField('countWordsAtOneTime')"
          >
            Сохранить
          </button>
        </div>
      </div>
      <div class="setting__userDataContainer">
        <h1 class="setting__userDataHeader">Слова на повторении</h1>
        <!-- COUNT WRONGS -->
        <div class="setting__container">
          <p class="setting__userDataTittle">
            Количество ошибок необходимых для добавления слова:
          </p>
          <p
            class="setting__userData"
            v-if="changes.countWrongsToRepeatChange == false"
          >
            {{}}3
          </p>
          <div style="position: relative">
            <input
              type="text"
              class="setting__userDataInput number"
              :class="errors.countWrongsToRepeat ? '_error' : ''"
              name="countWrongsToRepeat"
              id="countWrongsToRepeat"
              v-if="changes.countWrongsToRepeatChange == true"
              autocomplete="off"
            />
            <div
              class="wordPopup__tooltip"
              v-if="
                errors.countWrongsToRepeat &&
                currentFocusInput == 'countWrongsToRepeat'
              "
              :tooltip="errors.countWrongsToRepeat"
            ></div>
          </div>
          <button
            class="setting__userDataReplace _change"
            v-if="changes.countWrongsToRepeatChange == false"
            @click="openEditor('countWrongsToRepeat')"
          >
            Изменить
          </button>
          <img
            src="@/assets/closeRed.png"
            alt=""
            class="setting__userDataClose"
            v-if="changes.countWrongsToRepeatChange == true"
            @click="changes.countWrongsToRepeatChange = false"
          />
          <button
            class="setting__userDataReplace"
            v-if="changes.countWrongsToRepeatChange == true"
            @click="changeField('countWrongsToRepeat')"
          >
            Сохранить
          </button>
        </div>
        <!-- REGULARITY TO REPEAT -->
        <div
          class="setting__container"
          style="flex-direction: column; align-items: flex-start"
        >
          <div class="setting__regularityInfo">
            <p class="setting__userDataTittle" style="width: 360px">
              Регулярность повторения слова попавшее на повторение:
              22-22-22-42-42-42-82-82 {{}}
            </p>
            <button
              class="setting__userDataReplace _change"
              v-if="changes.regularityToRepeatChange == false"
              @click="openEditor('regularityToRepeat')"
            >
              Изменить
            </button>
            <img
              src="@/assets/closeRed.png"
              alt=""
              class="setting__userDataClose"
              v-if="changes.regularityToRepeatChange == true"
              @click="changes.regularityToRepeatChange = false"
            />
            <button
              class="setting__userDataReplace"
              v-if="changes.regularityToRepeatChange == true"
              @click="changeField('regularityToRepeat')"
            >
              Сохранить
            </button>
          </div>
          <div
            id="regularityToRepeat"
            class="setting__regularityData"
            v-if="changes.regularityToRepeatChange == true"
          >
            <template
              v-for="(item, index) in ['', '', '', '', '', '', '', '']"
              :key="index"
            >
              <div style="position: relative">
                <input
                  type="text"
                  class="setting__regularityItem"
                  :name="`regularityToRepeat${index}`"
                  :class="errors?.regularityToRepeat?.[index] ? '_error' : ''"
                  autocomplete="off"
                />
                <div
                  class="wordPopup__tooltip"
                  v-if="
                    errors?.regularityToRepeat?.[index] &&
                    currentFocusInput == `regularityToRepeat${index}`
                  "
                  :tooltip="errors?.regularityToRepeat?.[index]"
                ></div>
              </div>
              <p class="setting__regularDash" v-if="index != 7">-</p>
            </template>
          </div>
        </div>
      </div>
      <div class="setting__userDataContainer">
        <h1 class="setting__userDataHeader">Проверка на актуальность</h1>
        <!-- MAX COUNT CHECK -->
        <div class="setting__container">
          <p class="setting__userDataTittle">
            Количество встреч со словом за выбранный промежуток времени:
          </p>
          <p
            class="setting__userData"
            v-if="changes.maxCountCheckChange == false"
          >
            {{}}3
          </p>
          <div style="position: relative">
            <input
              type="text"
              class="setting__userDataInput number"
              :class="errors.maxCountCheck ? '_error' : ''"
              name="maxCountCheck"
              id="maxCountCheck"
              v-if="changes.maxCountCheckChange == true"
              autocomplete="off"
            />
            <div
              class="wordPopup__tooltip"
              v-if="
                errors.maxCountCheck && currentFocusInput == 'maxCountCheck'
              "
              :tooltip="errors.maxCountCheck"
            ></div>
          </div>

          <button
            class="setting__userDataReplace _change"
            v-if="changes.maxCountCheckChange == false"
            @click="openEditor('maxCountCheck')"
          >
            Изменить
          </button>
          <img
            src="@/assets/closeRed.png"
            alt=""
            class="setting__userDataClose"
            v-if="changes.maxCountCheckChange == true"
            @click="changes.maxCountCheckChange = false"
          />
          <button
            class="setting__userDataReplace"
            v-if="changes.maxCountCheckChange == true"
            @click="changeField('maxCountCheck')"
          >
            Сохранить
          </button>
        </div>
        <!-- MAX DATE CHECK -->
        <div class="setting__container">
          <p class="setting__userDataTittle">
            Промежуток времени, на котором считаются встречи (в днях):
          </p>
          <p
            class="setting__userData"
            v-if="changes.maxDateCheckChange == false"
          >
            {{}}45
          </p>
          <div style="position: relative">
            <input
              type="text"
              class="setting__userDataInput number"
              :class="errors.maxDateCheck ? '_error' : ''"
              name="maxDateCheck"
              id="maxDateCheck"
              v-if="changes.maxDateCheckChange == true"
              autocomplete="off"
            />
            <div
              class="wordPopup__tooltip"
              v-if="errors.maxDateCheck && currentFocusInput == 'maxDateCheck'"
              :tooltip="errors.maxDateCheck"
            ></div>
          </div>

          <button
            class="setting__userDataReplace _change"
            v-if="changes.maxDateCheckChange == false"
            @click="openEditor('maxDateCheck')"
          >
            Изменить
          </button>
          <img
            src="@/assets/closeRed.png"
            alt=""
            class="setting__userDataClose"
            v-if="changes.maxDateCheckChange == true"
            @click="changes.maxDateCheckChange = false"
          />
          <button
            class="setting__userDataReplace"
            v-if="changes.maxDateCheckChange == true"
            @click="changeField('maxDateCheck')"
          >
            Сохранить
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { nextTick } from "@vue/runtime-core";
import iconPopup from "../components/iconPopup.vue";
export default {
  emits: ["close"],

  components: {
    iconPopup,
  },
  props: {
    test: String,
  },
  data() {
    return {
      changes: {
        nickNameChange: false,
        userNameChange: false,
        emailChange: false,
        passwordChange: false,
        countWordsAtOneTimeChange: false,
        countWrongsToRepeatChange: false,
        regularityToRepeatChange: false,
        maxDateCheckChange: false,
        maxCountCheckChange: false,
      },
      iconPopupVisible: false,
      currentFocusInput: "",
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
    forbiddenLetter(event) {
      let value = event.target.value;
      let key = event.key;
      if (!/^[0-9]$|^Backspace$/.test(key)) {
        event.preventDefault();
        return;
      }
      if (value.length >= 2 && key != "Backspace") {
        event.preventDefault();
        return;
      }
    },
    async openEditor(field) {
      let change = `${field}Change`;
      this.changes[change] = true;
      delete this.errors[field];
      await nextTick();
      if (field != "regularityToRepeat") {
        let input = document.querySelector(`#${field}`);
        input.addEventListener("focus", this.selectInput);
        input.addEventListener("focusout", this.unSelectInput);
        if (input.classList.contains("number"))
          input.addEventListener("keydown", this.forbiddenLetter);
      } else {
        let inputs = Array.from(document.querySelectorAll(`#${field} input`));
        inputs.forEach((input) => {
          input.addEventListener("focus", this.selectInput);
          input.addEventListener("focusout", this.unSelectInput);
          input.addEventListener("keydown", this.forbiddenLetter);
        });
      }
    },
    validateField(field, fieldData) {
      if (fieldData.length == 0) {
        this.errors[field] = "Поле обязательно для заполнения!";
        return;
      }
      if (
        !/^[0-9]+$/.test(fieldData) &&
        (field == "countWordsAtOneTime" ||
          field == "countWrongsToRepeat" ||
          field == "maxCountCheck" ||
          field == "maxDateCheck")
      ) {
        this.errors[field] = "Разрешается использовать только цифры!";
        return;
      }
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
        case "userName":
          if (!/^([A-Za-zА-Яа-я]+)$/.test(fieldData)) {
            this.errors[field] =
              "Имя может содержать только буквы английского или русского алфавита!";
            return;
          }
          if (fieldData.length < 2 && fieldData.length > 15) {
            this.errors[field] =
              "Длина Имени не должна превышать 15 символов или быть меньше, чем 2 символа! Если ваше имя содержит более 15-ти символов, используйте, пожалуйста, сокращенную версию!";
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
        case "password":
          if (
            !/^[a-z0-9][a-z0-9-_.]+@([a-z]|[a-z0-9]?[a-z0-9-]+[a-z0-9]).[a-z0-9]{2,10}(?:.[a-z]{2,10})?$/.test(
              fieldData
            )
          ) {
            this.errors[field] = "Неверный формат введенного Email!";
            return;
          }
          break;
        case "countWordsAtOneTime": {
          if (fieldData < 20 || fieldData > 99) {
            this.errors[field] =
              "За один урок следует повторять не менее 20 слов и не более 99!";
            return;
          }
          break;
        }
        case "countWrongsToRepeat": {
          if (fieldData < 3 || fieldData > 9) {
            this.errors[field] =
              "Слово не следует добавлять чаще, чем после 3 ошибок и реже, чем после 9!";
            return;
          }
          break;
        }
        case "maxCountCheck": {
          if (fieldData < 3 || fieldData > 9) {
            this.errors[field] =
              "Слово не следует добавлять чаще, чем после 3 встреч и реже, чем после 9!";
            return;
          }
          break;
        }
        case "maxDateCheck": {
          if (fieldData < 10 || fieldData > 90) {
            this.errors[field] =
              "Слово не следует анализировать за срок короче, чем 10 дней и длиннее, чем 90!";
            return;
          }
          break;
        }
        case "regularityToRepeat": {
          this.errors[field] = {};
          fieldData.forEach((item, index) => {
            if (item == "") {
              this.errors[field][index] = "Заполните интервал!";
              return;
            }

            item = +item;

            if (typeof item != "number") {
              this.errors[field][index] =
                "Последовательность должна состоять из цифр!";
              return;
            }
            if (item > 16 && item < 1) {
              this.errors[field][index] =
                "Интервал не может превышать 16-ти дней и быть меньше 1-ого дня!";
              return;
            }
          });
          break;
        }
      }
      if (
        field != "regularityToRepeat" ||
        Object.keys(this.errors.regularityToRepeat).length == 0
      )
        delete this.errors[field];
    },

    changeField(field) {
      let fieldData;
      if (field != "regularityToRepeat") {
        fieldData = document.querySelector(`#${field}`).value;
        this.validateField(field, fieldData);
        if (this.errors[field]) {
          return;
        }
      } else {
        let inputs = Array.from(document.querySelectorAll(`#${field} input`));
        fieldData = [];
        inputs.forEach((input) => {
          fieldData.push(input.value);
        });
        this.validateField(field, fieldData);
        if (this.errors[field]) {
          return;
        }
      }
      let change = `${field}Change`;
      this.changes[change] = false;
      console.log(fieldData);
    },
  },
};
</script>

<style></style>
