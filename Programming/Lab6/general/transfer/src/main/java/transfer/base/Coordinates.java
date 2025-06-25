package transfer.base;

import client.structure.Validatable;
import java.io.Serializable;
import java.util.Objects;

/**
 * Класс представляет координаты
 */
public class Coordinates implements Validatable,Serializable {
    private long x; //Максимальное значение поля: 948
    private double y;

    public Coordinates(long x, double y) {
        this.x = x;
        this.y = y;
    }

    public long getX() {
        return x;
    }

    public double getY() {
        return y;
    }

    @Override
    public boolean validate() {
        if (x >= 938) return false;
        return true;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Coordinates coordinates = (Coordinates) o;
        return Objects.equals(x, coordinates.x) && Objects.equals(y, coordinates.y);
    }

    @Override
    public int hashCode() {
        return Objects.hash(x,y);
    }

    @Override
    public String toString() {
        return "(" + x + ", " + y + ")";
    }
}