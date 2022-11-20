<template>
  <div class="slideFilter _close" ref="filter">
    <img
      src="@/assets/filter.png"
      alt=""
      class="slideFilter__icon"
      ref="icon"
      @click="showFilter"
    />
    <div
      class="slideFilter__filter"
      @click.self="showSubFilter"
      v-if="filterVisible == true"
    >
      {{ filterTitle }}
      <div class="slideFilter__subFilter _close" ref="subFilter">
        <p
          class="slideFilter__subFilterItem"
          v-for="(item, index) in filterList"
          :key="index"
          :id="index"
          @click="
            filter = index;
            showSubFilter();
          "
        >
          {{ item }}
        </p>
      </div>
    </div>
    <img
      src="@/assets/arrowDown.png"
      alt=""
      class="slideFilter__arrow"
      v-if="filterVisible == true"
      @click="showSubFilter"
      id="arrow"
      ref="arrow"
    />
  </div>
</template>

<script>
export default {
  props: {
    filterList: Object,
  },
  data() {
    return {
      filter: "letterUp",
      filterVisible: false,
    };
  },
  computed: {
    filterTitle() {
      return this.filterList[this.filter];
    },
  },
  mounted() {
    let filter = this.$refs.filter;
    let icon = this.$refs.icon;
    icon.style.width = `${filter.clientHeight}px`;
  },
  methods: {
    showFilter() {
      let filter = this.$refs.filter;
      let subFilter = this.$refs.subFilter;
      let icon = this.$refs.icon;
      let arrow = this.$refs.arrow;
      if (!filter.classList.contains("_close")) {
        if (!subFilter.classList.contains("_close")) {
          subFilter.classList.toggle("_close");
          arrow.classList.toggle("_active");
        }
        icon.style.width = `${filter.clientHeight}px`;
        filter.classList.toggle("_close");
        this.filterVisible = false;

        return;
      }
      filter.classList.toggle("_close");
      icon.style.width = `28px`;
      setTimeout(() => {
        this.filterVisible = true;
      }, 200);
    },
    showSubFilter() {
      let subFilter = this.$refs.subFilter;
      let arrow = this.$refs.arrow;

      if (!subFilter?.classList?.contains("_close")) {
        subFilter.classList.toggle("_close");
        arrow.classList.toggle("_active");
        return;
      }
      subFilter.classList.toggle("_close");
      arrow.classList.toggle("_active");
    },
  },
  watch: {
    filter() {
      this.$emit("change", this.filter);
    },
  },
};
</script>

<style>
.slideFilter {
  width: 100%;
  height: 100%;
  display: flex;
  border-radius: 3px;
  box-shadow: 0px 0px 4px 0px #ffffff;
  background-color: white;
  border: 1px solid black;
  transition: all 0.3s ease;
  padding: 8px;
}
.slideFilter._close {
  width: 0;
  border: 0;
  padding: 0;
}
.slideFilter._close .slideFilter__icon {
  height: 100%;
}
.slideFilter__icon {
  height: 28px;
  transition: all 0.3s ease;
  margin: auto 0 auto 0;
  cursor: pointer;
}
.slideFilter__filter {
  width: 100%;
  border-radius: 3px;
  box-shadow: 0px 0px 4px 0px #ffffff;
  background-color: white;
  border: 1px solid white;
  position: relative;
  font-size: 16px;
  padding: 0 8px;
  margin: auto 0;
}
.slideFilter__subFilter {
  position: absolute;
  right: 0;
  z-index: 3;
  background-color: #fff;
  border-radius: 0.4rem;
  box-shadow: 0 0.1rem 2rem #04061c1a;
  padding: 15px 0;
  margin-top: 20px;
  width: 300px;
  transition: all 0.3s ease;
  overflow: hidden;
}
.slideFilter__subFilter._close {
  height: 0;
  box-shadow: 0;
  padding: 0;
}
.slideFilter__subFilterItem {
  font-size: 1.2rem;
  font-weight: 400;
  padding: 5px 5px;
  cursor: pointer;
}
.slideFilter__subFilterItem:hover {
  background-color: #f5f5f6;
}
.slideFilter__arrow {
  width: 16px;
  height: 16px;
  margin: auto 0 auto 0;
  cursor: pointer;
  animation: arrowToDown 0.3s ease;
  animation-fill-mode: forwards;
}
.slideFilter__arrow._active {
  animation: arrowToUp 0.3s ease;
  animation-fill-mode: forwards;
}
</style>
