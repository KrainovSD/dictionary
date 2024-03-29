<template>
  <div class="docs__hamburger">
    <div style="display: flex" @click="toggleMenu">
      <img src="@/assets/hamburger.png" alt="" class="docs__hamburgerIcon" />
      <span class="docs__hamburgerText">Меню</span>
    </div>
    <p
      class="docs__upButton"
      @click="this.$refs.docsContent.scrollTo({ top: 0, behavior: 'smooth' })"
    >
      Вернуться наверх
    </p>
  </div>
  <div class="docs appearVision">
    <div class="docs__backDrop" ref="backDrop" @click="toggleMenu"></div>
    <div class="docs__link" ref="links">
      <h2>Руководство</h2>
      <div v-for="(itemDocs, indexDocs) in docs" :key="indexDocs">
        <h1
          class="docs__header"
          :class="currentHeader == itemDocs.header ? '_active' : ''"
          @click="selectHeader"
        >
          {{ itemDocs.header }}
        </h1>
        <div v-if="currentHeader == itemDocs.header">
          <a
            v-for="(itemContent, indexContent) in itemDocs.content"
            :key="indexContent"
            :href="`#${itemContent.id}`"
            class="docs__chapter"
            :class="currentChapter == itemContent.id ? '_active' : ''"
            @click="toggleMenu"
            >{{ itemContent.chapter }}</a
          >
        </div>
      </div>
    </div>
    <div class="docs__content" ref="docsContent">
      <template v-for="(itemDocs, indexDocs) in docs" :key="indexDocs">
        <div
          v-if="currentHeader == itemDocs.header"
          style="display: flex; flex-direction: column"
        >
          <h2 class="docs__contentHeader">{{ itemDocs.header }}</h2>
          <div
            style="display: flex; flex-direction: column"
            v-for="(itemContent, indexContent) in itemDocs.content"
            :key="indexContent"
          >
            <h1
              class="docs__contentChapter"
              :id="itemContent.id"
              :ref="collectChapters"
            >
              {{ itemContent.chapter }}
            </h1>
            <p
              class="docs__contentText"
              v-for="(itemText, indexText) in itemContent.text"
              :key="indexText"
              v-html="itemText"
            ></p>
            <img
              :src="getImgUlr(itemContent.img)"
              alt=""
              class="docs__img"
              v-if="itemContent.img"
            />
          </div>
          <div class="docs__buttonPanel">
            <button
              class="docs__buttonNextBack _back"
              v-if="indexDocs > 0"
              @click="selectHeader"
            >
              {{ docs[indexDocs - 1].header }}
            </button>
            <button
              class="docs__buttonNextBack _next"
              v-if="indexDocs + 1 <= docs.length - 1"
              @click="selectHeader"
            >
              {{ docs[indexDocs + 1].header }}
            </button>
          </div>

          <img src="@/assets/KrainovLogoBlack.png" alt="" class="docs__logo" />
        </div>
      </template>
    </div>
  </div>
</template>

<script>
import { nextTick } from "@vue/runtime-core";
export default {
  data() {
    return {
      currentHeader: "Введение",
      currentChapter: "whatIsDictionary",
      docs: [
        {
          header: "Введение",
          content: [
            {
              chapter: "Что такое Dictionary project??",
              id: "whatIsDictionary",
              text: [
                "Dictionary project (сокращённо DP) - это удобный сервис для заучивания иностранных слов. (На данный момент осуществляется поддержка исключительно Английского языка) Сервис разработан на основе субъективного видения настраиваемого механизма, который делает акцент не только на изучение новых слов, но и выполняет второстепенные, но немаловажные функции для изучения языка, такие как:",
                "- работа со словами, в которых часто допускаются ошибки;",
                "- отбор приоритетных слов, на которые следует сделать упор;",
                "- регулярный повтор уже изученных ранее слов;",
                "Основная особенность сервиса заключается в полной автоматизации перечисленных процессов, которая позволит гибко настраивать каждый из них и впоследствии следовать указаниям сервиса.",
              ],
            },
            {
              chapter: "Дополнительные особенности",
              id: "opportunities",
              text: [
                "Сервис обладает дополнительными возможностями, которые благоприятно влияют на комфорт в процессе обучения.",
                "Первой особенностью является offline режим обучения. Когда на вашем девайсе отсутствует интернет соединение или на сервере производятся технические работы, и он не доступен, сайт по-прежнему можно загрузить и продолжать работу с сервисом, благодаря системе кеширования и синхронизации данных. В последствии при устранении вышеперечисленных неполадок ваши данные автоматически будут синхронизированы.",
                "<i>Важно:</i> При работе в offline режиме, все данные хранятся на стороне пользователя. Во время синхронизации на стороне сервера производится строгая проверка на целостность. При ручном вмешательстве данные могут быть утеряны, и синхронизации не произойдет!",
                "Второй особенностью сервиса является встроенный Яндекс словарь, который при добавлении нового слова или редактировании уже имеющегося, подскажет о допущенных в слове ошибках и предложит варианты транскрипции и перевода. Яндекс словарь работает исключительно в online версии сервиса!",
                'Третья особенность заключается в поддержке неправильных глаголов, как отдельного типа слов. Для того, чтобы пометить слово, как неправильный глагол, необходимо записать три его формы через двойной дефис : "Throw--threw--trown". В таком случае слово будет помечено как неправильный глагол, и при последующем повторении каждая его форма проверяется на ошибки отдельно.',
                "<i>Важно:</i> Впоследствии при повторении неправильных глаголов их необходимо записывать в подобном формате!",
              ],
            },
            {
              chapter: "Краткий порядок работы",
              id: "orderOfWork",
              text: [
                "Для удобной работы на сервисе, в первую очередь необходимо зарегистрировать аккаунт и войти в него. Без авторизации сервис будет функционировать в offline режиме, все тонко настраиваемые правила для изучения будут выставлены по умолчанию без возможности изменения. После авторизации появится возможность зайти в настройки пользователя и настроить сервис по своему усмотрению.",
                "Первым этапом при изучении является создание новой категории слов и ее наполнение (про особенности категорий и слов читайте в разделе 'Изучаемые слова'). Когда категория будет готова к изучению, необходимо переключить ее статус соответсвующей кнопкой. После этого возможность: редактировать категории; добавлять в нее слова; удалять из нее слова; - будет закрыта. Как только статус категории изменится, будет предложено произвести первое повторение (про типы и особенности повторений читайте в разделе 'Повторение слов'). После его успешного завершения (на основе настроенного шаблона) сервис подскажет, когда будет производиться следующее повторение данной категории. ",
                "Вторым этапом является завершение полного курса повторения категории и перенос слов во вкладку 'Изученные'. В этой вкладке произодится повтор слов, которые не были задействованы дольше всего (подробнее об этой вкладке читайте в разделе 'Изученные слова').",
                "Промежуточными возможностями являются повторяемые слова и актуализатор. Подробнее о них можно прочитать в соответствующих разделах.",
              ],
            },
          ],
        },
        {
          header: "Настройки",
          content: [
            {
              chapter: "Первичная настройка",
              id: "initialSetup",
              text: [
                "Изначально все настройки сервиса заполнены рекомендуемыми значениями по умолчанию. После регистрации и авторизации у пользователя появляется возможность изменять настройки под себя.",
              ],
            },
            {
              chapter: "Виды настроек и где их найти",
              id: "kindOfSetup",
              text: [
                "В настройках встречается такое понятие, как регулярность повторения. Предлагаемый шаблон выглядит следующим образом: '2-2-2-2-4-4-4-4-8-8-16-16'. Цифры в регулярности означают количество дней в промежутке между повторениями. Исходя из представленного шаблона, после первого повторения будет перерыв два дня, а перед последним повторением перерыв шестнадцать дней.",
                "Следующие виды настроек можно найти в общих настройках профиля пользователя:",
                "1. Настройка количества слов, которую будет предоставлять сервис для одного сеанса повторения во вкладке 'Изученные'.",
                "2. Настройка количества допустимых ошибок в слове перед его добавлением во вкладку 'Повторяемые'.",
                "3. Настройка регулярности повторения слов из вкладки 'Повторяемые'.",
                "4-5. Настройка количества слов и промежутка времени, за который Актуализатор будет считать количество встреч со словом и выявлять часто встречающиеся.",
                "Так же существует настройка регулярности повторения изучаемой категории слов, которая указывается непосредственно перед созданием категории.",
              ],
            },
            {
              chapter: "Изменение данных пользователя",
              id: "changeUserInfo",
              text: [
                "В пользовательских настройках имеется возможность изменить раз в день учетные данные пользователя, такие как: привязанная почта или пароль. А так же неограниченное количество раз: имя пользователя, аватар пользователя.",
              ],
            },
            {
              chapter: "Импорт и экспорт базы слов",
              id: "importExport",
              text: [
                "В пользовательских настройках присутствует возможность экспортировать всю базу слов в виде файла, чтобы в случае потери данных или аккаунта, импортировать ее, не потеряв свой прогресс.",
                " <span>Совет:</span> рекомендуется делать резервную копию данных с периодичностью раз в неделю.",
                " <i>Важно:</i> Ручное вмешательство в данные, которые содержатся в файле, может привести к порче целостности данных. Таким образом, экспортированный файл будет считаться невалидным и не пройдет проверку при импорте. ",
              ],
            },
          ],
        },
        {
          header: "Повторение слов",
          content: [
            {
              chapter: "Виды повторения",
              id: "kindOfStudy",
              text: [
                "Повторение бывает двух типов: стандартное и реверсивное. В стандартном предоставляется перевод и описание слова, требуется ввести в поле само слово на английском. В реверсивном представлено само слово на английском, пользователю необходимо выбрать перевод из четырёх доступных вариантов.",
              ],
            },
            {
              chapter: " Ошибки",
              id: "studyErrors",
              text: [
                "В стандартном режиме предоставляется 3 попытки корректно ввести слово. Если слово введено неправильно, сервис оставляет только те символы, которые соответсвуют слову. После трех попыток слово засчитывается с ошибкой, и сервис предоставляет верный ответ. ",
                "В реверсивном режиме дается одна попытка выбрать верный ответ из четырех представленных. В случае неудачи засчитывается ошибка, и выводится верный ответ.",
              ],
            },
            {
              chapter: "Продолжение сеанса",
              id: "continueStudy",
              text: [
                "В случае, когда начинается процесс повторения, а после пропадает интернет/закрывается вкладка/закрывается окно, то при повторном открытии сервис предложит продолжить с того же места, на котором пользователь остановился, или начать с начала. ",
              ],
            },
          ],
        },
        {
          header: "Изучаемые слова",
          content: [
            {
              chapter: "Настройки",
              id: "learnSetup",
              text: [
                "При создании категории указывается регулярность повторения. Регулярность повторения - это периодичность дней, с которой будет осуществляться повтор категории.",
              ],
            },
            {
              chapter: " Категории",
              id: "category",
              text: [
                "Первым шагом к началу обучения является создание категории для слов. Категория подразумевает собой контейнер для некоторого количества слов, которые будут изучаться одновременно друг с другом. Минимальное количество слов для начала изучения категории: 15. Максимального ограничения нет. Каждый пользователь индивидуально выбирает сколько за раз ему изучать слов.",
                "<span>Совет:</span> Категории можно использовать в качестве группировки слов одного типа. Например: природа, цвета, еда, животные. Также эффективно использовать категорию для хранения совершенно хаотичного набора слов.",
              ],
            },
            {
              chapter: "Особенности категорий",
              id: "featuresOfCategories",
              text: [
                "При создании категории необходимо указать всего три параметра: Имя, Иконку и Регулярность повторения (изначально поле уже заполнено значениями по умолчанию, которые являются максимально эффективным шаблоном с точки зрения сервиса).",
                "Чтобы начать обучение категории, необходимо изменить её статус соответсвующей кнопкой управления (после изменения статуса категории, редактирование становится невозможным). Кнопка переключения статуса будет не активна до тех пор, пока категория не будет содержать по меньшей мере 15 слов.",
                "После активации категории появится возможность обычного и обратного повторения. Если одна из кнопок повторения горит желтым цветом, значит сегодня необходимо пройти повторение этого типа. Если кнопка горит зеленым, значит на текущий день вы не должны проходить данный тип повторения выбранной категории (Расчитывается исходя из регулярности повторения). Если кнопка горит красным, значит вы просрочили день повторения.",
                "Тип повторения засчитывается пройденным после его прохождения без единой ошибки.",
                "<i>Важно:</i> Если на сегодня у пользователя не запланировано ни одного вида повторения для категории, и кнопки горят зеленым, пользователь все еще может активировать повторение. Однако итоговые результаты не будут нигде учитываться.",
                "<i>Важно:</i> При удалении категории также удаляются все слова внутри нее.",
                "<i>Важно:</i> После полного цикла повторений обоих типов (12 раз), категория удаляется, а все слова внутри неё переносятся во вкладку 'Изученные'.",
              ],
            },
            {
              chapter: "Особенности слов",
              id: "featuresOfWords",
              text: [
                "При добавлении слов присутствуют обязательные и необязательные поля. Из обязательных имеется:",
                "- Слово на английском;",
                "- Перевод;",
                "- Транскрипция;",
                "Необязательными полями являются поля примеров и описание контекста слова на английском. Изначально доступно одно поле примеров, чтобы добавить дополнительные, необходимо заполнить каждый предыдущий пример. Максимум полей: 3.",
                "<span>Совет:</span> В английском языке имеется большое количество слов имеющих одинаковый перевод, но разный контекст употребления. Описание контекста на английском языке является отличным вариантом решения проблемы. Грамотное описание контекста слова можно отыскать на сайте Cambridge Dictionary.",
              ],
            },
            {
              chapter: "Встроенные словарь и проверка на орфографию",
              id: "translateAPI",
              text: [
                "После завершения введения слова на английском в поле, оно будет проверено на орфографию, и если слово написано некорректно, пользователю будет предложен возможный вариант слова.",
                "Встроенный словарь также предлагает варианты перевода слова и его транскрипцию.",
              ],
            },
          ],
        },
        {
          header: "Изученные слова",
          content: [
            {
              chapter: "Настройки",
              id: "knownSetup",
              text: [
                "В персональных настройках пользователя указывается количество слов, предоставляемых сервисом за одно повторение выбранного типа. В день можно производить бесконечное количество повторений обоих типов. ",
              ],
            },
            {
              chapter: "Принцип работы",
              id: "knownPrinciple",
              text: [
                "На главный экран выводятся все изученные пользователем слова. При запуске повторения сервис случайным образом отбирает выбранное пользователем в настройках количество слов, которое не повторялось дольше всего по времени. На каждом слове подписана дата его последнего повторения каждого типа.",
                "<i>Важно:</i> Если в слове во время повторения будет допущена ошибка, дата последнего повторения не будет обновлена!",
              ],
            },
          ],
        },
        {
          header: "Слова с ошибками",
          content: [
            {
              chapter: "Настройки",
              id: "repeatSetup",
              text: [
                "В персональных настройках пользователя указывается количество допустимых ошибок в слове перед добавлением его во вкладку 'Повторяемые', а также шаблон регулярности повторения. Регулярность повторения - это периодичность дней с которой будет осуществляться повторение слов. ",
              ],
            },
            {
              chapter: "Принцип работы",
              id: "repeatPrinciple",
              text: [
                "На главный экран выводятся все слова, которые содержит вкладка. При повторении формируется список слов исходя из шаблона регулярности повторения.",
                "<i>Важно:</i> если хотя бы в одном слове будет допущена ошибка, прохождение всей пачки слов не будет засчитано!",
                "<i>Важно:</i> если в текущем дне нет доступных слов, кнопка активна не будет!",
              ],
            },
          ],
        },
        {
          header: "Актуализатор",
          content: [
            {
              chapter: "Настройки",
              id: "relevanceSetup",
              text: [
                "В пользовательских настройках выставляется количество слов и промежуток времени, за который они должны встретиться, чтобы считаться актуальными для пользователя.",
              ],
            },
            {
              chapter: "Принцип работы",
              id: "relevancePrinciple",
              text: [
                "Самое последнее поле выводит список слов, которые содержит актуализатор. Первая цифра означает количество встреч со словом за указанный пользователем промежуток времени. Вторая цифра обозначает общее количество встреч  со словом за все его время существования в актуализаторе. Буква I в квадратных скобках будет означать неправильный глагол. Чтобы добавить слова в актуализатор, необходимо перечислить их в самом первом поле через запятую или точку с запятой. После добавления во втором поле отобразятся все только что добавленные слова. Зеленым цветом будут отмечены те, что появились в актуализаторе впервые. Черным цветом - уже имеющиеся ранее. Красным - слова, которые выполнили условие, прописанное в пользовательских настройках. В этом случае пользователь может выделить кликом слово и активировать кнопку 'Добавить на изучение'.",
              ],
            },
          ],
        },
        {
          header: "Статистика",
          content: [
            {
              chapter: "Непрерывная серия повторений",
              id: "streak",
              text: [
                "Во вкладке 'Изучение' представлена страница со статистическими данными пользователя. Первым отображается информация о лучшей и текущей серии повторений. Серия накапливается каждый день в процессе выполнения пользователем всех запланированных задач. Основые условия увеличения серии:",
                "1. При наличии слов во вкладке 'Изученные' произвести повторение каждого типа минимум один раз в день.",
                "2. При наличии слов во вкладе 'Изучаемые' произвести все запланированные типы повторений на текущий день.",
                "3. При наличии слов во вкладке 'Повторяемые' произвести все запланированные типы повторений на текущий день.",
                "<span>Совет:</span> успешность выполнения условий для увеличения серии можно отслеживать по цветовой гамме кнопок начала повторений. Если кнопка горит зеленым цветом - на текущий день условие было выполнено. Если горит желтым - на текущий день требуется произвести повторение. Если горит красным - условие увеличения серии было просрочено, и при завершении повторения серия будет сброшена!",
                "<i>Важно:</i> если на текущий день у вас нет никаких активностей, чтобы увеличить серию повторений, необходимо один раз зайти на сервис!",
              ],
            },
            {
              chapter: "График",
              id: "chart",
              text: [
                "Ниже серии повторений представлен график, отображающий количество слов, которые пользователь изучил и поставил на изучение за выбранный период времени.",
              ],
            },
          ],
        },
        {
          header: "Как скачать сайт в виде приложения",
          content: [
            {
              chapter: "Что такое PWA приложение",
              id: "whatIsPwa",
              text: [
                "PWA или Progressive Web Application – технология, которая позволяет клиентам установить сайт на смартфон как приложение. На русский язык переводится как «прогрессивное веб-приложение». Основной особенностью PWA является кеширование статичных данных web-сайта, что ускоряет процесс повторных загрузок страниц и позволяет пользоваться ими при отключенном интернете.",
              ],
            },
            {
              chapter: "Установка PWA на IOS",
              id: "installPWAtoIOS",
              text: [
                "К сожалению, вынести вкладку на рабочий стол в виде ярлыка можно только из браузера Safari и если вы привыкли использовать другие обозреватели, для создания PWA вам все же придется обратиться к штатному. Хорошая новость — элементов интерфейса Safari в созданном приложении вы все равно не увидите, так что не имеет никакого значения, через какой браузер вы создавали ярлык. Переходим на вкладку с интересующим нас ресурсом, выбираем Поделиться и На экран “Домой”.",
              ],
            },
            {
              chapter: "Установка PWA на остальные платформы",
              id: "installPWA",
              text: [
                "Установка на остальные платформы не составляет особых затруднений. Как правило, при заходе на сайт виден банер с предложением установить PWA. В случае если банер не появляется, есть альтернативные способы установки, которые различаются в зависимости от используемого браузера. Подробнее об установке можно почитать в руководствах к конкретному браузеру.",
              ],
            },
          ],
        },
      ],
      chapters: [],
    };
  },
  mounted() {
    this.$refs.docsContent.addEventListener("scroll", this.selectChapter);
    /* Отправлять запрос серверу на скачивание документа и записывать его в docs */
  },

  methods: {
    /*getImgUlr(img) {
      return require(`@/assets/docs/${img}`);
    },*/
    async selectHeader(event) {
      this.chapters = [];
      this.currentHeader = event.target.textContent;
      await nextTick();
      this.$refs.docsContent.scrollTo({ top: 0, behavior: "smooth" });
      this.selectChapter();
    },
    collectChapters(object) {
      if (object !== null) this.chapters.push(object);
    },
    getCoords(elem) {
      let box = elem.getBoundingClientRect();
      return {
        top: box.top + scrollY,
        left: box.left + scrollX,
      };
    },
    selectChapter() {
      this.chapters.forEach((chapter) => {
        const chapterTop = this.getCoords(chapter).top;
        if (chapterTop > -160 && chapterTop < 180) {
          if (this.currentChapter != chapter.id)
            this.currentChapter = chapter.id;
        }
      });
    },
    toggleMenu() {
      let links = this.$refs.links;
      let styleOfLinks = window.getComputedStyle(links);
      if (styleOfLinks.position != "fixed") return;
      let backDrop = this.$refs.backDrop;
      links.classList.toggle("_visible");
      backDrop.classList.toggle("_visible");
    },
  },
};
</script>

<style></style>
