package project.gui;

import javafx.geometry.Insets;
import javafx.scene.control.*;
import javafx.scene.layout.GridPane;
import javafx.scene.layout.VBox;
import javafx.scene.layout.HBox;
import javafx.stage.FileChooser;
import project.systems.SystemResult;
import project.systems.SystemSolver;
import project.systems.SystemFunction;

import java.io.File;
import java.io.PrintWriter;

public class SystemInputPanel extends VBox {

    private ComboBox<String> systemComboBox;
    private TextField x0Field;
    private TextField y0Field;
    private TextField toleranceField;
    private Button solveButton;
    private Button saveButton;
    private Label resultLabel;
    private Label iterationsLabel;
    private Label errorLabel;
    private TextArea detailsArea;
    private TextArea systemDisplay;
    private SystemPlotter systemPlotter;

    private SystemResult currentResult;
    private SystemDefinition currentSystem;
    private double currentX0;
    private double currentY0;
    private double currentTolerance;

    // Описание систем
    private static class SystemDefinition {
        String name;
        String description;
        SystemFunction phi1;
        SystemFunction phi2;
        double defaultX0;
        double defaultY0;

        SystemDefinition(String name, String description,
                         SystemFunction phi1,
                         SystemFunction phi2,
                         double defaultX0, double defaultY0) {
            this.name = name;
            this.description = description;
            this.phi1 = phi1;
            this.phi2 = phi2;
            this.defaultX0 = defaultX0;
            this.defaultY0 = defaultY0;
        }
    }

    private SystemDefinition[] systems = {
            new SystemDefinition(
                    "Система 1 (вариант 9)",
                    "{ sin(x+y) = 1.5x - 0.1\n{ x² + 2y² = 1",
                    (x, y) -> (Math.sin(x + y) + 0.1) / 1.5,
                    (x, y) -> Math.sqrt(Math.max(0, (1 - x*x) / 2)),
                    0.5, 0.5
            ),
            new SystemDefinition(
                    "Система 2 (вариант 3)",
                    "{ cos(x-1) + y = 0.5\n{ x - cos(y) = 3",
                    (x, y) -> Math.cos(y) + 3,
                    (x, y) -> 0.5 - Math.cos(x - 1),
                    3.5, 0.5
            ),
            new SystemDefinition(
                    "Система 3 (вариант 10)",
                    "{ sin(x+0.5) - y = 1\n{ cos(y-2) + x = 0",
                    (x, y) -> -Math.cos(y - 2),
                    (x, y) -> Math.sin(x + 0.5) - 1,
                    0.5, 0.5
            )
    };

    public SystemInputPanel() {
        setupUI();
    }

    private void setupUI() {
        setSpacing(15);
        setPadding(new Insets(20));
        setStyle("-fx-background-color: #f5f5f5;");

        // Заголовок
        Label title = new Label("Решение систем нелинейных уравнений");
        title.setStyle("-fx-font-size: 18px; -fx-font-weight: bold; -fx-text-fill: #2c3e50;");

        // Выбор системы
        Label selectLabel = new Label("Выберите систему:");
        selectLabel.setStyle("-fx-font-weight: bold;");

        systemComboBox = new ComboBox<>();
        for (int i = 0; i < systems.length; i++) {
            systemComboBox.getItems().add(systems[i].name);
        }
        systemComboBox.setValue(systems[0].name);
        systemComboBox.setOnAction(e -> updateSystemDisplay());

        // Отображение выбранной системы
        systemDisplay = new TextArea();
        systemDisplay.setEditable(false);
        systemDisplay.setPrefHeight(80);
        systemDisplay.setFont(javafx.scene.text.Font.font("Monospaced", 12));

        // График
        systemPlotter = new SystemPlotter();
        systemPlotter.setPrefHeight(450);
        systemPlotter.setMinHeight(350);

        // Панель ввода
        GridPane form = new GridPane();
        form.setHgap(10);
        form.setVgap(10);

        int row = 0;

        form.add(new Label("Начальное x₀:"), 0, row);
        x0Field = new TextField();
        form.add(x0Field, 1, row);
        row++;

        form.add(new Label("Начальное y₀:"), 0, row);
        y0Field = new TextField();
        form.add(y0Field, 1, row);
        row++;

        form.add(new Label("Точность ε:"), 0, row);
        toleranceField = new TextField("0.01");
        form.add(toleranceField, 1, row);
        row++;

        // Кнопки
        HBox buttonBox = new HBox(10);
        solveButton = new Button("Решить систему");
        solveButton.setStyle("-fx-background-color: #27ae60; -fx-text-fill: white; -fx-font-size: 14px;");
        solveButton.setOnAction(e -> solve());

        Button solveNegativeButton = new Button("Отрицательный корень (y<0)");
        solveNegativeButton.setStyle("-fx-background-color: #e67e22; -fx-text-fill: white;");
        solveNegativeButton.setOnAction(e -> solveNegative());

        saveButton = new Button("Сохранить результат");
        saveButton.setStyle("-fx-background-color: #3498db; -fx-text-fill: white; -fx-font-size: 12px;");
        saveButton.setOnAction(e -> saveToFile());
        saveButton.setDisable(true);

        buttonBox.getChildren().addAll(solveButton, solveNegativeButton, saveButton);

        // Панель результатов
        resultLabel = new Label();
        resultLabel.setStyle("-fx-font-size: 14px; -fx-font-weight: bold;");

        iterationsLabel = new Label();
        errorLabel = new Label();

        detailsArea = new TextArea();
        detailsArea.setEditable(false);
        detailsArea.setPrefHeight(150);
        detailsArea.setFont(javafx.scene.text.Font.font("Monospaced", 12));

        // Собираем левую панель
        VBox leftPanel = new VBox(10);
        leftPanel.getChildren().addAll(
                selectLabel, systemComboBox, systemDisplay,
                form, buttonBox, resultLabel, iterationsLabel, errorLabel, detailsArea
        );
        leftPanel.setPrefWidth(400);

        // Правая панель (только график)
        VBox rightPanel = new VBox(10);
        rightPanel.getChildren().addAll(systemPlotter);
        rightPanel.setFillWidth(true);

        HBox mainContent = new HBox(20);
        mainContent.getChildren().addAll(leftPanel, rightPanel);
        mainContent.setFillHeight(true);

        getChildren().addAll(title, mainContent);

        updateSystemDisplay();
    }

    private void updateSystemDisplay() {
        int index = systemComboBox.getSelectionModel().getSelectedIndex();
        if (index >= 0 && index < systems.length) {
            systemDisplay.setText(systems[index].description);
            x0Field.setText(String.valueOf(systems[index].defaultX0));
            y0Field.setText(String.valueOf(systems[index].defaultY0));
            systemPlotter.setCurrentSystemIndex(index);
            systemPlotter.clear();

            currentResult = null;
            saveButton.setDisable(true);
        }
    }

    private void solve() {
        try {
            int index = systemComboBox.getSelectionModel().getSelectedIndex();
            if (index < 0) return;

            currentSystem = systems[index];
            currentX0 = Double.parseDouble(x0Field.getText().replace(',', '.'));
            currentY0 = Double.parseDouble(y0Field.getText().replace(',', '.'));
            currentTolerance = Double.parseDouble(toleranceField.getText().replace(',', '.'));

            solveButton.setDisable(true);
            saveButton.setDisable(true);
            resultLabel.setText("Вычисление...");
            systemPlotter.clear();

            new Thread(() -> {
                SystemSolver solver = new SystemSolver(currentSystem.phi1, currentSystem.phi2);
                SystemResult result = solver.solve(currentX0, currentY0, currentTolerance);

                javafx.application.Platform.runLater(() -> {
                    if (result.isConverged()) {
                        currentResult = result;
                        resultLabel.setText(String.format("Корень: x = %.8f, y = %.8f",
                                result.getX(), result.getY()));
                        iterationsLabel.setText("Количество итераций: " + result.getIterations());

                        double lastError = result.getErrors().isEmpty() ? 0 :
                                result.getErrors().get(result.getErrors().size() - 1);
                        errorLabel.setText(String.format("Погрешность: %.3e", lastError));

                        StringBuilder sb = new StringBuilder();
                        sb.append("Погрешности по шагам (|Δx,y|):\n");
                        sb.append("----------------------------------------\n");
                        for (int i = 0; i < result.getErrors().size(); i++) {
                            sb.append(String.format("Шаг %d: %.3e\n", i + 1, result.getErrors().get(i)));
                        }
                        detailsArea.setText(sb.toString());

                        systemPlotter.plotSystem(index, result.getX(), result.getY());
                        saveButton.setDisable(false);
                    } else {
                        currentResult = null;
                        resultLabel.setText("Метод не сошелся");
                        iterationsLabel.setText("");
                        errorLabel.setText(result.getMessage());
                        detailsArea.setText("");
                        saveButton.setDisable(true);
                    }
                    solveButton.setDisable(false);
                });
            }).start();

        } catch (NumberFormatException e) {
            resultLabel.setText("Ошибка ввода чисел");
            solveButton.setDisable(false);
        }
    }

    private void solveNegative() {
        try {
            int index = systemComboBox.getSelectionModel().getSelectedIndex();
            if (index < 0) return;

            if (index != 0) {
                errorLabel.setText("Отрицательный корень только для системы 1");
                return;
            }

            currentSystem = systems[index];

            // Берем x из поля, y делаем отрицательным
            double x0 = Double.parseDouble(x0Field.getText().replace(',', '.'));
            double y0 = -Math.abs(Double.parseDouble(y0Field.getText().replace(',', '.')));
            double tolerance = Double.parseDouble(toleranceField.getText().replace(',', '.'));

            solveButton.setDisable(true);
            saveButton.setDisable(true);
            resultLabel.setText("Вычисление отрицательного корня...");
            systemPlotter.clear();

            new Thread(() -> {
                // Создаем функции с отрицательным y
                SystemFunction phi1 = (x, y) -> (Math.sin(x + y) + 0.1) / 1.5;
                SystemFunction phi2Negative = (x, y) -> -Math.sqrt(Math.max(0, (1 - x*x) / 2));

                SystemSolver solver = new SystemSolver(phi1, phi2Negative);
                SystemResult result = solver.solve(x0, y0, tolerance);

                javafx.application.Platform.runLater(() -> {
                    if (result.isConverged()) {
                        currentResult = result;
                        resultLabel.setText(String.format("Отрицательный корень: x = %.8f, y = %.8f",
                                result.getX(), result.getY()));
                        iterationsLabel.setText("Количество итераций: " + result.getIterations());

                        double lastError = result.getErrors().isEmpty() ? 0 :
                                result.getErrors().get(result.getErrors().size() - 1);
                        errorLabel.setText(String.format("Погрешность: %.3e", lastError));

                        StringBuilder sb = new StringBuilder();
                        sb.append("Погрешности по шагам (|Δx,y|):\n");
                        sb.append("----------------------------------------\n");
                        for (int i = 0; i < result.getErrors().size(); i++) {
                            sb.append(String.format("Шаг %d: %.3e\n", i + 1, result.getErrors().get(i)));
                        }
                        detailsArea.setText(sb.toString());

                        systemPlotter.plotSystem(index, result.getX(), result.getY());
                        saveButton.setDisable(false);
                    } else {
                        resultLabel.setText("Метод не сошелся. Попробуйте другое начальное приближение");
                        errorLabel.setText(result.getMessage());
                    }
                    solveButton.setDisable(false);
                    saveButton.setDisable(false);
                });
            }).start();

        } catch (NumberFormatException e) {
            resultLabel.setText("Ошибка ввода чисел");
            solveButton.setDisable(false);
        }
    }

    private void saveToFile() {
        if (currentResult == null || currentSystem == null) {
            errorLabel.setText("Нет данных для сохранения");
            return;
        }

        FileChooser fileChooser = new FileChooser();
        fileChooser.setTitle("Сохранить результат решения системы");
        fileChooser.getExtensionFilters().add(
                new FileChooser.ExtensionFilter("Текстовые файлы", "*.txt")
        );
        fileChooser.setInitialFileName("system_result.txt");

        File file = fileChooser.showSaveDialog(getScene().getWindow());
        if (file != null) {
            try (PrintWriter writer = new PrintWriter(file)) {
                writer.println("╔══════════════════════════════════════════════════════════╗");
                writer.println("║     РЕЗУЛЬТАТ РЕШЕНИЯ СИСТЕМЫ НЕЛИНЕЙНЫХ УРАВНЕНИЙ     ║");
                writer.println("╚══════════════════════════════════════════════════════════╝");
                writer.println();
                writer.println("Система: " + currentSystem.name);
                writer.println(currentSystem.description);
                writer.println();
                writer.println("Начальные приближения: x₀ = " + currentX0 + ", y₀ = " + currentY0);
                writer.println("Точность: ε = " + currentTolerance);
                writer.println();
                writer.println("Корень: x = " + currentResult.getX() + ", y = " + currentResult.getY());
                writer.println("Количество итераций: " + currentResult.getIterations());
                writer.println();

                double f1 = Math.sin(currentResult.getX() + currentResult.getY()) - 1.5 * currentResult.getX() + 0.1;
                double f2 = currentResult.getX() * currentResult.getX() + 2 * currentResult.getY() * currentResult.getY() - 1;
                writer.println("Проверка правильности решения:");
                writer.println("  F(x,y) = " + f1);
                writer.println("  G(x,y) = " + f2);
                writer.println();

                writer.println("Погрешности по шагам:");
                writer.println("----------------------------------------");
                writer.println(String.format("%-10s %-20s", "Шаг", "|Δx,y|"));
                writer.println("----------------------------------------");
                for (int i = 0; i < currentResult.getErrors().size(); i++) {
                    writer.println(String.format("%-10d %.3e", i + 1, currentResult.getErrors().get(i)));
                }
                writer.println();
                writer.println("Сохранено: " + new java.util.Date());

                errorLabel.setText("Результат сохранен в файл: " + file.getName());
            } catch (Exception e) {
                errorLabel.setText("Ошибка сохранения: " + e.getMessage());
            }
        }
    }
}