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
              ref="input"
            />
            <p class="iconPopup__error" v-if="error != ''">{{ error }}</p>
          </div>
        </div>
        <div class="newPassword__confirmContainer">
          <confirm-button
            text="Подтвердить"
            @click="sendData"
            fontSize="14"
            :disabled="checkConfirm"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import confirmButton from "../components/confirmButton.vue";
export default {
  emits: ["close", "replace", "auth"],
  components: {
    confirmButton,
  },
  data() {
    return {
      icon: "",
      error: "",
    };
  },
  computed: {
    userInfo() {
      return this.$store.getters.getUserInfo;
    },
    showIcon() {
      if (this.icon != "") {
        return this.icon;
      }
      if (
        this.userInfo?.avatar != "" &&
        Object.keys(this.userInfo).length > 0
      ) {
        return require(`../assets/avatar/${this.userInfo.nickName}/${this.userInfo.avatar}`);
      }
      return require("../assets/avatar.png");
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
      let file = event.target.files[0];
      let type = file.type.split("/");
      let size = file.size;
      let maxSize = 1 * 1024 * 1024;
      if ((type[0] != "image" && type[1] != "png") || size > maxSize) {
        this.error = "Неверный формат файла!";
        return;
      }
      if (!FileReader) console.log("не поддерживается");
      if (event.target.files.lenght) console.log("Ничего не загружено");
      let reader = new FileReader();
      reader.onload = () => {
        this.icon = reader.result.substring(reader.result.indexOf(",") + 1);
        this.icon = "data:image/png;base64," + this.icon;
      };
      reader.readAsDataURL(file);
    },
    sendData() {
      let file = this.$refs.input?.files[0];
      let formData = new FormData();
      formData.append("avatar", file);
      this.$api.change
        .avatar(formData)
        .then((res) => {
          this.$store.commit("setUserInfo", res.data.user);
          this.$emit("replace", res.data.message);
          this.closePopup();
        })
        .catch((err) => {
          if (err.response.status == 500) this.error = "Сервер не отвечает!";
          if (err.response.status == 400)
            this.error = "Переданный файл не прошел проверку!";
          if (err.response.status == 401) this.$emit("auth");
        });
    },
  },
};
</script>

<style>
.iconPopup {
  margin: auto;
  background: linear-gradient(-42deg, #fce5f9 50%, #e7fcf5 50%);
  display: flex;
  flex-direction: column;
  width: 400px;
}
.iconPopup__container {
  padding: 20px;
  display: flex;
  flex-direction: column;
}
.iconPopup__avatarContainer {
  padding: 20px 0;
  display: flex;
  margin: 0 auto;
}
.iconPopup__avatar {
  width: 64px;
  height: 64px;
}
.iconPopup__fileContainer {
  display: flex;
  flex-direction: column;
  margin-left: 20px;
}
.iconPopup__avatarReplace {
  margin: 0 0 0 0;
  font-family: antique;
}
.iconPopup__avatarReplace::file-selector-button {
  padding: 8px 13px;
  border-radius: 20px;
  font-size: 14px;
  background-color: #698afe;
  box-shadow: 0px 3px 13px 0px #c2cef0;
  color: white;
  font-family: antique;
  border: 0;
  cursor: pointer;
}
.iconPopup__error {
  color: red;
  padding-top: 4px;
  margin: 0 0 auto 0;
}
</style>
