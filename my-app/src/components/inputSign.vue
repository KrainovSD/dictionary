<template>
  <div class="sign__inputContainer" :class="errors[typeFiled] ? '_error' : ''">
    <div class="sign__iconInputContainer">
      <img :src="srcIcon" alt="" class="sign__inputIcon" />
    </div>

    <input
      :type="typeInput"
      class="sign__input"
      :placeholder="typeField"
      :name="typeField"
      v-model="password"
      autocomplete="off"
      v-if="!(typeField == 'password' || typeField == 'repeatPassword')"
    />
    <input
      :type="typeInput"
      class="sign__input"
      :placeholder="typeField"
      ref="password"
      :name="typeField"
      v-model="password"
      autocomplete="off"
      v-if="typeField == 'password'"
    />
    <input
      :type="typeInput"
      class="sign__input"
      :placeholder="typeField"
      ref="repeatPassword"
      :name="typeField"
      v-model="password"
      autocomplete="off"
      v-if="typeField == 'repeatPassword'"
    />

    <div class="sign__iconInputContainer" v-if="typeField == 'password'">
      <img
        src="image/eye-crossed.png"
        alt=""
        class="sign__visiblePassword"
        ref="eyeIcon"
        @click.stop="switchTypeInput('password', 'eyeIcon')"
      />
    </div>

    <div class="sign__iconInputContainer" v-if="typeField == 'repeatPassword'">
      <img
        src="image/eye-crossed.png"
        alt=""
        class="sign__visiblePassword"
        ref="repeatEyeIcon"
        @click.stop="switchTypeInput('repeatPassword', 'repeatEyeIcon')"
      />
    </div>

    <div
      class="sign__tooltip"
      v-if="
        (errors[typeField] &&
          currentFocusInput == typeField &&
          signType == 'signIn') ||
        (currentFocusInput != 'password' &&
          currentFocusInput == typeField &&
          errors[typeField])
      "
      :tooltip="errors[typeField]"
    ></div>
    <div
      class="sign__tooltipPassword"
      v-if="currentFocusInput == 'password' && signType == 'signUp'"
    >
      <p>Надежный пароль должен содержать:</p>
      <br />
      <ul>
        <li
          class="sign__advicePassword"
          :class="advicesPassword.minSize ? '_active' : ''"
        >
          8 или более символов;
        </li>
        <li
          class="sign__advicePassword"
          :class="advicesPassword.numberAndLetter ? '_active' : ''"
        >
          Сочетаниe букв и цифр;
        </li>
        <li
          class="sign__advicePassword"
          :class="advicesPassword.lowerAndUpper ? '_active' : ''"
        >
          Сочетание верхнего и нижнего регистра
        </li>
        <li
          class="sign__advicePassword"
          :class="advicesPassword.specialSymbol ? '_active' : ''"
        >
          Специальные символы;
        </li>
        <li
          class="sign__advicePassword"
          :class="advicesPassword.blackList ? '_active' : ''"
        >
          Слова не входящие в черный список паролей;
        </li>
      </ul>
      <br />
      <p>Сложность пароля:</p>
      <div class="sign__difficultyPassword">
        <div
          class="sign__difficultyPasswordBar"
          :class="barOfDifficultyPassword"
        ></div>
      </div>
      <br />
      <p style="color: rgb(253, 69, 69)">{{ errors.password }}</p>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    typeField: String,
    errors: Object,
  },
  data() {
    return {
      password: "",
    };
  },
  computed: {
    srcIcon() {
      let src = "";
      switch (this.typeField) {
        case "nickName":
          src = "image/user.png";
          break;
        case "userName":
          src = "image/userName.png";
          break;
        case "email":
          src = "image/email.png";
          break;
        case "password":
          src = "image/house-key.png";
          break;
        case "repeatPassword":
          src = "image/padlock.png";
          break;
        default:
          break;
      }
      return src;
    },
    typeInput() {
      let type = "text";
      if (this.typeField == "password" || this.typeField == "repeatPassword") {
        type = "password";
      }
      return type;
    },
  },
  methods: {
    switchTypeInput(kindOfInput, kindOfEye) {
      if (this.$refs[kindOfInput].type === "password") {
        if (!this.$refs[kindOfEye].classList.contains("_active")) {
          this.$refs[kindOfEye].classList.toggle("_active");
          setTimeout(() => {
            this.$refs[kindOfEye].classList.toggle("_active");
          }, 300);
          setTimeout(() => {
            this.$refs[kindOfInput].type = "text";
            let path = this.$refs[kindOfEye].src.split("/");
            path[path.length - 1] = "eye.png";
            this.$refs[kindOfEye].src = path.join("/");
          }, 250);
        }
      } else if (this.$refs[kindOfInput].type === "text") {
        if (!this.$refs[kindOfEye].classList.contains("_active")) {
          this.$refs[kindOfEye].classList.toggle("_active");
          setTimeout(() => {
            this.$refs[kindOfEye].classList.toggle("_active");
          }, 300);
          setTimeout(() => {
            this.$refs[kindOfInput].type = "password";
            let path = this.$refs[kindOfEye].src.split("/");
            path[path.length - 1] = "eye-crossed.png";
            this.$refs[kindOfEye].src = path.join("/");
          }, 250);
        }
      }
    },
  },
};
</script>

<style></style>
