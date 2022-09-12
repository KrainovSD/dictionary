<template>
  <div class="modal__backDrop" ref="backDrop">
    <div class="infoPopup">
      <h1 class="infoPopup__header">{{ infoHeader }}</h1>
      <div class="infoPopup__line"></div>
      <p class="infoPopup__tittle">
        {{ infoTittle }}
      </p>
      <div class="infoPopup__line"></div>
      <button class="infoPopup__button" ref="closeButton" @click="closePopup">
        OK
      </button>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    infoTittle: String,
    infoHeader: String,
  },
  data() {
    return {};
  },
  methods: {
    closePopup() {
      if (!this.$refs.closeButton.classList.contains("_active")) {
        this.$refs.closeButton.classList.toggle("_active");
        setTimeout(() => {
          this.$refs.closeButton.classList.toggle("_active");
          if (!this.$refs.backDrop.classList.contains("close")) {
            this.$refs.backDrop.classList.toggle("close");
            setTimeout(() => {
              this.$refs.backDrop.classList.toggle("close");
              this.$emit("close");
            }, 300);
          }
        }, 300);
      }
    },
  },
};
</script>

<style></style>
