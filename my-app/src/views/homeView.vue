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
          <img src="image/website1.png" alt="" class="homeFeature__img" />
          <p class="homeFeature__imgDescription">главная</p>
        </div>
        <p class="homeFeature__descriprion">
          Возможность собирать слова в категории с различной вместимостью и
          тонкой настройкой шаблона повторения. Автоматическая система,
          предлагающая к повторению слова из категорий в зависимости от
          установленного шаблона повторений. Отдельное хранилище для слов,
          которые проходят весь цикл повторений (не менее 10 раз). А так же
          отдельное хранилище для слов, в которых совершаются ошибки для более
          интенсивного заучивания. Каждое из хранилищ отдельно настраивается под
          ваши нужды и предлагает автоматизированную систему повторения слов,
          которые вы давно не повторяли.
        </p>
      </div>

      <div class="homeFeature__homeFeatureContainer anim-item">
        <div class="homeFeature__imgContainer">
          <img src="image/website1.png" alt="" class="homeFeature__img" />
          <p class="homeFeature__imgDescription">анализатор</p>
        </div>
        <p class="homeFeature__descriprion">
          Отдельный инструмент который поможет вам определить частоту
          использования слова в языке, основываясь на вашем опыте. Каждый раз,
          когда вы встречаете слово, которое на ваш взгляд не часто используется
          и не требует персонального изучения, вы можете добавить это слово в
          хранилище. Когда вы спустя время встретите и добавите это слово вновь
          столько раз за промежуток времени, сколько вы себе настроите,
          хранилище подскажет вам, что вы встречаетесь с этим словом довольно
          часто и его следует поставить на изучение.
        </p>
      </div>

      <div class="homeFeature__homeFeatureContainer anim-item">
        <div class="homeFeature__imgContainer">
          <img src="image/website1.png" alt="" class="homeFeature__img" />
          <p class="homeFeature__imgDescription">документация</p>
        </div>
        <p class="homeFeature__descriprion">
          Документация содержащая все тонкости работы с сервисом и удобной
          навигацией по интересующим вас вопросам. Поможет вам разобраться с
          настройками и опциями, предоставляемые сервисом. Подскажет как
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
    let animItem = Array.from(document.querySelectorAll(".anim-item"));
    /*console.log(animItem);
    let options = {
      threshold: 1,
    };
    let unAnimatedItem = function (entries) {
      entries.forEach((el) => {
        if (el.isIntersecting == false) {
          let item = el.target;
          if (item.classList.contains("_active")) {
            item.classList.toggle("_active");
          }
        }
      });
    };
    let observer = new IntersectionObserver(unAnimatedItem, options);
    animItem.forEach((el) => {
      observer.observe(el);
    });*/
    window.addEventListener("scroll", animatedItem);
    animatedItem();

    function animatedItem() {
      animItem.forEach((el) => {
        let height = el.offsetHeight;
        let itemTop = getCoords(el).top;
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
    }

    function getCoords(elem) {
      var box = elem.getBoundingClientRect();
      return {
        top: box.top + pageYOffset,
        left: box.left + pageXOffset,
      };
    }

    //observer.observe(animItem);
  },
};
</script>

<style></style>
