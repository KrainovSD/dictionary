<template>
  <div class="searchPanel _close" ref="search">
    <img
      src="@/assets/search.png"
      alt=""
      class="searchPanel__icon"
      @click="showSearch"
      ref="icon"
    />
    <input
      type="text"
      class="searchPanel__input"
      placeholder="Search"
      v-if="searching == true"
      :value="modelValue"
      @input="$emit('update:modelValue', $event.target.value)"
    />
  </div>
</template>

<script>
export default {
  props: {
    modelValue: String,
  },
  data() {
    return {
      searching: false,
    };
  },
  mounted() {
    let icon = this.$refs.icon;
    let search = this.$refs.search;
    icon.style.width = `${search.clientHeight}px`;
  },
  methods: {
    showSearch() {
      let icon = this.$refs.icon;
      let search = this.$refs.search;
      if (!search.classList.contains("_close")) {
        search.classList.toggle("_close");
        icon.style.width = `${search.clientHeight}px`;
        this.searching = false;
        this.search = "";
        return;
      }
      search.classList.toggle("_close");
      this.searching = true;
      icon.style.width = `24px`;
    },
  },
};
</script>

<style>
.searchPanel {
  display: flex;
  border-radius: 3px;
  box-shadow: 0px 0px 4px 0px #ffffff;
  background-color: white;
  border: 1px solid black;
  transition: all 0.3s ease;
  position: relative;
  width: 100%;
  height: 100%;
  padding: 5px;
}
.searchPanel._close {
  width: 0;
  padding: 0;
  border: 0px;
}
.searchPanel._close .searchPanel__icon {
  height: 100%;
}
.searchPanel__icon {
  height: 24px;
  margin: auto 0;
  cursor: pointer;
  transition: all 0.3s ease;
}
.searchPanel__input {
  font-size: 16px;
  padding: 0 15px;
  width: 100%;
}
</style>
