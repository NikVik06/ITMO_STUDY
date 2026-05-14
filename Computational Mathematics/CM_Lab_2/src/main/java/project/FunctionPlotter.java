package project;

import project.utils.MathParser;
import javafx.scene.chart.LineChart;
import javafx.scene.chart.NumberAxis;
import javafx.scene.chart.XYChart;
import javafx.scene.layout.BorderPane;

public class FunctionPlotter extends BorderPane {

    private LineChart<Number, Number> chart;
    private XYChart.Series<Number, Number> series;

    public FunctionPlotter() {
        NumberAxis xAxis = new NumberAxis();
        NumberAxis yAxis = new NumberAxis();

        xAxis.setLabel("x");
        yAxis.setLabel("f(x)");

        chart = new LineChart<>(xAxis, yAxis);
        chart.setTitle("График функции");
        chart.setCreateSymbols(false);
        chart.setAnimated(false);

        series = new XYChart.Series<>();
        series.setName("f(x)");

        chart.getData().add(series);

        setCenter(chart);
    }

    public void plotFunction(String func, double root) {
        series.getData().clear();

        // Удаляем точку корня, если была
        if (chart.getData().size() > 1) {
            chart.getData().remove(1);
        }

        // Интервал вокруг корня
        double a = root - 3;
        double b = root + 3;

        // Строим график
        double step = (b - a) / 500;
        for (double x = a; x <= b; x += step) {
            double y = MathParser.evaluate(func, x);
            if (!Double.isNaN(y) && !Double.isInfinite(y)) {
                series.getData().add(new XYChart.Data<>(x, y));
            }
        }

        // Добавляем точку корня
        XYChart.Series<Number, Number> rootPoint = new XYChart.Series<>();
        rootPoint.setName("Корень");

        double yRoot = MathParser.evaluate(func, root);
        if (!Double.isNaN(yRoot) && !Double.isInfinite(yRoot)) {
            rootPoint.getData().add(new XYChart.Data<>(root, yRoot));
            chart.getData().add(rootPoint);
        }

        chart.setTitle(String.format("%s   |   Корень: %.8f", func, root));
    }
}