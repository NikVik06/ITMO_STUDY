function handleCanvasClick(event) {
    const canvas = document.getElementById('areaCanvas');
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    const rSelect = document.querySelector('[id$="rInput"]');
    const currentR = parseFloat(rSelect.value);

    if (!currentR || isNaN(currentR)) {
        showGraphMessage('Сначала установите радиус R', 'error');
        return;
    }
    const graphX = parseFloat(((x - 200) / 40).toFixed(6));
    const graphY = parseFloat(((200 - y) / 40).toFixed(6));
    document.getElementById('graph-coords').textContent =
        'Координаты с графика: X: ' + graphX + ', Y: ' + graphY;
    showGraphMessage('Отправка точки: X=' + graphX + ', Y=' + graphY + ', R=' + currentR, 'success');
    drawTemporaryPoint(graphX, graphY);
    const graphXInput = document.querySelector('[id$="graphX"]');
    const graphYInput = document.querySelector('[id$="graphY"]');
    const graphRInput = document.querySelector('[id$="graphR"]');
    const graphSubmit = document.querySelector('[id$="graphSubmit"]');

    if (graphXInput && graphYInput && graphRInput && graphSubmit) {
        graphXInput.value = graphX;
        graphYInput.value = graphY;
        graphRInput.value = currentR;
        setTimeout(() => {
            graphSubmit.click();
        }, 100);
    } else {
        showGraphMessage('Ошибка: форма не найдена', 'error');
    }
}

function setupAjaxListener() {
    const pointsDataInput = document.querySelector('[id$="pointsData"]');
    if (pointsDataInput) {
        const observer = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutation) {
                if (mutation.type === 'attributes' && mutation.attributeName === 'value') {
                    setTimeout(() => {
                        drawArea();
                        updateTableManually();
                    }, 300);
                }
            });
        });

        observer.observe(pointsDataInput, {
            attributes: true,
            attributeFilter: ['value']
        });
    }
}

function drawTemporaryPoint(x, y) {
    const canvas = document.getElementById('areaCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const pointX = 200 + x * 40;
    const pointY = 200 - y * 40;
    ctx.beginPath();
    ctx.arc(pointX, pointY, 6, 0, 2 * Math.PI);
    ctx.fillStyle = '#3498db';
    ctx.fill();
    ctx.strokeStyle = '#2c3e50';
    ctx.lineWidth = 2;
    ctx.stroke();
}

function showGraphMessage(message, type) {
    const messageDiv = document.getElementById('graph-message');
    if (messageDiv) {
        messageDiv.textContent = message;
        messageDiv.className = 'graph-message graph-' + type;
    }
}

function drawArea() {
    const canvas = document.getElementById('areaCanvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const rSelect = document.querySelector('[id$="rInput"]');
    const currentR = parseFloat(rSelect.value) || 2.0;

    ctx.clearRect(0, 0, 400, 400);
    drawAxes(ctx);

    if (currentR) {
        drawAreaShapes(ctx, currentR);
    }

    drawPointsFromJson(ctx);
}

function drawPointsFromJson(ctx) {
    const pointsDataInput = document.querySelector('[id$="pointsData"]');

    if (!pointsDataInput || !pointsDataInput.value) return;

    try {
        const points = JSON.parse(pointsDataInput.value);
        points.forEach(point => {
            drawSinglePoint(ctx, point.x, point.y, point.hit);
        });
    } catch (e) {
        console.error('Error parsing points JSON:', e);
    }
}

function drawAxes(ctx) {
    ctx.strokeStyle = '#2c3e50';
    ctx.lineWidth = 2;

    // Ось X
    ctx.beginPath();
    ctx.moveTo(0, 200);
    ctx.lineTo(400, 200);
    ctx.stroke();

    // Ось Y
    ctx.beginPath();
    ctx.moveTo(200, 0);
    ctx.lineTo(200, 400);
    ctx.stroke();

    // Стрелки
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

    // Разметка
    ctx.font = '14px Times New Roman';
    ctx.fillStyle = '#2c3e50';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    for (let i = -5; i <= 5; i++) {
        if (i !== 0) {
            const x = 200 + i * 40;
            const y = 200 - i * 40;

            ctx.beginPath();
            ctx.moveTo(x, 195);
            ctx.lineTo(x, 205);
            ctx.stroke();
            ctx.fillText(i.toString(), x, 220);

            ctx.beginPath();
            ctx.moveTo(195, y);
            ctx.lineTo(205, y);
            ctx.stroke();
            ctx.fillText(i.toString(), 180, y);
        }
    }

    ctx.fillText('X', 380, 180);
    ctx.fillText('Y', 220, 20);
}

function drawAreaShapes(ctx, r) {
    ctx.fillStyle = 'rgba(52, 152, 219, 0.3)';
    ctx.strokeStyle = '#3498db';
    ctx.lineWidth = 2;

    // Прямоугольник в 4-й четверти
    ctx.beginPath();
    ctx.rect(200, 200, r * 40, r * 20);
    ctx.fill();
    ctx.stroke();

    // Треугольник в 3-й четверти
    ctx.beginPath();
    ctx.moveTo(200, 200);
    ctx.lineTo(200 - r * 40, 200);
    ctx.lineTo(200, 200 + r * 40);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Круг в 1-й четверти
    ctx.beginPath();
    ctx.arc(200, 200, r * 40, -Math.PI / 2, 0, false);
    ctx.lineTo(200, 200);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
}

function drawSinglePoint(ctx, x, y, hit) {
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

function setupRListener() {
    const rInput = document.querySelector('[id$="rInput"]');
    if (rInput) {
        rInput.addEventListener('change', function() {
            const currentR = this.value;
            drawArea();
            if (currentR) {
                showGraphMessage('Радиус установлен: R = ' + currentR + '. Кликните на график для выбора точки.', 'success');
            }
        });
    }
}

function setupCheckButtonHandler() {
    const checkButton = document.querySelector('[id$="checkPoint"]');
    if (checkButton) {
        checkButton.addEventListener('click', function(e) {
            const form = document.getElementById('mainForm');
            if (form) {
                const xInput = form.querySelector('[id$="xInput"]:checked');
                const yInput = form.querySelector('[id$="yInput"]');
                const rInput = form.querySelector('[id$="rInput"]');

                if (xInput && yInput && rInput) {
                    const x = parseFloat(xInput.value);
                    const y = parseFloat(yInput.value);
                    const r = parseFloat(rInput.value);

                    if (!isNaN(x) && !isNaN(y) && !isNaN(r)) {
                        drawTemporaryPoint(x, y);
                        showGraphMessage('Проверка точки: X=' + x + ', Y=' + y + ', R=' + r, 'success');
                    }
                }
            }
        });
    }
}

function setupClearButtonHandler() {
    const clearButton = document.querySelector('[id$="clearResults"]');
    if (clearButton) {
        const originalOnclick = clearButton.onclick;

        clearButton.onclick = function(e) {
            if (!confirm('Вы уверены, что хотите очистить всю историю?')) {
                // Полностью останавливаем событие
                if (e.preventDefault) e.preventDefault();
                if (e.stopPropagation) e.stopPropagation();
                e.cancelBubble = true;
                e.returnValue = false;

                // Останавливаем JSF события
                if (window.jsf) {
                    jsf.ajax.request(this, e, {
                        execute: '@this',
                        render: '@none'
                    });
                }

                return false;
            }

            // Если подтвердили - вызываем оригинальный обработчик
            if (originalOnclick) {
                return originalOnclick.call(this, e);
            }
            return true;
        };
    }
}

function clearGraphFieldsOnLoad() {
    // Очищаем координаты на странице
    const graphCoords = document.getElementById('graph-coords');
    if (graphCoords && !graphCoords.textContent.includes('не выбрано')) {
        graphCoords.textContent = 'Координаты с графика: X: не выбрано, Y: не выбрано';
    }
}

function updateTableManually() {
    const pointsDataInput = document.querySelector('[id$="pointsData"]');
    if (!pointsDataInput || !pointsDataInput.value) return;

    try {
        const points = JSON.parse(pointsDataInput.value);
        const resultsDiv = document.getElementById('results');
        if (!resultsDiv) return;

        if (points.length === 0) {
            const noResultsMsg = resultsDiv.querySelector('.no-results');
            const table = resultsDiv.querySelector('.results-table');

            if (noResultsMsg) noResultsMsg.style.display = 'block';
            if (table) table.style.display = 'none';
            return;
        }

        let table = resultsDiv.querySelector('.results-table');
        const noResultsMsg = resultsDiv.querySelector('.no-results');

        if (noResultsMsg) noResultsMsg.style.display = 'none';

        if (!table) {
            table = createResultsTable(resultsDiv);
        }

        table.style.display = 'table';

        updateTableRows(table, points);

    } catch (error) {
        console.error('Error updating table:', error);
    }
}

function createResultsTable(container) {
    const table = document.createElement('table');
    table.className = 'results-table';
    table.innerHTML = `
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
        <tbody>
        </tbody>
    `;
    container.appendChild(table);
    return table;
}

function updateTableRows(table, points) {
    const tbody = table.querySelector('tbody');
    if (!tbody) return;

    tbody.innerHTML = '';

    points.forEach((point) => {
        const row = document.createElement('tr');
        row.className = point.hit ? 'hit' : 'miss';

        let timeStr;
        if (point.timestamp) {
            const date = new Date(point.timestamp);
            timeStr = date.toLocaleDateString('ru-RU') + ' ' +
                      date.toLocaleTimeString('ru-RU');
        } else {
            const now = new Date();
            timeStr = now.toLocaleDateString('ru-RU') + ' ' +
                     now.toLocaleTimeString('ru-RU');
        }

        const execTime = point.executionTime || 0;

        row.innerHTML = `
            <td>${point.x.toFixed(3)}</td>
            <td>${point.y.toFixed(3)}</td>
            <td>${point.r}</td>
            <td style="color: ${point.hit ? 'green' : 'red'}; font-weight: bold;">
                ${point.hit ? 'Попадание' : 'Промах'}
            </td>
            <td>${timeStr}</td>
            <td>${execTime} нс</td>
        `;

        tbody.appendChild(row);
    });
}

function initializePage() {
    clearGraphFieldsOnLoad();
    drawArea();
    setupRListener();
    setupCheckButtonHandler();
    setupClearButtonHandler();
    setupAjaxListener();

    const canvas = document.getElementById('areaCanvas');
    if (canvas) {
        canvas.addEventListener('click', handleCanvasClick);
    }

    setTimeout(() => {
        updateTableManually();
    }, 500);
}

document.addEventListener('DOMContentLoaded', initializePage);