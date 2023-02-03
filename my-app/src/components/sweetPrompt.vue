<template>
  <div class="prompt" ref="prompt" v-if="isVisible">
    <h1 class="prompt__header">{{ header }}</h1>
    <div class="prompt__line"></div>
    <div class="prompt__titleContainer">
      <p class="prompt__title">
        {{ title }}
      </p>
    </div>

    <div class="prompt__line"></div>
    <div class="prompt__buttonContainer">
      <div class="prompt__confirmContainer left">
        <confirm-button text="Yes" @click="_confirm" fontSize="16px" />
      </div>
      <div class="prompt__confirmContainer right">
        <confirm-button text="No" @click="_cancel" fontSize="16px" />
      </div>
    </div>
  </div>
</template>

<script>
import confirmButton from "./confirmButton.vue";

export default {
  components: { confirmButton },
  data() {
    return {
      isVisible: false,
      isChoise: true,
      header: "",
      title: "",
    };
  },
  promptController: null,
  created() {
    window.prompt = async (header, message) => {
      this.header = header;
      this.title = message;
      let resolve, reject;

      const promptPromise = new Promise((confirm, cancel) => {
        resolve = confirm;
        reject = cancel;
      });
      this.$options.promptController = { resolve, reject };
      this.isVisible = true;
      return promptPromise;
    };
  },
  methods: {
    closePrompt() {
      this.isVisible = false;
      this.header = "";
      this.title = "";
    },
    _confirm() {
      this.$options.promptController.resolve(true);
      this.closePrompt();
    },
    _cancel() {
      this.$options.promptController.resolve(false);
      this.closePrompt();
    },
  },
};
</script>

<style>
.prompt {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 30;
  background: linear-gradient(-42deg, #fce5f9 50%, #e7fcf5 50%);
  display: flex;
  flex-direction: column;
  min-width: 30%;
  max-width: 60%;
  padding: 20px;
  max-height: 90vh;
  overflow: auto;
}
@media (max-width: 1023px) {
  .prompt {
    min-width: none;
    max-width: 100vw;
    width: auto;
  }
}
.prompt__header {
  font-weight: 700;
  font-size: 24px;
  margin: 0 auto;
  text-align: center;
  width: 100%;
}
.prompt__titleContainer {
  margin: 0 auto;
}
.prompt__title {
  font-size: 18px;
  font-family: "Times New Roman", Times, serif;
  width: 100%;
  text-align: center;
}
.prompt__title._enter {
  margin-top: 10px;
}
.prompt__line {
  width: 80%;
  margin: 8px auto;
  height: 1px;
  background-color: black;
}
.prompt__buttonContainer {
  display: flex;
  padding-top: 0.5rem;
}
.prompt__confirmContainer {
  width: 30%;
}
.prompt__confirmContainer.left {
  margin: 0 auto 0 0;
}
.prompt__confirmContainer.right {
  margin: 0 0 0 auto;
}
</style>
