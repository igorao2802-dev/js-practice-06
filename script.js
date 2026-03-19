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
const highlightBtn = document.querySelector("#highlight-expensive");
const filterFavBtn = document.querySelector("#filter-fav");
const demoBtn = document.querySelector("#load-demo");
const demo100Btn = document.querySelector("#load-100");
const clearAllBtn = document.querySelector("#clear-all");
const errorBlock = document.querySelector("#form-error");

/* =====================================================
ДАННЫЕ ПРИЛОЖЕНИЯ
===================================================== */
const cards = [];

/* =====================================================
СЧЁТЧИК КАРТОЧЕК
===================================================== */
function updateCounter() {
    // Использую querySelectorAll().length, чтобы получить актуальное количество карточек в контейнере
    // querySelectorAll возвращает NodeList всех элементов с классом .card
    countSpan.textContent = container.querySelectorAll(".service-card").length;
}

/* =====================================================
ВЫВОД ОШИБОК
===================================================== */
function showError(message) {
    // textContent используется для безопасного вывода текста (защита от XSS-атак)
    // В отличие от innerHTML, textContent не выполняет HTML-код
    errorBlock.textContent = message;
}

function clearError() {
    errorBlock.textContent = "";
}

/* =====================================================
ВАЛИДАЦИЯ ПОЛЯ ВВОДА
===================================================== */
function validate(title) {
    const trimmed = title.trim();
    if (trimmed === "") {
        return "Введите название услуги";
    }
    if (trimmed.length < 3) {
        return "Минимум 3 символа";
    }
    return null;
}

/* =====================================================
СОЗДАНИЕ КАРТОЧКИ УСЛУГИ
===================================================== */
function createCard(cardData) {
    // createElement — создаю новый DOM-элемент динамически
    // Использую createElement, потому что нужно создать элемент программно, а не через innerHTML
    const card = document.createElement("div");
    card.classList.add("service-card");
    
    // Добавляю data-id для идентификации карточки
    card.dataset.id = cardData.id;
    
    /* ===== ЗАГОЛОВОК (с редактированием по клику) ===== */
    const title = document.createElement("h3");
    // textContent — защита от XSS при выводе пользовательских данных
    // Использую textContent, потому что он экранирует HTML-теги и предотвращает инъекции кода
    title.textContent = cardData.title;
    title.style.cursor = "pointer";
    title.title = "Нажмите для редактирования";
    
    /* ===== КАТЕГОРИЯ ===== */
    const category = document.createElement("span");
    category.textContent = cardData.category;
    category.classList.add("category-badge");
    
    /* ===== ОПИСАНИЕ ===== */
    const desc = document.createElement("p");
    desc.textContent = cardData.description || "";
    
    /* ===== КНОПКА «В ИЗБРАННОЕ» ===== */
    const favBtn = document.createElement("button");
    favBtn.textContent = "В избранное";
    favBtn.classList.add("btn-secondary");
    favBtn.addEventListener("click", () => {
        // classList.toggle — переключает класс highlight на карточке
        // Использую toggle, потому что нужно добавлять/удалять класс одним методом
        card.classList.toggle("highlight");
    });
    
    /* ===== КНОПКА «УДАЛИТЬ» ===== */
    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "Удалить";
    deleteBtn.classList.add("btn-danger");
    deleteBtn.addEventListener("click", () => {
        // remove — удаляет элемент из DOM
        // Использую remove, потому что это современный и понятный способ удаления узла
        card.remove();
        updateCounter();
    });
    
    /* ===== РЕДАКТИРОВАНИЕ ПО КЛИКУ НА ЗАГОЛОВОК ===== */
    title.addEventListener("click", () => {
        const input = document.createElement("input");
        input.type = "text";
        input.value = title.textContent;
        input.classList.add("input");
        
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
    
    /* ===== ДОБАВЛЕНИЕ ВСЕХ ЭЛЕМЕНТОВ В КАРТОЧКУ ===== */
    // append — добавляю несколько элементов за один раз
    // Использую append, потому что можно добавить несколько узлов одним вызовом
    card.append(title, category, desc, favBtn, deleteBtn);
    
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
    const error = validate(title);
    if (error) {
        showError(error);
        return;
    }
    
    clearError();
    
    // Создаю объект карточки с уникальным ID
    const newCard = {
        id: Date.now(),
        title: title.trim(),
        description: desc.trim(),
        category: category
    };
    
    cards.push(newCard);
    
    // Создаю DOM-элемент карточки
    const cardElement = createCard(newCard);
    
    // append — добавляю карточку в контейнер
    // Использую append, потому что это современный метод добавления узла в DOM
    container.append(cardElement);
    
    // Очищаю форму после успешного добавления
    titleInput.value = "";
    descInput.value = "";
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
    clearError();
});

/* =====================================================
ПЕРЕКЛЮЧЕНИЕ ТЕМЫ (ТЁМНАЯ/СВЕТЛАЯ)
===================================================== */
toggleThemeBtn.addEventListener("click", () => {
    // classList.toggle — переключает класс dark-theme на body
    // Использую toggle, потому что нужно добавлять/удалять класс одним действием
    document.body.classList.toggle("dark-theme");
});

/* =====================================================
ПОДСВЕТКА КАРТОЧЕК КАТЕГОРИИ «РАЗРАБОТКА»
===================================================== */
highlightBtn.addEventListener("click", () => {
    // querySelectorAll — нахожу все карточки в контейнере
    const allCards = container.querySelectorAll(".service-card");
    
    allCards.forEach(card => {
        // Нахожу элемент категории внутри карточки
        const categoryEl = card.querySelector(".category-badge");
        if (categoryEl && categoryEl.textContent === "Разработка") {
            // classList.add — добавляю класс highlight
            // Использую add, потому что нужно добавить класс без удаления других
            card.classList.add("highlight");
        }
    });
});

/* =====================================================
ФИЛЬТР «ПОКАЗАТЬ ТОЛЬКО ИЗБРАННЫЕ»
===================================================== */
filterFavBtn.addEventListener("click", () => {
    const allCards = container.querySelectorAll(".service-card");
    
    allCards.forEach(card => {
        // classList.contains — проверяю наличие класса highlight
        if (!card.classList.contains("highlight")) {
            // Добавляю класс hidden для скрытия карточки
            card.classList.add("hidden");
        } else {
            // Удаляю класс hidden для отображения карточки
            card.classList.remove("hidden");
        }
    });
});

/* =====================================================
DEMO: ЗАГРУЗКА 50 КАРТОЧЕК (DocumentFragment)
===================================================== */
demoBtn.addEventListener("click", () => {
    // DocumentFragment — создаю фрагмент документа для оптимизации
    // Использую DocumentFragment, потому что вставка происходит за ОДИН раз в DOM
    // Это уменьшает количество перерисовок страницы и улучшает производительность
    const fragment = document.createDocumentFragment();
    
    for (let i = 1; i <= 50; i++) {
        const cardData = {
            id: Date.now() + i,
            title: "Услуга " + i,
            description: "Описание услуги номер " + i,
            category: "Дизайн"
        };
        
        // append — добавляю карточку во фрагмент (не в DOM напрямую)
        fragment.append(createCard(cardData));
    }
    
    // append — добавляю весь фрагмент в контейнер за один раз
    container.append(fragment);
    updateCounter();
});

/* =====================================================
DEMO: ЗАГРУЗКА 100 КАРТОЧЕК (DocumentFragment)
===================================================== */
demo100Btn.addEventListener("click", () => {
    // DocumentFragment — для оптимизации массовой вставки
    const fragment = document.createDocumentFragment();
    
    for (let i = 1; i <= 100; i++) {
        const cardData = {
            id: Date.now() + i,
            title: "Услуга PRO " + i,
            description: "Расширенное описание услуги " + i,
            category: "Маркетинг"
        };
        
        fragment.append(createCard(cardData));
    }
    
    container.append(fragment);
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