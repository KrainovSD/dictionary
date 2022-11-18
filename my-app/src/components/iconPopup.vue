<template>
  <div class="modal__backDrop" style="z-index: 6" ref="backDrop">
    <div class="iconPopup">
      <img
        src="@/assets/close.png"
        alt=""
        class="sign__closeButton"
        @click.stop="closePopup"
      />
      <div class="iconPopup__container">
        <h1 class="sign__header">Смена аватара</h1>
        <p class="sign__description">Загрузите иконку для смены аватара</p>
        <div class="iconPopup__avatarContainer">
          <img :src="showIcon" alt="" class="setting__avatar" />
          <div class="iconPopup__fileContainer">
            <input
              type="file"
              class="iconPopup__avatarReplace"
              @change="changeIcon"
            />
            <p class="iconPopup__error" v-if="error != ''">{{ error }}</p>
          </div>
        </div>
        <button
          class="sign__logInButton"
          ref="confirm"
          @click.stop="sendData"
          :disabled="checkConfirm"
        >
          Подтвердить
        </button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  emits: ["close"],
  props: {
    test: String,
  },
  data() {
    return {
      icon: "",
      error: "",
    };
  },
  computed: {
    showIcon() {
      if (this.icon != "") {
        return this.icon;
      }
      return require(`../assets/avatar.png`);
    },
    checkConfirm() {
      if (this.icon != "" && this.error == "") return false;
      return true;
    },
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
    changeIcon(event) {
      this.error = "";
      this.icon = "";
      let icon = event.target.files[0];
      let type = icon.type.split("/");
      let size = icon.size;
      if (type[0] != "image" && type[1] != "png" && size > 53248) {
        this.error = "Неверный формат файла!";
        return;
      }
      if (!FileReader) console.log("не поддерживается");
      if (event.target.files.lenght) console.log("Ничего не загружено");
      let file = event.target.files[0];
      let reader = new FileReader();
      reader.onload = () => {
        this.icon = reader.result.substring(reader.result.indexOf(",") + 1);
        this.icon = "data:image/png;base64," + this.icon;
      };
      reader.readAsDataURL(file);
    },
    sendData() {
      let confirm = this.$refs.confirm;
      if (!confirm.classList.contains("_active")) {
        confirm.classList.toggle("_active");

        setTimeout(() => {
          confirm.classList.toggle("_active");
          console.log("ok");
        }, 300);
      } else {
        console.log(this.errors);
        setTimeout(() => {
          confirm.classList.toggle("_active");
        }, 300);
      }
    },
  },
};
</script>

<style></style>
