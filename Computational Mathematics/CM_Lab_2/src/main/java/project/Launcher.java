package project;

import javafx.application.Application;
import javafx.scene.Scene;
import javafx.stage.Stage;
public class Launcher extends Application {
    @Override
    public void start(Stage primaryStage) {
        MainWindow mainWindow = new MainWindow();
        Scene scene = new Scene(mainWindow, 1000, 700);
        scene.getStylesheets().add(getClass().getResource("/style.css").toExternalForm());

        primaryStage.setTitle("Метод Ньютона — Решение нелинейных уравнений");
        primaryStage.setScene(scene);
        primaryStage.show();
    }
    public static void main(String[] args) {
        launch(args);
    }
}
