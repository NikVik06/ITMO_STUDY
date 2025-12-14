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

    // Конвертация координат
    const graphX = parseFloat(((x - 200) / 40).toFixed(6));
    const graphY = parseFloat(((200 - y) / 40).toFixed(6));

    console.log('Canvas click - R:', currentR, 'X:', graphX, 'Y:', graphY);

    document.getElementById('graph-coords').textContent =
        'Координаты с графика: X: ' + graphX + ', Y: ' + graphY;

    showGraphMessage('Выбрана точка: X=' + graphX + ', Y=' + graphY + ', R=' + currentR, 'success');

    // Заполняем скрытые поля в основной форме
    const graphXInput = document.querySelector('[id$="graphX"]');
    const graphYInput = document.querySelector('[id$="graphY"]');
    const rInput = document.querySelector('[id$="rInput"]');

    if (graphXInput && graphYInput && rInput) {
        graphXInput.value = graphX;
        graphYInput.value = graphY;
        rInput.value = currentR;

        // Нажимаем скрытую кнопку
        setTimeout(function() {
            const graphCheckBtn = document.querySelector('[id$="graphCheckBtn"]');
            if (graphCheckBtn) {
                console.log('Submitting graph point');
                graphCheckBtn.click();
            } else {
                console.error('Graph check button not found');
            }
        }, 100);
    }
}

function showGraphMessage(message, type) {
    const messageDiv = document.getElementById('graph-message');
    messageDiv.textContent = message;
    messageDiv.className = 'graph-message graph-' + type;
}

function drawArea() {
    const canvas = document.getElementById('areaCanvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const rSelect = document.querySelector('[id$="rInput"]');
    const currentR = parseFloat(rSelect.value) || 2.0;

    // Очистка
    ctx.clearRect(0, 0, 400, 400);

    // Оси
    drawAxes(ctx);

    // Область
    if (currentR) {
        drawAreaShapes(ctx, currentR);
    }

    // Точки из JSON
    drawPointsFromJson(ctx);
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

    // Четверть круга
    ctx.beginPath();
    ctx.arc(200, 200, r * 40, Math.PI, 1.5 * Math.PI, true);
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

function drawPointsFromJson(ctx) {
    const pointsDataInput = document.querySelector('[id$="pointsData"]');
    if (!pointsDataInput || !pointsDataInput.value) return;

    try {
        const points = JSON.parse(pointsDataInput.value);
        console.log('Drawing points from JSON:', points);

        points.forEach(function(point) {
            drawSinglePoint(ctx, point.x, point.y, point.hit);
        });
    } catch (e) {
        console.error('Error parsing points JSON:', e);
        drawPointsFromTable(ctx);
    }
}

function drawPointsFromTable(ctx) {
    const resultsTable = document.querySelector('.results-table');
    if (!resultsTable) return;

    const rows = resultsTable.querySelectorAll('tbody tr');

    rows.forEach(function(row) {
        const cells = row.querySelectorAll('td');
        if (cells.length >= 4) {
            const xText = cells[0].textContent.trim();
            const yText = cells[1].textContent.trim();
            const hit = cells[3].textContent.includes('Попадание');

            const x = parseFloat(xText);
            const y = parseFloat(yText);

            if (!isNaN(x) && !isNaN(y)) {
                drawSinglePoint(ctx, x, y, hit);
            }
        }
    });
}

function drawSinglePoint(ctx, x, y, hit) {
    const pointX = 200 + x * 40;
    const pointY = 200 - y * 40;

    console.log('Drawing point: x=' + x + ', y=' + y + ', screenX=' + pointX + ', screenY=' + pointY + ', hit=' + hit);

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

// Инициализация
document.addEventListener('DOMContentLoaded', function() {
    drawArea();
    setupRListener();
    document.getElementById('areaCanvas').addEventListener('click', handleCanvasClick);
});