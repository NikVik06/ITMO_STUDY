package project;

import project.gui.InputPanel;
import project.gui.ResultPanel;
import project.utils.Result;
import javafx.geometry.Insets;
import javafx.scene.control.Tab;
import javafx.scene.control.TabPane;
import javafx.scene.layout.BorderPane;
import project.gui.SystemInputPanel;

public class MainWindow extends BorderPane {

    private final InputPanel inputPanel;
    private final ResultPanel resultPanel;
    private final FunctionPlotter plotter;

    public MainWindow() {
        inputPanel = new InputPanel(this);
        resultPanel = new ResultPanel();
        plotter = new FunctionPlotter();

        setupUI();
    }

    private void setupUI() {
        // Вкладки
        TabPane tabPane = new TabPane();

        Tab inputTab = new Tab("Ввод данных", inputPanel);
        Tab resultTab = new Tab("Результаты", resultPanel);
        Tab plotTab = new Tab("График", plotter);

        Tab systemTab = new Tab("Системы", new SystemInputPanel());
        systemTab.setClosable(false);
        tabPane.getTabs().add(systemTab);

        inputTab.setClosable(false);
        resultTab.setClosable(false);
        plotTab.setClosable(false);

        tabPane.getTabs().addAll(inputTab, resultTab, plotTab);

        setCenter(tabPane);
        setPadding(new Insets(10));
    }

    /**
     * Обновляет результаты после решения
     */
    public void updateResults(Result result, String func, double initialGuess, double tolerance) {
        resultPanel.updateResults(result, func, initialGuess, tolerance);
        plotter.plotFunction(func, result.getRoot());
    }

    /**
     * Показывает ошибку
     */
    public void showError(String message) {
        resultPanel.showError(message);
    }
}
