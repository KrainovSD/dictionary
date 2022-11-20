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

      <div class="setting__userDataContainer data">
        <h1 class="setting__userDataHeader">Данные пользователя</h1>
        <setting-field
          title="Nick пользователя:"
          data="KrainovSD"
          field="nickName"
          inputType="String"
          placeholder="Введите nickName"
          :errors="errors"
          @change="(payload) => changeField(payload)"
          @edit="(payload) => clearField(payload)"
          v-model="nickName"
        />
        <setting-field
          title="Имя пользователя:"
          data="Денис"
          field="userName"
          inputType="String"
          placeholder="Введите имя"
          :errors="errors"
          @change="(payload) => changeField(payload)"
          @edit="(payload) => clearField(payload)"
          v-model="userName"
        />
        <setting-field
          title="Email пользователя:"
          data="denis****@*mail.**"
          field="email"
          inputType="String"
          placeholder="Введите email"
          :errors="errors"
          @change="(payload) => changeField(payload)"
          @edit="(payload) => clearField(payload)"
          v-model="email"
        />
        <setting-field
          title="Последний раз пароль был изменен:"
          data="12.02.2012"
          field="password"
          inputType="String"
          placeholder="Введите email"
          :errors="errors"
          @change="(payload) => changeField(payload)"
          @edit="(payload) => clearField(payload)"
          v-model="password"
        />
      </div>
      <div class="setting__userDataContainer">
        <h1 class="setting__userDataHeader">Изученные слова</h1>
        <setting-field
          title="Количество слов предоставляемых за одно повторение:"
          data="50"
          field="countWordsAtOneTime"
          inputType="Number"
          placeholder=""
          :errors="errors"
          @change="(payload) => changeField(payload)"
          @edit="(payload) => clearField(payload)"
          v-model="countWordsAtOneTime"
        />
      </div>
      <div class="setting__userDataContainer">
        <h1 class="setting__userDataHeader">Слова на повторении</h1>
        <setting-field
          title="Количество ошибок необходимых для добавления слова:"
          data="3"
          field="countWrongsToRepeat"
          inputType="Number"
          placeholder=""
          :errors="errors"
          @change="(payload) => changeField(payload)"
          @edit="(payload) => clearField(payload)"
          v-model="countWrongsToRepeat"
        />

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
              v-if="regularityToRepeatChange == false"
              @click="
                regularityToRepeatChange = true;
                clearField('regularityToRepeat');
              "
            >
              Изменить
            </button>
            <img
              src="@/assets/closeRed.png"
              alt=""
              class="setting__userDataClose"
              v-if="regularityToRepeatChange == true"
              @click="regularityToRepeatChange = false"
            />
            <button
              class="setting__userDataReplace"
              v-if="regularityToRepeatChange == true"
              @click="
                changeField({
                  field: 'regularityToRepeat',
                  fieldData: regularityToRepeat,
                })
              "
            >
              Сохранить
            </button>
          </div>
          <div
            class="setting__regularityData"
            v-if="regularityToRepeatChange == true"
          >
            <template v-for="(item, index) in regularityToRepeat" :key="index">
              <div class="setting__multipleInputContainer">
                <multiple-input-tooltip
                  v-model="regularityToRepeat[index]"
                  field="regularityToRepeat"
                  fontSize="16"
                  :index="index"
                  :errors="errors"
                />
              </div>

              <p class="setting__regularDash" v-if="index != 7">-</p>
            </template>
          </div>
        </div>
      </div>
      <!-- -->
      <div class="setting__userDataContainer">
        <h1 class="setting__userDataHeader">Проверка на актуальность</h1>
        <setting-field
          title="Количество ошибок необходимых для добавления слова:"
          data="3"
          field="maxCountCheck"
          inputType="Number"
          placeholder=""
          :errors="errors"
          @change="(payload) => changeField(payload)"
          @edit="(payload) => clearField(payload)"
          v-model="maxCountCheck"
        />
        <setting-field
          title="Промежуток времени, на котором считаются встречи (в днях):"
          data="45"
          field="maxDateCheck"
          inputType="Number"
          placeholder=""
          :errors="errors"
          @change="(payload) => changeField(payload)"
          @edit="(payload) => clearField(payload)"
          v-model="maxDateCheck"
        />
      </div>
      <div class="setting__userDataContainer">
        <h1 class="setting__userDataHeader">Резервная копия</h1>
        <div class="setting__backup">
          <button class="setting__backupButton export">Экспортировать</button>
          <button class="setting__backupButton import">Импортировать</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { nextTick } from "@vue/runtime-core";
import iconPopup from "../components/iconPopup.vue";
import settingField from "../components/settingField.vue";
import multipleInputTooltip from "../components/multipleInputTooltip.vue";

export default {
  emits: ["close"],

  components: {
    iconPopup,
    settingField,
    multipleInputTooltip,
  },
  data() {
    return {
      nickName: "",
      userName: "",
      email: "",
      password: "",
      countWordsAtOneTime: "",
      countWrongsToRepeat: "",
      regularityToRepeat: ["", "", "", "", "", "", "", ""],
      maxCountCheck: "",
      maxDateCheck: "",
      iconPopupVisible: false,
      regularityToRepeatChange: false,
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
    closeEditor(fieldChange) {
      this.changes[fieldChange] = false;
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

            if (item > 16 || item < 1) {
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
    clearField(payload) {
      delete this.errors[payload];
      if (payload == "regularityToRepeat") {
        this[payload] = ["", "", "", "", "", "", "", ""];
        return;
      }
      this[payload] = "";
    },
    changeField(data) {
      let { field, fieldData } = data;
      this.validateField(field, fieldData);
      if (this.errors[field]) {
        return;
      }
    },
  },
  watch: {
    nickName() {
      if (this.errors?.nickName) this.validateField("nickName", this.nickName);
    },
    userName() {
      if (this.errors?.userName) this.validateField("userName", this.userName);
    },
    email() {
      if (this.errors?.email) this.validateField("email", this.email);
    },
    password() {
      if (this.errors?.password) this.validateField("password", this.password);
    },
    countWordsAtOneTime() {
      if (this.errors?.countWordsAtOneTime)
        this.validateField("countWordsAtOneTime", this.countWordsAtOneTime);
    },
    countWrongsToRepeat() {
      if (this.errors?.countWrongsToRepeat)
        this.validateField("countWrongsToRepeat", this.countWrongsToRepeat);
    },
    maxCountCheck() {
      if (this.errors?.maxCountCheck)
        this.validateField("maxCountCheck", this.maxCountCheck);
    },
    maxDateCheck() {
      if (this.errors?.maxDateCheck)
        this.validateField("maxDateCheck", this.maxDateCheck);
    },
    regularityToRepeat: {
      handler: function () {
        if (this.errors?.regularityToRepeat)
          this.validateField("regularityToRepeat", this.regularityToRepeat);
      },
      deep: true,
    },
  },
};
</script>

<style></style>
