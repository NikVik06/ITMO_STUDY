package project.systems;

/**
 * Функциональный интерфейс для φ(x,y)
 */
@FunctionalInterface
public interface SystemFunction {
    double apply(double x, double y);
}