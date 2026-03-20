"use strict";

/* =====================================================
ПОИСК ЭЛЕМЕНТОВ DOM
===================================================== */
// Использую querySelector, потому что это современный стандарт для поиска элементов
// querySelector позволяет использовать CSS-селекторы и работает с первым найденным элементом
const titleInput = document.querySelector("#title-input");
const descInput = document.querySelector("#desc-input");
const categorySelect = document.querySelector("#category-select");
const addBtn = document.querySelector("#add-btn");
const clearBtn = document.querySelector("#clear-btn");
const container = document.querySelector("#services-container");
const countSpan = document.querySelector("#total-count");
const toggleThemeBtn = document.querySelector("#toggle-theme");
const themeIcon = document.querySelector("#theme-icon");
const themeText = document.querySelector("#theme-text");
const highlightBtn = document.querySelector("#highlight-dev-btn");
const highlightStar = document.querySelector("#highlight-star");
const highlightMessage = document.querySelector("#highlight-message");
const showFavoritesBtn = document.querySelector("#show-favorites-btn");
const showAllBtn = document.querySelector("#show-all-btn");
const demoBtn = document.querySelector("#load-demo");
const demo100Btn = document.querySelector("#load-100");
const removeDemoBtn = document.querySelector("#remove-demo");
const clearAllBtn = document.querySelector("#clear-all");
const errorBlock = document.querySelector("#form-error");
const emptyMsg = document.querySelector("#empty-msg");

/* =====================================================
ДАННЫЕ ПРИЛОЖЕНИЯ
===================================================== */
const cards = [];
let isHighlightActive = false; // Флаг состояния подсветки категории
let demoCardsCount = 0; // Счётчик демо-карточек

/* =====================================================
СЧЁТЧИК КАРТОЧЕК
===================================================== */
function updateCounter() {
    // Использую querySelectorAll().length, чтобы получить актуальное количество карточек в контейнере
    // querySelectorAll возвращает NodeList всех элементов с классом .service-card
    const count = container.querySelectorAll(".service-card").length;
    countSpan.textContent = count;
    
    // Показываю сообщение "Список пуст", если карточек нет
    if (count === 0) {
        emptyMsg.style.display = "block";
    } else {
        emptyMsg.style.display = "none";
    }
}

/* =====================================================
ВЫВОД ОШИБОК
===================================================== */
function showError(message) {
    // textContent используется для безопасного вывода текста (защита от XSS-атак)
    // В отличие от innerHTML, textContent не выполняет HTML-код
    errorBlock.textContent = message;
    errorBlock.style.display = "block";
}

function clearError() {
    errorBlock.textContent = "";
    errorBlock.style.display = "none";
}

/* =====================================================
ВАЛИДАЦИЯ ПОЛЯ ВВОДА
===================================================== */
function validateTitle(title) {
    const trimmedTitle = title.trim();
    
    // Проверка на пустое название
    if (trimmedTitle === "") {
        return "Введите название услуги";
    }
    
    // Проверка минимальной длины (требование задания: минимум 3 символа)
    if (trimmedTitle.length < 3) {
        return "Минимум 3 символа";
    }
    
    // Проверка первого символа (не цифра и не спецсимвол)
    const firstChar = trimmedTitle.charAt(0);
    if (!/[А-Яа-яA-Za-z]/.test(firstChar)) {
        return "Первый символ должен быть буквой";
    }
    
    // Проверка на бесконечность и специальные значения
    if (trimmedTitle.toLowerCase() === "infinity" || trimmedTitle.toLowerCase() === "nan") {
        return "Недопустимое значение";
    }
    
    return null;
}

/* =====================================================
УПРАВЛЕНИЕ СТИЛЯМИ ПОЛЕЙ ВВОДА
===================================================== */
function setFieldValidity(field, isValid) {
    // Удаляем оба класса сначала
    field.classList.remove("valid", "invalid");
    
    // Добавляем соответствующий класс
    if (isValid) {
        // Синяя граница #2563EB при валидном вводе
        field.classList.add("valid");
    } else {
        // Красная граница #FF5555 при невалидном вводе
        field.classList.add("invalid");
    }
}

function clearFieldValidity(field) {
    // Сбрасываем стили валидации (серая граница #DCE3EB по умолчанию)
    field.classList.remove("valid", "invalid");
}

// Обработчики для валидации в реальном времени
titleInput.addEventListener("input", () => {
    const error = validateTitle(titleInput.value);
    if (titleInput.value.trim() === "") {
        clearFieldValidity(titleInput);
    } else {
        setFieldValidity(titleInput, error === null);
    }
});

descInput.addEventListener("input", () => {
    // Описание необязательное, поэтому просто сбрасываем стили
    clearFieldValidity(descInput);
});

/* =====================================================
СОЗДАНИЕ КАРТОЧКИ УСЛУГИ
===================================================== */
function createCard(cardData, isDemo = false) {
    // createElement — создаю новый DOM-элемент динамически
    // Использую createElement, потому что нужно создать элемент программно, а не через innerHTML
    const card = document.createElement("div");
    // classList.add — добавляю класс service-card для стилизации
    // Использую classList.add, потому что это безопасный способ добавления классов
    card.classList.add("service-card");
    
    // Добавляю data-id для идентификации карточки
    card.dataset.id = cardData.id;
    // Помечаем демо-карточки
    if (isDemo) {
        card.dataset.isDemo = "true";
    }
    
    /* ===== ЗАГОЛОВОК (с редактированием по клику) ===== */
    const title = document.createElement("h3");
    // textContent — защита от XSS при выводе пользовательских данных
    // Использую textContent, потому что он экранирует HTML-теги и предотвращает инъекции кода
    title.textContent = cardData.title;
    title.style.cursor = "pointer";
    title.title = "Нажмите для редактирования";
    
    /* ===== КАТЕГОРИЯ ===== */
    const category = document.createElement("span");
    // textContent — безопасный вывод категории
    category.textContent = cardData.category;
    // classList.add — добавляю класс для стилизации бейджа категории
    category.classList.add("category-badge");
    
    /* ===== ОПИСАНИЕ (необязательное поле) ===== */
    const desc = document.createElement("p");
    // textContent — защита от XSS при выводе описания
    desc.textContent = cardData.description || "";
    if (!cardData.description) {
        desc.style.display = "none";
    }
    
/* ===== КНОПКА «В ИЗБРАННОЕ» ===== */
const favBtn = document.createElement("button");
// textContent — безопасный вывод текста кнопки
// ИСПРАВЛЕНИЕ 1: Одинаковая длина текста для сохранения размера кнопки
favBtn.textContent = "☆ В избранное";
favBtn.classList.add("btn-favorite");
favBtn.addEventListener("click", () => {
    // Переключаем текст и иконку кнопки
    // НЕ добавляем класс highlight на карточку (подсветка только для "Разработка")
    const isFavorite = favBtn.textContent.includes("★");
    
    if (isFavorite) {
        // Текст такой же длины для сохранения размера кнопки
        favBtn.textContent = "☆ В избранное";
        card.dataset.isFavorite = "false";
    } else {
        // Текст такой же длины для сохранения размера кнопки
        favBtn.textContent = "★ Избранное";
        card.dataset.isFavorite = "true";
    }
    
    updateCounter();
});    
    /* ===== КНОПКА «УДАЛИТЬ» ===== */
    const deleteBtn = document.createElement("button");
    // textContent — безопасный вывод текста кнопки
    deleteBtn.textContent = "Удалить";
    deleteBtn.classList.add("btn-delete");
    deleteBtn.addEventListener("click", () => {
        // confirm — требую подтверждение перед удалением
        // Использую confirm, потому что это требование безопасности (защита от случайного удаления)
        const confirmDelete = confirm("Вы уверены, что хотите удалить эту карточку?");
        
        if (!confirmDelete) {
            return;
        }
        
        // remove — удаляет элемент из DOM
        // Использую remove, потому что это современный и понятный способ удаления узла
        card.remove();
        updateCounter();
    });
    
    /* ===== РЕДАКТИРОВАНИЕ ЗАГОЛОВКА ПО КЛИКУ ===== */
    title.addEventListener("click", () => {
        const input = document.createElement("input");
        input.type = "text";
        input.value = title.textContent;
        input.classList.add("edit-input");
        
        // replaceChild — заменяет заголовок на input
        card.replaceChild(input, title);
        input.focus();
        
        input.addEventListener("blur", () => {
            const newValue = input.value.trim();
            if (newValue.length >= 3) {
                // textContent — безопасное обновление текста
                title.textContent = newValue;
            }
            card.replaceChild(title, input);
        });
        
        input.addEventListener("keydown", (e) => {
            if (e.key === "Enter") {
                input.blur();
            }
        });
    });
    
    /* ===== РЕДАКТИРОВАНИЕ ОПИСАНИЯ ПО КЛИКУ ===== */
    desc.addEventListener("click", () => {
        const input = document.createElement("input");
        input.type = "text";
        input.value = desc.textContent;
        input.classList.add("edit-input");
        
        // replaceChild — заменяет описание на input
        card.replaceChild(input, desc);
        input.focus();
        
        input.addEventListener("blur", () => {
            const newValue = input.value.trim();
            // textContent — безопасное обновление текста
            desc.textContent = newValue;
            if (newValue === "") {
                desc.style.display = "none";
            } else {
                desc.style.display = "block";
            }
            card.replaceChild(desc, input);
        });
        
        input.addEventListener("keydown", (e) => {
            if (e.key === "Enter") {
                input.blur();
            }
        });
    });
    
    /* ===== ДОБАВЛЕНИЕ ВСЕХ ЭЛЕМЕНТОВ В КАРТОЧКУ ===== */
    // Создаём контейнер для кнопок
    const actionsDiv = document.createElement("div");
    actionsDiv.classList.add("card-actions");
    
    // append — добавляю несколько элементов за один раз
    // Использую append, потому что можно добавить несколько узлов одним вызовом
    actionsDiv.append(favBtn, deleteBtn);
    card.append(title, category, desc, actionsDiv);
    
    return card;
}

/* =====================================================
ДОБАВЛЕНИЕ НОВОЙ КАРТОЧКИ
===================================================== */
addBtn.addEventListener("click", () => {
    const title = titleInput.value;
    const desc = descInput.value;
    const category = categorySelect.value;
    
    // ВАЛИДАЦИЯ: проверяю название перед созданием карточки
    // Описание необязательное, поэтому не проверяем
    const error = validateTitle(title);
    if (error) {
        showError(error);
        setFieldValidity(titleInput, false);
        return;
    }
    
    clearError();
    setFieldValidity(titleInput, true);
    
    // Создаю объект карточки с уникальным ID
    const newCard = {
        id: Date.now(),
        title: title.trim(),
        description: desc.trim(),
        category: category
    };
    
    cards.push(newCard);
    
    // Создаю DOM-элемент карточки
    const cardElement = createCard(newCard, false);
    
    // append — добавляю карточку в контейнер
    // Использую append, потому что это современный метод добавления узла в DOM
    container.append(cardElement);
    
    // Очищаю форму после успешного добавления
    titleInput.value = "";
    descInput.value = "";
    clearFieldValidity(titleInput);
    clearFieldValidity(descInput);
    clearError();
    
    // Обновляю счётчик
    updateCounter();
});

/* =====================================================
ОЧИСТКА ФОРМЫ
===================================================== */
clearBtn.addEventListener("click", () => {
    titleInput.value = "";
    descInput.value = "";
    clearFieldValidity(titleInput);
    clearFieldValidity(descInput);
    clearError();
});

/* =====================================================
ПЕРЕКЛЮЧЕНИЕ ТЕМЫ (ТЁМНАЯ/СВЕТЛАЯ) С ИКОНКОЙ
===================================================== */
toggleThemeBtn.addEventListener("click", () => {
    document.body.classList.toggle("dark-theme");
    
    const isDark = document.body.classList.contains("dark-theme");
    
    if (isDark) {
        themeIcon.textContent = "🌞";
        themeText.textContent = "Включить светлую тему"; // 
    } else {
        themeIcon.textContent = "🌙";
        themeText.textContent = "Включить тёмную тему"; // 
    }
});

/* =====================================================
ПОДСВЕТКА КАРТОЧЕК КАТЕГОРИИ «РАЗРАБОТКА»
===================================================== */
highlightBtn.addEventListener("click", () => {
    // querySelectorAll — нахожу все карточки в контейнере
    const allCards = container.querySelectorAll(".service-card");
    let devCardsFound = 0;
    
    // Переключаем состояние подсветки
    isHighlightActive = !isHighlightActive;
    
    if (isHighlightActive) {
        // Включаем подсветку
        allCards.forEach(card => {
            // Нахожу элемент категории внутри карточки
            const categoryEl = card.querySelector(".category-badge");
            if (categoryEl && categoryEl.textContent === "Разработка") {
                // classList.add — добавляю класс category-highlight
                // Использую add, потому что нужно добавить класс без удаления других
                card.classList.add("category-highlight");
                devCardsFound++;
            }
        });
        
        // Вывод сообщения, если карточек категории не найдено
        if (devCardsFound === 0) {
            highlightMessage.textContent = "⚠️ Карточки категории «Разработка» не найдены";
        } else {
            highlightMessage.textContent = `✓ Подсвечено карточек: ${devCardsFound}`;
        }
        
        // Меняем иконку звезды на закрашенную
        highlightStar.textContent = "★";
    } else {
        // Выключаем подсветку
        allCards.forEach(card => {
            // classList.remove — удаляю класс category-highlight
            card.classList.remove("category-highlight");
        });
        
        highlightMessage.textContent = "";
        // Возвращаем пустую звёздочку
        highlightStar.textContent = "⭐";
    }
});

/* =====================================================
ПОКАЗАТЬ ВСЕ КАРТОЧКИ
===================================================== */
showAllBtn.addEventListener("click", () => {
    const allCards = container.querySelectorAll(".service-card");
    
    allCards.forEach(card => {
        // classList.remove — удаляю класс hidden для отображения всех карточек
        card.classList.remove("hidden");
    });
    
    highlightMessage.textContent = "";
});

/* =====================================================
ФИЛЬТР «ПОКАЗАТЬ ТОЛЬКО ИЗБРАННЫЕ»
===================================================== */
showFavoritesBtn.addEventListener("click", () => {
    const allCards = container.querySelectorAll(".service-card");
    
    allCards.forEach(card => {
        // dataset.isFavorite — проверяю, добавлена ли карточка в избранное
        const isFavorite = card.dataset.isFavorite === "true";
        
        if (!isFavorite) {
            // classList.add — добавляю класс hidden для скрытия карточки
            // Использую classList вместо style.display, потому что это разделяет логику и стили
            card.classList.add("hidden");
        } else {
            // classList.remove — удаляю класс hidden для отображения карточки
            card.classList.remove("hidden");
        }
    });
});

/* =====================================================
DEMO: ЗАГРУЗКА 10 ДЕМО-КАРТОЧЕК (DocumentFragment)
===================================================== */
demoBtn.addEventListener("click", () => {
    // DocumentFragment — создаю фрагмент документа для оптимизации
    // Использую DocumentFragment, потому что вставка происходит за ОДИН раз в DOM
    // Это уменьшает количество перерисовок страницы и улучшает производительность
    const fragment = document.createDocumentFragment();
    
    // Демо-данные (10 карточек)
    const demoServices = [
        { title: "Разработка лендинга", category: "Разработка", description: "Создание одностраничного сайта" },
        { title: "SEO-аудит сайта", category: "Маркетинг", description: "Анализ и оптимизация для поисковиков" },
        { title: "Дизайн логотипа", category: "Дизайн", description: "Разработка фирменного знака" },
        { title: "Настройка рекламы", category: "Маркетинг", description: "Контекстная реклама в Яндекс и Google" },
        { title: "Вёрстка по макету", category: "Разработка", description: "HTML/CSS вёрстка из дизайна" },
        { title: "UX-исследование", category: "Дизайн", description: "Анализ пользовательского опыта" },
        { title: "Email-рассылка", category: "Маркетинг", description: "Настройка цепочки писем" },
        { title: "React-компонент", category: "Разработка", description: "Разработка компонента на React" },
        { title: "Брендбук", category: "Дизайн", description: "Создание руководства по бренду" },
        { title: "Контент-план на месяц", category: "Маркетинг", description: "План публикаций для соцсетей" }
    ];
    
    for (let i = 0; i < demoServices.length; i++) {
        const cardData = {
            id: Date.now() + i + Math.random(),
            title: demoServices[i].title,
            description: demoServices[i].description,
            category: demoServices[i].category
        };
        
        // append — добавляю карточку во фрагмент (не в DOM напрямую)
        fragment.append(createCard(cardData, true));
        demoCardsCount++;
    }
    
    // append — добавляю весь фрагмент в контейнер за один раз
    container.append(fragment);
    updateCounter();
});

/* =====================================================
DEMO: ЗАГРУЗКА 100 ДЕМО-КАРТОЧЕК (DocumentFragment)
===================================================== */
demo100Btn.addEventListener("click", () => {
    // DocumentFragment — создаю фрагмент документа для оптимизации
    const fragment = document.createDocumentFragment();
    
    for (let i = 1; i <= 100; i++) {
        const cardData = {
            id: Date.now() + i + Math.random(),
            title: "Услуга PRO " + i,
            description: "Расширенное описание услуги " + i,
            category: i % 3 === 0 ? "Дизайн" : (i % 3 === 1 ? "Разработка" : "Маркетинг")
        };
        
        fragment.append(createCard(cardData, true));
        demoCardsCount++;
    }
    
    container.append(fragment);
    updateCounter();
});

/* =====================================================
УДАЛЕНИЕ ТОЛЬКО ДЕМО-КАРТОЧЕК
===================================================== */
removeDemoBtn.addEventListener("click", () => {
    // confirm — требую подтверждение перед удалением демо-карточек
    const confirmDelete = confirm("Вы уверены, что хотите удалить все демо-карточки?");
    
    if (!confirmDelete) {
        return;
    }
    
    const demoCards = container.querySelectorAll("[data-is-demo='true']");
    
    demoCards.forEach(card => {
        // remove — удаляет элемент из DOM
        card.remove();
    });
    
    demoCardsCount = 0;
    updateCounter();
});

/* =====================================================
УДАЛЕНИЕ ВСЕХ КАРТОЧЕК (с подтверждением)
===================================================== */
clearAllBtn.addEventListener("click", () => {
    // confirm — требую подтверждение перед массовым удалением
    // Использую confirm, потому что это требование безопасности (защита от случайного удаления)
    const confirmDelete = confirm("Удалить все карточки?");
    
    if (!confirmDelete) {
        return;
    }
    
    // textContent = "" — очищаю контейнер безопасно
    // Использую textContent, потому что это удаляет все дочерние узлы без выполнения HTML
    container.textContent = "";
    
    // Очищаю массив данных
    cards.length = 0;
    demoCardsCount = 0;
    isHighlightActive = false;
    highlightMessage.textContent = "";
    highlightStar.textContent = "⭐";
    
    updateCounter();
});

/* =====================================================
ИНИЦИАЛИЗАЦИЯ ПРИ ЗАГРУЗКЕ СТРАНИЦЫ
===================================================== */
window.addEventListener("load", () => {
    // Инициализирую счётчик при загрузке страницы
    updateCounter();
    console.log("Приложение загружено. Карточек:", container.querySelectorAll(".service-card").length);
});