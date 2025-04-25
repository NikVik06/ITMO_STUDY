package project.models;

import project.structure.Validatable;
import java.util.Objects;

/**
 * Класс представляет автомобиль
 */
public class Car implements Validatable {
    private Boolean cool;//Поле не может быть null


    public Car(Boolean cool) {
        this.cool = cool;
    }

    public Boolean getCar() {
        return cool;
    }

    @Override
    public boolean validate() {
        return true;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Car car = (Car) o;
        return Objects.equals(cool, car.cool);
    }

    @Override
    public int hashCode() {
        return Objects.hash(cool);
    }

    @Override
    public String toString() {
        return String.valueOf(cool);
    }
}
