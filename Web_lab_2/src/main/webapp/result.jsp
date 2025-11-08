<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="ui" uri="http://dop.ru/ui" %>
<!DOCTYPE html>
<html lang="ru">
<head>
    <meta charset="UTF-8">
    <title>Результат проверки</title>
    <link rel="stylesheet" href="styles/style.css">
    <style>
            .alert {
                border: 1px solid transparent;
                border-radius: 8px;
                padding: 15px;
                margin: 15px 0;
                font-family: 'Times New Roman', serif;
            }
            .alert-success {
                background-color: rgba(46, 204, 113, 0.15);
                border-color: #27ae60;
                color: #155724;
            }
            .alert-error {
                background-color: rgba(231, 76, 60, 0.15);
                border-color: #e74c3c;
                color: #721c24;
            }
            .alert-warning {
                background-color: rgba(241, 196, 15, 0.15);
                border-color: #f1c40f;
                color: #856404;
            }
            .alert-info {
                background-color: rgba(52, 152, 219, 0.15);
                border-color: #3498db;
                color: #0c5460;
            }
            .alert-header {
                display: flex;
                align-items: center;
                margin-bottom: 8px;
            }
            .alert-icon {
                font-size: 18px;
                margin-right: 10px;
            }
            .alert-title {
                flex-grow: 1;
                font-size: 18px;
                font-weight: bold;
            }
            .alert-close {
                background: none;
                border: none;
                font-size: 20px;
                cursor: pointer;
                color: inherit;
                padding: 0;
                margin-left: 10px;
                line-height: 1;
            }
            .alert-close:hover {
                opacity: 0.7;
            }
            .alert-body {
                font-size: 16px;
                line-height: 1.5;
            }
        </style>
</head>
<body>
    <div id="header">
        <h1>Результат проверки</h1>
        <p>Николенко Максим Викторович, группа P3215, вариант 466890</p>
    </div>

    <div class="container">
        <c:if test="${not empty result}">
            <c:choose>
                <c:when test="${result.hit}">
                    <ui:alert type="success" title="Попадание!" closable="true" icon="true">
                        Точка с координатами X=${result.x}, Y=${result.y} попадает в область при R=${result.r}.
                    </ui:alert>
                </c:when>
                <c:otherwise>
                    <ui:alert type="error" title="Промах" closable="true" icon="true">
                        Точка с координатами X=${result.x}, Y=${result.y} не попадает в область при R=${result.r}.
                    </ui:alert>
                </c:otherwise>
            </c:choose>

            <div class="form-group ${result.hit ? 'hit' : 'miss'}" style="text-align: center;">
                <h2 style="font-size: 28px; margin-bottom: 20px;">
                    ${result.hit ? 'Точка попадает в область!' : 'Точка не попадает в область.'}
                </h2>
                <div style="font-size: 18px; line-height: 2;">
                    <p><strong>Координаты точки:</strong> X = ${result.x}, Y = ${result.y}</p>
                    <p><strong>Радиус:</strong> R = ${result.r}</p>
                    <p><strong>Время проверки:</strong> ${result.timestamp}</p>
                    <p><strong>Время выполнения:</strong> ${result.executionTime} наносекунд</p>
                </div>
            </div>
        </c:if>

        <div style="text-align: center; margin: 30px 0;">
            <a href="controller" class="submit-btn" style="text-decoration: none; display: inline-block;">
                Вернуться к форме
            </a>
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
                            <c:forEach var="res" items="${sessionScope.results}">
                                <tr class="${res.hit ? 'hit' : 'miss'}">
                                    <td>${res.x}</td>
                                    <td>${res.y}</td>
                                    <td>${res.r}</td>
                                    <td><strong>${res.hit ? 'Попадание' : 'Промах'}</strong></td>
                                    <td>${res.timestamp}</td>
                                    <td>${res.executionTime} нс</td>
                                </tr>
                            </c:forEach>
                        </c:when>
                        <c:otherwise>
                            <tr class="no-results">
                                <td colspan="6">Нет данных о предыдущих проверках</td>
                            </tr>
                        </c:otherwise>
                    </c:choose>
                </tbody>
            </table>
        </div>
    </div>
<script>
function closeAlert(alertId) {
    const alertElement = document.getElementById(alertId);
    if (alertElement) {
        alertElement.style.display = 'none';
    }
}
</script>
</body>
</html>