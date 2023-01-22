<template>
  <div class="chart">
    <div class="chart__header">
      <div>
        Период:
        <span
          class="chart__period"
          @click="this.$refs.periodList.classList.toggle('_active')"
          >{{ period }}</span
        >
      </div>
      <div class="chart__periodList">
        <div class="chart__periodListContent" ref="periodList">
          <template v-for="(item, index) in $options.periodList" :key="index">
            <p
              v-if="period != item"
              @click="
                period = item;
                this.$refs.periodList.classList.toggle('_active');
              "
            >
              {{ item }}
            </p>
          </template>
        </div>
      </div>
    </div>
    <div class="chart__container">
      <div class="chart__leftLabelContainer">
        <div
          class="chart__leftLabelItem"
          v-for="(item, index) in leftLabelList"
          :key="index"
          :style="[]"
        >
          {{ item }}
        </div>
      </div>
      <div class="chart__baseContainer">
        <div class="chart__base" ref="chart">
          <div
            class="chart__itemContainer"
            v-for="(item, index) in chartItems"
            :key="index"
            :tooltip="bottomLabelList[index]"

          >
            <div
              class="chart__firstItem"
              v-if="item.first"
              :style="[item.first.height, item.first.radius]"
              :tooltip="item.first.count"
            >
              <p
                :style="[
                  item.first.pers >= 10 ? 'display: block' : 'display: none',
                ]"
              >
                {{ item.first.count }}
              </p>
            </div>
            <div
              class="chart__secondItem"
              v-if="item.second"
              :style="[item.second.height]"
              :tooltip="item.second.count"
            >
              <p
                :style="[
                  item.second.pers >= 10 ? 'display: block' : 'display: none',
                ]"
              >
                {{ item.second.count }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="chart__footer">
      <div class="chart__footerHeader">
        <div class="chart__footerHeaderElement">Всего</div>
        <div class="chart__footerHeaderElement">{{ period }}</div>
      </div>
      <div class="chart__footerElement">
        <div class="chart__footerNumber">{{ firstElements?.length }}</div>
        <div class="chart__footerNumber">{{ amountKnownWords }}</div>
        <div class="chart__footerSquare _blue"></div>
        <div class="chart__footerText">Выучено слов</div>
      </div>
      <div class="chart__footerElement">
        <div class="chart__footerNumber">{{ secondElements?.length }}</div>
        <div class="chart__footerNumber">{{ amountStudyWords }}</div>
        <div class="chart__footerSquare _orange"></div>
        <div class="chart__footerText">Слов поставлено на изучение</div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    firstElements: Array,
    secondElements: Array,
    dateRegistration: Number,
  },
  increaseMaxAmountWordsByPers: 15, // Увеличивает максимальную сумму слов (на представленный график) на 15 процентов
  countLeftLabel: 5, // количество делений слева
  minStepLeftLabel: 5, // минимальный шаг левых делений
  maxCountStepAllTime: 20, // максмальное количество нижних делений при периоде за "все время";
  periodList: ["7 дней", "30 дней", "90 дней", "1 год", "всё время"],
  data() {
    return {
      period: "7 дней",
    };
  },

  computed: {
    chartItemsMathes() {
      let chartItems = [];
      switch (this.period) {
        case "7 дней": {
          chartItems = [...Array(7).keys()].reverse().map((index) => {
            let date = Math.floor(Date.now() / (1000 * 60 * 60 * 24));
            date = date - index;
            let mathesFirstElements = this.firstElements.filter((item) => {
              return Math.floor(item / (1000 * 60 * 60 * 24)) == date;
            });
            let mathesSecondElements = this.secondElements.filter((item) => {
              return Math.floor(item / (1000 * 60 * 60 * 24)) == date;
            });

            let chartItem = {};
            if (mathesFirstElements.length > 0)
              chartItem.first = {
                count: mathesFirstElements.length,
                height: "",
              };
            if (mathesSecondElements.length > 0)
              chartItem.second = {
                count: mathesSecondElements.length,
                height: "",
              };

            return chartItem;
          });
          break;
        }
        case "30 дней": {
          chartItems = [...Array(10).keys()].reverse().map((index) => {
            let date = Math.floor(Date.now() / (1000 * 60 * 60 * 24));
            let dateStart = date - index * 3 - 2;
            let dateEnd = date - index * 3;

            let mathesFirstElements = this.firstElements.filter((item) => {
              return (
                dateStart <= Math.floor(item / (1000 * 60 * 60 * 24)) &&
                Math.floor(item / (1000 * 60 * 60 * 24)) <= dateEnd
              );
            });
            let mathesSecondElements = this.secondElements.filter((item) => {
              return (
                dateStart <= Math.floor(item / (1000 * 60 * 60 * 24)) &&
                Math.floor(item / (1000 * 60 * 60 * 24)) <= dateEnd
              );
            });

            let chartItem = {};
            if (mathesFirstElements.length > 0)
              chartItem.first = {
                count: mathesFirstElements.length,
                height: "",
              };
            if (mathesSecondElements.length > 0)
              chartItem.second = {
                count: mathesSecondElements.length,
                height: "",
              };

            return chartItem;
          });
          break;
        }
        case "90 дней": {
          chartItems = [...Array(9).keys()].reverse().map((index) => {
            let date = Math.floor(Date.now() / (1000 * 60 * 60 * 24));
            let dateStart = date - index * 10 - 9;
            let dateEnd = date - index * 10;

            let mathesFirstElements = this.firstElements.filter((item) => {
              return (
                dateStart <= Math.floor(item / (1000 * 60 * 60 * 24)) &&
                Math.floor(item / (1000 * 60 * 60 * 24)) <= dateEnd
              );
            });
            let mathesSecondElements = this.secondElements.filter((item) => {
              return (
                dateStart <= Math.floor(item / (1000 * 60 * 60 * 24)) &&
                Math.floor(item / (1000 * 60 * 60 * 24)) <= dateEnd
              );
            });

            let chartItem = {};
            if (mathesFirstElements.length > 0)
              chartItem.first = {
                count: mathesFirstElements.length,
                height: "",
              };
            if (mathesSecondElements.length > 0)
              chartItem.second = {
                count: mathesSecondElements.length,
                height: "",
              };

            return chartItem;
          });
          break;
        }
        case "1 год": {
          chartItems = [...Array(12).keys()].reverse().map((index) => {
            let date = new Date();
            date.setDate(1);
            date.setMonth(date.getMonth() - index);

            let mathesFirstElements = this.firstElements.filter((item) => {
              let itemDate = new Date(item);
              return (
                itemDate.getMonth() == date.getMonth() &&
                itemDate.getFullYear() == date.getFullYear()
              );
            });
            let mathesSecondElements = this.secondElements.filter((item) => {
              let itemDate = new Date(item);
              return (
                itemDate.getMonth() == date.getMonth() &&
                itemDate.getFullYear() == date.getFullYear()
              );
            });

            let chartItem = {};
            if (mathesFirstElements.length > 0)
              chartItem.first = {
                count: mathesFirstElements.length,
                height: "",
              };
            if (mathesSecondElements.length > 0)
              chartItem.second = {
                count: mathesSecondElements.length,
                height: "",
              };

            return chartItem;
          });
          break;
        }
        case "всё время": {
          let dateRegister = this.dateRegistration;
          dateRegister = Math.floor(dateRegister / (1000 * 60 * 60 * 24));

          let dateNow = Math.floor(Date.now() / (1000 * 60 * 60 * 24));
          let diff = dateNow - dateRegister + 1;
          let countStep = this.$options.maxCountStepAllTime;

          if (diff <= this.$options.maxCountStepAllTime) {
            countStep = diff;
          }
          while (diff % countStep != 0) {
            diff++;
          }

          let step = diff / countStep;

          chartItems = [...Array(countStep).keys()].reverse().map((index) => {
            let date = Math.floor(Date.now() / (1000 * 60 * 60 * 24));

            let dateStart;
            let dateEnd;
            if (diff <= this.$options.maxCountStepAllTime) {
              dateStart = date - index * step;
              dateEnd = date - index * step;
            } else {
              dateStart = date - (index + 1) * step + 1;
              dateEnd = date - (index + 1) * step + 1 + (step - 1);
            }

            let mathesFirstElements = this.firstElements.filter((item) => {
              return (
                dateStart <= Math.floor(item / (1000 * 60 * 60 * 24)) &&
                Math.floor(item / (1000 * 60 * 60 * 24)) <= dateEnd
              );
            });
            let mathesSecondElements = this.secondElements.filter((item) => {
              return (
                dateStart <= Math.floor(item / (1000 * 60 * 60 * 24)) &&
                Math.floor(item / (1000 * 60 * 60 * 24)) <= dateEnd
              );
            });

            let chartItem = {};
            if (mathesFirstElements.length > 0)
              chartItem.first = {
                count: mathesFirstElements.length,
                height: "",
              };
            if (mathesSecondElements.length > 0)
              chartItem.second = {
                count: mathesSecondElements.length,
                height: "",
              };

            return chartItem;
          });
          break;
        }
      }
      return chartItems;
    },
    maxAmountWords() {
      let pers = this.$options.increaseMaxAmountWordsByPers;
      let countLeftLabel = this.$options.countLeftLabel;
      let minStep = this.$options.minStepLeftLabel;

      let amountWords = 0;
      let chartItems = this.chartItemsMathes;
      for (let item of chartItems) {
        let amount = 0;
        if (item.first) amount += item.first.count;
        if (item.second) amount += item.second.count;
        if (amount > amountWords) amountWords = amount;
      }
      amountWords = Math.ceil(amountWords + amountWords * (pers / 100));
      while (amountWords % countLeftLabel != 0) amountWords++;

      amountWords =
        amountWords > minStep * countLeftLabel
          ? amountWords
          : minStep * countLeftLabel;
      return amountWords;
    },
    chartItems() {
      // [{first: {height: '', count: 0, radius: ''}, second: {height: '', count: 0}}, ]
      let chartItems = this.chartItemsMathes;
      let maxAmountWords = this.maxAmountWords;

      for (let item of chartItems) {
        if (item.first) {
          item.first.height = `height: ${
            (item.first.count * 100) / maxAmountWords
          }%`;
          item.first.pers = (item.first.count * 100) / maxAmountWords;
          if (!item.second)
            item.first.radius = `border-radius: 10px 10px 0px 0px`;
          else item.first.radius = `border-radius: 0px 0px 0px 0px`;
        }
        if (item.second) {
          item.second.height = `height: ${
            (item.second.count * 100) / maxAmountWords
          }%`;
          item.second.pers = (item.second.count * 100) / maxAmountWords;
        }
      }
      return chartItems;
    },
    leftLabelList() {
      let countLeftLabel = this.$options.countLeftLabel;
      let amountWords = this.maxAmountWords;

      let step = amountWords / countLeftLabel;

      let leftLabelList = [];
      for (let i = countLeftLabel; i >= 1; i--) {
        leftLabelList.push(step * i);
      }

      return leftLabelList;
    },
    bottomLabelList() {
      let bottomLabelList = [];
      let monthsList = [
        "Jun",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
      ];
      switch (this.period) {
        case "7 дней": {
          bottomLabelList = [...Array(7).keys()].reverse().map((index) => {
            let date = new Date();
            date.setDate(date.getDate() - index);
            let day = date.getDate();
            if (day < 10) day = `0${day}`;
            return `${day} ${monthsList[date.getMonth()]}`;
          });
          break;
        }
        case "30 дней": {
          bottomLabelList = [...Array(10).keys()].reverse().map((index) => {
            let date = new Date();
            date.setDate(date.getDate() - index * 3 - 2);
            let day = date.getDate();
            if (day < 10) day = `0${day}`;
            return `${day} ${monthsList[date.getMonth()]}`;
          });
          break;
        }
        case "90 дней": {
          bottomLabelList = [...Array(9).keys()].reverse().map((index) => {
            let date = new Date();
            date.setDate(date.getDate() - index * 10 - 9);
            let day = date.getDate();
            if (day < 10) day = `0${day}`;
            return `${day} ${monthsList[date.getMonth()]}`;
          });
          break;
        }
        case "1 год": {
          bottomLabelList = [...Array(12).keys()].reverse().map((index) => {
            let date = new Date();
            date.setDate(1);
            date.setMonth(date.getMonth() - index);
            return `${monthsList[date.getMonth()]} ${date.getFullYear()}`;
          });
          break;
        }
        case "всё время": {
          let dateRegister = this.dateRegistration;
          dateRegister = Math.floor(dateRegister / (1000 * 60 * 60 * 24));

          let dateNow = Math.floor(Date.now() / (1000 * 60 * 60 * 24));
          let diff = dateNow - dateRegister + 1;
          let countStep = this.$options.maxCountStepAllTime;

          if (diff <= this.$options.maxCountStepAllTime) {
            countStep = diff;
          }
          while (diff % countStep != 0) {
            diff++;
          }
          let step = diff / countStep;

          bottomLabelList = [...Array(countStep).keys()]
            .reverse()
            .map((index) => {
              let date = new Date();
              if (diff <= this.$options.maxCountStepAllTime)
                date.setDate(date.getDate() - index * step);
              else date.setDate(date.getDate() - (index + 1) * step + 1);
              let day = date.getDate();
              if (day < 10) day = `0${day}`;
              return `${day} ${
                monthsList[date.getMonth()]
              } ${date.getFullYear()}`;
            });

          break;
        }
      }
      return bottomLabelList;
    },
    amountKnownWords() {
      let chartItems = this.chartItems;
      let amount = 0;
      for (let item of chartItems) {
        if (item.first) amount += item.first.count;
      }
      return amount;
    },
    amountStudyWords() {
      let chartItems = this.chartItems;
      let amount = 0;
      for (let item of chartItems) {
        if (item.second) amount += item.second.count;
      }
      return amount;
    },
  },
  methods: {},
};
</script>

<style></style>
