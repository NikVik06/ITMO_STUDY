import java.io.File;
import java.io.FileNotFoundException;
import java.util.Random;
import java.util.Scanner;

public class InputHandler {
    private Matrix A;
    private Vector b;
    private int n;

    public InputHandler() {
        this.A = null;
        this.b = null;
        this.n = 0;
    }
    public void readFromConsole() {
        Scanner scanner = new Scanner(System.in);
        System.out.print("Введите размерность системы n (n <= 20): ");
        n = scanner.nextInt();

        if (n <= 0 || n > 20) {
            System.out.println("Ошибка: n должно быть от 1 до 20");
            return;
        }

        A = new Matrix(n);
        b = new Vector(n);
        System.out.println("Введите матрицу A построчно (по " + n + " чисел в строке):");
        for (int i = 0; i < n; i++) {
            System.out.printf("Строка %d: ", i+1);
            for (int j = 0; j < n; j++) {
                while (!scanner.hasNextDouble()) {
                    System.out.println("Ошибка: введите число!");
                    scanner.next();
                }
                A.setData(i,j, scanner.nextDouble());
            }
        }
        System.out.println("Введите вектор правой части b (" + n + " чисел через пробел):");
        for (int i = 0; i < n; i++) {
            while (!scanner.hasNextDouble()) {
                System.out.println("Ошибка: введите число!");
                scanner.next();
            }
            b.setData(i,scanner.nextDouble());
        }
        System.out.println("Матрица успешно загружена!");
    }

    public void readFromFile(String filename) {
        try {
            Scanner scanner = new Scanner(new File(filename));
            if (!scanner.hasNextInt()) {
                System.out.println("Ошибка: файл не содержит размерности");
                n = 0;
                return;
            }
            n = scanner.nextInt();

            if (n > 20) {
                System.out.println("Ошибка: размерность матрицы больше 20");
                n = 0;
                return;
            }
            A = new Matrix(n);
            b = new Vector(n);

            for (int i = 0; i < n;i++) {
                for (int j = 0; j < n; j++) {
                    if (!scanner.hasNextDouble()) {
                        System.out.println("Ошибка: недостаточно данных в файле");
                        n = 0;
                        return;
                    }
                    A.setData(i,j,scanner.nextDouble());
                }
            }

            for (int i = 0; i< n; i++) {
                if (!scanner.hasNextDouble()) {
                    System.out.println("Ошибка: недостаточно данных в файле");
                    n = 0;
                    return;
                }
                b.setData(i,scanner.nextDouble());
            }
            scanner.close();
            System.out.println("Данные успешно загружены из файла " + filename);
            System.out.println("Размерность системы: " + n);
        } catch (FileNotFoundException e) {
            System.out.println("Файл не найден");
            n = 0;
        } catch (Exception e) {
            System.out.println("Ошибка при чтении файла: " + e.getMessage());
            n = 0;
        }
    }

    public Matrix getA() {
        return A;
    }

    public Vector getB() {
        return b;
    }

    public int getN() {
        return n;
    }

    public void printSystem() {
        if (A == null || b == null) {
            System.out.println("Система не загружена");
            return;
        }

        System.out.println("Матрица A:");
        for (int i = 0; i < n; i++) {
            System.out.print("| ");
            for (int j = 0; j < n; j++) {
                System.out.printf("%8.3f ", A.getData(i, j));
            }
            System.out.printf(" | %8.3f |\n", b.getData(i));
        }
    }

    public void readRandom(boolean guaranteeDominance) {
        Scanner sc = new Scanner(System.in);
        System.out.print("Введите размерность n (1-20): ");
        try {
            this.n = sc.nextInt();
            if (n <= 0 || n > 20) {
                System.out.println("Ошибка размерности.");
                this.n = 0;
                return;
            }

            this.A = new Matrix(n);
            this.b = new Vector(n);
            Random rand = new Random();

            for (int i = 0; i < n; i++) {
                double rowSum = 0;
                for (int j = 0; j < n; j++) {
                    double val = Math.round((rand.nextDouble() * 20 - 10) * 100.0) / 100.0;
                    A.setData(i, j, val);
                    if (i != j) rowSum += Math.abs(val);
                }

                double diag;
                if (guaranteeDominance) {
                    diag = Math.round((rowSum + rand.nextDouble() * 5 + 1) * 100.0) / 100.0;
                } else {
                    diag = Math.round((rand.nextDouble() * 20 - 10) * 100.0) / 100.0;
                }

                A.setData(i, i, diag);
                b.setData(i, Math.round((rand.nextDouble() * 20 - 10) * 100.0) / 100.0);
            }
        } catch (Exception e) {
            System.out.println("Ошибка ввода.");
            this.n = 0;
        }
    }

}

