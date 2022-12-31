<template>
  <img
    src="@/assets/close.png"
    alt=""
    class="closeButton"
    @click.stop="$emit('close')"
  />
</template>

<script>
export default {
  mounted() {
    document.addEventListener("keyup", this.keyboardEvent);
  },
  beforeUnmount() {
    document.removeEventListener("keyup", this.keyboardEvent);
  },
  methods: {
    keyboardEvent(event) {
      if (event.keyCode == 27) this.$emit("close");
    },
  },
};
</script>

<style>
.closeButton {
  width: 14px;
  height: 14px;
  transition: all 0.2s ease;
  cursor: pointer;
}
.closeButton:hover {
  transform: scale(1.2, 1.2);
}
</style>
