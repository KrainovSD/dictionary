import { createStore } from "vuex";

const store = createStore({
  state() {
    return {
      auth: false,
      accessToken: "",
      user: {},
    };
  },
  getters: {
    getUserInfo(state) {
      return state.user;
    },
    getAccessToken(state) {
      return state.accessToken;
    },
    getAuth(state) {
      return state.auth;
    },
  },
  mutations: {
    setAccessToken(state, payload) {
      if (typeof payload == "string") state.accessToken = payload;
    },
    setUserInfo(state, payload) {
      if (typeof payload == "object") {
        state.user = payload;
        state.auth = true;
      }
    },
    resetAuth(state) {
      state.auth = false;
      state.user = {};
      state.accessToken = "";
    },
  },
});

export default store;
