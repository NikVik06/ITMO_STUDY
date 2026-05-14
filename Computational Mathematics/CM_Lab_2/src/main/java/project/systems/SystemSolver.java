package project.systems;

import java.util.ArrayList;
import java.util.List;


/**
 * Решение системы нелинейных уравнений методом простой итерации
 */
public class SystemSolver {

    private final SystemFunction phi1;
    private final SystemFunction phi2;

    public SystemSolver(SystemFunction phi1, SystemFunction phi2) {
        this.phi1 = phi1;
        this.phi2 = phi2;
    }

    /**
     * Проверяет условие сходимости в точке
     */
    public boolean checkConvergence(double x, double y) {
        double h = 1e-6;

        double dPhi1dx = (phi1.apply(x + h, y) - phi1.apply(x, y)) / h;
        double dPhi1dy = (phi1.apply(x, y + h) - phi1.apply(x, y)) / h;
        double dPhi2dx = (phi2.apply(x + h, y) - phi2.apply(x, y)) / h;
        double dPhi2dy = (phi2.apply(x, y + h) - phi2.apply(x, y)) / h;

        double norm = Math.max(
                Math.abs(dPhi1dx) + Math.abs(dPhi1dy),
                Math.abs(dPhi2dx) + Math.abs(dPhi2dy)
        );

        return norm < 1;
    }

    public SystemResult solve(double x0, double y0, double tolerance, int maxIterations) {
        List<Double> errors = new ArrayList<>();
        double xPrev = x0;
        double yPrev = y0;
        double xCurrent = x0;
        double yCurrent = y0;

        boolean convergent = checkConvergence(x0, y0);
        if (!convergent) {
        }


        for (int i = 0; i < maxIterations; i++) {
            xCurrent = phi1.apply(xPrev, yPrev);
            yCurrent = phi2.apply(xPrev, yPrev);

            double error = Math.sqrt(Math.pow(xCurrent - xPrev, 2) +
                    Math.pow(yCurrent - yPrev, 2));
            errors.add(error);

            if (error < tolerance) {
                return new SystemResult(xCurrent, yCurrent, i + 1, errors, true, null);
            }

            xPrev = xCurrent;
            yPrev = yCurrent;
        }

        return new SystemResult(xCurrent, yCurrent, maxIterations, errors, false,
                "Метод не сошелся за " + maxIterations + " итераций");
    }

    public SystemResult solve(double x0, double y0, double tolerance) {
        return solve(x0, y0, tolerance, 100);
    }
}