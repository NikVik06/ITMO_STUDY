import axios from 'axios';

const API_BASE = '/area-backend/api';

const api = axios.create({
  baseURL: API_BASE,
  headers: {
    'Content-Type': 'application/json'
  }
});

api.interceptors.request.use(config => {
  const token = localStorage.getItem('token');

  if (token) {
    config.headers.Authorization = token;
    //console.log('Установлен заголовок Authorization:', config.headers.Authorization);
  } else {
    console.warn('Токен не найден в localstorage');
  }

  return config;
});

export const authAPI = {
  login: async (username, password) => {
    try {
      const body = { username, password };
      const response = await api.post('/login', body);

      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('username', response.data.username);
        return { success: true, data: response.data };
      }
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.error || 'Ошибка авторизации'
      };
    }
  },

  logout: async () => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        await api.post('/logout', {}, {
          headers: { Authorization: token }
        });
      } catch (error) {
        console.log('Logout completed (ignoring errors)');
      }
    }
    localStorage.removeItem('token');
    localStorage.removeItem('username');
  }
};

export const pointAPI = {
  checkPoint: async (x, y, r) => {
    try {
      const body = { x, y, r };
      const response = await api.post('/check', body);
      return { success: true, data: response.data };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.error || 'Ошибка проверки точки'
      };
    }
  },

  getResults: async () => {
    try {
      const response = await api.get('/results');
      return { success: true, data: response.data };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.error || 'Ошибка загрузки результатов'
      };
    }
  },

  clearResults: async () => {
    try {
      await api.delete('/results');
      return { success: true };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.error || 'Ошибка очистки'
      };
    }
  }
};

export const checkAuth = async () => {
  const token = localStorage.getItem('token');
  if (!token) return false;
  return true;
};

export default api;