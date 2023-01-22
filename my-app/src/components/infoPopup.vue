<template>
  <div class="modal__backDrop z15" ref="backDrop" v-if="isVisible"></div>
  <div class="modal__container info z16" v-if="isVisible">
    <div class="infoPopup">
      <h1 class="infoPopup__header">{{ header }}</h1>
      <div class="infoPopup__line"></div>
      <div class="infoPopup__titleContainer">
        <p
          class="infoPopup__title"
          v-for="(item, index) in fullTitle"
          :key="index"
          :class="item.length == 0 ? '_enter' : ''"
        >
          {{ item }}
        </p>
      </div>
      <div class="infoPopup__line"></div>
      <div class="infoPopup__confirmContainer">
        <confirm-button text="OK" @click="closePopup" fontSize="16px" />
      </div>
    </div>
  </div>
</template>

<script>
import confirmButton from "../components/confirmButton.vue";
export default {
  components: { confirmButton },
  infoContoller: null,
  data() {
    return {
      title: "",
      header: "",
      isVisible: false,
    };
  },
  computed: {
    fullTitle() {
      let title = this.title.split("\n");
      return title;
    },
  },
  methods: {
    keyBoardEvent(event) {
      if (this.isVisible == false) return;
      let code = event.keyCode;
      if (code == 13) return this.closePopup();
      if (code == 27) return this.closePopup();
    },
    closePopup() {
      document.removeEventListener("keyup", this.keyBoardEvent);
      if (!this.$refs.backDrop.classList.contains("close")) {
        this.$refs.backDrop.classList.toggle("close");
        setTimeout(() => {
          this.$refs.backDrop.classList.toggle("close");
          this.isVisible = false;
          this.$options.infoContoller.resolve(true);
        }, 300);
      }
    },
    show(header, title) {
      this.title = title;
      this.header = header;
      this.isVisible = true;
      let resolve, reject;
      document.addEventListener("keyup", this.keyBoardEvent);

      const infoPromise = new Promise((confirm, cancel) => {
        resolve = confirm;
        reject = cancel;
      });
      this.$options.infoContoller = { resolve, reject };
      return infoPromise;
    },
  },
};
</script>

<style>
.infoPopup {
  margin: auto;
  background: linear-gradient(-42deg, #fce5f9 50%, #e7fcf5 50%);
  display: flex;
  flex-direction: column;
  min-width: 30%;
  max-width: 60%;
  padding: 20px;
}
@media (max-width: 1023px) {
  .infoPopup {
    min-width: none;
    max-width: 100vw;
    width: auto;
  }
}
.infoPopup__header {
  font-weight: 700;
  font-size: 24px;
  margin: 0 auto;
  text-align: center;
  width: 100%;
}
.infoPopup__titleContainer {
  margin: 0 auto;
  width: 100%;
}
.infoPopup__title {
  font-size: 18px;
  font-family: "Times New Roman", Times, serif;
  text-align: center;
}
.infoPopup__title._enter {
  margin-top: 10px;
}
.infoPopup__line {
  width: 90%;
  margin: 8px auto;
  height: 1px;
  background-color: black;
}
.infoPopup__confirmContainer {
  width: 30%;
  margin: 0.35714rem auto;
}
</style>
