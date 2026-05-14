package project.solvers;

import project.utils.MathParser;
import project.utils.Result;
import java.util.ArrayList;
import java.util.List;

/**
 * Метод хорд (метод секущих с фиксированным концом)
 * Формула: x = a - f(a)*(b-a)/(f(b)-f(a))
 */
public class ChordSolver {

    public static Result solve(String func, double a, double b,
                               double tolerance, int maxIterations) {
        List<Double> errors = new ArrayList<>();
        double xPrev = a;
        double xCurrent = a;

        // Проверяем, что f(a) и f(b) имеют разные знаки
        double fa = MathParser.evaluate(func, a);
        double fb = MathParser.evaluate(func, b);

        if (fa * fb >= 0) {
            return new Result(0, 0, errors, 0, false,
                    "На интервале нет корня (f(a) и f(b) одного знака)");
        }



        for (int i = 0; i < maxIterations; i++) {
            // Формула метода хорд
            fa = MathParser.evaluate(func, a);
            fb = MathParser.evaluate(func, b);

            xCurrent = a - fa * (b - a) / (fb - fa);
            double fCurrent = MathParser.evaluate(func, xCurrent);

            double error = Math.abs(xCurrent - xPrev);
            errors.add(error);


            if (error < tolerance || Math.abs(fCurrent) < tolerance) {
                return new Result(xCurrent, i + 1, errors, fCurrent, true, null);
            }

            // Сужаем интервал
            if (fa * fCurrent < 0) {
                b = xCurrent;
            } else {
                a = xCurrent;
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