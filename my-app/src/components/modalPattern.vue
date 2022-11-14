<template>
  <div class="modal__backDrop" @click.self="closePopup" ref="backDrop"></div>
</template>

<script>
export default {
  props: {
    test: String,
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

<style></style>
