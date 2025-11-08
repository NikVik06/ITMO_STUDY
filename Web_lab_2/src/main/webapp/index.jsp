<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="ui" uri="http://dop.ru/ui" %>
<!DOCTYPE html>
<html lang="ru">
<head>
    <meta charset="UTF-8">
    <title>Проверка попадания точки в область</title>
    <style>
        <%@ include file="styles/style.css" %>

        #graph-container {
            text-align: center;
        }
        #graph {
            border: 2px solid #34495e;
            border-radius: 12px;
            box-shadow: 0 6px 20px rgba(0, 0, 0, 0.1);
            background: white;
            cursor: crosshair;
        }
        #graph-message {
            margin-top: 15px;
            font-weight: bold;
            min-height: 20px;
        }
        .graph-success {
            color: #27ae60;
        }
        .graph-error {
            color: #e74c3c;
        }
        .form-select {
            width: 100%;
            max-width: 300px;
            padding: 15px;
            border: 2px solid #bdc3c7;
            border-radius: 8px;
            font-size: 16px;
            font-family: inherit;
            transition: all 0.3s;
            background: white;
        }
        .form-select:focus {
            border-color: #3498db;
            outline: none;
            box-shadow: 0 0 8px rgba(52, 152, 219, 0.3);
            transform: translateY(-2px);
        }
    </style>
</head>
<body>
    <div id="header">
        <h1>Лабораторная работа №2</h1>
        <h2>Проверка попадания точки в область</h2>
        <p>Николенко Максим Викторович, группа P3215, вариант 466890</p>
    </div>

    <div class="container">
        <ui:alert type="info" title="Информация" closable="true" icon="true">
            Для проверки попадания точки выберите координаты X, Y и радиус R.
        </ui:alert>

        <form id="point-form" action="controller" method="GET">
            <div class="form-group">
                <label>Координата X:</label>

                <div class="radio-group" id="x-radios">
                    <label><input type="radio" name="x" value="-5" required /> -5</label>
                    <label><input type="radio" name="x" value="-4" /> -4</label>
                    <label><input type="radio" name="x" value="-3" /> -3</label>
                    <label><input type="radio" name="x" value="-2" /> -2</label>
                    <label><input type="radio" name="x" value="-1" /> -1</label>
                    <label><input type="radio" name="x" value="0" /> 0</label>
                    <label><input type="radio" name="x" value="1" /> 1</label>
                    <label><input type="radio" name="x" value="2" /> 2</label>
                    <label><input type="radio" name="x" value="3" /> 3</label>
                </div>
                <small>Выберите значение X от -5 до 3</small>
            </div>

            <!-- Hidden input для графика -->
            <input type="hidden" id="graph-x" name="x" />

            <div class="form-group">
                <label for="y">Координата Y:</label>
                <input type="text" id="y" name="y" class="input-field"
                       placeholder="Введите Y от -3 до 5" required />
                <small>Диапазон: от -3 до 5</small>
            </div>

            <div class="form-group">
                <label for="r">Радиус R:</label>
                <select id="r" name="r" class="form-select" required>
                    <option value="">Выберите R</option>
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                    <option value="4">4</option>
                    <option value="5">5</option>
                </select>
                <small>Выберите значение радиуса</small>
            </div>

            <button type="submit" class="submit-btn">Проверить попадание</button>
        </form>

        <div id="error" class="error-message" style="display: none;"></div>

        <div id="graph-container">
            <h2>Область попадания</h2>
            <canvas id="graph" width="400" height="400"></canvas>
            <div id="graph-message"></div>
            <div id="graph-coords" style="padding: 10px; background: #f8f9fa; border-radius: 5px; margin: 5px 0;">
                Координаты с графика: X: не выбрано, Y: не выбрано
            </div>
        </div>

        <div id="results">
            <h2>История проверок</h2>
            <table id="results-table">
                <thead>
                    <tr>
                        <th>X</th>
                        <th>Y</th>
                        <th>R</th>
                        <th>Результат</th>
                        <th>Время</th>
                        <th>Время выполнения</th>
                    </tr>
                </thead>
                <tbody id="results-body">
                    <c:choose>
                        <c:when test="${not empty sessionScope.results}">
                            <c:forEach var="result" items="${sessionScope.results}">
                                <tr class="${result.hit ? 'hit' : 'miss'}">
                                    <td>${result.x}</td>
                                    <td>${result.y}</td>
                                    <td>${result.r}</td>
                                    <td><strong>${result.hit ? 'Попадание' : 'Промах'}</strong></td>
                                    <td>${result.timestamp}</td>
                                    <td>${result.executionTime} нс</td>
                                </tr>
                            </c:forEach>
                        </c:when>
                        <c:otherwise>
                            <tr class="no-results">
                                <td colspan="6">
                                    Пока нет результатов. Введите данные и нажмите "Проверить попадание"
                                </td>
                            </tr>
                        </c:otherwise>
                    </c:choose>
                </tbody>
            </table>
        </div>
    </div>

    <script>
        document.addEventListener('DOMContentLoaded', function() {
            const form = document.getElementById('point-form');
            const errorDiv = document.getElementById('error');
            const yInput = document.getElementById('y');
            const rSelect = document.getElementById('r');
            const xRadios = document.querySelectorAll('input[name="x"]');
            const graphXInput = document.getElementById('graph-x');
            const canvas = document.getElementById('graph');
            const ctx = canvas.getContext('2d');
            const graphMessage = document.getElementById('graph-message');
            const graphCoordsDisplay = document.getElementById('graph-coords');

            let currentR = null;
            let graphX = null;
            let graphY = null;
            let useGraphCoordinates = false;

            form.addEventListener('submit', function(event) {
                errorDiv.style.display = 'none';
                errorDiv.textContent = '';

                const selectedXRadio = document.querySelector('input[name="x"]:checked');
                const y = yInput.value;
                const r = rSelect.value;

                let errors = [];

                if (!selectedXRadio && !useGraphCoordinates) {
                    errors.push('Выберите координату X из предложенных значений или кликните на график');
                }
                if (!y) {
                    errors.push('Введите координату Y');
                } else {
                    const yNum = parseFloat(y);
                    if (isNaN(yNum) || yNum < -3 || yNum > 5) {
                        errors.push('Y должен быть числом от -3 до 5');
                    }
                }

                if (!r) {
                    errors.push('Выберите радиус R');
                }

                if (errors.length > 0) {
                    event.preventDefault();
                    errorDiv.textContent = errors.join(', ');
                    errorDiv.style.display = 'block';
                } else {
                    if (useGraphCoordinates) {
                        xRadios.forEach(radio => {
                            radio.disabled = true;
                        });
                    }
                }
            });

            rSelect.addEventListener('change', function() {
                currentR = this.value;
                drawGraph();
                if (currentR) {
                    graphMessage.textContent = `Радиус установлен: R = ${currentR}. Кликните на график для выбора точки.`;
                    graphMessage.className = 'graph-success';
                }
            });

            canvas.addEventListener('click', function(event) {
                if (!currentR) {
                    graphMessage.textContent = 'Сначала установите радиус R';
                    graphMessage.className = 'graph-error';
                    return;
                }

                const rect = canvas.getBoundingClientRect();
                const x = event.clientX - rect.left;
                const y = event.clientY - rect.top;

                graphX = ((x - 200) / 40).toFixed(3);
                graphY = ((200 - y) / 40).toFixed(3);

                console.log('Clicked at:', graphX, graphY);

                graphXInput.value = graphX;
                useGraphCoordinates = true;
                xRadios.forEach(radio => {
                    radio.checked = false;
                    radio.required = false;
                });
                yInput.value = graphY;
                rSelect.value = currentR;
                graphCoordsDisplay.textContent = `Координаты с графика: X: ${graphX}, Y: ${graphY}`;

                graphMessage.textContent = `Выбрана точка на графике: X=${graphX}, Y=${graphY}, R=${currentR}`;
                graphMessage.className = 'graph-success';
                setTimeout(() => {
                    form.submit();
                }, 100);
            });

            xRadios.forEach(radio => {
                radio.addEventListener('change', function() {
                    if (this.checked) {
                        useGraphCoordinates = false;
                        graphXInput.value = '';
                        graphCoordsDisplay.textContent = 'Координаты с графика: X: не выбрано, Y: не выбрано';
                        graphMessage.textContent = 'Выбрано значение X из списка. Кликните на график для точного выбора.';
                        graphMessage.className = 'graph-success';
                    }
                });
            });

            xRadios.forEach(radio => {
                radio.disabled = false;
            });

            function drawGraph() {
                ctx.clearRect(0, 0, canvas.width, canvas.height);

                ctx.strokeStyle = '#2c3e50';
                ctx.lineWidth = 2;

                ctx.beginPath();
                ctx.moveTo(0, 200);
                ctx.lineTo(400, 200);
                ctx.stroke();

                ctx.beginPath();
                ctx.moveTo(200, 0);
                ctx.lineTo(200, 400);
                ctx.stroke();

                ctx.fillStyle = '#2c3e50';
                ctx.beginPath();
                ctx.moveTo(400, 200);
                ctx.lineTo(390, 195);
                ctx.lineTo(390, 205);
                ctx.closePath();
                ctx.fill();

                ctx.beginPath();
                ctx.moveTo(200, 0);
                ctx.lineTo(195, 10);
                ctx.lineTo(205, 10);
                ctx.closePath();
                ctx.fill();

                ctx.font = '14px Times New Roman';
                ctx.fillStyle = '#2c3e50';
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';

                for (let i = -5; i <= 5; i++) {
                    if (i !== 0) {
                        const x = 200 + i * 40;
                        const y = 200 + i * 40;

                        ctx.beginPath();
                        ctx.moveTo(x, 195);
                        ctx.lineTo(x, 205);
                        ctx.stroke();
                        ctx.fillText(i, x, 220);

                        ctx.beginPath();
                        ctx.moveTo(195, y);
                        ctx.lineTo(205, y);
                        ctx.stroke();
                        ctx.fillText(-i, 180, y);
                    }
                }

                ctx.fillText('X', 380, 180);
                ctx.fillText('Y', 220, 20);

                if (currentR) {
                    const r = parseFloat(currentR);
                    ctx.fillStyle = 'rgba(52, 152, 219, 0.3)';
                    ctx.strokeStyle = '#3498db';
                    ctx.lineWidth = 2;

                    // Четверть круга
                    ctx.beginPath();
                    ctx.arc(200, 200, r * 40, 3 * Math.PI / 2, 2 * Math.PI);
                    ctx.lineTo(200, 200);
                    ctx.closePath();
                    ctx.fill();
                    ctx.stroke();

                    // Треугольник
                    ctx.beginPath();
                    ctx.moveTo(200, 200);
                    ctx.lineTo(200 - r * 40, 200);
                    ctx.lineTo(200, 200 + r * 40);
                    ctx.closePath();
                    ctx.fill();
                    ctx.stroke();

                    // Прямоугольник
                    ctx.beginPath();
                    ctx.rect(200, 200, r * 40, r * 20);
                    ctx.fill();
                    ctx.stroke();
                }

                <c:if test="${not empty sessionScope.results}">
                    <c:forEach var="result" items="${sessionScope.results}">
                        drawPoint(${result.x}, ${result.y}, ${result.hit});
                    </c:forEach>
                </c:if>
            }

            function drawPoint(x, y, hit) {
                const pointX = 200 + x * 40;
                const pointY = 200 - y * 40;

                ctx.beginPath();
                ctx.arc(pointX, pointY, 4, 0, 2 * Math.PI);
                ctx.fillStyle = hit ? '#27ae60' : '#e74c3c';
                ctx.fill();
                ctx.strokeStyle = '#2c3e50';
                ctx.lineWidth = 1;
                ctx.stroke();
            }

            drawGraph();
        });

        function closeAlert(alertId) {
            const alertElement = document.getElementById(alertId);
            if (alertElement) {
                alertElement.style.display = 'none';
            }
        }
    </script>
</body>
</html>