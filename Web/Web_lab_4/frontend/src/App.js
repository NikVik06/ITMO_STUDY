import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { checkAuth } from './api';
import { loginSuccess, logout } from './store/authSlice';
import LoginPage from './LoginPage';
import MainPage from './MainPage';

function App() {
  const isAuthenticated = useSelector(state => state.auth.isAuthenticated);
  const loading = useSelector(state => state.auth.loading);
  const dispatch = useDispatch();

  useEffect(() => {
    const verifyAuth = async () => {
      const authenticated = await checkAuth();
      if (authenticated) {
        const token = localStorage.getItem('token');
        const username = localStorage.getItem('username');
        dispatch(loginSuccess({ token, username }));
      }
    };

    verifyAuth();
  }, [dispatch]);

  const handleLogin = () => {
    const token = localStorage.getItem('token');
    const username = localStorage.getItem('username');
    dispatch(loginSuccess({ token, username }));
  };

  const handleLogout = () => {
    dispatch(logout());
  };

  if (loading) {
    return <div className="loading">Загрузка...</div>;
  }

  return (
    <BrowserRouter basename="/area-backend">
      <Routes>

        <Route
          path="/login"
          element={
            isAuthenticated
              ? <Navigate to="/" replace />
              : <LoginPage onLogin={handleLogin} />
          }
        />

        <Route
          path="/"
          element={
            isAuthenticated
              ? <MainPage onLogout={handleLogout} />
              : <Navigate to="/login" replace />
          }
        />
        <Route
          path="*"
          element={
            <Navigate to={isAuthenticated ? "/" : "/login"} replace />
          }
        />

      </Routes>
    </BrowserRouter>
  );
}

export default App;
