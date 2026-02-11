import React, { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Graph from './Graph';
import { pointAPI, authAPI } from './api';
import { setPoints, addPoint, clearPoints, setLoading, setError } from './store/pointsSlice';
import { logout as logoutAction } from './store/authSlice';

function MainPage({ onLogout }) {
  const points = useSelector(state => state.points.items);
  const loading = useSelector(state => state.points.loading);
  const pointsError = useSelector(state => state.points.error);
  const auth = useSelector(state => state.auth);
  const dispatch = useDispatch();

  const [xValues, setXValues] = useState([]);
  const [y, setY] = useState('');
 const [rValues, setRValues] = useState([]);
  const [formError, setFormError] = useState('');
  const [username, setUsername] = useState('');
  const [isLoadingResults, setIsLoadingResults] = useState(false);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  const xOptions = [-5, -4, -3, -2, -1, 0, 1, 2, 3];
  const rOptions = [-5, -4, -3, -2, -1, 0, 1, 2, 3];

  const resultsLoaded = useRef(false);

  const getDisplayMode = () => {
      if (windowWidth < 728) return 'mobile';
      if (windowWidth < 1174) return 'tablet';
      return 'desktop';
    };

    const displayMode = getDisplayMode();

  useEffect(() => {
      const handleResize = () => setWindowWidth(window.innerWidth);
      window.addEventListener('resize', handleResize);

      if (!resultsLoaded.current) {
        loadResults();
        resultsLoaded.current = true;
      }

      if (auth.username) {
        setUsername(auth.username);
      } else {
        const savedUsername = localStorage.getItem('username');
        if (savedUsername) setUsername(savedUsername);
      }

      return () => window.removeEventListener('resize', handleResize);
    }, [auth.username]);

  const loadResults = async () => {
    if (loading || isLoadingResults) return;

    setIsLoadingResults(true);
    dispatch(setLoading(true));

    try {
      const result = await pointAPI.getResults();
      if (result.success) {
        dispatch(setPoints(result.data));
      } else {
        dispatch(setError(result.message));
      }
    } catch (err) {
      dispatch(setError('Ошибка загрузки данных'));
    } finally {
      dispatch(setLoading(false));
      setIsLoadingResults(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');

    if (xValues.length === 0) {
      setFormError('Выберите хотя бы одно значение X');
      return;
    }

    if (y === '') {
      setFormError('Введите значение Y');
      return;
    }

    if (rValues.length === 0) {
      setFormError('Выберите хотя бы одно значение R');
      return;
    }

    const yNum = parseFloat(y);

    if (isNaN(yNum) || yNum < -5 || yNum > 5) {
      setFormError('Y должен быть числом от -5 до 5');
      return;
    }

    const invalidR = rValues.find(r => r <= 0);
    if (invalidR !== undefined) {
      setFormError(`Радиус R должен быть положительным. Неверное значение: ${invalidR}`);
      return;
    }

    dispatch(setLoading(true));

    try {
      for (const xVal of xValues) {
        for (const rVal of rValues) {
          const result = await pointAPI.checkPoint(xVal, yNum, rVal);

          if (result.success) {
            dispatch(addPoint(result.data));
          } else {
            setFormError(`Ошибка для X=${xVal}, R=${rVal}: ${result.message}`);
          }
        }
      }
      setY('');
    } catch (err) {
      setFormError('Ошибка соединения с сервером');
    } finally {
      dispatch(setLoading(false));
    }
  };

  const handleClearResults = async () => {
    if (window.confirm('Вы уверены, что хотите очистить историю?')) {
      try {
        const result = await pointAPI.clearResults();
        if (result.success) {
          dispatch(clearPoints());
        }
      } catch (err) {
        dispatch(setError('Ошибка очистки данных'));
      }
    }
  };

  const handleLogout = async () => {
    try {
      await authAPI.logout();
    } catch (err) {

    }

    dispatch(logoutAction());

    onLogout();
  };

  const handleCanvasClick = async (clickX, clickY) => {
    if (rValues.length === 0) {
      setFormError('Сначала выберите радиус(ы) R');
      return;
    }

    for (const rVal of rValues) {
        const result = await pointAPI.checkPoint(clickX, clickY, rVal);
        if (result.success) {
          dispatch(addPoint(result.data));
        } else {
          setFormError(`Ошибка для R=${rVal}: ${result.message}`);
        }
      }
    };

  return (
    <div className="main-container">
          <header className="header">
            <div className="header-content">
              <h1>Проверка попадания точки в область</h1>
              <div className="user-info">
                <p className="username">Пользователь: {username}</p>
                <p className="display-mode">
                  Режим: {
                    displayMode === 'mobile' ? 'Мобильный' :
                    displayMode === 'tablet' ? 'Планшетный' : 'Десктопный'
                  }
                </p>
              </div>
            </div>
            <button onClick={handleLogout} className="logout-btn">
              Выйти
            </button>
          </header>

          <div className={`content ${displayMode}`}>
            <div className="form-section">
              <form onSubmit={handleSubmit} className="point-form">
                <h2>Введите координаты</h2>

                <div className="form-group">
                  <label className="form-label">Координата X:</label>
                  <div className={`checkbox-group ${displayMode}`}>
                    {xOptions.map(value => (
                      <label key={value} className="checkbox-label">
                        <input
                          type="checkbox"
                          value={value}
                          checked={xValues.includes(value)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setXValues([...xValues, value]);
                            } else {
                              setXValues(xValues.filter(v => v !== value));
                            }
                          }}
                          disabled={loading}
                        />
                        <span className="checkbox-text">{value}</span>
                      </label>
                    ))}
                  </div>
                  <small className="form-hint">
                    Выбрано: {xValues.length > 0 ? xValues.join(', ') : 'ничего'}
                  </small>
                </div>

                <div className="form-group">
                  <label htmlFor="y" className="form-label">Координата Y:</label>
                  <input
                    type="number"
                    id="y"
                    value={y}
                    onChange={(e) => setY(e.target.value)}
                    placeholder="-5 ... 5"
                    min="-5"
                    max="5"
                    step="0.1"
                    className="form-input"
                    disabled={loading}
                  />
                  <small className="form-hint">Диапазон: от -5 до 5</small>
                </div>

                <div className="form-group">
                  <label className="form-label">Радиус R:</label>
                  <div className={`checkbox-group ${displayMode}`}>
                    {rOptions.map(value => (
                      <label key={value} className="checkbox-label">
                        <input
                          type="checkbox"
                          value={value}
                          checked={rValues.includes(value)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setRValues([...rValues, value]);
                            } else {
                              setRValues(rValues.filter(v => v !== value));
                            }
                          }}
                          disabled={loading}
                        />
                        <span className="checkbox-text">{value}</span>
                      </label>
                    ))}
                  </div>
                  <small className="form-hint">
                    Выбрано: {rValues.length > 0 ? rValues.join(', ') : 'ничего'}
                    {rValues.some(r => r <= 0) &&
                      <span className="error-text"> (только положительные!)</span>
                    }
                  </small>
                </div>

                {(formError || pointsError) && (
                  <div className="error-message">
                    {formError || pointsError}
                  </div>
                )}

                {loading && (
                  <div className="loading-indicator">
                    <span>⏳ Загрузка...</span>
                  </div>
                )}

                <div className="form-actions">
                  <button
                    type="submit"
                    className="submit-btn"
                    disabled={loading || xValues.length === 0 || rValues.length === 0 || !y}
                  >
                    {loading ? 'Проверка...' : `Проверить (${xValues.length * rValues.length} точек)`}
                  </button>

                  <button
                    type="button"
                    onClick={handleClearResults}
                    className="clear-btn"
                    disabled={points.length === 0 || loading}
                  >
                    Очистить историю
                  </button>
                </div>
              </form>
            </div>

            <div className="graph-section">
              <Graph
                results={points}
                currentRValues={rValues}
                onCanvasClick={handleCanvasClick}
              />

              <div className={`results-section ${displayMode}`}>
                <h2>История проверок</h2>
                <p className="results-count">
                  Всего точек: <strong>{points.length}</strong>
                </p>

                {points.length === 0 ? (
                  <p className="no-results">Нет результатов. Проверьте точку!</p>
                ) : (
                  <div className="table-container">
                    <table className="results-table">
                      <thead>
                        <tr>
                          <th>X</th>
                          <th>Y</th>
                          <th>R</th>
                          {displayMode !== 'mobile' && <th>Результат</th>}
                          {displayMode === 'desktop' && <th>Время</th>}
                        </tr>
                      </thead>
                      <tbody>
                        {points.map((point, index) => (
                          <tr key={index} className={point.hit ? 'hit-row' : 'miss-row'}>
                            <td>{point.x.toFixed(displayMode === 'mobile' ? 1 : 2)}</td>
                            <td>{point.y.toFixed(displayMode === 'mobile' ? 1 : 2)}</td>
                            <td>{point.r}</td>
                            {displayMode !== 'mobile' && (
                              <td>
                                <span className={`result-badge ${point.hit ? 'hit' : 'miss'}`}>
                                  {point.hit ? 'Попадание' : 'Промах'}
                                </span>
                              </td>
                            )}
                            {displayMode === 'desktop' && (
                              <td className="time-cell">
                                {new Date(point.createdAt).toLocaleTimeString('ru-RU')}
                              </td>
                            )}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      );
    }

export default MainPage;