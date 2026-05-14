package project.utils;

import java.util.List;
public class Result {
    private final double root;
    private final int iterations;
    private final List<Double> errors;
    private final double functionValue;
    private final boolean converged;
    private final String message;

    public Result(double root, int iterations, List<Double> errors, double functionValue, boolean converged,String message) {
        this.root = root;
        this.iterations = iterations;
        this.errors = errors;
        this.functionValue = functionValue;
        this.converged = converged;
        this.message = message;
    }

    public double getRoot() {
        return root;
    }

    public List<Double> getErrors() {
        return errors;
    }

    public String getMessage() {
        return message;
    }

    public boolean isConverged() {
        return converged;
    }

    public int getIterations() {
        return iterations;
    }

    public double getFunctionValue() {
        return functionValue;
    }
}
