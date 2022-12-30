<template>
  <sign-form
    v-if="signVisible == true"
    :signType="signType"
    @close="this.signVisible = false"
    @switch="this.signType = 'register'"
    @register="(payload) => register(payload)"
  />
  <info-popup ref="info" />
  <setting-popup
    v-if="settingPopupVisible == true"
    @close="
      settingPopupVisible = false;
      userMenuVisible = false;
    "
    @noAuth="noAuth"
  />

  <div class="header">
    <div class="headerContainer">
      <img src="@/assets/KrainovLogo.png" alt="" class="header__logo" />
      <div class="header__titles">
        <router-link :to="{ name: 'home' }" class="header__title">
          Главная</router-link
        >
        <router-link :to="{ name: 'learn' }" class="header__title"
          >Изучение</router-link
        >
        <router-link :to="{ name: 'actual' }" class="header__title"
          >Актуальность</router-link
        >
        <router-link :to="{ name: 'documentation' }" class="header__title"
          >Документация</router-link
        >
        <router-link :to="{ name: 'contacts' }" class="header__title"
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
  <div class="workplace">
    <router-view />
  </div>
</template>

<script>
import signForm from "../components/signForm.vue";
import infoPopup from "../components/infoPopup";
import settingPopup from "../components/settingPopup.vue";

export default {
  components: {
    infoPopup,
    signForm,
    settingPopup,
  },
  data() {
    return {
      signVisible: false,
      signType: "",
      userMenuVisible: false,
      settingPopupVisible: false,
    };
  },
  mounted() {
    if (!this.auth) this.checkAuth();
  },
  computed: {
    auth() {
      let auth = this.$store.getters.getAuth;
      return auth;
    },
    userInfo() {
      let userInfo = this.$store.getters.getUserInfo;
      return userInfo;
    },
    avatar() {
      if (
        this.userInfo?.avatar != "" &&
        Object.keys(this.userInfo).length > 0
      ) {
        return require(`../assets/avatar/${this.userInfo.nickName}/${this.userInfo.avatar}`);
      }
      return require("../assets/avatar.png");
    },
  },
  methods: {
    checkAuth() {
      this.$api.auth
        .checkAuth()
        .then((res) => {
          let user = res.data.user;
          let token = res.data.token;
          this.$store.commit("setUserInfo", user);
          this.$store.commit("setAccessToken", token);
        })
        .catch(() => {
          this.$store.commit("resetAuth");
        });
    },
    openSettingPopup() {},
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
    async showInfo(header, title) {
      await this.$refs.info.show(header, title);
    },
    register(payload) {
      this.showInfo("Регистрация", payload);
      this.signVisible = false;
    },
    logout() {
      this.userMenuVisible = false;
      this.$api.auth
        .logout()
        .then((res) => {
          this.showInfo("Выход из системы", res.data.message);
          this.$store.commit("resetAuth");
        })
        .catch((err) => {
          this.showInfo("Выход из системы", err.response.data.message);
          this.$store.commit("resetAuth");
        });
    },
    noAuth() {
      this.settingPopupVisible = false;
      this.userMenuVisible = false;
      this.signType = "login";
      this.signVisible = true;
      this.showInfo("Need authorization", "Change field");
    },
  },
};
</script>

<style></style>
