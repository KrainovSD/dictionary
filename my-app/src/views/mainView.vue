<template>
  <sign-popup
    v-if="signVisiable == true"
    :signType="signType"
    @close="this.signVisiable = false"
    @sign="sign"
  />
  <div class="header">
    <div class="headerContainer">
      <img src="image/KrainovLogo.png" alt="" class="header__logo" />
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
      <div class="header__authPanel" v-if="a == 0">
        <button class="header__signIn" ref="signIn" @click="openSignIn">
          Войти
        </button>
        <button class="header__signUp" ref="signUp" @click="openSignUp">
          Регистрация
        </button>
      </div>
      <div class="header__userMenu" v-if="a == 1">
        <img src="" alt="" class="header__avatar" />
        <p class="header__nickName">KrainovSD</p>
        <img src="" alt="" class="header_arrow" />
      </div>
    </div>
  </div>
  <div class="workplace">
    <router-view />
  </div>
</template>

<script>
import signPopup from "../components/signPopup.vue";
export default {
  components: { signPopup },
  data() {
    return {
      signVisiable: false,
      signType: "",
      a: 0,
    };
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
    },
    test() {
      console.log(this.$router);
      this.$router.push({ name: "home" });
    },

    get() {
      this.$api.testConnection
        .testGet()
        .then((data) => {
          console.log(data.data);
        })
        .catch((err) => console.log(err));
    },
    post() {
      this.$api.testConnection
        .testPost({ loh: "loh" })
        .then((data) => {
          console.log(data);
        })
        .catch((err) => console.log(err));
    },
  },
};
</script>

<style></style>
