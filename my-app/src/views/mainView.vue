<template>
  <sign-popup
    v-if="signVisiable == true"
    :signType="signType"
    @close="this.signVisiable = false"
    @sign="sign"
  />

  <div class="header">
    <div class="headerContainer">
      <img
        src="image/KrainovLogo.png"
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
          <img src="image/avatar.png" alt="" class="header__avatar" />
          <p class="header__nickName">{{ userInfo.nickName }}</p>
          <img src="image/arrow-down.png" alt="" class="header__arrow" />
        </div>
        <div
          class="header__userSettings"
          :class="userMenuVisiable == true ? '_active' : ''"
        >
          <div class="header__settingsItem">
            <img src="image/cog.png" alt="" class="header__settingsIcon" />
            <p class="header__settingsTittle">Настройки</p>
          </div>
          <div class="header__settingsItem" @click="logOut">
            <img src="image/exit.png" alt="" class="header__settingsIcon" />
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
import signPopup from "../components/signPopup.vue";
//import signTest from "../components/signTest.vue";
export default {
  components: {
    signPopup,
    //signTest,
  },
  data() {
    return {
      signVisiable: false,
      signType: "",
      userMenuVisiable: false,
    };
  },
  mounted() {},
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
          .signUp(data)
          .then((data) => {
            console.log(data);
          })
          .catch((err) => console.log(err));
      } else if (this.signType == "signIn") {
        this.$api.auth
          .signIn(data)
          .then((req) => {
            console.log(req);
            switch (req.data.type) {
              case 1: {
                //let message = req.data.message;
                break;
              }
              default:
                break;
            }
          })
          .catch((err) => console.log(err));
      }
    },
    logOut() {
      this.$api.auth
        .signOut()
        .then((data) => {
          console.log(data);
        })
        .catch((err) => console.log(err));
    },
    testToken() {
      this.$api.auth
        .getNewTokenTest()
        .then((data) => {
          console.log(data);
          let request = data.data;
          console.log(request);
        })
        .catch((err) => {
          console.log(err);
        });
    },
  },
};
</script>

<style></style>
