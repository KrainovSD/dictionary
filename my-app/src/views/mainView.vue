<template>
  <sign-form
    v-if="signVisiable == true"
    :signType="signType"
    :responseMessage="responseMessage"
    @close="
      this.signVisiable = false;
      this.responseMessage = '';
    "
    @sign="sign"
    @switch="
      this.responseMessage = '';
      this.signType = 'signUp';
    "
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
          <img src="@/assets/avatar.png" alt="" class="header__avatar" />
          <p class="header__nickName">{{ userInfo.nickName }} Krainov</p>
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
          <div class="header__settingsItem" @click="logOut">
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
      responseMessage: "",
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
      let userInfo = this.$store.getters.getInfo;
      return userInfo;
    },
  },
  methods: {
    checkAuth() {
      this.$api.auth
        .checkAuth()
        .then((res) => {
          console.log(res);
          switch (res.data.type) {
            case 1: {
              let user = res.data.userInfo;
              this.$store.commit("setUserInfo", user);
              break;
            }
            default: {
              this.$store.commit("resetAuth");
              break;
            }
          }
        })
        .catch((err) => {
          console.log(err);
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
    sign(data) {
      console.log(data, this.signType);
      if (this.signType == "signUp") {
        this.$api.auth
          .register(data)
          .then((res) => {
            console.log(res);
            switch (res.data.type) {
              case 1: {
                // Информационное окно
                this.infoHeader = "Регистрация";
                this.infoTittle = res.data.message;
                this.infoVisiable = true;
                this.signVisiable = false;
                break;
              }
              default: {
                this.responseMessage = res.data.message;
                break;
              }
            }
          })
          .catch((err) => {
            console.log(err);
            this.responseMessage = "Сервер не отвечает";
          });
      } else if (this.signType == "signIn") {
        this.$api.auth
          .login(data)
          .then((res) => {
            console.log(res);
            switch (res.data.type) {
              case 1: {
                let user = res.data.userInfo;
                this.$store.commit("setUserInfo", user);
                this.signVisiable = false;
                break;
              }
              default: {
                this.responseMessage = res.data.message;
                break;
              }
            }
          })
          .catch((err) => {
            console.log(err);
            this.responseMessage = "Сервер не отвечает";
          });
      }
    },
    logOut() {
      this.$api.auth
        .logout()
        .then((res) => {
          console.log(res);
          this.checkAuth();
        })
        .catch((err) => {
          console.log(err);
          this.checkAuth();
        });
    },
  },
};
</script>

<style></style>
