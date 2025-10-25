"use strict";

console.log("JavaScript загружен.");

document.addEventListener("DOMContentLoaded", function () {
  console.log("DOM загружен.");
  initApplication();
});

function initApplication() {
  console.log("Инициализация приложения...");
  restoreHistory();
  console.log("Приложение инициализировано!");
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
  params.append("x", x);
  params.append("y", y);
  params.append("r", r);

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
      results.result = "error";
    }

    const prevResults = JSON.parse(localStorage.getItem("results") || "[]");
    localStorage.setItem("results", JSON.stringify([...prevResults, results]));

    rowX.innerText = results.x.toString();
    rowY.innerText = results.y.toString();
    rowR.innerText = results.r.toString();
    rowTime.innerText = results.time;
    rowExecTime.innerText = results.execTime;
    rowResult.innerText = results.result;

    newRow.className = results.result === "true" ? "hit" : "miss";
    console.log("Результат отображен в таблице");
  } catch (error) {
    console.error("Ошибка сети:", error);
    rowX.innerText = x.toString();
    rowY.innerText = y.toString();
    rowR.innerText = r.toString();
    rowTime.innerText = "N/A";
    rowExecTime.innerText = "N/A";
    rowResult.innerText = "network error";
    newRow.className = "miss";
  }
}

function restoreHistory() {
  console.log("Восстанавливаем историю...");

  const prevResults = JSON.parse(localStorage.getItem("results") || "[]");
  console.log("Найдено записей в истории:", prevResults.length);

  const resultsBody = document.getElementById("results-body");
  if (!resultsBody) return;

  prevResults.forEach((result) => {
    const noResults = document.querySelector(".no-results");
    if (noResults) {
      noResults.remove();
    }

    const newRow = resultsBody.insertRow(0);
    newRow.className = result.result === "true" ? "hit" : "miss";

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

window.processRequestJS = function(x) {
  return function(y) {
    return function(r) {
      return function() {
        console.log("🟢 PureScript вызывает processRequest с:", x, y, r);

        // Возвращаем промис с результатом
        return new Promise((resolve, reject) => {
          const params = new URLSearchParams();
          params.append("x", x);
          params.append("y", y);
          params.append("r", r);

          fetch("/calculate?" + params.toString())
            .then(response => {
              if (!response.ok) {
                throw new Error(`HTTP error: ${response.status}`);
              }
              return response.json();
            })
            .then(data => {
              resolve({
                result: data.result,
                now: data.now,
                time: data.time
              });
            })
            .catch(error => {
              reject(error);
            });
        });
      };
    };
  };
};

window.insertRowToTable = function(x) {
  return function(y) {
    return function(r) {
      return function(resultStr) {
        return function(time) {
          return function(execTime) {
            return function() {
              console.log("🟢 PureScript добавляет результат в таблицу:", x, y, r, resultStr);

              const noResults = document.querySelector(".no-results");
              if (noResults) {
                noResults.remove();
              }

              const resultsBody = document.getElementById("results-body");
              if (!resultsBody) {
                console.error("results-body не найден!");
                return;
              }

              const newRow = resultsBody.insertRow(0);
              const rowX = newRow.insertCell(0);
              const rowY = newRow.insertCell(1);
              const rowR = newRow.insertCell(2);
              const rowResult = newRow.insertCell(3);
              const rowTime = newRow.insertCell(4);
              const rowExecTime = newRow.insertCell(5);

              rowX.innerText = x.toString();
              rowY.innerText = y.toString();
              rowR.innerText = r.toString();
              rowTime.innerText = time;
              rowExecTime.innerText = execTime;
              rowResult.innerText = resultStr;

              newRow.className = resultStr === "true" ? "hit" : "miss";
              console.log("✅ PureScript добавил результат в таблицу");
            };
          };
        };
      };
    };
  };
};

window.displayResultInTable = function(x) {
  return function(y) {
    return function(r) {
      return function(result) {
        return function(time) {
          return function(execTime) {
            return function() {
              console.log("🟢 PureScript добавляет результат в таблицу:", x, y, r, result);

              const noResults = document.querySelector(".no-results");
              if (noResults) {
                noResults.remove();
              }

              const resultsBody = document.getElementById("results-body");
              if (!resultsBody) {
                console.error("results-body не найден!");
                return;
              }

              const newRow = resultsBody.insertRow(0);
              const rowX = newRow.insertCell(0);
              const rowY = newRow.insertCell(1);
              const rowR = newRow.insertCell(2);
              const rowResult = newRow.insertCell(3);
              const rowTime = newRow.insertCell(4);
              const rowExecTime = newRow.insertCell(5);

              rowX.innerText = x.toString();
              rowY.innerText = y.toString();
              rowR.innerText = r.toString();
              rowTime.innerText = time;
              rowExecTime.innerText = execTime;
              rowResult.innerText = result.toString();

              newRow.className = result === true ? "hit" : "miss";
              console.log("✅ PureScript добавил результат в таблицу");
            };
          };
        };
      };
    };
  };
};

// Функция для PureScript - делает HTTP запрос
window.processRequestAff = function(x) {
  return function(y) {
    return function(r) {
      return function(onError, onSuccess) {
        console.log("🟡 PureScript делает запрос:", x, y, r);

        const params = new URLSearchParams();
        params.append("x", x);
        params.append("y", y);
        params.append("r", r);

        fetch("/calculate?" + params.toString())
          .then(response => {
            console.log("🟢 Получен ответ, статус:", response.status);
            if (!response.ok) {
              throw new Error(`HTTP error: ${response.status}`);
            }
            return response.json();
          })
          .then(data => {
            console.log("🟢 Данные от сервера:", data);
            onSuccess({
              result: data.result,
              now: data.now,
              time: data.time
            })();
          })
          .catch(error => {
            console.error("🔴 Ошибка запроса:", error);
            onError(error.toString())();
          });

        return function(cancelError, cancelerError, cancelerSuccess) {
          console.log("processRequestAff: Отмена");
          cancelerSuccess();
        };
      };
    };
  };
};