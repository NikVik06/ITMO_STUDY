package project.utils;

public class ConvergenceChecker {
    public static boolean hasRoot(String func, double a, double b) {
        double fa = MathParser.evaluate(func,a);
        double fb = MathParser.evaluate(func,b);
        if (fa * fb < 0) {
            return true;
        }

        if (Math.abs(fa) < 1e-10 || Math.abs(fb) < 1e-10) {
            return true;
        }
        return false;
    }

    public static Double findInitialGuess(String func, double a, double b) {
        double step = (b - a) / 20;

        for (double x = a; x <= b; x += step) {
            double f = MathParser.evaluate(func, x);
            double secondDerivative = secondDerivative(func, x);

            if (f * secondDerivative > 0) {
                return x;
            }
        }
        return null;
    }

    public static double secondDerivative(String func, double x) {
        double h = 1e-5;
        double fPlus = MathParser.evaluate(func, x + h);
        double f = MathParser.evaluate(func, x);
        double fMinus = MathParser.evaluate(func, x - h);
        return (fPlus - 2 * f + fMinus) / (h * h);
    }


    public static Double checkEndpointRoot(String func, double a, double b) {
        double fa = MathParser.evaluate(func, a);
        double fb = MathParser.evaluate(func, b);

        if (Math.abs(fa) < 1e-10) return a;
        if (Math.abs(fb) < 1e-10) return b;

        return null;
    }


}
