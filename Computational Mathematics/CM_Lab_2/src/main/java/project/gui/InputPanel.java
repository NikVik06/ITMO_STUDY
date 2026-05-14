package project.gui;

import javafx.geometry.Insets;
import javafx.scene.control.*;
import javafx.scene.layout.GridPane;
import javafx.scene.layout.VBox;
import javafx.stage.FileChooser;
import project.MainWindow;
import project.solvers.NewtonSolver;
import project.solvers.ChordSolver;
import project.solvers.FixedPointSolver;
import project.utils.ConvergenceChecker;
import project.utils.Result;

import java.io.File;
import java.io.FileNotFoundException;
import java.util.Scanner;

public class InputPanel extends VBox {

    private final MainWindow mainWindow;

    private TextField funcField;
    private TextField aField;
    private TextField bField;
    private TextField guessField;
    private TextField toleranceField;
    private CheckBox autoGuessCheck;
    private Button solveButton;
    private Button loadFileButton;
    private Label statusLabel;
    private ComboBox<String> methodComboBox;

    public InputPanel(MainWindow mainWindow) {
        this.mainWindow = mainWindow;
        setupUI();
    }

    private void setupUI() {
        setSpacing(15);
        setPadding(new Insets(20));
        setStyle("-fx-background-color: #f5f5f5;");

        Label title = new Label("Решение нелинейных уравнений");
        title.setStyle("-fx-font-size: 18px; -fx-font-weight: bold; -fx-text-fill: #2c3e50;");

        GridPane form = new GridPane();
        form.setHgap(10);
        form.setVgap(10);

        int row = 0;

        // Функция
        form.add(new Label("Функция f(x):"), 0, row);
        funcField = new TextField("x^2 - 2");
        funcField.setPrefWidth(300);
        form.add(funcField, 1, row);
        form.add(new Label("Пример: x^2 - 2, sin(x) - x/2, exp(x) - 3*x"), 2, row);
        row++;

        // Выбор готовой функции
        ComboBox<String> presetFunctions = new ComboBox<>();
        presetFunctions.setPromptText("Выберите функцию");
        presetFunctions.getItems().addAll(
                "x^2 - 2",
                "sin(x) - x/2",
                "exp(x) - 3*x",
                "cos(x) - x",
                "x^3 - 2*x - 5",
                "log(x) - 1",
                "-1.8*x^3 - 2.94*x^2 + 10.37*x + 5.38"
        );
        presetFunctions.setOnAction(e -> {
            String selected = presetFunctions.getValue();
            if (selected != null) {
                funcField.setText(selected);
                switch (selected) {
                    case "x^2 - 2":
                        aField.setText("1");
                        bField.setText("2");
                        guessField.setText("1.5");
                        statusLabel.setText("Интервал [1, 2], корень ≈ 1.414");
                        break;
                    case "sin(x) - x/2":
                        aField.setText("1");
                        bField.setText("2");
                        guessField.setText("1.9");
                        statusLabel.setText("Интервал [1, 2], корень ≈ 1.895");
                        break;
                    case "exp(x) - 3*x":
                        aField.setText("0");
                        bField.setText("1");
                        guessField.setText("0.5");
                        statusLabel.setText("Интервал [0, 1], корень ≈ 0.619");
                        break;
                    case "cos(x) - x":
                        aField.setText("0");
                        bField.setText("1");
                        guessField.setText("0.7");
                        statusLabel.setText("Интервал [0, 1], корень ≈ 0.739");
                        break;
                    case "x^3 - 2*x - 5":
                        aField.setText("2");
                        bField.setText("3");
                        guessField.setText("2.5");
                        statusLabel.setText("Интервал [2, 3], корень ≈ 2.094");
                        break;
                    case "log(x) - 1":
                        aField.setText("2");
                        bField.setText("3");
                        guessField.setText("2.5");
                        statusLabel.setText("Интервал [2, 3], корень ≈ 2.718");
                        break;
                    case "-1.8*x^3 - 2.94*x^2 + 10.37*x + 5.38":
                        aField.setText("-4");
                        bField.setText("3");
                        guessField.setText("0");
                        statusLabel.setText("Три корня: [-4,-3], [-1,0], [1,2]");
                        break;
                }
            }
        });
        form.add(presetFunctions, 2, 0);
        row++;

        // Интервал
        form.add(new Label("Интервал [a, b]:"), 0, row);
        aField = new TextField("1");
        aField.setPrefWidth(80);
        bField = new TextField("2");
        bField.setPrefWidth(80);
        form.add(aField, 1, row);
        form.add(new Label("до"), 2, row);
        form.add(bField, 3, row);
        row++;

        // Начальное приближение
        form.add(new Label("Начальное x₀:"), 0, row);
        guessField = new TextField("1.5");
        guessField.setPrefWidth(100);
        autoGuessCheck = new CheckBox("Автоподбор");
        autoGuessCheck.setSelected(true);
        form.add(guessField, 1, row);
        form.add(autoGuessCheck, 2, row);
        guessField.disableProperty().bind(autoGuessCheck.selectedProperty());
        row++;

        // Точность
        form.add(new Label("Точность ε:"), 0, row);
        toleranceField = new TextField("1e-6");
        toleranceField.setPrefWidth(100);
        form.add(toleranceField, 1, row);
        row++;

        // Выбор метода
        methodComboBox = new ComboBox<>();
        methodComboBox.getItems().addAll(
                "Метод Ньютона",
                "Метод хорд",
                "Метод простой итерации"
        );
        methodComboBox.setValue("Метод Ньютона");
        methodComboBox.setPrefWidth(180);
        form.add(new Label("Метод решения:"), 0, row);
        form.add(methodComboBox, 1, row);

        Label methodHint = new Label("(для метода хорд используется интервал [a,b])");
        methodHint.setStyle("-fx-text-fill: #7f8c8d; -fx-font-size: 10px;");
        form.add(methodHint, 2, row);
        row++;

        // Кнопки
        solveButton = new Button("Найти корень");
        solveButton.setStyle("-fx-background-color: #27ae60; -fx-text-fill: white; -fx-font-size: 14px;");
        solveButton.setOnAction(e -> solve());

        loadFileButton = new Button("Загрузить из файла");
        loadFileButton.setStyle("-fx-background-color: #3498db; -fx-text-fill: white;");
        loadFileButton.setOnAction(e -> loadFromFile());

        statusLabel = new Label();
        statusLabel.setStyle("-fx-text-fill: #7f8c8d;");

        getChildren().addAll(title, form, solveButton, loadFileButton, statusLabel);
    }

    private void solve() {
        try {
            String func = funcField.getText();
            double a = Double.parseDouble(aField.getText().replace(',', '.'));
            double b = Double.parseDouble(bField.getText().replace(',', '.'));
            double tolerance = Double.parseDouble(toleranceField.getText().replace(',', '.'));
            String method = methodComboBox.getValue();

            if (!ConvergenceChecker.hasRoot(func, a, b)) {
                mainWindow.showError("На интервале [" + a + ", " + b + "] нет корня!");
                return;
            }

            Double endpointRoot = ConvergenceChecker.checkEndpointRoot(func, a, b);
            if (endpointRoot != null) {
                mainWindow.showError("Корень найден на границе: x = " + endpointRoot);
                return;
            }

            double initialGuess = 0;
            boolean needsGuess = method.equals("Метод Ньютона") || method.equals("Метод простой итерации");

            if (needsGuess) {
                if (autoGuessCheck.isSelected()) {
                    Double guess = ConvergenceChecker.findInitialGuess(func, a, b);
                    if (guess != null) {
                        initialGuess = guess;
                        statusLabel.setText("Автоматически подобрано x₀ = " + initialGuess);
                    } else {
                        initialGuess = (a + b) / 2;
                        statusLabel.setText("Используется середина интервала: x₀ = " + initialGuess);
                    }
                } else {
                    initialGuess = Double.parseDouble(guessField.getText().replace(',', '.'));
                }
            }

            statusLabel.setText("Вычисление...");
            solveButton.setDisable(true);

            final double finalGuess = initialGuess;
            final double finalA = a;
            final double finalB = b;

            new Thread(() -> {
                Result result = null;
                try {
                    switch (method) {
                        case "Метод Ньютона":
                            result = NewtonSolver.solve(func, finalGuess, tolerance);
                            break;
                        case "Метод хорд":
                            result = ChordSolver.solve(func, finalA, finalB, tolerance);
                            break;
                        case "Метод простой итерации":
                            result = FixedPointSolver.solve(func, finalA, finalB, tolerance);
                            break;
                        default:
                            result = NewtonSolver.solve(func, finalGuess, tolerance);
                    }
                } catch (Exception ex) {
                    final String errorMsg = ex.getMessage();
                    javafx.application.Platform.runLater(() -> {
                        mainWindow.showError("Ошибка: " + errorMsg);
                        statusLabel.setText("Ошибка: " + errorMsg);
                        solveButton.setDisable(false);
                    });
                    return;
                }

                final Result finalResult = result;
                javafx.application.Platform.runLater(() -> {
                    if (finalResult.isConverged()) {
                        mainWindow.updateResults(finalResult, func, finalGuess, tolerance);
                        statusLabel.setText("Готово! Корень: " + finalResult.getRoot());
                    } else {
                        mainWindow.showError(finalResult.getMessage());
                        statusLabel.setText("Ошибка: " + finalResult.getMessage());
                    }
                    solveButton.setDisable(false);
                });
            }).start();

        } catch (NumberFormatException e) {
            mainWindow.showError("Ошибка ввода чисел. Используйте точку (.)");
        } catch (Exception e) {
            mainWindow.showError("Ошибка: " + e.getMessage());
        }
    }

    private void loadFromFile() {
        FileChooser fileChooser = new FileChooser();
        fileChooser.setTitle("Выберите файл с данными");
        fileChooser.getExtensionFilters().add(
                new FileChooser.ExtensionFilter("Текстовые файлы", "*.txt")
        );

        String projectDir = System.getProperty("user.dir");
        File initialDir = new File(projectDir);
        if (initialDir.exists() && initialDir.isDirectory()) {
            fileChooser.setInitialDirectory(initialDir);
        } else {
            File altDir = new File(".");
            if (altDir.exists() && altDir.isDirectory()) {
                fileChooser.setInitialDirectory(altDir);
            }
        }

        File file = fileChooser.showOpenDialog(getScene().getWindow());
        if (file != null) {
            try (Scanner scanner = new Scanner(file)) {
                String func = scanner.nextLine().trim();
                String[] interval = scanner.nextLine().trim().split("\\s+");
                double a = Double.parseDouble(interval[0].replace(',', '.'));
                double b = Double.parseDouble(interval[1].replace(',', '.'));
                double guess = Double.parseDouble(scanner.nextLine().trim().replace(',', '.'));
                double tolerance = Double.parseDouble(scanner.nextLine().trim().replace(',', '.'));

                funcField.setText(func);
                aField.setText(String.valueOf(a));
                bField.setText(String.valueOf(b));
                toleranceField.setText(String.valueOf(tolerance));

                if (guess == 0) {
                    autoGuessCheck.setSelected(true);
                } else {
                    autoGuessCheck.setSelected(false);
                    guessField.setText(String.valueOf(guess));
                }

                statusLabel.setText("Данные загружены: " + file.getName());

            } catch (FileNotFoundException e) {
                mainWindow.showError("Файл не найден!");
            } catch (Exception e) {
                mainWindow.showError("Ошибка чтения файла. Формат:\n" +
                        "1: функция\n2: a b\n3: x₀ (0=автоподбор)\n4: ε");
            }
        }
    }
}