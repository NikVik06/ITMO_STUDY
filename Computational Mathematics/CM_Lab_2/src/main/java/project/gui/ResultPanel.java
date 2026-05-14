package project.gui;

import javafx.geometry.Insets;
import javafx.scene.control.Button;
import javafx.scene.control.Label;
import javafx.scene.control.ScrollPane;
import javafx.scene.control.TextArea;
import javafx.scene.layout.VBox;
import javafx.scene.text.Font;
import javafx.stage.FileChooser;
import project.utils.Result;

import java.io.File;
import java.io.PrintWriter;

public class ResultPanel extends VBox {

    private final Label rootLabel;
    private final Label functionValueLabel;
    private final Label iterationsLabel;
    private final TextArea errorsArea;
    private final Label statusLabel;
    private Button saveToFileButton;

    private Result currentResult;
    private String currentFunc;
    private double currentInitialGuess;
    private double currentTolerance;

    public ResultPanel() {
        setSpacing(15);
        setPadding(new Insets(20));
        setStyle("-fx-background-color: #f5f5f5;");

        // Заголовок
        Label title = new Label("Результаты вычислений");
        title.setStyle("-fx-font-size: 18px; -fx-font-weight: bold; -fx-text-fill: #2c3e50;");

        // Результаты
        rootLabel = new Label();
        rootLabel.setFont(Font.font(14));

        functionValueLabel = new Label();
        functionValueLabel.setFont(Font.font(14));

        iterationsLabel = new Label();
        iterationsLabel.setFont(Font.font(14));

        // Таблица погрешностей
        Label errorsTitle = new Label("Погрешности по шагам:");
        errorsTitle.setStyle("-fx-font-weight: bold;");

        errorsArea = new TextArea();
        errorsArea.setEditable(false);
        errorsArea.setPrefHeight(200);
        errorsArea.setFont(Font.font("Monospaced", 12));

        ScrollPane scrollPane = new ScrollPane(errorsArea);
        scrollPane.setFitToWidth(true);
        scrollPane.setPrefHeight(250);

        // Кнопка сохранения
        saveToFileButton = new Button("Сохранить результат в файл");
        saveToFileButton.setStyle("-fx-background-color: #3498db; -fx-text-fill: white; -fx-font-size: 12px;");
        saveToFileButton.setOnAction(e -> saveToFile());
        saveToFileButton.setDisable(true);

        // Статус
        statusLabel = new Label();
        statusLabel.setStyle("-fx-text-fill: #7f8c8d;");

        getChildren().addAll(title, rootLabel, functionValueLabel, iterationsLabel,
                errorsTitle, scrollPane, saveToFileButton, statusLabel);
    }

    public void updateResults(Result result, String func, double initialGuess, double tolerance) {
        // Сохраняем данные для возможного сохранения
        this.currentResult = result;
        this.currentFunc = func;
        this.currentInitialGuess = initialGuess;
        this.currentTolerance = tolerance;

        if (result.isConverged()) {
            rootLabel.setText(String.format("Корень: x = %.12f", result.getRoot()));
            functionValueLabel.setText(String.format("Значение функции: f(x) = %.3e", result.getFunctionValue()));
            iterationsLabel.setText(String.format("Количество итераций: %d", result.getIterations()));

            // Формируем таблицу погрешностей
            StringBuilder sb = new StringBuilder();
            sb.append(String.format("%-10s %-20s\n", "Шаг", "|x_k - x_{k-1}|"));
            sb.append("----------------------------------------\n");

            for (int i = 0; i < result.getErrors().size(); i++) {
                sb.append(String.format("%-10d %.3e\n", i + 1, result.getErrors().get(i)));
            }

            errorsArea.setText(sb.toString());
            statusLabel.setText("Решение найдено успешно");
            saveToFileButton.setDisable(false); // включаем кнопку

        } else {
            rootLabel.setText("Метод не сошелся");
            functionValueLabel.setText("");
            iterationsLabel.setText("");
            errorsArea.setText(result.getMessage());
            statusLabel.setText("Ошибка: " + result.getMessage());
            saveToFileButton.setDisable(true); // отключаем кнопку
        }
    }

    public void showError(String message) {
        rootLabel.setText("Ошибка");
        functionValueLabel.setText("");
        iterationsLabel.setText("");
        errorsArea.setText(message);
        statusLabel.setText("Ошибка: " + message);
        saveToFileButton.setDisable(true);
    }

    private void saveToFile() {
        if (currentResult == null || !currentResult.isConverged()) {
            statusLabel.setText("Нет данных для сохранения");
            return;
        }

        FileChooser fileChooser = new FileChooser();
        fileChooser.setTitle("Сохранить результат");
        fileChooser.getExtensionFilters().add(
                new FileChooser.ExtensionFilter("Текстовые файлы", "*.txt")
        );
        fileChooser.setInitialFileName("result.txt");

        File file = fileChooser.showSaveDialog(getScene().getWindow());
        if (file != null) {
            try (PrintWriter writer = new PrintWriter(file)) {
                writer.println("╔══════════════════════════════════════════════════════════╗");
                writer.println("║     РЕЗУЛЬТАТ РЕШЕНИЯ НЕЛИНЕЙНОГО УРАВНЕНИЯ            ║");
                writer.println("╚══════════════════════════════════════════════════════════╝");
                writer.println();
                writer.println("Функция: " + currentFunc);
                writer.println("Интервал/начальное приближение: x₀ = " + currentInitialGuess);
                writer.println("Точность: ε = " + currentTolerance);
                writer.println();
                writer.println("Корень: x = " + currentResult.getRoot());
                writer.println("Значение функции: f(x) = " + currentResult.getFunctionValue());
                writer.println("Количество итераций: " + currentResult.getIterations());
                writer.println();
                writer.println("Погрешности по шагам:");
                writer.println("----------------------------------------");
                writer.println(String.format("%-10s %-20s", "Шаг", "|x_k - x_{k-1}|"));
                writer.println("----------------------------------------");
                for (int i = 0; i < currentResult.getErrors().size(); i++) {
                    writer.println(String.format("%-10d %.3e", i + 1, currentResult.getErrors().get(i)));
                }
                writer.println();
                writer.println("Сохранено: " + new java.util.Date());

                statusLabel.setText("Результат сохранен в файл: " + file.getName());
            } catch (Exception e) {
                statusLabel.setText("Ошибка сохранения: " + e.getMessage());
            }
        }
    }
}