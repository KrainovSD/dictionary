<template>
  <div class="homeImg">
    <div class="homeImg__container">
      <h1 class="homeImg__header anim-item">
        Сервис для изучения <br />
        иностранных слов
      </h1>
      <p class="homeImg__title anim-item">
        Удобная настройка временных патернов для повторения и закрепления <br />
        как новых слов, так и уже изученных.
      </p>
    </div>
  </div>

  <div class="homeFeature">
    <div class="homeFeature__container">
      <div class="homeFeature__homeFeatureContainer anim-item">
        <div class="homeFeature__imgContainer">
          <img src="@/assets/website1.png" alt="" class="homeFeature__img" />
          <p class="homeFeature__imgDescription">изучение</p>
        </div>
        <p class="homeFeature__descriprion">
          Возможность собирать слова в категории с различной вместимостью и
          тонкой настройкой шаблона повторения. Автоматическая система,
          предлагающая к повторению слова из категорий в зависимости от
          установленного шаблона повторений. Отдельное хранилище для слов,
          которые проходят весь цикл повторений (не менее 12 раз). А так же
          отдельное хранилище для слов, в которых совершаются ошибки для более
          интенсивного заучивания. Каждое из хранилищ отдельно настраивается под
          ваши нужды и предлагает автоматизированную систему повторения слов,
          которые вы давно не повторяли.
        </p>
      </div>

      <div class="homeFeature__homeFeatureContainer anim-item">
        <div class="homeFeature__imgContainer">
          <img src="@/assets/website1.png" alt="" class="homeFeature__img" />
          <p class="homeFeature__imgDescription">анализатор</p>
        </div>
        <p class="homeFeature__descriprion">
          Отдельный инструмент который поможет вам определить частоту
          использования слова в языке, основываясь на вашем опыте. Каждый раз,
          когда вы встречаете слово, которое на ваш взгляд не часто используется
          и не требует персонального изучения, вы можете добавить это слово в
          хранилище. Когда вы спустя время встретите и добавите это слово вновь,
          хранилище подскажет вам, что вы встречаетесь с этим словом довольно
          часто за выбранный промежуток времени и его следует поставить на
          изучение.
        </p>
      </div>

      <div class="homeFeature__homeFeatureContainer anim-item">
        <div class="homeFeature__imgContainer">
          <img src="@/assets/website1.png" alt="" class="homeFeature__img" />
          <p class="homeFeature__imgDescription">документация</p>
        </div>
        <p class="homeFeature__descriprion">
          Документация содержащая все тонкости работы с сервисом и удобной
          навигацией по интересующим вас вопросам. Поможет вам разобраться с
          настройками и опциями, предоставляемыми сервисом. Подскажет как
          правильно начать учить и настраивать сервис, чтобы в перспективе он
          сам учил вас.
        </p>
      </div>
    </div>
  </div>
  <div class="homeStart">
    <div class="homeStart__container">
      <router-link
        :to="{ name: 'documentation' }"
        class="homeStart__button anim-item"
      >
        Начать учиться
      </router-link>
    </div>
  </div>
</template>

<script>
export default {
  mounted() {
    window.addEventListener("scroll", this.animatedItem);
    this.animatedItem();
  },
  methods: {
    getCoords(elem) {
      let box = elem.getBoundingClientRect();
      return {
        top: box.top + scrollY,
        left: box.left + scrollX,
      };
    },
    animatedItem() {
      let animItem = Array.from(document.querySelectorAll(".anim-item"));
      animItem.forEach((el) => {
        let height = el.offsetHeight;
        let itemTop = this.getCoords(el).top;
        let animStart = itemTop + height / 2;
        const pageHeight = document.documentElement.clientHeight;
        const scrollTop = document.documentElement.scrollTop;
        const fullPageHeight = pageHeight + scrollTop;
        if (animStart < fullPageHeight) {
          if (el.children.length == 2) {
            Array.from(el.children).forEach((child) => {
              if (!child.classList.contains("_active")) {
                child.classList.toggle("_active");
              }
            });
          } else if (!el.classList.contains("_active")) {
            el.classList.toggle("_active");
          }
        } else if (animStart > fullPageHeight) {
          if (el.children.length == 2) {
            Array.from(el.children).forEach((child) => {
              if (child.classList.contains("_active")) {
                child.classList.toggle("_active");
              }
            });
          } else if (el.classList.contains("_active")) {
            el.classList.toggle("_active");
          }
        }
      });
    },
  },
};
</script>

<style></style>
