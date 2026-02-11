import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { loginSuccess } from './store/authSlice';

let username = ''

function LoginPage({ onLogin }) {

function LoginPage(props) {
  const handleSubmit = async () => {
    props.onLogin();
  };
}


  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);

  const dispatch = useDispatch();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const url = isRegistering
        ? 'http://localhost:8080/area-backend/api/register'
        : 'http://localhost:8080/area-backend/api/login';

      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('username', data.username || username);
        dispatch(loginSuccess({
          token: data.token,
          username: data.username || username
        }));

        onLogin();
      } else {
        setError(data.error ||
          (isRegistering ? 'Ошибка регистрации' : 'Ошибка авторизации'));
      }
    } catch (err) {
      setError('Ошибка соединения с сервером');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h1>Лабораторная работа №4</h1>
        <h2>Проверка попадания точки в область</h2>

        <div className="student-info">
          <p><strong>ФИО:</strong> Николенко Максим Викторович</p>
          <p><strong>Группа:</strong> Р3215</p>
          <p><strong>Вариант:</strong> 300040</p>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          <h3>{isRegistering ? 'Регистрация' : 'Вход в систему'}</h3>

          <div className="form-group">
            <label htmlFor="username">Логин:</label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              disabled={loading}
              placeholder="Введите логин"
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Пароль:</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={loading}
              placeholder="Введите пароль"
            />
          </div>

          {error && <div className="error-message">{error}</div>}

          <button
            type="submit"
            className="login-btn"
            disabled={loading}
          >
            {loading ? 'Обработка...' : (isRegistering ? 'Зарегистрироваться' : 'Войти')}
          </button>

          <button
            type="button"
            className="toggle-btn"
            onClick={() => setIsRegistering(!isRegistering)}
            disabled={loading}
          >
            {isRegistering ? 'Уже есть аккаунт? Войти' : 'Нет аккаунта? Зарегистрироваться'}
          </button>

          <div className="test-credentials">
            <p>Для тестирования можно использовать:</p>
            <p>admin / admin123</p>
          </div>
        </form>
      </div>
    </div>
  );
}

export default LoginPage;