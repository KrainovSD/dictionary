<template>
  <div class="setting__container">
    <p class="setting__userDataTittle">{{ title }}</p>
    <p class="setting__userData" v-if="changes[fieldChange] == false">
      {{ data }}
    </p>
    <div style="position: relative">
      <input
        type="text"
        class="setting__userDataInput"
        :class="[
          errors[field] ? '_error' : '',
          inputType == 'Number' ? 'number' : '',
        ]"
        :placeholder="placeholder"
        :name="field"
        :id="field"
        v-if="changes?.[fieldChange] == true"
        autocomplete="off"
      />
      <div
        class="wordPopup__tooltip"
        v-if="errors?.[field] && currentFocusInput == field"
        :tooltip="errors?.[field]"
      ></div>
    </div>
    <button
      class="setting__userDataReplace _change"
      v-if="changes?.[fieldChange] == false"
      @click="$emit('edit', field)"
    >
      Изменить
    </button>
    <img
      src="@/assets/closeRed.png"
      alt=""
      class="setting__userDataClose"
      v-if="changes?.[fieldChange] == true"
      @click="$emit('close', fieldChange)"
    />
    <button
      class="setting__userDataReplace"
      v-if="changes?.[fieldChange] == true"
      @click="$emit('change', field)"
    >
      Сохранить
    </button>
  </div>
</template>

<script>
export default {
  emits: ["edit", "change", "close"],
  props: {
    title: String,
    data: String,
    field: String,
    placeholder: String,
    changes: Object,
    errors: Object,
    currentFocusInput: String,
    inputType: String,
  },
  computed: {
    fieldChange() {
      return `${this.field}Change`;
    },
    /*inputClass(field) {
      let classes = [];
      if (this.errors[field]) {
        classes.push("_error");
      }
      if (this.inputType == "Number") {
        classes.push("number");
      }
      console.log(classes);
      let style = classes.join(",");

      return style;
    },*/
  },
};
</script>

<style></style>
