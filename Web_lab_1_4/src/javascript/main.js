// Импортируем PureScript модуль
import '../output/Main/index.js';

// Импортируем старый код
import './legacy.js';

// Ваш старый код остаётся как есть
console.log('JavaScript загружен.');

const state = {
  x: 0,
  y: null,
  r: [],
};

document.addEventListener('DOMContentLoaded', function () {
  console.log('DOM загружен.');
  initApplication();
});

function initApplication() {
  console.log('Инициализация приложения...');
  // ... весь ваш остальной код
}

// Экспортируем для PureScript
export { initApplication };
