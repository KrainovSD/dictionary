<template>
  <sign-form
    v-if="signVisiable == true"
    :signType="signType"
    @close="this.signVisiable = false"
    @switch="this.signType = 'signUp'"
    @register="(payload) => register(payload)"
  />
  <info-popup
    v-if="infoVisiable == true"
    :infoTittle="infoTittle"
    :infoHeader="infoHeader"
    @close="
      this.infoVisiable = false;
      this.infoTittle = '';
      this.infoHeader = '';
    "
  />
  <setting-popup
    v-if="settingPopupVisible == true"
    @close="
      settingPopupVisible = false;
      userMenuVisiable = false;
    "
  />

  <div class="header">
    <div class="headerContainer">
      <img
        src="@/assets/KrainovLogo.png"
        alt=""
        class="header__logo"
        @click="testToken"
      />
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
        <button class="header__signIn" ref="signIn" @click="openSignIn">
          Войти
        </button>
        <button class="header__signUp" ref="signUp" @click="openSignUp">
          Регистрация
        </button>
      </div>
      <div class="header__userMenu" v-if="auth == true">
        <div
          class="header__activeUserMenu"
          @click="
            if (userMenuVisiable == true) userMenuVisiable = false;
            else userMenuVisiable = true;
          "
        >
          <img :src="avatar" alt="" class="header__avatar" />
          <p class="header__nickName">{{ userInfo.nickName }}</p>
          <img src="@/assets/arrow-down.png" alt="" class="header__arrow" />
        </div>
        <div
          class="header__userSettings"
          :class="userMenuVisiable == true ? '_active' : ''"
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
//import signTest from "../components/signTest.vue";
export default {
  components: {
    infoPopup,
    signForm,
    settingPopup,
    //signTest,
  },
  data() {
    return {
      signVisiable: false,
      signType: "",
      userMenuVisiable: false,
      infoVisiable: false,
      infoTittle: "",
      infoHeader: "",
      settingPopupVisible: false,
    };
  },
  mounted() {
    this.checkAuth();
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
      if (this.userInfo?.avatar != "none") {
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
          this.$store.commit("setUserInfo", user);
        })
        .catch(() => {
          this.$store.commit("resetAuth");
        });
    },
    openSettingPopup() {},
    openSignIn() {
      if (!this.$refs.signIn.classList.contains("header__signIn_active")) {
        this.$refs.signIn.classList.toggle("header__signIn_active");
        setTimeout(() => {
          this.$refs.signIn.classList.toggle("header__signIn_active");
        }, 500);
        this.signVisiable = true;
        this.signType = "signIn";
      }
    },
    openSignUp() {
      if (!this.$refs.signUp.classList.contains("header__signUp_active")) {
        this.$refs.signUp.classList.toggle("header__signUp_active");
        setTimeout(() => {
          this.$refs.signUp.classList.toggle("header__signUp_active");
        }, 500);
        this.signVisiable = true;
        this.signType = "signUp";
      }
    },
    showInfoPopup(header, tittle) {
      this.infoHeader = header;
      this.infoTittle = tittle;
      this.infoVisiable = true;
    },
    register(payload) {
      this.showInfoPopup("Регистрация", payload);
      this.signVisiable = false;
    },
    logout() {
      this.$api.auth
        .logout()
        .then((res) => {
          this.showInfoPopup("Logout", res.data.message);
          this.$store.commit("resetAuth");
        })
        .catch((err) => {
          this.showInfoPopup("Logout", err.response.data.message);
          this.$store.commit("resetAuth");
        });
    },
  },
};
</script>

<style></style>
