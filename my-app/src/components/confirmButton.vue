<template>
  <button
    class="confirmButton"
    ref="confirmButton"
    @click="confirmData"
    :style="`font-size: ${fontSize}px`"
  >
    {{ text }}
  </button>
</template>

<script>
export default {
  props: {
    text: String,
    fontSize: String,
  },
  methods: {
    confirmData() {
      let confirmButton = this.$refs.confirmButton;
      if (!confirmButton.classList.contains("_active")) {
        confirmButton.classList.toggle("_active");

        setTimeout(() => {
          confirmButton.classList.toggle("_active");
        }, 300);
      }
    },
  },
};
</script>

<style>
.confirmButton {
  width: 100%;
  height: 100%;
  padding: 13px;
  font-family: Dreamcast;
  position: relative;
  background-color: white;
  border-radius: 3px;
  box-shadow: 0px 0px 4px 0px #ffffff;
  outline: 1px solid rgba(#ffffff, 0.5);
  transition: all 0.3s ease;
  background-color: #ffffff;
}
.confirmButton:hover {
  transform: translateY(-4px);
  box-shadow: 0px 8px 8px -6px #6092ff;
  outline: 1px solid rgba(#6092ff, 0.5);
}
.confirmButton._active {
  outline: 1px solid rgba(#6092ff, 0);
  outline-offset: 15px;
  transform: translateY(0);
  box-shadow: 0px 0 0 0 #fff;
}
</style>
