"use strict";

console.log("JavaScript загружен.");

const state = {
    x: 0,
    y: null,
    r: []
};

document.addEventListener('DOMContentLoaded', function() {
    console.log("DOM загружен.");

    initApplication();
});

function initApplication() {
    console.log("Инициализация приложения...");

    initEventHandlers();

    restoreHistory();

    console.log("Приложение инициализировано!");
}

function initEventHandlers() {
    console.log("Инициализация обработчиков событий...");
    const xInput = document.getElementById("x");
    if (xInput) {
        xInput.addEventListener("input", (ev) => {
            state.x = parseFloat(ev.target.value);
            console.log("X изменен:", state.x);
        });

        state.x = parseFloat(xInput.value) || 0;
    }

    const yButtons = document.querySelectorAll('.y-btn');
    console.log("Найдено кнопок Y:", yButtons.length);

    yButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            const value = parseFloat(this.textContent);
            console.log("Кнопка Y нажата:", value);

            yButtons.forEach(b => {
                b.classList.remove('active');
                b.style.backgroundColor = '';
                b.style.color = '';
            });

            this.classList.add('active');
            this.style.backgroundColor = '#3498db';
            this.style.color = 'white';

            state.y = value;
            const yHiddenInput = document.getElementById('y');
            if (yHiddenInput) {
                yHiddenInput.value = state.y;
            }

            console.log("Y установлен:", state.y);
        });
    });

    const rCheckboxes = document.querySelectorAll('input[name="r"]');
    console.log("Найдено чекбоксов R:", rCheckboxes.length);

    rCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', function() {
            const value = parseFloat(this.value);

            if (this.checked) {
                if (!state.r.includes(value)) {
                    state.r.push(value);
                }
            } else {
                state.r = state.r.filter(r => r !== value);
            }

            console.log("R изменен:", state.r);
        });
    });

    const form = document.getElementById("point-form");
    if (form) {
        form.addEventListener("submit", async function (ev) {
            ev.preventDefault();
            console.log("Форма отправлена!", state);

            try {
                validateState(state);
            } catch (e) {
                console.log("Ошибка валидации:", e.message);
                return;
            }

            for (const currentR of state.r) {
                await processRequest(state.x, state.y, currentR);
            }
        });
    }
}

function validateState(state) {
    console.log("Валидация state:", state);

    if (isNaN(state.x) || state.x < -5 || state.x > 3) {
        alert("X должен быть в диапазоне от -5 до 3");
        throw new Error("Invalid X");
    }

    if (state.y === null || isNaN(state.y)) {
        alert("Выберите значение Y");
        throw new Error("Invalid Y");
    }

    if (state.r.length === 0) {
        alert("Выберите хотя бы одно значение R");
        throw new Error("Invalid R");
    }

    console.log("Валидация пройдена!");
}

async function processRequest(x, y, r) {
    const noResults = document.querySelector(".no-results");
    if (noResults) {
        noResults.remove();
        console.log("Убрано сообщение 'нет результатов'");
    }

    const resultsBody = document.getElementById("results-body");
    if (!resultsBody) {
        console.error("results-body не найден!");
        return;
    }

    const newRow = resultsBody.insertRow(0);
    console.log("Добавлена новая строка в таблицу");

    const rowX = newRow.insertCell(0);
    const rowY = newRow.insertCell(1);
    const rowR = newRow.insertCell(2);
    const rowResult = newRow.insertCell(3);
    const rowTime = newRow.insertCell(4);
    const rowExecTime = newRow.insertCell(5);

    const params = new URLSearchParams();
    params.append('x', x);
    params.append('y', y);
    params.append('r', r);

    console.log("Отправка запроса с параметрами:", params.toString());

    try {
        const response = await fetch("/calculate?" + params.toString());
        console.log("Получен ответ:", response.status);

        const results = {
            x: x,
            y: y,
            r: r,
            execTime: "",
            time: "",
            result: false,
        };

        if (response.ok) {
            const result = await response.json();
            console.log("Данные от сервера:", result);
            results.time = new Date(result.now).toLocaleString();
            results.execTime = `${result.time} ns`;
            results.result = result.result.toString();
        } else if (response.status === 400) {
            const result = await response.json();
            console.log("Ошибка 400:", result);
            results.time = new Date(result.now).toLocaleString();
            results.execTime = "N/A";
            results.result = `error: ${result.reason}`;
        } else {
            console.log("Ошибка сервера:", response.status);
            results.time = "N/A";
            results.execTime = "N/A";
            results.result = "error"
        }

        const prevResults = JSON.parse(localStorage.getItem("results") || "[]");
        localStorage.setItem("results", JSON.stringify([...prevResults, results]));

        rowX.innerText = results.x.toString();
        rowY.innerText = results.y.toString();
        rowR.innerText = results.r.toString();
        rowTime.innerText = results.time;
        rowExecTime.innerText = results.execTime;
        rowResult.innerText = results.result;

        newRow.className = results.result === 'true' ? 'hit' : 'miss';
        console.log("Результат отображен в таблице");

    } catch (error) {
        console.error('Ошибка сети:', error);
        rowX.innerText = x.toString();
        rowY.innerText = y.toString();
        rowR.innerText = r.toString();
        rowTime.innerText = "N/A";
        rowExecTime.innerText = "N/A";
        rowResult.innerText = "network error";
        newRow.className = 'miss';
    }
}

function restoreHistory() {
    console.log("Восстанавливаем историю...");

    const prevResults = JSON.parse(localStorage.getItem("results") || "[]");
    console.log("Найдено записей в истории:", prevResults.length);

    const resultsBody = document.getElementById("results-body");
    if (!resultsBody) return;

    prevResults.forEach(result => {
        const noResults = document.querySelector(".no-results");
        if (noResults) {
            noResults.remove();
        }

        const newRow = resultsBody.insertRow(0);
        newRow.className = result.result === 'true' ? 'hit' : 'miss';

        const rowX = newRow.insertCell(0);
        const rowY = newRow.insertCell(1);
        const rowR = newRow.insertCell(2);
        const rowResult = newRow.insertCell(3);
        const rowTime = newRow.insertCell(4);
        const rowExecTime = newRow.insertCell(5);

        rowX.innerText = result.x.toString();
        rowY.innerText = result.y.toString();
        rowR.innerText = result.r.toString();
        rowTime.innerText = result.time;
        rowExecTime.innerText = result.execTime;
        rowResult.innerText = result.result;
    });
}