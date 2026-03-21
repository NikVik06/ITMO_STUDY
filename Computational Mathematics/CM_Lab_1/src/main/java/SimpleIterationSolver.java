public class SimpleIterationSolver {
    public static Solution solve(Matrix A, Vector b, double epsilon, int maxIterations) {
        int n = A.getSize();
        Vector x = new Vector(n);
        Vector oldX = new Vector(n);
        double[] errors = new double[n];
        int iterations = 0;
        double maxDiff;

        for (int i = 0; i < n; i++) {
            x.setData(i, 0);
        }
        /*
        for (int i = 0; i < n; i++) {
            x.setData(i, b.getData(i) / A.getData(i, i));
        }*/

        do {
            oldX.copyFrom(x);

            for (int i = 0; i < n; i++) {
                double sum = 0;
                for (int j = 0; j < n; j++) {
                    if (j != i) {
                        sum += A.getData(i, j) * oldX.getData(j);
                    }
                }
                double newValue = (b.getData(i) - sum) / A.getData(i, i);
                x.setData(i, newValue);
            }

            maxDiff = 0;
            for (int i = 0; i < n; i++) {
                double diff = Math.abs(x.getData(i) - oldX.getData(i));
                errors[i] = diff;
                if (diff > maxDiff) {
                    maxDiff = diff;
                }
            }
            iterations++;

            System.out.printf("%4d  | ", iterations);
            for (int k = 0; k < n; k++) {
                System.out.printf("%8.4f ", x.getData(k));
            }
            System.out.printf(" | %8.6f\n", maxDiff);

        } while (maxDiff >= epsilon && iterations < maxIterations);

        return new Solution(x, iterations, errors, maxDiff);
    }
}