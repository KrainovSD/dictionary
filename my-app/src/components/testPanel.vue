<template>
  <div class="modal__backDrop" ref="backDrop"></div>
  <div class="modal__container">
    <div class="testPanel">
      <close-modal-button @close="closePopup" class="testPanel__closeButton" />
      <h class="testPanel__header">Меню для тестирования</h>
      <div class="testPanel__containerTest">
        <h class="testPanel__nameTest">Study words</h>
        <button class="testPanel__buttonTest">Создать паттерн категорий</button>
        <button class="testPanel__buttonTest">Проверка обычного повтора</button>
        <button class="testPanel__buttonTest">
          Проверка реверсивного повтора
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import closeModalButton from "./closeModalButton.vue";

export default {
  components: {
    closeModalButton,
  },
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
