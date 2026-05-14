package project.solvers;

import project.utils.MathParser;
import project.utils.Result;

import java.util.ArrayList;
import java.util.List;

public class NewtonSolver {
    public static Result solve(String func, double initialGuess,
                               double tolerance, int maxIterations) {
        List<Double> errors = new ArrayList<>();
        double xPrev = initialGuess;
        double xCurrent = initialGuess;


        for (int i = 0; i < maxIterations; i++) {
            double fValue = MathParser.evaluate(func, xPrev);
            double fDerivative = MathParser.derivative(func, xPrev);

            // Проверка на деление на ноль
            if (Math.abs(fDerivative) < 1e-12) {
                return new Result(xPrev, i, errors, fValue, false,
                        "Производная близка к нулю");
            }

            // Формула Ньютона: x_{k+1} = x_k - f(x_k) / f'(x_k)
            xCurrent = xPrev - fValue / fDerivative;

            // Вычисляем погрешность
            double error = Math.abs(xCurrent - xPrev);
            errors.add(error);

            // Проверка на достижение точности
            if (error < tolerance) {
                return new Result(xCurrent, i + 1, errors,
                        MathParser.evaluate(func, xCurrent), true, null);
            }

            xPrev = xCurrent;
        }

        // Не сошелся за maxIterations
        return new Result(xCurrent, maxIterations, errors,
                MathParser.evaluate(func, xCurrent), false,
                "Метод не сошелся за " + maxIterations + " итераций");
    }

    /**
     * Упрощенный вызов метода Ньютона (с параметрами по умолчанию)
     * @param func          функция
     * @param initialGuess  начальное приближение
     * @param tolerance     точность
     * @return результат
     */
    public static Result solve(String func, double initialGuess, double tolerance) {
        return solve(func, initialGuess, tolerance, 100);
    }



}
