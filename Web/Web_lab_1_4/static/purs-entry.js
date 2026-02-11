import * as Main from '../output/Main/index.js';
window.addEventListener('DOMContentLoaded', function () {
  console.log('Инициализация PureScript...');
  if (Main && typeof Main.main === 'function') {
    Main.main();
  } else {
    console.error('Main.main not found!');
  }
});
window.Main = Main;
