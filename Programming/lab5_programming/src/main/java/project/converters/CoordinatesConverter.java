package project.converters;

import com.opencsv.bean.AbstractBeanField;
import project.models.Coordinates;
/**
 * Конвертер для преобразования строкового представления координат в объект {@link Coordinates}
 */
public class CoordinatesConverter extends AbstractBeanField<Coordinates, String> {
/**
 * Преобразует строковое представление координат в объект Coordinates
 * @param value строка с координатами в формате "(x,y)"
 * @return объект Coordinates или null при ошибке парсинга
 */
    @Override
    protected Object convert(String value) {
        try {
            String clean = value.replaceAll("[()\\s]", "");
            String[] parts = clean.split(",");

            if (parts.length != 2) {
                throw new IllegalArgumentException("Invalid coordinates format");
            }

            long x = Long.parseLong(parts[0]);
            double y = Double.parseDouble(parts[1]);

            if (x >= 948) {
                throw new IllegalArgumentException("X cannot be > 948");
            }

            return new Coordinates(x, y);
        } catch (Exception e) {
            System.err.println("Ошибка парсинга координат: " + value);
            return null;
        }
    }
}