package server.converters;

import com.opencsv.bean.AbstractBeanField;
import transfer.base.Car;

/**
 * Конвертер для преобразования между строковым представлением и объектом {@link Car}
 */
public class CarConverter extends AbstractBeanField<Car, String> {
    /**
     * Конвертер для преобразования между строковым представлением и объектом Car
     * @param value строковое представление булева значения
     * @return объект Car с установленным полем cool
     * @throws IllegalArgumentException если значение не может быть преобразовано в boolean
     */

    @Override
    protected Object convert(String value) {
        return new Car(Boolean.parseBoolean(value));
    }
}