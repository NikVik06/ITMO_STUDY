package project.gui;

import javafx.scene.chart.NumberAxis;
import javafx.scene.chart.ScatterChart;
import javafx.scene.chart.XYChart;
import javafx.scene.layout.BorderPane;
import javafx.scene.layout.StackPane;
import javafx.scene.paint.Color;
import javafx.scene.canvas.Canvas;
import javafx.scene.canvas.GraphicsContext;
import javafx.scene.control.ScrollPane;
import javafx.scene.input.ScrollEvent;
import javafx.scene.input.MouseEvent;
import javafx.geometry.Point2D;

public class SystemPlotter extends BorderPane {

    private Canvas canvas;
    private double canvasWidth = 500;
    private double canvasHeight = 500;

    // Область отображения
    private double minX = -2;
    private double maxX = 2;
    private double minY = -2;
    private double maxY = 2;

    // Для зума и панорамирования
    private double zoomFactor = 1.0;
    private double offsetX = 0;
    private double offsetY = 0;
    private double startMouseX, startMouseY;
    private double startOffsetX, startOffsetY;

    private int currentSystemIndex = 0;
    private double solutionX = Double.NaN;
    private double solutionY = Double.NaN;

    public SystemPlotter() {
        setupCanvas();
    }

    private void setupCanvas() {
        canvas = new Canvas(canvasWidth, canvasHeight);
        canvas.setStyle("-fx-background-color: white; -fx-border-color: #ddd;");

        // Обработка изменения размера
        canvas.widthProperty().addListener(evt -> draw());
        canvas.heightProperty().addListener(evt -> draw());

        // Зум колесиком мыши
        canvas.setOnScroll(this::handleZoom);

        // Панорамирование
        canvas.setOnMousePressed(this::handleMousePressed);
        canvas.setOnMouseDragged(this::handleMouseDragged);

        // Центрируем
        StackPane centerPane = new StackPane(canvas);
        centerPane.setStyle("-fx-padding: 10;");

        setCenter(centerPane);
    }

    private void handleZoom(ScrollEvent event) {
        double delta = event.getDeltaY() > 0 ? 1.1 : 0.9;
        zoomFactor *= delta;
        zoomFactor = Math.max(0.5, Math.min(5.0, zoomFactor));

        updateViewBounds();
        draw();
    }

    private void handleMousePressed(MouseEvent event) {
        startMouseX = event.getX();
        startMouseY = event.getY();
        startOffsetX = offsetX;
        startOffsetY = offsetY;
    }

    private void handleMouseDragged(MouseEvent event) {
        double dx = event.getX() - startMouseX;
        double dy = event.getY() - startMouseY;

        double moveX = dx / canvasWidth * (maxX - minX);
        double moveY = -dy / canvasHeight * (maxY - minY);

        offsetX = startOffsetX + moveX;
        offsetY = startOffsetY + moveY;

        updateViewBounds();
        draw();
    }

    private void updateViewBounds() {
        double centerX = (minX + maxX) / 2;
        double centerY = (minY + maxY) / 2;
        double rangeX = (maxX - minX) / zoomFactor;
        double rangeY = (maxY - minY) / zoomFactor;

        minX = centerX + offsetX - rangeX / 2;
        maxX = centerX + offsetX + rangeX / 2;
        minY = centerY + offsetY - rangeY / 2;
        maxY = centerY + offsetY + rangeY / 2;
    }

    public void plotSystem(int systemIndex, double solutionX, double solutionY) {
        this.currentSystemIndex = systemIndex;
        this.solutionX = solutionX;
        this.solutionY = solutionY;

        // Сбрасываем зум и панорамирование
        zoomFactor = 1.0;
        offsetX = 0;
        offsetY = 0;

        // Настраиваем область в зависимости от системы
        switch (systemIndex) {
            case 0: // sin(x+y) = 1.5x - 0.1, x² + 2y² = 1
                minX = -1.5;
                maxX = 1.5;
                minY = -1.2;
                maxY = 1.2;
                break;
            case 1: // cos(x-1) + y = 0.5, x - cos(y) = 3
                minX = 2.5;
                maxX = 4.5;
                minY = -0.5;
                maxY = 1.5;
                break;
            case 2:
                minX = -1.5;
                maxX = 1.5;
                minY = -2;
                maxY = 1;
                break;
            default:
                minX = -2;
                maxX = 2;
                minY = -2;
                maxY = 2;
        }

        draw();
    }

    public void clear() {
        GraphicsContext gc = canvas.getGraphicsContext2D();
        gc.setFill(Color.WHITE);
        gc.fillRect(0, 0, canvasWidth, canvasHeight);
        drawAxes();
    }

    private void draw() {
        GraphicsContext gc = canvas.getGraphicsContext2D();

        // Очищаем
        gc.setFill(Color.WHITE);
        gc.fillRect(0, 0, canvasWidth, canvasHeight);

        // Рисуем сетку
        drawGrid();

        // Рисуем оси
        drawAxes();

        // Рисуем линии уровня
        drawLevelCurves();

        // Отмечаем решение
        if (!Double.isNaN(solutionX) && !Double.isNaN(solutionY)) {
            drawSolutionPoint();
        }
    }

    private void drawGrid() {
        GraphicsContext gc = canvas.getGraphicsContext2D();
        gc.setStroke(Color.LIGHTGRAY);
        gc.setLineWidth(0.5);

        // Вертикальные линии
        for (double x = Math.ceil(minX); x <= maxX; x += 0.5) {
            double pixelX = xToPixel(x);
            if (pixelX >= 0 && pixelX <= canvasWidth) {
                gc.strokeLine(pixelX, 0, pixelX, canvasHeight);
            }
        }

        // Горизонтальные линии
        for (double y = Math.ceil(minY); y <= maxY; y += 0.5) {
            double pixelY = yToPixel(y);
            if (pixelY >= 0 && pixelY <= canvasHeight) {
                gc.strokeLine(0, pixelY, canvasWidth, pixelY);
            }
        }
    }

    private void drawAxes() {
        GraphicsContext gc = canvas.getGraphicsContext2D();

        double originX = xToPixel(0);
        double originY = yToPixel(0);

        gc.setStroke(Color.BLACK);
        gc.setLineWidth(1.5);

        // Вертикальная ось
        if (originX >= 0 && originX <= canvasWidth) {
            gc.strokeLine(originX, 0, originX, canvasHeight);
        }

        // Горизонтальная ось
        if (originY >= 0 && originY <= canvasHeight) {
            gc.strokeLine(0, originY, canvasWidth, originY);
        }

        // Подписи осей
        gc.setFill(Color.BLACK);
        gc.fillText("x", canvasWidth - 15, originY - 5);
        gc.fillText("y", originX + 5, 15);

        // Деления
        gc.setStroke(Color.GRAY);
        gc.setLineWidth(0.5);

        for (double x = -5; x <= 5; x += 0.5) {
            double pixelX = xToPixel(x);
            if (pixelX >= 0 && pixelX <= canvasWidth && Math.abs(x) > 1e-10) {
                gc.strokeLine(pixelX, originY - 3, pixelX, originY + 3);
                gc.fillText(String.format("%.1f", x), pixelX - 10, originY + 15);
            }
        }

        for (double y = -5; y <= 5; y += 0.5) {
            double pixelY = yToPixel(y);
            if (pixelY >= 0 && pixelY <= canvasHeight && Math.abs(y) > 1e-10) {
                gc.strokeLine(originX - 3, pixelY, originX + 3, pixelY);
                gc.fillText(String.format("%.1f", y), originX + 8, pixelY + 4);
            }
        }
    }

    private void drawLevelCurves() {
        GraphicsContext gc = canvas.getGraphicsContext2D();

        // F(x,y)=0 — красным
        gc.setStroke(Color.RED);
        gc.setLineWidth(2);
        drawContour(this::evaluateF, Color.RED);

        // G(x,y)=0 — синим
        gc.setStroke(Color.BLUE);
        gc.setLineWidth(2);
        drawContour(this::evaluateG, Color.BLUE);
    }

    private void drawContour(ContourFunction func, Color color) {
        GraphicsContext gc = canvas.getGraphicsContext2D();
        gc.setStroke(color);

        int steps = 200;
        double stepX = (maxX - minX) / steps;
        double stepY = (maxY - minY) / steps;

        double[][] values = new double[steps + 1][steps + 1];
        for (int i = 0; i <= steps; i++) {
            double x = minX + i * stepX;
            for (int j = 0; j <= steps; j++) {
                double y = minY + j * stepY;
                values[i][j] = func.evaluate(x, y);
            }
        }

        for (int i = 0; i < steps; i++) {
            for (int j = 0; j < steps; j++) {
                double x1 = minX + i * stepX;
                double y1 = minY + j * stepY;
                double x2 = x1 + stepX;
                double y2 = y1 + stepY;

                double v00 = values[i][j];
                double v10 = values[i + 1][j];
                double v01 = values[i][j + 1];
                double v11 = values[i + 1][j + 1];

                drawSegment(x1, y1, x2, y1, v00, v10, gc);
                drawSegment(x1, y1, x1, y2, v00, v01, gc);
                drawSegment(x2, y1, x2, y2, v10, v11, gc);
                drawSegment(x1, y2, x2, y2, v01, v11, gc);
            }
        }
    }

    private void drawSegment(double x1, double y1, double x2, double y2,
                             double v1, double v2, GraphicsContext gc) {
        if (v1 * v2 < 0) {
            double t = -v1 / (v2 - v1);
            double x = x1 + t * (x2 - x1);
            double y = y1 + t * (y2 - y1);

            double pixelX = xToPixel(x);
            double pixelY = yToPixel(y);

            if (pixelX >= 0 && pixelX <= canvasWidth &&
                    pixelY >= 0 && pixelY <= canvasHeight) {
                gc.fillOval(pixelX - 1.5, pixelY - 1.5, 3, 3);
            }
        }
    }

    private void drawSolutionPoint() {
        GraphicsContext gc = canvas.getGraphicsContext2D();

        double pixelX = xToPixel(solutionX);
        double pixelY = yToPixel(solutionY);

        if (pixelX >= 0 && pixelX <= canvasWidth &&
                pixelY >= 0 && pixelY <= canvasHeight) {

            gc.setFill(Color.GREEN);
            gc.fillOval(pixelX - 8, pixelY - 8, 16, 16);

            gc.setStroke(Color.WHITE);
            gc.setLineWidth(2);
            gc.strokeOval(pixelX - 8, pixelY - 8, 16, 16);

            gc.setFill(Color.BLACK);
            gc.fillText(String.format("(%.3f, %.3f)", solutionX, solutionY),
                    pixelX + 10, pixelY - 5);
        }
    }

    private double xToPixel(double x) {
        return (x - minX) / (maxX - minX) * canvasWidth;
    }

    private double yToPixel(double y) {
        return canvasHeight - (y - minY) / (maxY - minY) * canvasHeight;
    }

    private double evaluateF(double x, double y) {
        switch (currentSystemIndex) {
            case 0: return Math.sin(x + y) - 1.5 * x + 0.1;
            case 1: return Math.cos(x - 1) + y - 0.5;
            case 2: return Math.sin(x + 0.5) - y - 1;
            default: return 0;
        }
    }

    private double evaluateG(double x, double y) {
        switch (currentSystemIndex) {
            case 0: return x * x + 2 * y * y - 1;
            case 1: return x - Math.cos(y) - 3;
            case 2: return Math.cos(y - 2) + x;
            default: return 0;
        }
    }

    public void setCurrentSystemIndex(int index) {
        this.currentSystemIndex = index;
    }

    @FunctionalInterface
    private interface ContourFunction {
        double evaluate(double x, double y);
    }
}