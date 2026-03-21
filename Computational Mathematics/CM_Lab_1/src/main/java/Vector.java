public class Vector {
    private double[] data;
    private int size;

    public Vector(int size) {
        this.size = size;
        this.data = new double[size];
    }

    public double getData(int i) {
        return data[i];
    }
    public void setData(int i, double value) {
        data[i] = value;
    }

    public int getSize() {
        return size;
    }

    public void swap(int i, int j) {
        double temp = data[i];
        data[i] = data[j];
        data[j] = temp;
    }

    public void copyFrom(Vector other) {
        for (int i = 0; i < size; i++) {
            this.data[i] = other.data[i];
        }
    }


}

