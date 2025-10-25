// ES модули для PureScript
export const alert = function(message) {
  return function() {
    window.alert(message);
  };
};

export const preventDefault = function(event) {
  return function() {
    event.preventDefault();
  };
};

export const _textContent = function(node) {
  return function() {
    return node.textContent !== null ? { tag: "Just", value: node.textContent } : { tag: "Nothing" };
  };
};

export const processRequestJS = function(x) {
  return function(y) {
    return function(r) {
      return function() {
        console.log("🟢 PureScript вызывает processRequest с:", x, y, r);
        // Вызываем вашу оригинальную функцию
        processRequest(x, y, r);
      };
    };
  };
};

export const displayResultInTable = function(x) {
  return function(y) {
    return function(r) {
      return function(result) {
        return function(time) {
          return function(execTime) {
            return function() {
              console.log("🟢 PureScript.displayResultInTable: Добавляю результат:", x, y, r, result);

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
              console.log("✅ PureScript успешно добавил результат в таблицу");
            };
          };
        };
      };
    };
  };
};

export const processRequestWithResult = function(x) {
  return function(y) {
    return function(r) {
      return function(onError, onSuccess) {
        console.log("🟡 PureScript.processRequestWithResult: Начало для", x, y, r);

        processRequest(x, y, r)
          .then(resultData => {
            console.log("🟢 PureScript.processRequestWithResult: Получены данные:", resultData);
            onSuccess(resultData)();
          })
          .catch(error => {
            console.error("🔴 PureScript.processRequestWithResult: Ошибка:", error);
            onError(error.toString())();
          });

        return function(cancelError, cancelerError, cancelerSuccess) {
          console.log("processRequestWithResult: Отмена");
          cancelerSuccess();
        };
      };
    };
  };
};

// Сделаем функцию глобально доступной для тестирования
window.processRequestWithResult = processRequestWithResult;

export const getItem = function(key) {
  return function() {
    return localStorage.getItem(key);
  };
};

export const setItem = function(key) {
  return function(value) {
    return function() {
      localStorage.setItem(key, value);
    };
  };
};

export const clearStorage = function() {
  return function() {
    localStorage.clear();
  };
};



export const stringify = function(results) {
  try {
    // Упрощаем структуру для надежности
    const simplified = results.map(item => ({
      x: item.x,
      y: item.y,
      r: item.r,
      result: item.result,
      time: item.time,
      execTime: item.execTime
    }));
    return JSON.stringify(simplified);
  } catch (e) {
    console.error("❌ stringify: Ошибка:", e);
    return "[]";
  }
};

export const parseResults = function(json) {
  try {
    console.log("🔄 parseResults: Парсим JSON, длина:", json.length);
    const parsed = JSON.parse(json);

    if (Array.isArray(parsed)) {
      console.log("✅ parseResults: Это массив, элементов:", parsed.length);

      const results = [];

      for (let i = 0; i < parsed.length; i++) {
        const item = parsed[i];

        try {
          // Безопасное извлечение данных с проверками
          const x = safeParseNumber(item.x, "x", i);
          const y = safeParseNumber(item.y, "y", i);
          const r = safeParseNumber(item.r, "r", i);

          // Обработка result
          let result = false;
          if (typeof item.result === 'boolean') {
            result = item.result;
          } else if (typeof item.result === 'string') {
            result = item.result === 'true' || item.result === '1';
          } else if (item.result !== undefined) {
            console.warn(`⚠️ Неизвестный тип result в элементе ${i}:`, typeof item.result, item.result);
          }

          // Обработка времени
          const time = item.time || "N/A";
          const execTime = item.execTime || "N/A";

          results.push({
            x: x,
            y: y,
            r: r,
            result: result,
            time: time,
            execTime: execTime
          });

        } catch (itemError) {
          console.error(`❌ Ошибка парсинга элемента ${i}:`, itemError, item);
          // Пропускаем проблемный элемент, но продолжаем обработку остальных
        }
      }

      console.log("✅ parseResults: Успешно обработано", results.length, "записей из", parsed.length);
      return {
        tag: "Just",
        value: results
      };
    } else {
      console.error("❌ parseResults: Это не массив:", typeof parsed);
    }
  } catch (e) {
    console.error("❌ parseResults: Ошибка парсинга JSON:", e);
  }
  return { tag: "Nothing" };
};

// Вспомогательная функция для безопасного парсинга чисел
function safeParseNumber(value, fieldName, index) {
  if (typeof value === 'number') {
    return value;
  } else if (typeof value === 'string') {
    const parsed = parseFloat(value);
    if (!isNaN(parsed)) {
      return parsed;
    }
  }
  console.warn(`⚠️ Проблема с полем ${fieldName} в элементе ${index}:`, value);
  return 0; // значение по умолчанию
}

export const safeParseAndDisplay = function(json) {
  return function() {
    try {
      console.log("🛡️ Безопасный парсинг и отображение...");
      const parsed = JSON.parse(json);

      if (!Array.isArray(parsed)) {
        console.error("❌ Данные не являются массивом");
        return { tag: "Nothing" };  // ВОЗВРАЩАЕМ Nothing для PureScript
      }

      let successCount = 0;

      for (let i = 0; i < parsed.length; i++) {
        try {
          const item = parsed[i];

          // Безопасное извлечение данных
          const x = safeNumber(item.x);
          const y = safeNumber(item.y);
          const r = safeNumber(item.r);
          const result = safeBoolean(item.result);
          const time = safeString(item.time);
          const execTime = safeString(item.execTime);

          // Безопасный вызов PureScript функции
          displayResultInTable(x)(y)(r)(result)(time)(execTime)();
          successCount++;

        } catch (itemError) {
          console.error(`❌ Ошибка в элементе ${i}:`, itemError);
          // Продолжаем со следующим элементом
        }
      }

      return successCount;  // Просто возвращаем число
          } catch (e) {
            console.error("❌ Безопасный парсинг не удался:", e);
            return 0;  // Возвращаем 0 при ошибке
    }
  };
};

// Вспомогательные функции
function safeNumber(value) {
  if (typeof value === 'number') return value;
  if (typeof value === 'string') {
    const parsed = parseFloat(value);
    if (!isNaN(parsed)) return parsed;
  }
  return 0;
}

function safeBoolean(value) {
  if (typeof value === 'boolean') return value;
  if (typeof value === 'string') return value === 'true' || value === '1';
  return false;
}

function safeString(value) {
  if (typeof value === 'string') return value;
  return "N/A";
}