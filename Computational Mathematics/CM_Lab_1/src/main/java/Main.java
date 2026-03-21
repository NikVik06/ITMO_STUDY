import java.util.InputMismatchException;
import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        while (true) {
            InputHandler inputHandler = new InputHandler();
            boolean inputSuccess = false;

            System.out.println("Решение СЛАУ методом Простых итераций:");

            while (!inputSuccess) {
                try {
                    System.out.println("\nВыберите способ ввода данных:");
                    System.out.println("1 - с клавиатуры");
                    System.out.println("2 - из файла");
                    System.out.println("3 - Случайная генерация");
                    System.out.println("0 - выход из программы");
                    System.out.print("Ваш выбор: ");

                    int choice = scanner.nextInt();

                    if (choice == 0) {
                        System.out.println("Программа завершена.");
                        System.exit(0);
                    }

                    if (choice == 1) {
                        inputHandler.readFromConsole();
                    } else if (choice == 2) {
                        System.out.print("Введите имя файла: ");
                        inputHandler.readFromFile(scanner.next());
                    } else if (choice == 3) {
                        System.out.println("Гарантировать диагональное преобладание?");
                        System.out.println("1 - Да");
                        System.out.println("2 - Нет");
                        System.out.print("Ваш выбор: ");
                        int randChoice = scanner.nextInt();
                        inputHandler.readRandom(randChoice == 1);
                    } else  {
                        System.out.println("Неверный выбор. Введите 1, 2 или 0.");
                        continue;
                    }

                    if (inputHandler.getN() > 0) inputSuccess = true;

                } catch (InputMismatchException e) {
                    System.out.println("Ошибка: введите число!");
                    scanner.nextLine();
                }
            }

            double epsilon = 0;
            boolean epsilonSuccess = false;
            while (!epsilonSuccess) {
                try {
                    System.out.print("Введите точность epsilon (например, 0.001): ");
                    String epsilonStr = scanner.next();
                    epsilonStr = epsilonStr.replace(',', '.');
                    epsilon = Double.parseDouble(epsilonStr);

                    if (epsilon <= 0) {
                        System.out.println("Ошибка: точность должна быть положительным числом!");
                        continue;
                    }
                    epsilonSuccess = true;
                } catch (NumberFormatException e) {
                    System.out.println("Ошибка: введите число!");
                }
            }

            Matrix A = inputHandler.getA();
            Vector b = inputHandler.getB();

            System.out.println("\nИсходная система:");
            inputHandler.printSystem();

            System.out.println("\nПроверка диагонального преобладания:");
            boolean readyToSolve = false;

            if (DiagonalDominanceChecker.hasDominance(A)) {
                System.out.println("Диагональное преобладание есть");
                readyToSolve = true;
            } else {
                System.out.println("Преобладания нет. Попытка перестановки строк");
                if (DiagonalDominanceChecker.makeDominant(A, b)) {
                    System.out.println("Преобладание успешно достигнуто перестановкой!");
                    inputHandler.printSystem();
                    readyToSolve = true;
                } else {
                    System.out.println("Ошибка: невозможно достичь диагонального преобладания.");
                    System.out.println("Метод простых итераций может не сойтись.");
                }
            }

            if (readyToSolve) {
                double norm = A.getRowNorm();
                System.out.println("Строчная норма матрицы: " + norm);

                Solution solution = SimpleIterationSolver.solve(A, b, epsilon, 1000);
                solution.print();
            } else {
                System.out.println("Решение пропущено из-за отсутствия преобладания.");
            }
        }
        }
    }