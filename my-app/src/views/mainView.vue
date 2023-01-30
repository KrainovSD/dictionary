<template>
  <sign-form
    v-if="signVisible == true"
    :signType="signType"
    @close="this.signVisible = false"
    @switch="this.signType = 'register'"
  />
  <info-popup ref="info" />
  <loading-popup v-if="isLoading == true" />
  <setting-popup
    v-if="settingPopupVisible == true"
    @close="
      settingPopupVisible = false;
      userMenuVisible = false;
    "
    @noAuth="noAuth"
  />
  <test-panel v-if="isTestVisible" @close="isTestVisible = false" />

  <div class="header">
    <div class="headerContainer">
      <div
        class="header__subMenu menuMobile"
        ref="subMenu"
        @click="toggleSubMenu"
      >
        <div class="bar1 menuMobile"></div>
        <div class="bar2 menuMobile"></div>
        <div class="bar3 menuMobile"></div>
      </div>

      <img
        src="@/assets/KrainovLogo.png"
        alt=""
        class="header__logo"
        @click="openTestPanel"
      />
      <img src="@/assets/logoBlack.png" alt="" class="header__logoMobile" />

      <div class="header__titles" ref="titles">
        <router-link
          :to="{ name: 'home' }"
          @click="toggleSubMenu"
          class="header__title"
        >
          Главная</router-link
        >
        <router-link
          :to="{ name: 'statistic' }"
          @click="toggleSubMenu"
          class="header__title"
          >Изучение</router-link
        >
        <router-link
          :to="{ name: 'actual' }"
          @click="toggleSubMenu"
          class="header__title"
          >Актуальность</router-link
        >
        <router-link
          :to="{ name: 'documentation' }"
          @click="toggleSubMenu"
          class="header__title"
          >Документация</router-link
        >
        <router-link
          :to="{ name: 'contacts' }"
          @click="toggleSubMenu"
          class="header__title"
          >Контакты</router-link
        >
      </div>
      <div class="header__authPanel" v-if="auth == false">
        <button class="header__signIn" ref="login" @click="openLogin">
          Войти
        </button>
        <button class="header__signUp" ref="register" @click="openRegister">
          Регистрация
        </button>
      </div>
      <div class="header__userMenu" v-if="auth == true">
        <div
          class="header__activeUserMenu"
          @click="
            if (userMenuVisible == true) userMenuVisible = false;
            else userMenuVisible = true;
          "
        >
          <img :src="avatar" alt="" class="header__avatar" />
          <p class="header__nickName">{{ userInfo.nickName }}</p>
          <img src="@/assets/arrow-down.png" alt="" class="header__arrow" />
        </div>
        <div
          class="header__userSettings"
          :class="userMenuVisible == true ? '_active' : ''"
        >
          <div class="header__settingsItem" @click="settingPopupVisible = true">
            <img src="@/assets/cog.png" alt="" class="header__settingsIcon" />
            <p class="header__settingsTittle">Настройки</p>
          </div>
          <div class="header__settingsItem" @click="logout">
            <img src="@/assets/exit.png" alt="" class="header__settingsIcon" />
            <p class="header__settingsTittle">Выход</p>
          </div>
        </div>
      </div>
    </div>
  </div>
  <div class="workplace" @click="toggleSubMenu">
    <router-view />
  </div>
</template>

<script>
import signForm from "../components/signForm.vue";
import infoPopup from "../components/infoPopup";
import settingPopup from "../components/settingPopup.vue";
import loadingPopup from "../components/loadingPopup.vue";
import testPanel from "../components/testPanel.vue";

export default {
  components: {
    infoPopup,
    signForm,
    settingPopup,
    loadingPopup,
    testPanel,
  },
  data() {
    return {
      signVisible: false,
      signType: "",
      userMenuVisible: false,
      settingPopupVisible: false,
      isLoading: false,
      testCombination: [],
      isTestVisible: false,
    };
  },
  async mounted() {
    console.log("v1");
    console.log(process.env);
    console.log(process.env.VUE_APP_PRODUCTION);

    await this.syncUserInfoWithServer();

    if (!this.auth) await this.checkAuth();
    document.addEventListener("keypress", this.validateKeyPress);

    await this.dailyCheckStreak();
    await this.checkActivities();
  },
  beforeUnmount() {
    document.removeEventListener("keypress", this.validateKeyPress);
  },
  computed: {
    auth() {
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
    avatar() {
      if (
        this.userInfo?.avatar != "" &&
        Object.keys(this.userInfo).length > 0
      ) {
        //const path = `../../upload/${this.userInfo.nickName}/${this.userInfo.avatar}`
        //return path;
        return require(`../assets/${this.userInfo.nickName}/${this.userInfo.avatar}`);
      }
      return require("../assets/avatar.png");
    },
  },
  methods: {
    validateKeyPress(event) {
      if (event.target.tagName == "BUTTON") event.preventDefault();
    },
    async showInfo(header, title) {
      await this.$refs.info.show(header, title);
    },
    noAuth() {
      this.settingPopupVisible = false;
      this.userMenuVisible = false;
      this.signType = "login";
      this.signVisible = true;
      this.showInfo("Авторизация", "Требуется авторизация!");
    },
    toggleSubMenu(e) {
      let subMenu = this.$refs.subMenu;
      let styleOfSubMenu = window.getComputedStyle(subMenu);
      if (styleOfSubMenu.display == "none") return;
      if (
        !subMenu.classList.contains("change") &&
        !e.target.classList.contains("menuMobile")
      )
        return;
      let titles = this.$refs.titles;
      if (e.target.classList.contains("header__title"))
        return setTimeout(() => {
          if (!subMenu.classList.contains("change")) return;
          subMenu.classList.toggle("change");
          titles.classList.toggle("_visible");
        }, 400);
      subMenu.classList.toggle("change");
      titles.classList.toggle("_visible");
    },
    openTestPanel() {
      /* alt x2, ctrl x3, click, alt*/
      this.isTestVisible = true;

      /*let pattern = this.testCombination.length;
      if (pattern == 0 || pattern == 1 || pattern == 6) {
        if (e.altKey && !e.ctrlKey) this.testCombination.push(true);
        else this.testCombination = [];
      } else if (pattern == 2 || pattern == 3 || pattern == 4) {
        if (!e.altKey && e.ctrlKey) this.testCombination.push(true);
        else this.testCombination = [];
      } else if (pattern == 5) {
        if (!e.altKey && !e.ctrlKey) this.testCombination.push(true);
        else this.testCombination = [];
      }

      if (this.testCombination.length == 7) this.isTestVisible = true;*/
    },
    openLogin() {
      let login = this.$refs.login;
      if (!login.classList.contains("header__signIn_active")) {
        login.classList.toggle("header__signIn_active");
        setTimeout(() => {
          login.classList.toggle("header__signIn_active");
        }, 500);
        this.signVisible = true;
        this.signType = "login";
      }
    },
    openRegister() {
      let register = this.$refs.register;
      if (!register.classList.contains("header__signUp_active")) {
        register.classList.toggle("header__signUp_active");
        setTimeout(() => {
          register.classList.toggle("header__signUp_active");
        }, 500);
        this.signVisible = true;
        this.signType = "register";
      }
    },
    async syncUserInfoWithServer() {
      try {
        if (this.isLoading == true) return;
        this.isLoading = true;

        let userInfo = this.$api.offline.getUserInfo();
        let res = await this.$api.user.syncInfo(userInfo);

        this.isLoading = false;
        userInfo = res?.data?.user;
        this.$store.commit("setUserInfo", userInfo);
        this.$api.offline.setSignatureAPI(userInfo);

        let message = res?.data?.message || res?.message;
        await this.showInfo("Синхронизация данных с сервером", message);
      } catch (err) {
        let message = err?.response?.data?.message || err?.message;
        this.isLoading = false;
        console.log(message);
      }
    },
    async checkAuth() {
      try {
        if (this.isLoading == true) return;
        this.isLoading = true;

        let res = await this.$api.auth.checkAuth();
        let user = res?.data?.user;
        let token = res?.data?.token;

        this.isLoading = false;

        this.$store.commit("setUserInfo", user);
        this.$api.offline.setSignatureAPI(user);
        this.$store.commit("setAccessToken", token);
      } catch (err) {
        this.isLoading = false;
        this.$store.commit("resetAuth");
      }
    },
    async dailyCheckStreak() {
      try {
        let lastDailyCheckStreak = this.$api.offline.getDayFromMillisecond(
          this.userInfo.statistics[0].lastDailyCheckStreak
        );
        let now = this.$api.offline.getDayFromMillisecond(Date.now());
        if (this.isLoading == true || lastDailyCheckStreak == now) return;

        let allWords = [
          ...this.userInfo.knownWords,
          ...this.userInfo.wordsToRepeat,
        ];
        let allCategories = [...this.userInfo.categoriesToLearn];
        allWords = allWords.filter((item) => item.offline != "delete");
        allCategories = allCategories.filter(
          (item) => item.offline != "delete" && item.startLearn == true
        );
        if (allWords.length == 0 && allCategories == 0) return;
        this.isLoading = true;

        let res = this.$store.getters.getAuth
          ? await this.$api.words.checkStreak()
          : this.$api.offline.checkStreak();

        this.isLoading = false;
        if (this.$store.getters.getAuth) {
          let userInfo = res?.data?.user;
          this.$store.commit("setUserInfo", userInfo);
          this.$api.offline.setSignatureAPI(userInfo);
        }
        let message = res?.data?.message || res?.message;
        await this.showInfo("Непрерывная серия повторения", message);
      } catch (err) {
        let message = err?.response?.data?.message || err?.message;
        let status = err?.response?.status;
        this.isLoading = false;
        if (status == 0 || status == 500) {
          this.$store.commit("resetAuth");
          return await this.dailyCheckStreak();
        }
        await this.showInfo("Непрерывная серия повторения", message);
      }
    },
    checkActivities() {
      let route = this.$route.name.toLowerCase();
      let necessaryNames = [
        "home",
        "known",
        "repeat",
        "newwords",
        "actual",
        "statistic",
      ];
      if (!necessaryNames.includes(route)) return;

      let userInfo = this.userInfo;
      let message = "";
      let categories = userInfo.categoriesToLearn;
      categories = categories.filter(
        (item) => item?.offline != "delete" && item.startLearn != false
      );
      let reverseRepeatCategories = categories.filter((item) => {
        let nextReverseRepeat = this.$api.offline.getDayFromMillisecond(
          item.nextReverseRepeat
        );
        let now = this.$api.offline.getDayFromMillisecond(Date.now());
        if (nextReverseRepeat <= now) return true;
        return false;
      });
      let standartRepeatCategories = categories.filter((item) => {
        let nextRepeat = this.$api.offline.getDayFromMillisecond(
          item.nextRepeat
        );
        let now = this.$api.offline.getDayFromMillisecond(Date.now());

        if (nextRepeat <= now) return true;
        return false;
      });

      if (
        reverseRepeatCategories.length > 0 ||
        standartRepeatCategories.length > 0
      )
        message +=
          'Сегодня требуется повторить категории из вкладки "Изучаемые"!\n';
      if (standartRepeatCategories.length > 0)
        message += `Количество категорий для обычного повторения: ${standartRepeatCategories.length}.\n`;
      if (reverseRepeatCategories.length > 0)
        message += `Количество категорий для реверсивного повторения: ${standartRepeatCategories.length}.\n`;
      if (
        reverseRepeatCategories.length > 0 ||
        standartRepeatCategories.length > 0
      )
        message += "\n";

      let repeatWords = userInfo.wordsToRepeat;
      repeatWords = repeatWords.filter((item) => item?.offline != "delete");
      let reverseRepeatWords = repeatWords.filter((item) => {
        let nextReverseRepeat = this.$api.offline.getDayFromMillisecond(
          item.nextReverseRepeat
        );

        let now = this.$api.offline.getDayFromMillisecond(Date.now());
        if (nextReverseRepeat <= now) return true;
        return false;
      });
      let standartRepeatWords = repeatWords.filter((item) => {
        let nextRepeat = this.$api.offline.getDayFromMillisecond(
          item.nextRepeat
        );
        let now = this.$api.offline.getDayFromMillisecond(Date.now());
        if (nextRepeat <= now) return true;
        return false;
      });
      if (reverseRepeatWords.length > 0 || standartRepeatWords.length > 0)
        message +=
          'Сегодня требуется повторить слова из вкладки "Повторяемые"!\n';
      if (standartRepeatWords.length > 0)
        message += `Количество слов для обычного повторения: ${standartRepeatWords.length}.\n`;
      if (reverseRepeatWords.length > 0)
        message += `Количество слов для реверсивного повторения: ${reverseRepeatWords.length}.\n`;
      if (reverseRepeatWords.length > 0 || standartRepeatWords.length > 0)
        message += "\n";

      let knownWords = userInfo.knownWords;
      if (knownWords.length > 0) {
        let standartRepeatKnownWords = this.$api.offline.getDayFromMillisecond(
          userInfo.statistics[0].lastRepeatKnownWords
        );
        let reverseRepeatKnownWords = this.$api.offline.getDayFromMillisecond(
          userInfo.statistics[0].lastReverseRepeatKnownWords
        );

        let now = this.$api.offline.getDayFromMillisecond(Date.now());
        if (standartRepeatKnownWords < now || reverseRepeatKnownWords < now)
          message +=
            'Сегодня рекомендуется повторить слова из вкладки "Изученные"!\n';
        if (standartRepeatKnownWords < now)
          message +=
            "Вы не проходили обычное повторение изученных слов сегодня.\n";
        if (reverseRepeatKnownWords < now)
          message +=
            "Вы не проходили реверсивное повторение изученных слов сегодня.";
      }
      if (message.length == 0) {
        message += "На сегодня все активности выполнены!";
      }
      this.showInfo("Задачи на сегодня", message);
    },
    async logout() {
      try {
        if (this.isLoading == true) return;
        this.isLoading = true;
        this.userMenuVisible = false;

        let res = await this.$api.auth.logout();
        let message = res?.data?.message;

        this.isLoading = false;

        this.showInfo("Выход из системы", message);
        this.$store.commit("resetAuth");
      } catch (err) {
        this.isLoading = false;
        let message = err?.response?.data?.message;
        this.showInfo("Выход из системы", message);
        this.$store.commit("resetAuth");
      }
    },
  },
};
</script>

<style></style>
