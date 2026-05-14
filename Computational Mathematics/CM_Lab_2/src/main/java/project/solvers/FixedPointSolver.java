package project.solvers;

import project.utils.MathParser;
import project.utils.Result;
import java.util.ArrayList;
import java.util.List;

public class FixedPointSolver {

    private static double phi(String func, double x, double lambda) {
        double fx = MathParser.evaluate(func, x);
        return x - lambda * fx;
    }

    /**
     * Проверяет условие сходимости на всем интервале
     */
    public static boolean checkConvergence(String func, double a, double b, double lambda) {
        double step = (b - a) / 20;
        for (double x = a; x <= b; x += step) {
            double df = MathParser.derivative(func, x);
            double phiDerivative = Math.abs(1 - lambda * df);
            if (phiDerivative >= 1) {
                return false;
            }
        }
        return true;
    }

    /**
     * Подбирает λ на заданном интервале [a, b]
     */
    public static double findLambda(String func, double a, double b) {
        double maxDerivative = 0;
        double step = (b - a) / 20;

        for (double x = a; x <= b; x += step) {
            double df = Math.abs(MathParser.derivative(func, x));
            if (df > maxDerivative) {
                maxDerivative = df;
            }
        }

        // λ = 1 / max|f'(x)|
        double lambda = 1.0 / (maxDerivative + 0.01);
        return lambda;
    }

    /**
     * Решение методом простой итерации с указанием интервала для подбора λ
     */
    public static Result solve(String func, double a, double b,
                               double tolerance, int maxIterations) {
        List<Double> errors = new ArrayList<>();

        // Подбираем λ на заданном интервале [a, b]
        double lambda = findLambda(func, a, b);

        // Начальное приближение — середина интервала
        double xPrev = (a + b) / 2;
        double xCurrent = xPrev;

        for (int i = 0; i < maxIterations; i++) {
            xCurrent = phi(func, xPrev, lambda);

            double error = Math.abs(xCurrent - xPrev);
            errors.add(error);

            double fCurrent = MathParser.evaluate(func, xCurrent);


            if (error < tolerance || Math.abs(fCurrent) < tolerance) {
                return new Result(xCurrent, i + 1, errors, fCurrent, true, null);
            }

            // Защита от вылета за интервал
            if (xCurrent < a || xCurrent > b) {
                return new Result(xCurrent, i + 1, errors, fCurrent, false,
                        "Метод вышел за границы интервала");
            }

            xPrev = xCurrent;
        }

        return new Result(xCurrent, maxIterations, errors,
                MathParser.evaluate(func, xCurrent), false,
                "Метод не сошелся за " + maxIterations + " итераций");
    }

    public static Result solve(String func, double a, double b, double tolerance) {
        return solve(func, a, b, tolerance, 100);
    }
}