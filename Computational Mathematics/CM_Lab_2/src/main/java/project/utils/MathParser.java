package project.utils;

import net.objecthunter.exp4j.Expression;
import net.objecthunter.exp4j.ExpressionBuilder;

public class MathParser {

    private static String prepareExpression(String expression) {
        return expression
                .toLowerCase()
                .replace("ln(", "log(");      // только ln(x) → log(x)
    }

    public static double evaluate(String expression, double x) {
        try {
            String prepared = prepareExpression(expression);
            Expression expr = new ExpressionBuilder(prepared)
                    .variable("x")
                    .build()
                    .setVariable("x", x);
            return expr.evaluate();
        } catch (Exception e) {
            System.err.println("Ошибка при вычислении: " + e.getMessage());
            return Double.NaN;
        }
    }

    public static double derivative(String expression, double x, double h) {
        String prepared = prepareExpression(expression);
        double fPlus = evaluate(prepared, x + h);
        double fMinus = evaluate(prepared, x - h);
        return (fPlus - fMinus) / (2 * h);
    }

    public static double derivative(String expression, double x) {
        return derivative(expression, x, 1e-7);
    }
}