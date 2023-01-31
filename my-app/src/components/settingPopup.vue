<template>
  <icon-popup
    v-if="iconPopupVisible == true"
    @close="iconPopupVisible = false"
    @auth="$emit('noAuth')"
  />
  <loading-popup v-if="isLoading == true" />
  <info-popup ref="info" />
  <confirm-popup ref="confirm" />

  <div class="modal__backDrop" ref="backDrop"></div>
  <div class="modal__container">
    <div class="setting">
      <close-modal-button @click="closePopup" class="sign__closeButton" />
      <h1 class="sign__header">Пользовательские настройки</h1>

      <div class="setting__avatarContainer">
        <img :src="avatar" alt="" class="setting__avatar" />
        <button class="setting__avatarReplace" @click="iconPopupVisible = true">
          Изменить аватар
        </button>
      </div>

      <div class="setting__userDataContainer data">
        <h1 class="setting__userDataHeader">Данные пользователя</h1>
        <setting-field
          title="Nick пользователя:"
          :data="userInfo.nickName"
          field="nickName"
          inputType="String"
          placeholder="Введите nickName"
          :errors="errors"
          @change="(payload) => checkField(payload)"
          @close="(payload) => clearField(payload)"
          v-model="nickName"
        />
        <setting-field
          title="Имя пользователя:"
          :data="userInfo.userName"
          field="userName"
          inputType="String"
          placeholder="Введите имя"
          :errors="errors"
          @change="(payload) => checkField(payload)"
          @close="(payload) => clearField(payload)"
          v-model="userName"
        />
        <setting-field
          title="Email пользователя:"
          :data="userInfo.email"
          field="email"
          inputType="String"
          placeholder="Введите email"
          :errors="errors"
          @change="(payload) => checkField(payload)"
          @close="(payload) => clearField(payload)"
          v-model="email"
        />
        <setting-field
          title="Последний раз пароль был изменен:"
          :data="dateFormat(userInfo.dateOfPassword)"
          field="password"
          inputType="String"
          placeholder="Введите email"
          :errors="errors"
          @change="(payload) => checkField(payload)"
          @close="(payload) => clearField(payload)"
          v-model="password"
        />
      </div>
      <div class="setting__userDataContainer">
        <h1 class="setting__userDataHeader">Изученные слова</h1>
        <setting-field
          title="Количество слов предоставляемых за одно повторение:"
          :data="userInfo.options?.[0]?.countKnownWordsAtOneTime"
          field="countKnownWordsAtOneTime"
          inputType="Number"
          placeholder=""
          :errors="errors"
          @change="(payload) => checkField(payload)"
          @close="(payload) => clearField(payload)"
          v-model="countKnownWordsAtOneTime"
        />
      </div>
      <div class="setting__userDataContainer">
        <h1 class="setting__userDataHeader">Слова на повторении</h1>
        <setting-field
          title="Количество ошибок необходимых для добавления слова:"
          :data="userInfo.options?.[0]?.countWrongsToAddToRepeat"
          field="countWrongsToAddToRepeat"
          inputType="Number"
          placeholder=""
          :errors="errors"
          @change="(payload) => checkField(payload)"
          @close="(payload) => clearField(payload)"
          v-model="countWrongsToAddToRepeat"
        />

        <!-- REGULARITY TO REPEAT -->
        <div
          class="setting__container"
          style="
            flex-direction: column;
            align-items: flex-start;
            position: relative;
          "
        >
          <div class="setting__regularityInfo">
            <p class="setting__userDataTittle" style="width: 345px">
              Регулярность повторения слова попавшее на повторение:
              {{ stringRegularityToRepeat }}
            </p>
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
                  @onEnter="
                    checkField({
                      field: 'regularityToRepeat',
                      fieldData: regularityToRepeat,
                    })
                  "
                  @onEsc="
                    regularityToRepeatChange = false;
                    clearField('regularityToRepeat');
                  "
                />
              </div>

              <p class="setting__regularDash" v-if="index != 7">-</p>
            </template>
          </div>
          <div class="setting__regularityButtonContainer">
            <button
              class="setting__userDataReplace _change"
              v-if="regularityToRepeatChange == false"
              @click="regularityToRepeatChange = true"
            >
              Изменить
            </button>
            <img
              src="@/assets/closeRed.png"
              alt=""
              class="setting__userDataClose"
              v-if="regularityToRepeatChange == true"
              @click="
                regularityToRepeatChange = false;
                clearField('regularityToRepeat');
              "
            />
            <button
              class="setting__userDataReplace"
              v-if="regularityToRepeatChange == true"
              @click="
                checkField({
                  field: 'regularityToRepeat',
                  fieldData: regularityToRepeat,
                })
              "
            >
              Сохранить
            </button>
          </div>
        </div>
      </div>
      <!-- -->
      <div class="setting__userDataContainer">
        <h1 class="setting__userDataHeader">Проверка на актуальность</h1>
        <setting-field
          title="Количество встреч за выбранный промежуток времени:"
          :data="userInfo.options?.[0]?.maxCountCheckRelevance"
          field="maxCountCheckRelevance"
          inputType="Number"
          placeholder=""
          :errors="errors"
          @change="(payload) => checkField(payload)"
          @close="(payload) => clearField(payload)"
          v-model="maxCountCheckRelevance"
        />
        <setting-field
          title="Промежуток времени, на котором считаются встречи (в днях):"
          :data="userInfo.options?.[0]?.maxDateCheckRelevance"
          field="maxDateCheckRelevance"
          inputType="Number"
          placeholder=""
          :errors="errors"
          @change="(payload) => checkField(payload)"
          @close="(payload) => clearField(payload)"
          v-model="maxDateCheckRelevance"
        />
      </div>
      <div class="setting__userDataContainer">
        <h1 class="setting__userDataHeader">Резервная копия</h1>
        <div class="setting__backup">
          <button class="setting__backupButton export" @click="exportData">
            Экспортировать
          </button>

          <input
            id="import"
            type="file"
            class="hidden"
            @change="importData"
            ref="import"
            :disabled="isLoading == true ? true : false"
          />
          <label for="import" class="setting__backupButton import"
            >Импортировать</label
          >
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import iconPopup from "../components/iconPopup.vue";
import settingField from "../components/settingField.vue";
import multipleInputTooltip from "../components/multipleInputTooltip.vue";
import infoPopup from "../components/infoPopup.vue";
import confirmPopup from "../components/confirmPopup.vue";
import closeModalButton from "../components/closeModalButton.vue";
import loadingPopup from "../components/loadingPopup.vue";

export default {
  emits: ["close", "noAuth"],

  components: {
    iconPopup,
    settingField,
    multipleInputTooltip,
    infoPopup,
    confirmPopup,
    closeModalButton,
    loadingPopup,
  },
  data() {
    return {
      nickName: "",
      userName: "",
      email: "",
      password: "",
      countKnownWordsAtOneTime: "",
      countWrongsToAddToRepeat: "",
      regularityToRepeat: ["", "", "", "", "", "", "", ""],
      maxCountCheckRelevance: "",
      maxDateCheckRelevance: "",
      iconPopupVisible: false,
      regularityToRepeatChange: false,
      errors: {},
      isLoading: false,
    };
  },
  computed: {
    userInfo() {
      return this.$store.getters.getUserInfo;
    },
    stringRegularityToRepeat() {
      let regularity = this.userInfo.options?.[0].regularityToRepeat;
      if (!regularity) return "";
      let stringRegularity = "";
      Object.values(regularity).forEach((el) => {
        if (stringRegularity == "") stringRegularity = `${el}`;
        stringRegularity += `-${el}`;
      });
      return stringRegularity;
    },
    avatar() {
      if (
        this.userInfo?.avatar != "" &&
        Object.keys(this.userInfo).length > 0
      ) {
        return `https://krainovdictionary.ru/uploads/${this.userInfo.nickName}/${this.userInfo.avatar}`;
      }
      return require("../assets/avatar.png");
    },
  },
  methods: {
    async showInfo(header, title) {
      await this.$refs.info.show(header, title);
    },
    async showConfirm(header, title) {
      let res = await this.$refs.confirm.show(header, title);
      return res;
    },
    dateFormat(date) {
      date = new Date(date);
      let minute = date.getMinutes();
      let hour = date.getHours();
      const day = date.getDate();
      const month = date.getMonth() + 1;
      const year = date.getFullYear();

      if (minute >= 0 && minute < 10) {
        minute = `0${minute}`;
      }
      if (hour >= 0 && hour < 10) {
        hour = `0${hour}`;
      }

      return `${day}-${month}-${year}`;
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
    validateField(field, fieldData) {
      if (fieldData.length == 0) {
        this.errors[field] = "Поле обязательно для заполнения!";
        return;
      }
      if (
        !/^[0-9]+$/.test(fieldData) &&
        (field == "countKnownWordsAtOneTime" ||
          field == "countWrongsToAddToRepeat" ||
          field == "maxCountCheckRelevance" ||
          field == "maxDateCheckRelevance")
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
          if (fieldData.length < 3 || fieldData.length > 25) {
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
          if (fieldData.length < 2 || fieldData.length > 15) {
            this.errors[field] =
              "Длина Имени не должна превышать 15 символов или быть меньше, чем 2 символа! Если ваше имя содержит более 15-ти символов, используйте, пожалуйста, сокращенную версию!";
            return;
          }
          break;
        case "email":
          if (
            !/^[a-z0-9][a-z0-9-_.]+@([a-z]|[a-z0-9]?[a-z0-9-]+[a-z0-9]).[a-z0-9]{2,10}(?:.[a-z]{2,10})?$/.test(
              fieldData.toLowerCase()
            )
          ) {
            this.errors[field] = "Неверный формат введенного Email!";
            return;
          }
          break;
        case "password":
          if (
            !/^[a-z0-9][a-z0-9-_.]+@([a-z]|[a-z0-9]?[a-z0-9-]+[a-z0-9]).[a-z0-9]{2,10}(?:.[a-z]{2,10})?$/.test(
              fieldData.toLowerCase()
            )
          ) {
            this.errors[field] = "Неверный формат введенного Email!";
            return;
          }
          break;
        case "countKnownWordsAtOneTime": {
          if (fieldData < 20 || fieldData > 99) {
            this.errors[field] =
              "За один урок следует повторять не менее 20 слов и не более 99!";
            return;
          }
          break;
        }
        case "countWrongsToAddToRepeat": {
          if (fieldData < 3 || fieldData > 9) {
            this.errors[field] =
              "Слово не следует добавлять чаще, чем после 3 ошибок и реже, чем после 9!";
            return;
          }
          break;
        }
        case "maxCountCheckRelevance": {
          if (fieldData < 3 || fieldData > 9) {
            this.errors[field] =
              "Слово не следует добавлять чаще, чем после 3 встреч и реже, чем после 9!";
            return;
          }
          break;
        }
        case "maxDateCheckRelevance": {
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
    async checkField(data) {
      let { field, fieldData } = data;
      if (field == "password" || field == "email")
        fieldData = fieldData.toLowerCase();
      this.validateField(field, fieldData);
      if (this.errors[field]) {
        return;
      }
      this.clearField(field);
      if (field == "regularityToRepeat") {
        this.regularityToRepeatChange = false;
        fieldData = fieldData.map((x) => +x);
      }
      let confirm = await this.showConfirm(
        "Изменение данных",
        `Вы уверены что хотите внести следующие изменения: "${fieldData}" ?`
      );
      if (!confirm) return;

      let form = {};
      form[field] = fieldData;
      this.sendInfo(form);
    },
    async sendInfo(form) {
      try {
        if (this.isLoading == true) return;
        this.isLoading = true;

        let res = await this.$api.user.info(form);
        let message = res?.data?.message;
        let user = res?.data?.user;

        this.isLoading = false;

        this.showInfo(`Редактирование информации`, message);
        this.$store.commit("setUserInfo", user);
      } catch (err) {
        let status = err?.response?.status;
        let message = err?.response?.data?.message || "Сервер не отвечает!";
        this.isLoading = false;

        if (status == 401) {
          this.$emit("noAuth");
        }
        if (status == 400) {
          this.showInfo(`Редактирование информации`, message);
          return;
        }
        this.showInfo(`Редактирование информации`, message);
      }
    },
    async exportData() {
      try {
        if (this.isLoading == true) return;
        this.isLoading = true;

        let res = await this.$api.user.export();
        let userData = res?.data?.message;
        this.isLoading = false;

        let blob = new Blob([userData], { type: "text/plain" });
        let link = document.createElement("a");
        link.setAttribute("href", URL.createObjectURL(blob));
        link.setAttribute("download", "userData.txt");
        link.click();
      } catch (err) {
        let message = err?.response?.data?.message || "Сервер не отвечает!";
        let status = err?.response?.status;
        this.isLoading = false;
        if (status == 401) {
          this.$emit("noAuth");
        }
        this.showInfo(`Экспорт`, message);
      }
    },
    async importData(event) {
      try {
        let file = event.target.files[0];
        this.$refs.import.value = null;
        let type = file.type;
        let size = file.size;
        let maxSize = 10 * 1024 * 1024;
        if (type != "text/plain" || size > maxSize) {
          throw new Error("Неверный тип данных!");
        }
        let userInfo = await file.text();
        userInfo = JSON.parse(userInfo);

        let confirm = await this.$refs.confirm.show(
          "Импорт",
          "Вы уверены что хотите заменить данные об изученных словах? Если вы используете старую резеврную копию, то весь достигнутый с этой даты прогресс будет утерян."
        );
        if (!confirm) return;
        if (this.isLoading == true) return;
        this.isLoading = true;

        let res = await this.$api.user.import({ userInfo });
        this.isLoading = false;
        userInfo = res?.data?.user;
        this.$store.commit("setUserInfo", userInfo);
        this.$api.offline.setSignatureAPI(userInfo);
        this.showInfo("Импорт", "Файл успешно импортирован!");
      } catch (err) {
        this.isLoading = false;
        this.showInfo("Импорт", "Неверный формат файла или данных!");
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
    countKnownWordsAtOneTime() {
      if (this.errors?.countKnownWordsAtOneTime)
        this.validateField(
          "countKnownWordsAtOneTime",
          this.countKnownWordsAtOneTime
        );
    },
    countWrongsToAddToRepeat() {
      if (this.errors?.countWrongsToAddToRepeat)
        this.validateField(
          "countWrongsToAddToRepeat",
          this.countWrongsToAddToRepeat
        );
    },
    maxCountCheckRelevance() {
      if (this.errors?.maxCountCheckRelevance)
        this.validateField(
          "maxCountCheckRelevance",
          this.maxCountCheckRelevance
        );
    },
    maxDateCheckRelevance() {
      if (this.errors?.maxDateCheckRelevance)
        this.validateField("maxDateCheckRelevance", this.maxDateCheckRelevance);
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
