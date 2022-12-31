<template>
  <div
    class="modal__backDrop"
    style="z-index: 1000"
    ref="backDrop"
    v-if="isVisible"
  >
    <div class="confirmPopup">
      <h1 class="confirmPopup__header">{{ header }}</h1>
      <div class="confirmPopup__line"></div>
      <p class="confirmPopup__title">
        {{ title }}
      </p>
      <div class="confirmPopup__line"></div>
      <div class="confirmPopup__buttonContainer">
        <div class="confirmPopup__confirmContainer left">
          <confirm-button text="Yes" @click="_confirm" fontSize="1vw" />
        </div>
        <div class="confirmPopup__confirmContainer right">
          <confirm-button text="No" @click="_cancel" fontSize="1vw" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import confirmButton from "../components/confirmButton.vue";

export default {
  components: { confirmButton },
  confirmController: null,
  data() {
    return {
      title: "",
      header: "",
      isVisible: false,
    };
  },

  methods: {
    keyBoardEvent(event) {
      if (this.isVisible == false) return;
      let code = event.keyCode;
      if (code == 13) return this._confirm();
      if (code == 27) return this._cancel();
    },
    closePopup() {
      if (this.isVisible == false) return;
      document.removeEventListener("keyup", this.keyBoardEvent);
      if (!this.$refs.backDrop.classList.contains("close")) {
        this.$refs.backDrop.classList.toggle("close");
        setTimeout(() => {
          this.$refs.backDrop.classList.toggle("close");
          this.isVisible = false;
        }, 300);
      }
    },
    async show(header, title) {
      this.title = title;
      this.header = header;
      let resolve, reject;
      document.addEventListener("keyup", this.keyBoardEvent);

      const confirmPromise = new Promise((confirm, cancel) => {
        resolve = confirm;
        reject = cancel;
      });
      this.$options.confirmController = { resolve, reject };
      this.isVisible = true;
      return confirmPromise;
    },
    _confirm() {
      this.$options.confirmController.resolve(true);
      this.closePopup();
    },
    _cancel() {
      this.$options.confirmController.resolve(false);
      this.closePopup();
    },
  },
};
</script>

<style>
.confirmPopup {
  margin: auto;
  z-index: 2;
  background: linear-gradient(-42deg, #fce5f9 50%, #e7fcf5 50%);
  display: flex;
  flex-direction: column;
  min-width: 30%;
  max-width: 50%;
  padding: 20px;
}
.confirmPopup__header {
  font-weight: 700;
  font-size: 1.8vw;
  margin: 0 auto;
}
.confirmPopup__title {
  text-align: center;
  font-size: 1.2vw;
  font-family: Dreamcast;
}
.confirmPopup__line {
  width: 80%;
  margin: 8px auto;
  height: 1px;
  background-color: black;
}
.confirmPopup__buttonContainer {
  display: flex;
  padding-top: 0.5rem;
}
.confirmPopup__confirmContainer {
  width: 30%;
}
.confirmPopup__confirmContainer.left {
  margin: 0 auto 0 0;
}
.confirmPopup__confirmContainer.right {
  margin: 0 0 0 auto;
}
</style>
