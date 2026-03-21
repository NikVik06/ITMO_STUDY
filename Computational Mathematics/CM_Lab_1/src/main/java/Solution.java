public class Solution {
    private Vector x;
    private int iterations;
    private double[] errors;
    private double maxDiff;

    public Vector getX() { return x; }
    public int getIterations() { return iterations; }
    public double getErrors(int i) { return errors[i]; }

    public Solution(Vector x, int iterations, double[] errors, double maxDiff) {
        this.x = x;
        this.iterations = iterations;
        this.errors = errors;
        this.maxDiff = maxDiff;
    }

    public void print() {
        System.out.println("\nРешение найдено за " + iterations + " итераций");
        System.out.printf("Итоговая погрешность: %f\n", maxDiff);
        System.out.println("Вектор погрешностей на последней итерации:");
        for (int i = 0; i < x.getSize(); i++) {
            System.out.printf("|x%d^(k) - x%d^(k-1)| = %f\n",
                    i+1, i+1, errors[i]);
        }
        System.out.println("\nОкончательное решение:");
        for (int i = 0; i < x.getSize(); i++) {
            System.out.printf("x%d = %f\n", i+1, x.getData(i));
        }
    }
}