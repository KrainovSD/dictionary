<template>
  <info-popup ref="info" />
  <loading-popup v-if="isLoading == true" />
  <div class="testPanel" v-if="isAdmin">
    <h1 class="testPanel__header">Меню для тестирования</h1>
    <div class="testPanel__container">
      <h1 class="testPanel__nameTest">Study words</h1>
      <button class="testPanel__buttonTest">Создать паттерн категорий</button>
      <button class="testPanel__buttonTest">Проверка обычного повтора</button>
      <button class="testPanel__buttonTest">
        Проверка реверсивного повтора
      </button>
    </div>
    <h1 class="testPanel__header">Добавление слов в категорию изученных</h1>
    <div class="testPanel__container">
      <div class="testPanel__addKnownWordsContainer">
        <input type="file" @change="checkKnownWordsFile" ref="fileKnownWords" />
        <p>Пользователь:</p>
        <div
          class="testPanel__userList"
          @click.self="this.$refs.subMenu.classList.toggle('_show')"
        >
          {{ currentSelectedUser }}
          <div class="testPanel__subMenu" ref="subMenu">
            <p v-if="userList?.length == 0" @click="getUserList">
              Запросить список пользователей
            </p>
            <template v-for="(item, index) in userList" :key="index">
              <p
                @click="
                  currentSelectedUser = item;
                  this.$refs.subMenu.classList.toggle('_show');
                "
                :class="currentSelectedUser == item ? '_selected' : ''"
              >
                {{ item }}
              </p>
            </template>
          </div>
        </div>
        <div style="margin-left: 20px">
          <div
            class="testPanel__button"
            :class="
              currentSelectedUser == 'Не выбран' || !isHasKnownWordsFile
                ? '_disabled'
                : ''
            "
            :disabled="
              currentSelectedUser == 'Не выбран' || !isHasKnownWordsFile
                ? true
                : false
            "
            @click="addNewKnownWords"
          >
            Добавить
          </div>
        </div>
      </div>
      <div class="testPanel__createImportFileContainer">
        <p>Сбор слов для импорта:</p>
        <textarea ref="export" class="testPanel__exportField"></textarea>
        <div style="margin-top: 10px">
          <div class="testPanel__button" @click="exportWords">Экспорт</div>
        </div>
      </div>
    </div>
  </div>
  <div class="notFound" v-else>404 NOT FOUND PAGE</div>
</template>

<script>
import infoPopup from "../components/infoPopup.vue";
import loadingPopup from "../components/loadingPopup.vue";
export default {
  components: {
    infoPopup,
    loadingPopup,
  },
  data() {
    return {
      isLoading: false,
      userList: [],
      currentSelectedUser: "Не выбран",
      isHasKnownWordsFile: false,
    };
  },
  computed: {
    isAuth() {
      let auth = this.$store.getters.getAuth;
      return auth;
    },
    userInfo() {
      let userInfo = this.$store.getters.getUserInfo;
      if (Object.keys(userInfo)?.length == 0) {
        userInfo = this.$api.offline.getUserInfo();
      }
      return userInfo;
    },
    isAdmin() {
      if (!this.isAuth) return false;
      if (this.userInfo.role != "admin") return false;
      return true;
    },
  },
  methods: {
    async showInfo(header, title) {
      await this.$refs.info.show(header, title);
      return;
    },
    async checkKnownWordsFile(event) {
      try {
        let file = event.target.files[0];
        let type = file.type;
        let size = file.size;
        let maxSize = 10 * 1024 * 1024;
        if (type != "text/plain" || size > maxSize) {
          throw new Error("Неверный тип данных!");
        }
        let words = await file.text();
        words = JSON.parse(words);
        console.log(words);
        this.isHasKnownWordsFile = true;
      } catch (err) {
        console.log(err);
        this.$refs.fileKnownWords.value = null;
        this.isHasKnownWordsFile = false;
      }
    },
    async getUserList() {
      try {
        if (this.isLoading == true) return;
        this.isLoading = true;

        let res = await this.$api.admin.getUserList();

        this.isLoading = false;
        this.userList = res.data.userList || [];
      } catch (err) {
        let message = err?.response?.data?.message || err?.message;
        this.isLoading = false;
        this.showInfo("Операция администрирования", message);
      }
    },
    async addNewKnownWords() {
      try {
        let file = this.$refs.fileKnownWords.files[0];
        if (!file) return;
        let words = await file.text();
        words = JSON.parse(words);

        if (this.isLoading == true) return;
        this.isLoading = true;
        let data = {
          user: this.currentSelectedUser,
          words,
        };
        let res = await this.$api.admin.addNewKnownWords(data);

        let message = res?.data?.message;
        this.isLoading = false;
        this.showInfo("Операция администрирования", message);
      } catch (err) {
        console.log(err);
        let message = err?.response?.data?.message || err?.message;
        this.isLoading = false;
        this.showInfo("Операция администрирования", message);
      }
    },
    exportWords() {
      let words = this.$refs.export.value;
      words = words.split("/");
      words = words.filter((item) => item.trim().length > 0);
      words = words.map((item) => item.trim());
      if (words.length == 0) {
        console.log("Слов нет");
        return;
      }
      let result = [];
      for (let item of words) {
        let destruction = item.split(";");
        let destructionExample = destruction[4].split("@");

        let word = destruction[0].trim().toLowerCase();
        let translate = destruction[1].trim().toLowerCase();
        let transcription = destruction[2].trim();
        if (!/\[/.test(transcription)) transcription = `[${transcription}`;
        if (!/\]/.test(transcription)) transcription = `${transcription}]`;

        let description = destruction[3].trim();
        if (
          description !== "" &&
          description[0]?.toUpperCase() != description[0]
        )
          description = `${description[0].toUpperCase()}${description.substring(
            1
          )}`;

        let examples = [];
        while (examples.length < 3) {
          let example = destructionExample?.[examples.length]?.trim() || "";
          if (example !== "" && example[example.length - 1] != ".")
            example = `${example}.`;
          examples.push(example);
        }
        result.push({
          word,
          translate,
          transcription,
          description,
          example: examples,
        });
        if (description.length > 164) {
          console.log(`У слова ${word} длинное описание`);
          return;
        }
        for (let example of examples) {
          if (example.length > 100) {
            console.log(`У слова ${word} длинный пример`);
            return;
          }
        }
      }
      result = JSON.stringify(result);
      let blob = new Blob([result], { type: "text/plain" });
      let link = document.createElement("a");
      link.setAttribute("href", URL.createObjectURL(blob));
      link.setAttribute("download", "userData.txt");
      link.click();
    },
  },
};
</script>

<style></style>
