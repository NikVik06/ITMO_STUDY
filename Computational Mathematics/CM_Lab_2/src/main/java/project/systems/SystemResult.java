package project.systems;

import java.util.List;

/**
 * Результат решения системы
 */
public class SystemResult {
    private final double x;
    private final double y;
    private final int iterations;
    private final List<Double> errors;
    private final boolean converged;
    private final String message;

    public SystemResult(double x, double y, int iterations, List<Double> errors,
                        boolean converged, String message) {
        this.x = x;
        this.y = y;
        this.iterations = iterations;
        this.errors = errors;
        this.converged = converged;
        this.message = message;
    }

    public double getX() { return x; }
    public double getY() { return y; }
    public int getIterations() { return iterations; }
    public List<Double> getErrors() { return errors; }
    public boolean isConverged() { return converged; }
    public String getMessage() { return message; }
}

