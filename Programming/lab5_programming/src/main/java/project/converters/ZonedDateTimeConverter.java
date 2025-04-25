package project.converters;

import com.opencsv.bean.AbstractBeanField;

import java.time.ZonedDateTime;
import java.time.format.DateTimeFormatter;
/**
 * Конвертер для преобразования строки в объект {@link ZonedDateTime}.
 */
public class ZonedDateTimeConverter extends AbstractBeanField<ZonedDateTime, String> {
    private final DateTimeFormatter formatter = DateTimeFormatter.ISO_ZONED_DATE_TIME;
    /**
     * Преобразует строку в объект ZonedDateTime
     * @param value строка с датой/временем в формате ISO-8601
     * @return объект ZonedDateTime
     */
    @Override
    protected Object convert(String value) {
        if (value == null || value.trim().isEmpty()) {
            return ZonedDateTime.now();
        }
        return ZonedDateTime.parse(value.trim(), formatter);
    }
}