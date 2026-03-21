public class Matrix {
    private double[][] data;
    private int size;

    public Matrix(int size) {
        this.size = size;
        this.data = new double[size][size];
    }

    public double getData(int i, int j) {
        return data[i][j];
    }

    public void setData(int i, int j, double value) {
        data[i][j] = value;
    }

    public int getSize() {
        return size;
    }

    public double getRowNorm() {
        double max = 0;
        for (int i = 0; i < size; i++) {
            double sum = 0;
            for (int j = 0; j < size; j++) {
                sum += Math.abs(data[i][j]);
            }
            if (sum > max) max = sum;
        }
        return max;

    }
    public void swapRows(int row1, int row2) {
        double[] temp = data[row1];
        data[row1] = data[row2];
        data[row2] = temp;
    }

}
