<template>
  <div class="modal__backDrop" style="z-index: 1000" ref="backDrop">
    <div class="infoPopup">
      <h1 class="infoPopup__header">{{ infoHeader }}</h1>
      <div class="infoPopup__line"></div>
      <p class="infoPopup__title">
        {{ infoTittle }}
      </p>
      <div class="infoPopup__line"></div>
      <div class="infoPopup__confirmContainer">
        <confirm-button text="OK" @click="closePopup" fontSize="1vw" />
      </div>
    </div>
  </div>
</template>

<script>
import confirmButton from "../components/confirmButton.vue";
export default {
  components: { confirmButton },
  props: {
    infoTittle: String,
    infoHeader: String,
  },
  data() {
    return {};
  },
  methods: {
    closePopup() {
      if (!this.$refs.backDrop.classList.contains("close")) {
        this.$refs.backDrop.classList.toggle("close");
        setTimeout(() => {
          this.$refs.backDrop.classList.toggle("close");
          this.$emit("close");
        }, 300);
      }
    },
  },
};
</script>

<style>
.infoPopup {
  margin: auto;
  z-index: 2;
  background: linear-gradient(-42deg, #fce5f9 50%, #e7fcf5 50%);
  display: flex;
  flex-direction: column;
  min-width: 30%;
  max-width: 50%;
  padding: 20px;
}
.infoPopup__header {
  font-weight: 700;
  font-size: 1.8vw;
  margin: 0 auto;
}
.infoPopup__title {
  text-align: center;
  font-size: 1.2vw;
  font-family: Dreamcast;
}
.infoPopup__line {
  width: 80%;
  margin: 8px auto;
  height: 1px;
  background-color: black;
}
.infoPopup__confirmContainer {
  width: 30%;
  margin: 0.35714rem auto;
}
</style>
