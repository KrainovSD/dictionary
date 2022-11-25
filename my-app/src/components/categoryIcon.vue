<template>
  <div class="categoryIcon" ref="categoryIcon">
    <img
      src="@/assets/close.png"
      alt=""
      class="sign__closeButton"
      @click.stop="closeCategoryIcon"
    />
    <div class="categoryIcon__container">
      <div class="categoryIcon__containerIcon">
        <img
          v-for="(item, index) in iconProd"
          :key="index"
          :src="require(`@/assets/category/${item}.png`)"
          alt=""
          :id="item"
          class="categoryIcon__icon categIcon"
          :class="currentSelectionIcon == item ? '_focus' : ''"
        />
      </div>
      <div class="newPassword__confirmContainer">
        <confirm-button
          text="Подтвердить"
          @click="chooseIcon"
          fontSize="14"
          :disabled="isCurrentSelectionIconEmpty"
        />
      </div>
    </div>
  </div>
</template>

<script>
import confirmButton from "../components/confirmButton.vue";
export default {
  components: {
    confirmButton,
  },
  props: {
    icon: String,
  },
  data() {
    return {
      iconProd: [
        "apple",
        "bag",
        "beers",
        "belt",
        "block",
        "box",
        "cap",
        "car",
        "cat",
        "chrome",
        "clock",
        "cloud",
        "coffee",
        "crown",
        "fist",
        "flag",
        "folder",
        "heart",
        "hole",
        "home",
        "key",
        "location",
        "mask",
        "money",
        "paw",
        "plane",
        "playpen",
        "puzzle",
        "shield",
        "space",
        "star",
        "telephone",
        "trophy",
        "t-shirt",
      ],
      currentSelectionIcon: "",
    };
  },
  mounted() {
    let imgs = Array.from(document.querySelectorAll(".categIcon"));
    imgs.forEach((img) => {
      img.addEventListener("click", this.selectIcon);
    });
    if (this.icon != "") this.currentSelectionIcon = this.icon;
  },
  computed: {
    isCurrentSelectionIconEmpty() {
      if (this.currentSelectionIcon == "") return true;
      return false;
    },
  },
  methods: {
    selectIcon(event) {
      let icon = event.target;
      this.currentSelectionIcon = icon.id;
    },
    closeAnimation() {
      let div = this.$refs.categoryIcon;
      if (!div.classList.contains("close")) {
        div.classList.toggle("close");
      }
    },
    closeCategoryIcon() {
      this.closeAnimation();
      setTimeout(() => {
        this.$emit("close");
      }, 300);
    },
    async chooseIcon() {
      if (this.currentSelectionIcon != "") {
        this.closeAnimation();
        setTimeout(() => {
          this.$emit("add", this.currentSelectionIcon);
        }, 300);
      }
    },
  },
};
</script>

<style>
.categoryIcon {
  position: absolute;
  top: 30px;
  left: 70%;
  z-index: 3;
  background: linear-gradient(-42deg, #e7fcf5 50%, #fce5f9 50%);
  display: flex;
  flex-direction: column;
  width: 328px;
  animation: appearBackDrop 0.4s ease;
}
.categoryIcon.close {
  animation: dissappearBackDrop 0.3s ease;
}
.categoryIcon__container {
  display: flex;
  flex-direction: column;
  padding: 20px;
}
.categoryIcon__icon {
  width: 40px;
  height: 40px;
  margin: 0 8px 8px 0;
  cursor: pointer;
  box-shadow: 0px 0px 4px 0px #ffffff;
  border: 1px solid black;
  transition: all 0.3s ease;
}
.categoryIcon__icon._focus {
  border: 3px solid #3a9beb;

  box-shadow: inset 0 1px 1px rgba(0, 0, 0, 0.425),
    0 0 8px rgba(102, 174, 233, 0.664);
}
.categoryIcon__containerIcon {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
}
</style>
