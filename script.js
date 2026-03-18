// =============================================
// Практическая работа №6 — Работа с DOM
// Starter Kit: script.js
// Основная работа выполняется здесь!
// =============================================

// =============================================
// ШАБЛОН ОБЪЕКТА КАРТОЧКИ
// Каждая карточка — это объект с такой структурой:
// {
//   id: Date.now(),       — уникальный идентификатор
//   title: "...",         — название услуги
//   category: "..."       — категория (design / dev / marketing)
// }
// =============================================


// =============================================
// ШАГ 1: НАХОДИМ ЭЛЕМЕНТЫ В DOM
// Используем querySelector — один раз в начале файла,
// чтобы не искать элементы снова и снова внутри функций.
// =============================================

const serviceNameInput   = document.querySelector('#service-name');
const categorySelect     = document.querySelector('#service-category');
const addBtn             = document.querySelector('#add-btn');
const clearFormBtn       = document.querySelector('#clear-form-btn');
const validationMsg      = document.querySelector('#validation-msg');

const servicesContainer  = document.querySelector('#services-container');
const totalCount         = document.querySelector('#total-count');
const emptyMsg           = document.querySelector('#empty-msg');

const toggleThemeBtn     = document.querySelector('#toggle-theme-btn');
const highlightDevBtn    = document.querySelector('#highlight-dev-btn');
const showFavoritesBtn   = document.querySelector('#show-favorites-btn');
const showAllBtn         = document.querySelector('#show-all-btn');

const demoFillBtn        = document.querySelector('#demo-fill-btn');


// =============================================
// ШАГ 2: ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ
// =============================================

// --- Обновление счётчика карточек ---
// TODO: Напишите функцию updateCounter()
// Подсказка: используйте querySelectorAll('.service-card').length
// Не забудьте комментарий «ПОЧЕМУ?» возле метода!
function updateCounter() {
  // TODO: ваш код здесь
}


// --- Показ/скрытие сообщения «список пуст» ---
// TODO: Напишите функцию toggleEmptyMessage()
// Подсказка: если в контейнере нет карточек — показать emptyMsg, иначе скрыть
function toggleEmptyMessage() {
  // TODO: ваш код здесь
}


// --- Валидация формы ---
// TODO: Напишите функцию validateInput(title)
// Возвращает true, если название корректно (не пустое, минимум 3 символа)
// При ошибке — выводит сообщение в validationMsg через textContent
// При успехе — очищает validationMsg
function validateInput(title) {
  // TODO: ваш код здесь
}


// =============================================
// ШАГ 3: СОЗДАНИЕ КАРТОЧКИ
// =============================================

// TODO: Напишите функцию createCardElement(cardData)
// Принимает объект { id, title, category }
// Возвращает готовый DOM-элемент карточки
//
// Структура карточки:
//   <div class="service-card" data-id="...">
//     <h3>Название</h3>
//     <span class="category-badge">Категория</span>
//     <div class="card-actions">
//       <button class="btn-secondary">⭐ В избранное</button>
//       <button class="btn-danger">Удалить</button>
//     </div>
//   </div>
//
// ВАЖНО: вставляйте текст только через textContent!
// Не забудьте комментарии «ПОЧЕМУ?» возле createElement, textContent, append
function createCardElement(cardData) {
  // TODO: ваш код здесь
}


// =============================================
// ШАГ 4: ДОБАВЛЕНИЕ КАРТОЧКИ
// =============================================

// TODO: Напишите обработчик для кнопки «Добавить»
// Алгоритм:
//   1. Считать значение из serviceNameInput и categorySelect
//   2. Вызвать validateInput — если false, выйти (return)
//   3. Создать объект карточки { id: Date.now(), title, category }
//   4. Вызвать createCardElement и добавить результат в servicesContainer
//   5. Очистить форму, обновить счётчик, скрыть emptyMsg
addBtn.addEventListener('click', () => {
  // TODO: ваш код здесь
});


// =============================================
// ШАГ 5: ОЧИСТКА ФОРМЫ
// =============================================

// TODO: Напишите обработчик для кнопки «Очистить форму»
// Очищает поля ввода и сообщение валидации
clearFormBtn.addEventListener('click', () => {
  // TODO: ваш код здесь
});


// =============================================
// ШАГ 6: ПЕРЕКЛЮЧЕНИЕ ТЁМНОЙ ТЕМЫ
// =============================================

// TODO: Напишите обработчик для кнопки «Переключить тему»
// Подсказка: document.body.classList.toggle(...)
// Не забудьте комментарий «ПОЧЕМУ toggle, а не add/remove?»
toggleThemeBtn.addEventListener('click', () => {
  // TODO: ваш код здесь
});


// =============================================
// ШАГ 7: ПОДСВЕТКА КАТЕГОРИИ «РАЗРАБОТКА»
// =============================================

// TODO: Напишите обработчик для кнопки «Подсветить Разработку»
// Алгоритм:
//   1. Найти все карточки через querySelectorAll
//   2. Для каждой проверить data-атрибут категории
//   3. Если категория === 'dev' — добавить класс highlight
// Подсказка: используйте forEach по NodeList
highlightDevBtn.addEventListener('click', () => {
  // TODO: ваш код здесь
});


// =============================================
// ШАГ 8: ФИЛЬТР «ПОКАЗАТЬ ТОЛЬКО ИЗБРАННЫЕ»
// =============================================

// TODO: Напишите обработчики для кнопок «Показать избранные» и «Показать все»
// Подсказка: добавляйте/убирайте класс .hidden на карточках без .highlight
showFavoritesBtn.addEventListener('click', () => {
  // TODO: ваш код здесь
});

showAllBtn.addEventListener('click', () => {
  // TODO: ваш код здесь
});


// =============================================
// 🔴 PRO: ДЕМО-ПРАЙС ЧЕРЕЗ DocumentFragment
// =============================================

// Демо-данные — не трогать!
const DEMO_SERVICES = [
  { title: 'Разработка лендинга',      category: 'dev'       },
  { title: 'SEO-оптимизация',          category: 'marketing' },
  { title: 'Дизайн логотипа',          category: 'design'    },
  { title: 'Настройка рекламы',        category: 'marketing' },
  { title: 'Мобильное приложение',     category: 'dev'       },
  { title: 'Фирменный стиль',          category: 'design'    },
  { title: 'Email-рассылка',           category: 'marketing' },
  { title: 'Интернет-магазин',         category: 'dev'       },
  { title: 'UX-аудит сайта',           category: 'design'    },
  { title: 'Контекстная реклама',      category: 'marketing' },
];

// TODO: Напишите обработчик для кнопки «Загрузить демо-прайс»
// Алгоритм:
//   1. Создать DocumentFragment
//   2. Для каждого элемента DEMO_SERVICES создать карточку через createCardElement
//   3. Добавить карточку в fragment (не в DOM!)
//   4. Одним вызовом append вставить fragment в servicesContainer
//   5. Обновить счётчик
// Не забудьте комментарий «ПОЧЕМУ DocumentFragment, а не append в цикле?»
demoFillBtn.addEventListener('click', () => {
  // TODO: ваш код здесь
});


// =============================================
// ИНИЦИАЛИЗАЦИЯ
// Вызывается один раз при загрузке страницы
// =============================================
function init() {
  updateCounter();
  toggleEmptyMessage();
}

init();