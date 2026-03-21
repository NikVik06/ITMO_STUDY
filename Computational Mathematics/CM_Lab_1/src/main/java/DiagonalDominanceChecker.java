public class DiagonalDominanceChecker {

    public static boolean hasDominance(Matrix A) {
        int n = A.getSize();
        for (int i = 0; i < n; i++) {
            double diagonal = Math.abs(A.getData(i, i));
            double sum = 0;
            for (int j = 0; j < n; j++) {
                if (j != i) sum += Math.abs(A.getData(i, j));
            }
            if (diagonal <= sum) return false;
        }
        return true;
    }

    public static boolean makeDominant(Matrix A, Vector b) {
        int n = A.getSize();
        for (int i = 0; i < n; i++) {
            int bestRow = -1;
            for (int k = i; k < n; k++) {
                double diag = Math.abs(A.getData(k, i));
                double sum = 0;
                for (int j = 0; j < n; j++) {
                    if (j != i) {
                        sum += Math.abs(A.getData(k, j));
                    }
                }
                if (diag > sum) {
                    bestRow = k;
                    break;
                }
            }

            if (bestRow != -1) {
                if (bestRow != i) {
                    A.swapRows(i, bestRow);
                    b.swap(i, bestRow);
                }
            } else {
                return false;
            }
        }
        return hasDominance(A);
    }
}